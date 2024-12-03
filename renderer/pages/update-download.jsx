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
      borderRadius: "12px",
      margin: "24px auto",
      overflow: "hidden",
    },
    filler: {
      height: "100%",
      backgroundColor: "#42a0a0",
      transition: "width 0.6s ease-in-out",
      padding: 0,
      margin: 0
    },
  };

  return (
    <div style={{ textAlign: "center", padding: "32.9vh" }}>
      <h1>Downloading Update</h1>
      <p>The update is being downloaded. Please wait...</p>

      <div style={progressBarStyle.container}>
        <div
          style={{
            ...progressBarStyle.filler,
            width: `${downloadProgress || 0}%`,
          }}
        />
      </div>

      {downloadProgress !== null || 0==0 && (
        <p>Download Progress: {downloadProgress || 0}%</p>
      )}
    </div>
  );
};

export default UpdateDownload;
