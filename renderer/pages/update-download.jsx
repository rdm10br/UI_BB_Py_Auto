import React, { useEffect, useState } from "react";
import styles from "../components/UpdaterNotification/UpdateNotification.module.css";

const images = [
  "https://media1.tenor.com/m/ZnpxgNXkVbEAAAAd/helldivers-automaton.gif",
  "https://media1.tenor.com/m/ERV_DkcIMxwAAAAd/house-of-wisdom-age-of-empires4.gif",
  "https://media1.tenor.com/m/IIRztzf3eLoAAAAd/among-us-upload.gif",
  "https://media2.giphy.com/media/3o7bu8sRnYpTOG1p8k/giphy.gif",
  "https://media3.giphy.com/media/cIbJ5bBlNLxynVGYzb/giphy.gif",
  "https://media2.giphy.com/media/f9dfemrLEPRCdJcUED/giphy.gif",
  "https://media1.giphy.com/media/WiIuC6fAOoXD2/giphy.gif",
  "https://media4.giphy.com/media/wnYB3vx9t6PXiq1ubB/giphy.gif",
  "https://media1.tenor.com/m/tn8M_LiWayIAAAAd/home-alone.gif",
  "https://media1.tenor.com/m/m-t6PExPiasAAAAd/pica-pau-ele-%C3%A9-louco.gif",
  "https://media1.tenor.com/m/_MuE-M2D_1sAAAAd/going-crazy-crazy.gif",
  "https://media1.tenor.com/m/XIF2n8jC4iwAAAAd/desenvolvimento-secullum.gif",
];

const UpdateDownload = () => {
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [selectedImage, setSelectedImage] = useState("");

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * images.length);
    setSelectedImage(images[randomIndex]);
  }, []);

  useEffect(() => {
    const handler = (event, progress) => {
      if (progress && typeof progress.percent === "number") {
        const percent = Number(progress.percent.toFixed(2));
        console.log(`Progress: ${percent}%`);
        setDownloadProgress(percent);
      } else {
        console.warn("Invalid progress object:", progress);
      }
    };

    window.MainIPC.onDownloadProgress(handler);

    return () => {
    };
  }, []);

  return (
    <div className={styles.progressBody}>
      <h1>Downloading Update</h1>
      <p>The update is being downloaded. Please wait...</p>
      <img
        src={selectedImage}
        alt="Update download animation"
        style={{
          width: "50%",
          maxWidth: "500px",
          height: "auto",
          borderRadius: "16px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
        }}
      />
      <br/>
      <progress
        className={styles.progress}
        max="100"
        value={downloadProgress}
      />
      <p>Download Progress: {downloadProgress.toFixed(0)}%</p>
    </div>
  );
};

export default UpdateDownload;