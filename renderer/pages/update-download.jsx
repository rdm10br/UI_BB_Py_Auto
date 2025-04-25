import React, { useEffect, useState } from "react";
import styles from "../components/UpdaterNotification/UpdateNotification.module.css";


const images = [
  "https://media1.tenor.com/m/ZnpxgNXkVbEAAAAd/helldivers-automaton.gif",
  "https://media1.tenor.com/m/ERV_DkcIMxwAAAAd/house-of-wisdom-age-of-empires4.gif",
  "https://media1.tenor.com/m/IIRztzf3eLoAAAAd/among-us-upload.gif",
  // "https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExYWowcDFnbHdvczE2ODMwZDZlY2U1NG12NXAxeWpvYjByaXZxY2g4OSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3o7bu8sRnYpTOG1p8k/giphy.gif",
  // "https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExa25vdDJyaGwzdjdwM2xlb3A3dXh0Y2VkeDF1dnhzcGt3cGhhazR2dCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/cIbJ5bBlNLxynVGYzb/giphy.gif",
  // "https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExdmhrZzVkd2o3amEydG5pM3E1czVpa25nc3M2anh0NnUydDh5c3pkdCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/f9dfemrLEPRCdJcUED/giphy.gif",
  // "https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExNjduM2RycGozYmc3YTN2ZDhuNnU5YXI5Z2M3aWlpZGo5bGlhNmJpNSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/WiIuC6fAOoXD2/giphy.gif",
  // "https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExYmNiNm5xcDBkYnZnNDA0ZWhkNmoybzhxcXQ3NzluZ3EwNzJya2d3NiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/wnYB3vx9t6PXiq1ubB/giphy.gif",
  // "https://media1.tenor.com/m/tn8M_LiWayIAAAAd/home-alone.gif",
  // "https://media1.tenor.com/m/m-t6PExPiasAAAAd/pica-pau-ele-%C3%A9-louco.gif",
  // "https://media1.tenor.com/m/_MuE-M2D_1sAAAAd/going-crazy-crazy.gif",
  // "https://media1.tenor.com/m/XIF2n8jC4iwAAAAd/desenvolvimento-secullum.gif",
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