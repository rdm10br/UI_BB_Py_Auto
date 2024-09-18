import React, { useState, useEffect } from "react";
import Image from "next/image";
import styles from "./AppSideBar.module.css";

const Runner = ({ script }) => {
  const [result, setResult] = useState(""); // Initialize result as an empty string
  const [terminal, setTerminal] = useState(false);
  const [play, setPlay] = useState(false);

  useEffect(() => {
    window.ipc.on("python-start", (event, data) => {
      setResult(data);
    });
    // Set up IPC listeners when the component mounts
    window.ipc.on("python-result", (event, data) => {
      console.log("Received data:", data);
      setResult((prevResult) => prevResult + (data ? data.toString() : ""));
      // setPlay(false); // Stop playing once the result is received
    });
    window.ipc.on("python-error", (event, error) => {
      console.error(error);
      // setPlay(false); // Stop playing in case of an error
    });

    // Cleanup listeners when the component unmounts
    return () => {
      // window.ipc.removeAllListeners("python-result");
      // window.ipc.removeAllListeners("python-error");
    };
  }, []);

  const runPython = () => {
    setResult(""); // Clear the previous result
    setTerminal(true);
    setPlay(true);
    window.ipc.send("run-python", script); // Trigger Python script execution
  };

  const stopPython = () => {
    setPlay(false); // Stop the execution
    setTerminal(false); // Optionally hide the terminal
    window.ipc.send("stop-python"); // Send a signal to stop the Python script
  };

  const pausePython = () => {
    setPlay(false); // Stop the execution
    setTerminal(false); // Optionally hide the terminal
    window.ipc.send("pause-python"); // Send a signal to stop the Python script
  };
  const resumePython = () => {
    setPlay(false); // Stop the execution
    setTerminal(false); // Optionally hide the terminal
    window.ipc.send("resume-python"); // Send a signal to stop the Python script
  };
  return (
    <div className="card">
      {!play ? (
        <button onClick={runPython} className={styles.runner}>
          <Image
            className={styles.icon_button}
            src="/icon/play-button-arrowhead.png"
            height={20}
            width={20}
          />
        </button>
      ) : (
        <button onClick={pausePython} className={styles.runner}>
          <Image
            className={styles.icon_button}
            src="/icon/pause.png"
            height={20}
            width={20}
          />
        </button>
      )}
      {play && (
        <button onClick={stopPython} className={styles.runner_destructive}>
          <Image
            className={styles.icon_button}
            src="/icon/stop-button.png"
            height={20}
            width={20}
          />
        </button>
      )}
      {terminal && (
        <>
          <p>Terminal: </p>
          <div className="terminal">
            <pre>{result}</pre>
          </div>
        </>
      )}
    </div>
  );
};

export default Runner;