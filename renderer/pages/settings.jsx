import React, { useState, useEffect } from "react";
import Head from "next/head";
import versionData from "../../../BB_Py_Automation/release.json";
// import Link from "next/link";

export default function NextPage() {
  const [version] = useState(versionData.CURRENT_VERSION);
  // const [version, setVersion] = useState(null);
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
    const fetchFileStatus = async () => {
      const query = `?files=${encodeURIComponent(
        loginFilePath
      )}&files=${encodeURIComponent(cookieFilePath)}`;

      try {
        const response = await fetch(`/api/check-files${query}`);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        // console.log(`${loginFilePath}: ${data[loginFilePath]}`);
        // console.log(`${cookieFilePath}: ${data[cookieFilePath]}`);
        setLoginFileExists(data[loginFilePath]);
        setCookieFileExists(data[cookieFilePath]);
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

    loadLoginData();
    loadCookieData();
  }, [loginFileExists, cookieFileExists]);

  useEffect(() => {
    const checkForUpdates = async () => {
      try {
        const response = await fetch("/api/api-github");
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const release = await response.json();
        const latestVersion = release.tag_name;
        setLatestVersion(latestVersion);
        if (version !== latestVersion) {
          setUpdateAvailable(true);
        }
      } catch (error) {
        console.error("Error checking for updates:", error);
      }
    };

    checkForUpdates();
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
        <title>Settings</title>
      </Head>
      <div>
        <h2>Settings</h2>
      </div>
      <div className="card">
        <h3>Credential & Cookies :</h3>
        {account ? <p>Account saved : {account}</p> : null}
        {session ? <p>Last Session cookies : {formattedDate}</p> : null}
        {!account && !session && (
          <p>Save your AVA Credentials and run the Test:</p>
        )}
        <br />
        <button>Save Credentials</button>
        <button className="destructive">Delete Cookies</button>
        <button className="destructive">Delete Cretendials & Cookies</button>
      </div>
      <div className="card">
        <h3>Updates</h3>
        {updateAvailable && (
          <>
            <p>There is an Update Available: {latestVersion}</p>
            <p>Your Version: {version}</p>
            <br />
            <button>Update</button>
          </>
        )}

        {!updateAvailable && (
          <>
          <p>Version : {version}</p>
          <br />
          <button>Check for Update</button>
          </>
          )}
        <button>Rollback</button>
        <button>View Logs</button>
        <button className="destructive">Delete Logs</button>
      </div>
      <div className="card">
        <h3>Bot Logs :</h3>
        <p>Logs from all bots runs</p>
        <br />
        <button>View Logs</button>
        <button className="destructive">Delete Logs</button>
      </div>
    </React.Fragment>
  );
}