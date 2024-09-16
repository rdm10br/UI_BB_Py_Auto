import React, { useState, useEffect } from "react";
import Head from "next/head";
import { useTranslation } from 'react-i18next';
import { withTranslation } from '../lib/withTranslation.js';
import versionData from "../../../BB_Py_Automation/release.json";
// import Link from "next/link";

export const getServerSideProps = withTranslation('common');

export default function NextPage() {
  const { t } = useTranslation('common');
  // console.log(t);
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
        <title>{t('settings')}</title>
      </Head>
      <div>
        <h2>{t('settings')}</h2>
      </div>
      <div className="card">
        <h3>{t('credentialAndCookies.title')}</h3>
        {account ? <p>{t('credentialAndCookies.accountSaved')} : {account}</p> : null}
        {session ? <p>{t('credentialAndCookies.lastSessionCookies')} : {formattedDate}</p> : null}
        {!account && !session && (
          <p>{t('credentialAndCookies.saveCredentialsPrompt')}</p>
        )}
        <br />
        <button>{t('credentialAndCookies.buttons.saveCredentials')}</button>
        <button className="destructive">{t('credentialAndCookies.buttons.deleteCookies')}</button>
        <button className="destructive">{t('credentialAndCookies.buttons.deleteCredentialsAndCookies')}</button>
      </div>
      <div className="card">
        <h3>{t('updates.title')}</h3>
        {updateAvailable && (
          <>
            <p>{t('updates.updateAvailable.message')} : {latestVersion}</p>
            <p>{t('updates.updateAvailable.yourVersion')} : {version}</p>
            <br />
            <button>{t('updates.updateAvailable.buttons.update')}</button>
          </>
        )}

        {!updateAvailable && (
          <>
            <p>{t('updates.noUpdateAvailable.message')} : {version}</p>
            <br />
            <button>{t('updates.noUpdateAvailable.buttons.checkForUpdate')}</button>
          </>
        )}
        <button>{t('updates.buttons.rollback')}</button>
        <button>{t('updates.buttons.viewLogs')}</button>
        <button className="destructive">{t('updates.buttons.deleteLogs')}</button>
      </div>
      <div className="card">
        <h3>{t('botLogs.title')}</h3>
        <p>{t('botLogs.description')}</p>
        <br />
        <button>{t('botLogs.buttons.viewLogs')}</button>
        <button className="destructive">{t('botLogs.buttons.deleteLogs')}</button>
      </div>
    </React.Fragment>
  );
}