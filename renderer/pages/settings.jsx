import React, { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
// import { useTranslation } from 'react-i18next';
// import { withTranslation } from '../lib/withTranslation.js';
// const isProduction = process.env.NODE_ENV === 'production';
// import LanguageSwitcher from "../components/LanguageSwitcher/LanguageSwitcher.js";

// export const getServerSideProps = withTranslation('common');

export default function NextPage() {
  // const { t } = useTranslation('common');
  const [account, setAccount] = useState(null);
  const [session, setSession] = useState(null);
  const [version, setVersion] = useState(null);

  const [loginFileExists, setLoginFileExists] = useState(false);
  const [cookieFileExists, setCookieFileExists] = useState(false);
  const [releaseFileExists, setReleaseFileExists] = useState(false);
  const [packFileExists, setPackFileExists] = useState(false);
  const [envFile, setEnvFile] = useState(false);

  const [latestVersion, setLatestVersion] = useState(null);
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [latestVersionApp, setLatestVersionApp] = useState(null);
  const [updateAvailableApp, setUpdateAvailableApp] = useState(false);
  const [envFileData, setEnvFileData] = useState("");
  const [packFileData, setPackFileData] = useState("");

  const [baseUrl, setBaseUrl] = useState("");
  const [repoId, setRepoId] = useState("");
  const [ownerRepo, setOwnerRepo] = useState("");
  const [gitBranch, setGitBranch] = useState("");

  const [activeTab, setActiveTab] = useState("userPreferences");

  const [pack, setPack] = useState("package.json");
  const [envFilePath, setenvFilePath] = useState(
    "scripts/BB_Py_Automation/.env"
  );
  const [loginFilePath, setLoginFilePath] = useState(
    "scripts/BB_Py_Automation/src/Metodos/Login/__pycache__/login.json"
  );
  const [cookieFilePath, setCookieFilePath] = useState(
    "scripts/BB_Py_Automation/src/Metodos/Login/__pycache__/login_cache.json"
  );
  const [releaseFilePath, setReleaseFilePath] = useState(
    "scripts/BB_Py_Automation/release.json"
  );

  useEffect(() => {
    const fetchFileStatus = async () => {
      const filePaths = [
        loginFilePath,
        cookieFilePath,
        envFilePath,
        releaseFilePath,
        pack,
      ];

      try {
        // Call the IPC method to check file existence
        const fileStatuses = await window.MainIPC.checkFilesExist(filePaths);

        // Process the results
        fileStatuses.forEach(async (status) => {
          console.log(`${status.path}: ${status.exists}`);
          if (status.path === loginFilePath) {
            setLoginFileExists(status.exists);

            if (!status.exists) {
              // Try another path if the file doesn't exist
              const _loginFilePath = `../../${loginFilePath}`;
              const [_loginFileStatus] = await window.MainIPC.checkFilesExist([
                _loginFilePath,
              ]);
              setLoginFilePath(_loginFilePath);
              setLoginFileExists(_loginFileStatus.exists);
              console.log(
                `Trying alternative login file path: ${_loginFilePath}, exists: ${_loginFileStatus.exists}`
              );
            }
          }

          if (status.path === cookieFilePath) {
            setCookieFileExists(status.exists);

            if (!status.exists) {
              // Try another path if the file doesn't exist
              const _cookieFilePath = `../../${cookieFilePath}`;
              const [_cookieFiletatus] = await window.MainIPC.checkFilesExist([
                _cookieFilePath,
              ]);
              setCookieFilePath(_cookieFilePath);
              setLoginFileExists(_cookieFiletatus.exists);
              console.log(
                `Trying alternative login file path: ${_cookieFilePath}, exists: ${_cookieFiletatus.exists}`
              );
            }
          }

          if (status.path === envFilePath) {
            if (status.exists === true) {
              setEnvFile(status.exists); // File exists, set it
            } else if (status.exists === false) {
              // Try another path if the file doesn't exist
              const _envFilePath = `../../${envFilePath}`;

              // Since this is an async operation, use 'await' to get the result
              const [_envFileStatus] = await window.MainIPC.checkFilesExist([
                _envFilePath,
              ]);
              console.log(
                `Trying alternative env file path: ${_envFilePath}, exists: ${_envFileStatus.exists}`
              );

              if (_envFileStatus.exists == true) {
                setEnvFile(_envFileStatus.exists);
                setenvFilePath(_envFilePath);
              }
            }
          }

          if (status.path === releaseFilePath) {
            setReleaseFileExists(status.exists);

            if (!status.exists) {
              // Try another path if the file doesn't exist
              const _releaseFilePath = `../${releaseFilePath}`;
              const [_releaseFileStatus] = await window.MainIPC.checkFilesExist(
                [_releaseFilePath]
              );
              setReleaseFilePath(_releaseFilePath);
              setLoginFileExists(_releaseFileStatus.exists);
              console.log(
                `Trying alternative login file path: ${_releaseFilePath}, exists: ${_releaseFileStatus.exists}`
              );
            }
          }

          if (status.path === pack) {
            setPackFileExists(status.exists);

            if (!status.exists) {
              // Try another path if the file doesn't exist
              const _pack = `../${pack}`;
              const [_packFileStatus] = await window.MainIPC.checkFilesExist([
                _pack,
              ]);
              setPack(_pack);
              setPackFileExists(_packFileStatus.exists);
              console.log(
                `Trying alternative login file path: ${_pack}, exists: ${_packFileStatus.exists}`
              );
            }
          }
        });
      } catch (error) {
        console.error("Error fetching file status:", error);
      }
    };

    fetchFileStatus();
  }, []);

  const loadEnvFileData = async () => {
    if (loginFileExists) {
      try {
        // console.log(envFilePath)
        const data = await window.MainIPC.getEnvVariables(`${envFilePath}`);
        if (data != null && data != "") {
          // console.log(`data : ${data}`)
          if (data) setEnvFileData(data);
        }
      } catch (error) {
        console.error("Error loading env file:", error);
      }
    }
  };

  const loadFileData = async (fileExists, filePath, setData, errorMessage) => {
    if (fileExists) {
      try {
        const data = await window.MainIPC.getJsonData(filePath);
        if (data) setData(data);
      } catch (error) {
        console.error(`${errorMessage}:`, error);
      }
    }
  };

  useEffect(() => {
    loadFileData(
      loginFileExists,
      loginFilePath,
      (data) => setAccount(data.username),
      "Error loading login file"
    );
    loadFileData(
      cookieFileExists,
      cookieFilePath,
      (data) => setSession(data.timestamp),
      "Error loading cookie file"
    );
    loadFileData(
      releaseFileExists,
      releaseFilePath,
      (data) => setVersion(data.CURRENT_VERSION),
      "Error loading release file"
    );
    loadFileData(
      packFileExists,
      pack,
      (data) => setPackFileData(data.version),
      "Error loading pack file"
    );
    loadEnvFileData();
  }, [
    loginFileExists,
    cookieFileExists,
    releaseFileExists,
    packFileExists,
    envFile,
  ]);

  const checkForUpdatesBot = async () => {
    const GITHUB_REPO = "rdm10br/BB_Py_Automation";
    try {
      const data = await window.MainIPC.getGitRepo(GITHUB_REPO);

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
        const wantsToUpdate = await window.MainIPC.showUpdatePopup(true);
        console.log(wantsToUpdate);
        if (wantsToUpdate) {
          console.log("User chose to update the app.");
          window.MainIPC.runPython("update_checker.py");
        } else {
          console.log("User choose not to update.");
        }
      } else {
        await window.MainIPC.showUpdatePopup(false);
        console.log("User is already up to date.");
      }
    } catch (err) {
      console.error("Error checking for updates:", err);
    }
  };

  const checkForUpdatesApp = async () => {
    const GITHUB_REPO = "rdm10br/UI_BB_Py_Auto";
    try {
      const data = await window.MainIPC.getGitRepo(GITHUB_REPO);

      // Check if there's an error in the response
      if (data.error) {
        throw new Error(data.error);
      }

      // GitHub API data should already be parsed, no need to call `data.json()`
      const latestVersionApp = data.tag_name;
      console.log(latestVersionApp);

      // Update the state with the latest version
      setLatestVersionApp(latestVersionApp);

      // Check if there is an update available
      if (packFileData !== latestVersionApp) {
        setUpdateAvailableApp(true);
        const wantsToUpdate = await window.MainIPC.showUpdatePopup(true);
        console.log(wantsToUpdate);
        if (wantsToUpdate) {
          console.log("User chose to update the app.");
          window.MainIPC.onUpdateAvailable();
        } else {
          console.log("User choose not to update.");
        }
      } else {
        await window.MainIPC.showUpdatePopup(false);
        console.log("User is already up to date.");
      }
    } catch (err) {
      console.error("Error checking for updates:", err);
    }
  };

  const runPython = (script) => {
    window.MainIPC.runPython(`${script}`);
  };

  const handleGenerateEnv = async () => {
    const envData = {
      BASE_URL: baseUrl,
      ID_REPOSITORIO_BQ: repoId,
      GIT_REPO: ownerRepo,
      GIT_BRANCH: gitBranch,
    };
    if (!baseUrl || !repoId || !ownerRepo || !gitBranch) {
      console.error("All fields are required!");
      alert("Por favor, preencha todos os campos."); // You can show an alert or another UI message
      return; // Stop execution if validation fails
    }
    try {
      // Send the env data to the backend via IPC to create the .env file
      await window.MainIPC.createEnvFile(envData);
      console.log("Env file created successfully!");
      setEnvFile(true);
      loadEnvFileData();
    } catch (error) {
      console.error("Error creating env file:", error);
    }
  };

  const handleDeleteEnv = async () => {
    try {
      // Send IPC to delete the .env file
      await window.MainIPC.deleteEnvFile();
      console.log(".env file deleted successfully!");

      // Optionally, you can reset the state if needed after deletion
      setEnvFile(false);
      setEnvFileData({});
    } catch (error) {
      console.error("Error deleting .env file:", error);
    }
  };

  const handleTabChange = (tab) => {
    // console.log(tab);
    // document.body.div.button.classList.toggle("active");
    setActiveTab(tab);

    // Remove the 'active' class from all buttons
    document.querySelectorAll(".tabs button").forEach((button) => {
      button.classList.remove("active");
    });

    // Add the 'active' class to the clicked button
    const activeButton = document.querySelector(
      `.tabs button[data-tab="${tab}"]`
    );
    if (activeButton) {
      activeButton.classList.add("active");
    }
  };

  const formattedDate = session
    ? (() => {
        const date = new Date(session);
        // const offset = -3; // GMT-3
        const offset = 0;
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
        <h2>Configurações : </h2>
      </div>
      <div className="tabs">
        <button
          className="active"
          data-tab="userPreferences"
          onClick={() => handleTabChange("userPreferences")}
        >
          Preferências do Usuário
        </button>
        <button
          className=""
          data-tab="envSettings"
          onClick={() => handleTabChange("envSettings")}
        >
          Variáveis de Ambiente
        </button>
        <button
          className=""
          data-tab="credentialsCookies"
          onClick={() => handleTabChange("credentialsCookies")}
        >
          Credenciais & Cookies
        </button>
        <button
          className=""
          data-tab="updates"
          onClick={() => handleTabChange("updates")}
        >
          Atualizações
        </button>
        <button
          className=""
          data-tab="logs"
          onClick={() => handleTabChange("logs")}
        >
          Logs
        </button>
      </div>
      {activeTab == "userPreferences" && (
        <div className="card">
          <h3>Preferências do Usuário :</h3>
          <p>{/* Idioma : <LanguageSwitcher /> */}</p>
          <button className="destructive">Restaurar Configurações</button>
        </div>
      )}
      {activeTab == "envSettings" && (
        <div className="card">
          {!envFile ? (
            <>
              <h3>Requisitos para o Env :</h3>
              <input
                type="text"
                placeholder="BASE_URL"
                value={baseUrl}
                onChange={(e) => setBaseUrl(e.target.value)}
              />
              <input
                type="text"
                placeholder="ID_REPOSITORIO_BQ"
                value={repoId}
                onChange={(e) => setRepoId(e.target.value)}
              />
              <input
                type="text"
                placeholder="OWNER/GIT_REPO"
                value={ownerRepo}
                onChange={(e) => setOwnerRepo(e.target.value)}
              />
              <input
                type="text"
                placeholder="GIT_BRANCH"
                value={gitBranch}
                onChange={(e) => setGitBranch(e.target.value)}
              />
              <br />
              <button onClick={handleGenerateEnv}>Gerar novo env</button>
            </>
          ) : (
            <>
              <h3>Variáveis de ambiente :</h3>
              <ul>
                {Object.entries(envFileData).map(([key, value]) => (
                  <li key={key} className="styled-item">
                    <span className="label">
                      <strong>{key} : </strong>
                    </span>
                    <span className="value">{value}</span>
                  </li>
                ))}
              </ul>
              <br />
              <button onClick={handleDeleteEnv}>Deletar .env</button>
            </>
          )}
        </div>
      )}
      {activeTab == "credentialsCookies" && (
        <div className="card">
          <h3>Credenciais & Cookies :</h3>
          {account ? (
            <p className="styled-item">
              <span className="label">
                <strong>Conta salva: </strong>
              </span>
              <span>{account}</span>
            </p>
          ) : null}
          {session ? (
            <p className="styled-item">
              <span className="label">
                <strong>Últimos cookies da sessão: </strong>
              </span>
              <span>{formattedDate}</span>
            </p>
          ) : null}
          {!account && !session && (
            <p>Salve suas credenciais AVA e execute o Teste:</p>
          )}
          <br />
          <button onClick={() => runPython("src/Main_Save_Login.py")}>
            {account ? (
              <span>Alterar Credenciais</span>
            ) : (
              <span>Salvar Credenciais</span>
            )}
          </button>
          <button className="destructive">Excluir Cookies</button>
          <button className="destructive">Excluir Credenciais & Cookies</button>
          <button className="destructive">Excluir cache</button>
        </div>
      )}
      {activeTab == "updates" && (
        <div className="card">
          <h3>Atualizações :</h3>
          <div className="card">
            <h4>Bot :</h4>
            {updateAvailable ? (
              <>
                <p>Há uma atualização disponível: {latestVersion}</p>
                <p>Sua Versão: {version}</p>
                <br />
                <button onClick={() => runPython("update_checker.py")}>
                  Atualizar
                </button>
              </>
            ) : (
              <>
                <p>Versão: {version}</p>
                <br />
                <button onClick={checkForUpdatesBot}>
                  Verificar Atualização
                </button>
              </>
            )}
            <button onClick={() => runPython("updater_rollback.py")}>
              Reverter
            </button>
            <Link href="/log/logViewUpdater">
              <button>Ver Logs</button>
            </Link>
            <button className="destructive">Excluir Logs</button>
          </div>
          <div className="card">
            <h4>App :</h4>
            {updateAvailableApp ? (
              <>
                <p>Há uma atualização disponível: {latestVersionApp}</p>
                <p>Sua Versão: {packFileData}</p>
                <br />
                <button onClick={() => runPython("")}>Atualizar</button>
              </>
            ) : (
              <>
                <p>Versão: {packFileData}</p>
                <br />
                <button onClick={checkForUpdatesApp}>
                  Verificar Atualização
                </button>
              </>
            )}
            <button onClick={() => runPython("")}>Reverter</button>
            <button>Ver Logs</button>
            <button className="destructive">Excluir Logs</button>
          </div>
        </div>
      )}
      {activeTab == "logs" && (
        <div className="card">
          <h3>Logs dos Bots:</h3>
          <p>Logs de todas as execuções dos bots</p>
          <br />
          <Link href="/log/logViewBot">
            <button>Ver Logs</button>
          </Link>
          <button className="destructive">Excluir Logs</button>
        </div>
      )}
    </React.Fragment>
  );
}