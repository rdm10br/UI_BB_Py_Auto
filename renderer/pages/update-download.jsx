import React, { useEffect, useState } from "react";

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
      // window.MainIPC.offDownloadProgress(onDownloadProgress);
    };
  }, []);

  const progressBarStyles = {
    container: {
      width: "80%",
      height: "20px",
      backgroundColor: "#e0e0de",
      borderRadius: "12px",
      margin: "24px auto",
      overflow: "hidden",
    },
    filler: (width) => ({
      height: "100%",
      width: `${width}%`,
      backgroundColor: "#42a0a0",
      transition: "width 0.6s ease-in-out",
    }),
  };

  return (
    <div style={{ textAlign: "center", padding: "32.9vh" }}>
      <h1>Downloading Update</h1>
      <p>The update is being downloaded. Please wait...</p>

      <div style={progressBarStyles.container}>
        <div style={progressBarStyles.filler(downloadProgress || 0)} />
      </div>

      {downloadProgress !== null && (
        <p>Download Progress: {downloadProgress || 0}%</p>
      )}
    </div>
  );
};

export default UpdateDownload;