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

  useEffect(() => {
    const loginFilePath =
      "../BB_Py_Automation/src/Metodos/Login/__pycache__/login.json";
    const cookieFilePath =
      "../BB_Py_Automation/src/Metodos/Login/__pycache__/login_cache.json";

    // const fetchFileStatus = async () => {
    //   const query = `?files=${encodeURIComponent(
    //     loginFilePath
    //   )}&files=${encodeURIComponent(cookieFilePath)}`;

    //   try {
    //     apiUrl = `/api/check-files${query}`
    //     // const response = await fetch(`/api/check-files${query}`);
    //     const response = await window.fileAPI.fetchMyApi(apiUrl);
    //     if (!response.ok) {
    //       throw new Error(`HTTP error! Status: ${response.status}`);
    //     }
    //     const data = await response.json();
    //     console.log(`${loginFilePath}: ${data[loginFilePath]}`);
    //     console.log(`${cookieFilePath}: ${data[cookieFilePath]}`);
    //     setLoginFileExists(data[loginFilePath]);
    //     setCookieFileExists(data[cookieFilePath]);
    //   } catch (error) {
    //     console.error("Error fetching file status:", error);
    //   }
    // };

    const fetchFileStatus = async () => {
      const filePaths = [loginFilePath, cookieFilePath];

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
        });
      } catch (error) {
        console.error("Error fetching file status:", error);
      }
    };

    // const fetchFileStatus = async () => {
    //   const query = `?files=${encodeURIComponent(
    //     loginFilePath
    //   )}&files=${encodeURIComponent(cookieFilePath)}`;

    //   try {
    //     const apiUrl = `api/check-files${query}`;
    //     const data = await window.fileAPI.fetchMyApi(apiUrl);

    //     console.log(`${loginFilePath}: ${data[loginFilePath]}`);
    //     console.log(`${cookieFilePath}: ${data[cookieFilePath]}`);

    //     setLoginFileExists(data[loginFilePath]);
    //     setCookieFileExists(data[cookieFilePath]);
    //   } catch (error) {
    //     console.error("Error fetching file status:", error);
    //   }
    // };

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

    loadLoginData();
    loadCookieData();
  }, [loginFileExists, cookieFileExists]);

  const checkForUpdates = async () => {
    // try {
    //   const response = await fetch("/api/api-github");
    //   if (!response.ok) {
    //     throw new Error(`HTTP error! Status: ${response.status}`);
    //   }
    //   const release = await response.json();
    //   const latestVersion = release.tag_name;
    //   setLatestVersion(latestVersion);
    //   if (version !== latestVersion) {
    //     setUpdateAvailable(true);
    //   }
    // } catch (error) {
    //   console.error("Error checking for updates:", error);
    // }

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
      }

      const wantsToUpdate = await window.githubAPI.showUpdatePopup(
        updateAvailable
      );
      console.log(wantsToUpdate);
      if (wantsToUpdate) {
        console.log("User chose to update the app.");
        // You can add your update logic here, like downloading and installing the update
      } else {
        console.log("User choose not to update or is already up to date.");
      }
    } catch (err) {
      console.error("Error checking for updates:", err);
    }
  };

  useEffect(() => {
    // checkForUpdates();
  }, [version]);

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
        <h3>Credenciais & Cookies:</h3>
        {account ? <p>Conta salva: {account}</p> : null}
        {session ? <p>Últimos cookies da sessão: {formattedDate}</p> : null}
        {!account && !session && (
          <p>Salve suas credenciais AVA e execute o Teste:</p>
        )}
        <br />
        <button>Salvar Credenciais</button>
        <button className="destructive">Excluir Cookies</button>
        <button className="destructive">Excluir Credenciais & Cookies</button>
      </div>
      <div className="card">
        <h3>Atualizações</h3>
        {updateAvailable && (
          <>
            <p>Há uma atualização disponível: {latestVersion}</p>
            <p>Sua Versão: {version}</p>
            <br />
            <button>Atualizar</button>
          </>
        )}

        {!updateAvailable && (
          <>
            <p>Versão: {version}</p>
            <br />
            <button onClick={checkForUpdates}>Verificar Atualização</button>
          </>
        )}
        <button>Reverter</button>
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