import React, { useState, useEffect } from "react";
import Image from "next/image";
import styles from "../SideBar/AppSideBar.module.css";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

const Runner = ({ script }) => {
  const [result, setResult] = useState("");
  const [prev, setprev] = useState("");
  const [terminal, setTerminal] = useState(false);
  const [play, setPlay] = useState(false);
  const [feedBack, setFeedBack] = useState("");
  const [isAccordionOpen, setIsAccordionOpen] = useState(true);

  useEffect(() => {
    // window.ipc.on("python-start", (event, data) => {
    //   setResult(data);
    // });

    // Set up IPC listeners when the component mounts
    // window.ipc.on("python-result", (event, data) => {
    //   console.warn("Received data:", data);
    //   setResult((prevResult) => prevResult + (data ? data.toString() : ""));
    //   // setPlay(false); // Stop playing once the result is received
    // });

    function scrollToBottom() {
      const terminal = document.querySelector(".terminal");
      terminal.scrollTop = terminal.scrollHeight;
      window.scrollTo(0, document.body.scrollHeight);
    }

    window.ipc.on("python-output", (data) => {
      setResult((prev) => prev + `${data}`);
      scrollToBottom();
    });

    window.ipc.on("python-error", (data) => {
      setOutput((prev) => prev + `${data}`);
      scrollToBottom();
    });

    window.ipc.on("python-close", (data) => {
      // setResult((prev) => prev + `${data}`);
      scrollToBottom();
      setPlay(false);
    });
    // Cleanup listeners when the component unmounts
    return () => {};
  }, []);

  const runPython = () => {
    setprev("");
    setResult(`Starting Python Script: ${script}\n`); // Clear the previous result
    setTerminal(true);
    setPlay(true);
    window.ipc.send("run-python", `src/${script}`); // Trigger Python script execution
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
  const submitFeedback = () => {
    let submitedFeedback = `Feedback for ${script} submitted: ${feedBack}`;
    console.log(submitedFeedback);

    // Here you could send the feedback to an API or backend, e.g.:
    // window.ipc.send("submit-feedback", feedBack);

    // Clear the feedback input after submission
    setFeedBack("");
  };
  return (
    <>
      <div id="runner" className="card">
        {!play ? (
          <button onClick={runPython} className={styles.runner}>
            <Image
              className={styles.icon_button}
              src="/icon/play-button-arrowhead.png"
              height={20}
              width={20}
              alt="Description of the image"
            />
          </button>
        ) : (
          <button onClick={pausePython} className={styles.runner}>
            <Image
              className={styles.icon_button}
              src="/icon/pause.png"
              height={20}
              width={20}
              alt="Description of the image"
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
              alt="Description of the image"
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
      <div id="feedback" className="card">
        <h3
          onClick={() => setIsAccordionOpen(!isAccordionOpen)}
          style={{ cursor: "pointer" }}
        >
          Feedback{" "}
          {isAccordionOpen ? (
            <FaChevronUp className={styles.icon} />
          ) : (
            <FaChevronDown className={styles.icon} />
          )}
        </h3>
        {!isAccordionOpen &&
        (
          <>
            <textarea
              className={styles.feedbackfield}
              type="text"
              placeholder="Dê seu FeedBack aqui !"
              value={feedBack}
              onChange={(e) => setFeedBack(e.target.value)}
              rows={10}
            />
            <button className={styles.runner} onClick={submitFeedback}>
              Submeter
            </button>
          </>
        )}
      </div>
    </>
  );
};

export default Runner;