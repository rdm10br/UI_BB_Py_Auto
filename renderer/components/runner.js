import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import styles from "./AppSideBar.module.css";

const Runner = ({ script }) => {
  const [result, setResult] = useState(null);
  useEffect(() => {
    // Set up IPC listeners when the component mounts
    window.ipc.on('python-result', (event, data) => {
      setResult((prevResult) => prevResult + data); // Append new data to the result
    });
    window.ipc.on('python-error', (event, error) => {
      console.error(error);
    });

    // Cleanup listeners when the component unmounts
    return () => {
      window.ipc.removeAllListeners('python-result');
      window.ipc.removeAllListeners('python-error');
    };
  }, []);
  const runPython = () => {
    setResult(""); // Clear the previous result
    window.ipc.send('run-python', script);
  };
  return (
    <div>
      <div className="card">
        <button
          onClick={runPython}
        className={styles.runner}
        >
          <Image
          className={styles.icon_button}
          src="/icon/play-button-arrowhead.png"
          height={20}
          width={20}
          />
        </button>
        <button
        className={styles.runner}
        >
          <Image
          className={styles.icon_button}
          src="/icon/pause.png"
          height={20}
          width={20}
          />
        </button>
        <button
          className={styles.runner_destructive}
        >
          <Image
          className={styles.icon_button}
          src="/icon/stop-button.png"
          height={20}
          width={20}
          />
        </button>
        {!setResult && (
        <>
        <p>Terminal: </p>
        <div className="terminal">
          <p>{result}</p>
        </div>
        </>)
        }
      </div>
    </div>
  );
};

export default Runner;