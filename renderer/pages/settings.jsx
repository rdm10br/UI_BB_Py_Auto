import React, { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import versionData from "../../../BB_Py_Automation/release.json";

export default function NextPage() {
  const [version] = useState(versionData.CURRENT_VERSION);
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
        <p>Save your AVA Credentials :</p>
        <br/>
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
        <br/>
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
        <br/>
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
