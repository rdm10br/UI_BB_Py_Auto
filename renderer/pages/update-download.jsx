import React, { useEffect, useState } from "react";

const UpdateDownload = () => {
  const [downloadProgress, setDownloadProgress] = useState(null);

  useEffect(() => {
    const onDownloadProgress = (progressObj) => {
      setDownloadProgress(progressObj.percent.toFixed(2));
    };

    // Listen for download progress updates
    window.MainIPC.onDownloadProgress(onDownloadProgress);

    return () => {
      // Clean up listener when the page unmounts.
      // window.MainIPC.onDownloadProgress(null);
    };
  }, []);

  const progressBarStyle = {
    container: {
      width: "80%",
      height: "20px",
      backgroundColor: "#e0e0de",
      borderRadius: "10px",
      margin: "20px auto",
      overflow: "hidden",
    },
    filler: {
      height: "100%",
      backgroundColor: "#76c7c0",
      transition: "width 0.3s ease-in-out",
    },
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h1>Downloading Update</h1>
      <p>The update is being downloaded. Please wait...</p>

      <div style={progressBarStyle.container}>
        <div
          style={{
            ...progressBarStyle.filler,
            width: `${downloadProgress || 0}%`,
          }}
        ></div>
      </div>

      {downloadProgress !== null && (
        <p>Download Progress: {downloadProgress}%</p>
      )}
    </div>
  );
};

export default UpdateDownload;
