import React, { useState, useEffect } from "react";
import Head from "next/head";
import Runner from "../../components/Runner/runner";
import Accordion from "../../components/Accordion/accordion";
import ObsComponent from "../../components/obsComponent/obsComponent"

export default function NextPage() {
  const [queueFileExists, setqueueFileExists] = useState(false);
  const [queueData, setQueueData] = useState(null);
  const [queueFilePath, setqueueFilePath] = useState(
      "scripts/BB_Py_Automation/src/Metodos/BQ/__pycache__/queue_files.json"
    );
  
    useEffect(() => {
      const fetchDataAsync = async () => {

        const filepath = [queueFilePath];
        try {
          const fileStatus = await window.MainIPC.checkFilesExist(filepath);
          fileStatus.forEach(async (status) => {
            console.log(`${status.path}: ${status.exists}`);
            if (status.path === queueFilePath) {
              setqueueFileExists(status.exists);
              
              if (!status.exists) {
                // Try another path if the file doesn't exist
                const _queueFilePath = `../../${queueFilePath}`;
                const [_queueFileStatus] = await window.MainIPC.checkFilesExist([
                  _queueFilePath,
                ]);
                setqueueFilePath(_queueFilePath);
                setqueueFileExists(_queueFileStatus.exists);
                console.log(
                  `Trying alternative queue file path: ${_queueFilePath}, exists: ${_queueFileStatus.exists}`
                );
              }
            }
          });
        } catch (error) {
          console.error("Error fetching file status:", error);
        }
      }
      fetchDataAsync();
  }, [])

  const loadFileData = async (fileExists, filePath, setData, errorMessage) => {
    if (fileExists) {
      try {
        const data = await window.MainIPC.getJsonData(filePath);
        if (data) setData(data);
        console.log(data)
      } catch (error) {
        console.error(`${errorMessage}:`, error);
      }
    }
  };

  const deleteQueueFileFunc = async () => {
    try {
      await window.MainIPC.deleteQueueFile(queueFilePath);
      setQueueData(null);
      setqueueFileExists(false);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
      loadFileData(
        queueFileExists,
        queueFilePath,
        (data) => setQueueData(data),
        "Error loading BQ Queue file"
      );
    }, [queueFileExists]);

	return (
		<React.Fragment>
			<Head>
				<title>BQ</title>
			</Head>
			<div>
				<h2>BQ</h2>
				<div className="card-tutorial">
					<Accordion
						pageProps={
							<>
								<p>
									Para a utilização deste robô, é necessário apenas que, nas
									variáveis de ambiente nas configurações, exista a variável
									"ID_REPOSITORIO_BQ" com o ID da sala desejada. Além disso,
									durante a execução do robô, ele solicitará quais Bancos de
									Questões devem ser utilizados e se são do tipo "Junção". Após
									essa etapa, ele seguirá com a criação conforme selecionado
									previamente.
								</p>
								<ObsComponent/>
							</>
						}
					/>
				<div>
          {queueFileExists && queueData?.queue_files &&
          <Accordion
            title="Fila"
            pageProps={
            <>
            <ul>
              {queueData.queue_files.map((file, index) => (
                <li key={index} style={{ margin: "10px 0" }}>
                  <strong>Item {index + 1}:</strong>
                  <ul style={{ marginLeft: "20px" }}>
                    {Object.entries(file).map(([key, value], i) => (
                      <li key={i}>
                        <strong>{key}:</strong> {String(value)}
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
            <button onClick={deleteQueueFileFunc}>Limpar Fila</button>
            </>
            }
				  />
          }
			</div>
				</div>
				<Runner script="Main_BQ.py"></Runner>
			</div>
		</React.Fragment>
	);
}