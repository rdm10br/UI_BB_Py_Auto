import React, { useState, useEffect } from "react";
import Head from "next/head";
// import { useTranslation } from 'react-i18next';
// import { withTranslation } from '../lib/withTranslation.js';
import versionData from "../../../BB_Py_Automation/release.json";
// import LanguageSwitcher from "../components/LanguageSwitcher/LanguageSwitcher.js";

// export const getServerSideProps = withTranslation('common');

export default function NextPage() {
  // const { t } = useTranslation('common');
  const [version] = useState(versionData.CURRENT_VERSION);
  const [account, setAccount] = useState(null);
  const [session, setSession] = useState(null);
  const [loginFileExists, setLoginFileExists] = useState(false);
  const [cookieFileExists, setCookieFileExists] = useState(false);
  const [latestVersion, setLatestVersion] = useState(null);
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [envFile, setEnvFile] = useState(false);
  const [envFileData, setEnvFileData] = useState("");
  const envFilePath = "../BB_Py_Automation/.env";

  useEffect(() => {
    const loginFilePath =
      "../BB_Py_Automation/src/Metodos/Login/__pycache__/login.json";
    const cookieFilePath =
      "../BB_Py_Automation/src/Metodos/Login/__pycache__/login_cache.json";
    const envFilePath = "../BB_Py_Automation/.env";

    const fetchFileStatus = async () => {
      const filePaths = [loginFilePath, cookieFilePath, envFilePath];

      try {
        // Call the IPC method to check file existence
        const fileStatuses = await window.fileAPI.checkFilesExist(filePaths);

        // Process the results
        fileStatuses.forEach((status) => {
          console.log(`${status.path}: ${status.exists}`);
          if (status.path === loginFilePath) {
            setLoginFileExists(status.exists);
          }
          if (status.path === cookieFilePath) {
            setCookieFileExists(status.exists);
          }
          if (status.path === envFilePath) {
            setEnvFile(status.exists);
          }
        });
      } catch (error) {
        console.error("Error fetching file status:", error);
      }
    };

    fetchFileStatus();
  }, []);

  useEffect(() => {
    const loadLoginData = async () => {
      if (loginFileExists) {
        try {
          const loginData = await import(
            `../../../BB_Py_Automation/src/Metodos/Login/__pycache__/login.json`
          );
          setAccount(loginData.username);
        } catch (error) {
          console.error("Error loading login file:", error);
        }
      }
    };

    const loadCookieData = async () => {
      if (cookieFileExists) {
        try {
          const cookieData = await import(
            `../../../BB_Py_Automation/src/Metodos/Login/__pycache__/login_cache.json`
          );
          setSession(cookieData.timestamp);
        } catch (error) {
          console.error("Error loading cookie file:", error);
        }
      }
    };

    const envFileData = async () => {
      if (loginFileExists) {
        try {
          const data = await window.ipc.on('get-env-variables', envFilePath);
          if (data != null || data != ""){
            console.log(`data : ${data}`)
            setEnvFileData(data)
          }
        } catch (error) {
          console.error("Error loading login file:", error);
        }
      }
    };

    loadLoginData();
    loadCookieData();
    envFileData();
  }, [loginFileExists, cookieFileExists, envFile]);

  const checkForUpdates = async () => {
    const GITHUB_REPO = "rdm10br/BB_Py_Automation";
    try {
      const data = await window.githubAPI.getRepo(GITHUB_REPO);

      // Check if there's an error in the response
      if (data.error) {
        throw new Error(data.error);
      }

      // GitHub API data should already be parsed, no need to call `data.json()`
      const latestVersion = data.tag_name;
      console.log(latestVersion);

      // Update the state with the latest version
      setLatestVersion(latestVersion);

      // Check if there is an update available
      if (version !== latestVersion) {
        setUpdateAvailable(true);
        const wantsToUpdate = await window.githubAPI.showUpdatePopup(true);
        console.log(wantsToUpdate);
        if (wantsToUpdate) {
          console.log("User chose to update the app.");
          window.ipc.send("run-python-root", "update_checker.py");
        } else {
          console.log("User choose not to update or is already up to date.");
        }
      } else {
        await window.githubAPI.showUpdatePopup(false);
      }
    } catch (err) {
      console.error("Error checking for updates:", err);
    }
  };

  useEffect(() => {
    // checkForUpdates();
  }, [version]);

  const runPython = (script) => {
    window.ipc.send("run-python", script);
  };

  const formattedDate = session
    ? (() => {
        const date = new Date(session);
        const offset = -3; // GMT-3
        const gmt3Date = new Date(date.getTime() + offset * 60 * 60 * 1000);
        const day = String(gmt3Date.getDate()).padStart(2, "0");
        const month = String(gmt3Date.getMonth() + 1).padStart(2, "0");
        const year = gmt3Date.getFullYear();
        const hours = String(gmt3Date.getHours()).padStart(2, "0");
        const minutes = String(gmt3Date.getMinutes()).padStart(2, "0");
        const seconds = String(gmt3Date.getSeconds()).padStart(2, "0");

        return `${day}/${month}/${year} ${hours}:${minutes}:${seconds} GMT ${offset}`;
      })()
    : null;

  return (
    <React.Fragment>
      <Head>
        <title>Configurações</title>
      </Head>
      <div>
        <h2>Configurações</h2>
      </div>
      <div className="card">
        <h3>Preferências do Usuário</h3>
        <p>{/* Idioma : <LanguageSwitcher /> */}</p>
        <button className="destructive">Restaurar Configurações</button>
      </div>
      <div className="card">
        <h3>Requisitos para o Env</h3>
        {!envFile && (
          <>
            <input type="text" placeholder="BASE_URL" />
            <input type="text" placeholder="ID_REPOSITORIO_BQ" />
            <input type="text" placeholder="OWNER/GIT_REPO" />
            <input type="text" placeholder="GIT_BRANCH" />
            <br />
            <button>Gerar novo env</button>
          </>
        )}
        {envFile && (
          <>
            <ul>
                <li>Base URL : {envFileData}</li>
                {/* {Object.entries(envFileData).map(([key, value]) => (
                    <li key={key}>
                        {key}: {value}
                    </li>
                ))} */}
            </ul>
            <br />
            <button>Deletar .env</button>
          </>
        )}
      </div>
      <div className="card">
        <h3>Credenciais & Cookies:</h3>
        {account ? <p>Conta salva: {account}</p> : null}
        {session ? <p>Últimos cookies da sessão: {formattedDate}</p> : null}
        {!account && !session && (
          <p>Salve suas credenciais AVA e execute o Teste:</p>
        )}
        <br />
        <button onClick={() => runPython("src/Main_Save_Login.py")}>
          Salvar Credenciais
        </button>
        <button className="destructive">Excluir Cookies</button>
        <button className="destructive">Excluir Credenciais & Cookies</button>
        <button className="destructive">Excluir cache</button>
      </div>
      <div className="card">
        <h3>Atualizações</h3>
        {updateAvailable && (
          <>
            <p>Há uma atualização disponível: {latestVersion}</p>
            <p>Sua Versão: {version}</p>
            <br />
            <button onClick={() => runPython("update_checker.py")}>
              Atualizar
            </button>
          </>
        )}

        {!updateAvailable && (
          <>
            <p>Versão: {version}</p>
            <br />
            <button onClick={checkForUpdates}>Verificar Atualização</button>
          </>
        )}
        <button onClick={() => runPython("updater_rollback.py")}>
          Reverter
        </button>
        <button>Ver Logs</button>
        <button className="destructive">Excluir Logs</button>
      </div>
      <div className="card">
        <h3>Logs dos Bots:</h3>
        <p>Logs de todas as execuções dos bots</p>
        <br />
        <button>Ver Logs</button>
        <button className="destructive">Excluir Logs</button>
      </div>
    </React.Fragment>
  );
}