import Head from "next/head";
import React from "react";

export default function HomePage() {
  const [message, setMessage] = React.useState("No message found.");
  React.useEffect(() => {
    window.ipc.on("message", (message) => {
      setMessage(message);
    });
  }, []);

  const [title, setTitle] = React.useState("");

  const changeTitle = () => {
    window.ipc.send("set-title", document.title);
  };
  return (
    <React.Fragment>
      <Head>
        {/* <meta httpEquiv="Content-Security-Policy" content="default-src 'self'; script-src 'self'"/> */}
        <title onChange={changeTitle}>Home</title>
      </Head>
      <div className="title">
        <h2>Home - Teste</h2>
      </div>
      <div className="card">
        <button
          onClick={() => {
            window.ipc.send("message", "Batata");
          }}
        >
          Test IPC Button
        </button>
        <button
          onClick={() => {
            window.ipc.send("message", "Destructive");
          }}
          className="destructive"
        >
          terminal Test Destructive Button
        </button>
        <p>Message: </p>
        <div className="terminal">
          <p>{message}</p>
        </div>
      </div>
      <div className="card">
        Message:
        <div className="terminal">
          <p>Message: [{message}]</p>
        </div>
      </div>
    </React.Fragment>
  );
}