import React, { useEffect, useState } from "react";
import styles from "../components/UpdaterNotification/UpdateNotification.module.css";


const images = [
  "https://media1.tenor.com/m/ZnpxgNXkVbEAAAAd/helldivers-automaton.gif",
  "https://media1.tenor.com/m/ERV_DkcIMxwAAAAd/house-of-wisdom-age-of-empires4.gif",
  "https://media1.tenor.com/m/IIRztzf3eLoAAAAd/among-us-upload.gif",
];

const UpdateDownload = () => {
  const [downloadProgress, setDownloadProgress] = useState(null);

  const [selectedImage, setSelectedImage] = useState("");

  useEffect(() => {
    // Seleciona uma imagem aleatória ao carregar o componente
    const randomIndex = Math.floor(Math.random() * images.length);
    setSelectedImage(images[randomIndex]);
  }, []);

  // useEffect(() => {
  //   console.log("Update download page test")
  //   const onDownloadProgress = (progressObj) => {
  //     console.log(progressObj)
  //     setDownloadProgress(progressObj.percent.toFixed(2));
  //   };

  //   window.MainIPC.onDownloadProgress(onDownloadProgress);

  //   return () => {
  //   };
  // }, []);

  useEffect(() => {
    console.log("Update download page loaded");
  
    const handleProgress = (percent) => {
      console.log(`Progress received: ${percent}%`);
      setDownloadProgress(percent);
    };
  
    // Register the IPC listener
    window.MainIPC.onDownloadProgress((event, percent) => {
      if (typeof percent === "number") {
        handleProgress(percent); // Call the handler with the percent value
      } else {
        console.warn("Invalid progress data:", percent);
      }
    });
  
    // Cleanup the listener when the component unmounts
    return () => {
      // window.MainIPC.removeDownloadProgressListener(handleProgress);
    };
  }, []);


  return (
    <div className={styles.progressBody}>
      <h1>Downloading Update</h1>
      <p>The update is being downloaded. Please wait...</p>
      <img
        src={selectedImage}
        alt="Random"
        style={{
          width: "50%",
          maxWidth: "500px",
          height: "auto",
          borderRadius: "16px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
        }}
      />
      <br />
      <progress className={styles.progress} max="100" value={downloadProgress || 0}/>
      {downloadProgress !== null || 0==0 && (
        <p>Download Progress: {downloadProgress || 0}%</p>
      )}
    </div>
  );
};

export default UpdateDownload;