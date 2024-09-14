import React, { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import versionData from "../../../BB_Py_Automation/release.json";
import path from 'path'

import accountsaved from "../../../BB_Py_Automation/src/Metodos/Login/__pycache__/login.json";
import cookie from "../../../BB_Py_Automation/src/Metodos/Login/__pycache__/login_cache.json";

export default function NextPage() {
  const [version] = useState(versionData.CURRENT_VERSION);
  const [account] = useState(accountsaved.username);
  const [session] = useState(cookie.timestamp);
  const date = new Date(session);
  const offset = -3; // GMT-3
  const gmt3Date = new Date(date.getTime() + offset * 60 * 60 * 1000);
  // const formattedDate = gmt3Date.toISOString().replace("Z", "");
  const day = String(gmt3Date.getDate()).padStart(2, "0");
  const month = String(gmt3Date.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
  const year = gmt3Date.getFullYear();
  const hours = String(gmt3Date.getHours()).padStart(2, "0");
  const minutes = String(gmt3Date.getMinutes()).padStart(2, "0");
  const seconds = String(gmt3Date.getSeconds()).padStart(2, "0");

  // Combine into the desired format: dd/mm/yyyy hh:mm:ss
  const formattedDate = `${day}/${month}/${year} ${hours}:${minutes}:${seconds} GMT ${offset}`;
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
        {/* <p>Save your AVA Credentials :</p> */}
        <p>Account saved : {account}</p>
        <p>Last Session cookies : {formattedDate}</p>
        <br />
        <button
        // onClick={() => {
        //   window.ipc.send("message", "Batata");
        // }}
        >
          Save Credentials
        </button>
        <button
          // onClick={() => {
          //   window.ipc.send("message", "Destructive");
          // }}
          className="destructive"
        >
          Delete Cookies
        </button>
        <button
          // onClick={() => {
          //   window.ipc.send("message", "Destructive");
          // }}
          className="destructive"
        >
          Delete Cretendials & Cookies
        </button>
      </div>
      <div className="card">
        <h3>Updates</h3>
        <p>Version : {version}</p>
        <br />
        <button
        // onClick={() => {
        //   window.ipc.send("message", "Batata");
        // }}
        >
          Check for Update
        </button>
        <button
        // onClick={() => {
        //   window.ipc.send("message", "Batata");
        // }}
        >
          Rollback
        </button>
        <button
        // onClick={() => {
        //   window.ipc.send("message", "Batata");
        // }}
        >
          View Logs
        </button>
        <button
          // onClick={() => {
          //   window.ipc.send("message", "Destructive");
          // }}
          className="destructive"
        >
          Delete Logs
        </button>
      </div>
      <div className="card">
        <h3>Bot Logs :</h3>
        <p>Logs from all bots runs</p>
        <br />
        <button
        // onClick={() => {
        //   window.ipc.send("message", "Batata");
        // }}
        >
          View Logs
        </button>
        <button
          // onClick={() => {
          //   window.ipc.send("message", "Destructive");
          // }}
          className="destructive"
        >
          Delete Logs
        </button>
      </div>
    </React.Fragment>
  );
}
