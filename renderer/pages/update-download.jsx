import React, { useEffect, useState } from "react";
import styles from "../components/UpdaterNotification/UpdateNotification.module.css";

const UpdateDownload = () => {
  const [downloadProgress, setDownloadProgress] = useState(null);

  useEffect(() => {
    console.log("Update download page test")
    const onDownloadProgress = (progressObj) => {
      console.log(progressObj)
      setDownloadProgress(progressObj.percent.toFixed(2));
    };

    window.MainIPC.onDownloadProgress(onDownloadProgress);

    return () => {
    };
  }, []);

  return (
    <div className={styles.progressBody}>
      <h1>Downloading Update</h1>
      <p>The update is being downloaded. Please wait...</p>
      <img src="https://media1.tenor.com/m/ZnpxgNXkVbEAAAAd/helldivers-automaton.gif"/>
      <br />
      <progress className={styles.progress} max="100" value={downloadProgress || 0}/>
      {downloadProgress !== null || 0==0 && (
        <p>Download Progress: {downloadProgress || 0}%</p>
      )}
    </div>
  );
};

export default UpdateDownload;