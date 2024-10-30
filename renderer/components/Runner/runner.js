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
    // window.MainIPC.on("python-start", (event, data) => {
    //   setResult(data);
    // });

    // Set up IPC listeners when the component mounts
    // window.MainIPC.on("python-result", (event, data) => {
    //   console.warn("Received data:", data);
    //   setResult((prevResult) => prevResult + (data ? data.toString() : ""));
    //   // setPlay(false); // Stop playing once the result is received
    // });

    function scrollToBottom() {
      const terminal = document.querySelector(".terminal");
      terminal.scrollTop = terminal.scrollHeight;
      window.scrollTo(0, document.body.scrollHeight);
    }

    const handlePythonOutput = (data) => {
      setResult((prev) => prev + `${data}`);
      scrollToBottom();
    };

    const handlePythonError = (data) => {
      setResult((prev) => prev + `${data}`);
      scrollToBottom();
    };
  
    const handlePythonClose = (data) => {
      scrollToBottom();
      setPlay(false);
    };

    // window.MainIPC.onPythonOutput((data) => {
    //   setResult((prev) => prev + `${data}`);
    //   scrollToBottom();
    // });

    // window.MainIPC.onPythonError((data) => {
    //   setOutput((prev) => prev + `${data}`);
    //   scrollToBottom();
    // });

    // window.MainIPC.onPythonClose((data) => {
    //   // setResult((prev) => prev + `${data}`);
    //   scrollToBottom();
    //   setPlay(false);
    // });

    window.MainIPC.onPythonOutput(handlePythonOutput);
    window.MainIPC.onPythonError(handlePythonError);
    window.MainIPC.onPythonClose(handlePythonClose);

    // Cleanup listeners when the component unmounts
    return () => {
      window.MainIPC.onPythonOutput(() => {}); // Cleanup
      window.MainIPC.onPythonError(() => {}); // Cleanup
      window.MainIPC.onPythonClose(() => {}); // Cleanup
    };
  }, []);

  const runPython = () => {
    setprev("");
    setResult(`Starting Python Script: ${script}\n`); // Clear the previous result
    setTerminal(true);
    setPlay(true);
    window.MainIPC.runPython(`src/${script}`); // Trigger Python script execution
  };

  const stopPython = () => {
    setPlay(false); // Stop the execution
    setTerminal(false); // Optionally hide the terminal
    window.MainIPC.stopPython(); // Send a signal to stop the Python script
  };

  const pausePython = () => {
    setPlay(false); // Stop the execution
    setTerminal(false); // Optionally hide the terminal
    window.MainIPC.send("pause-python"); // Send a signal to stop the Python script
  };
  const resumePython = () => {
    setPlay(false); // Stop the execution
    setTerminal(false); // Optionally hide the terminal
    window.MainIPC.send("resume-python"); // Send a signal to stop the Python script
  };
  const submitFeedback = () => {
    let submitedFeedback = `Feedback for ${script} submitted: ${feedBack}`;
    console.log(submitedFeedback);

    // Here you could send the feedback to an API or backend, e.g.:
    // window.MainIPC.send("submit-feedback", feedBack);

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
      <div id="feedback" className={styles.accordeon}>
        <h3 onClick={() => setIsAccordionOpen(!isAccordionOpen)}>
          FeedBack
          {isAccordionOpen ? (
            <FaChevronDown className={styles.icon} />
          ) : (
            <FaChevronUp className={styles.icon} />
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
              rows={5}
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