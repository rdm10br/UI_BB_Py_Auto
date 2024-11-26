import React, { useEffect, useState } from "react";
// import { style } from './updatePage.module.css'

const UpdateDownload = () => {
  const [downloadProgress, setDownloadProgress] = useState(null);

  useEffect(() => {
    const onDownloadProgress = (progressObj) => {
      setDownloadProgress(progressObj.percent.toFixed(2));
    };

    // Listen for download progress updates
    window.MainIPC.onDownloadProgress(onDownloadProgress);

    return () => {
      // Clean up listener when the page unmounts
      // window.MainIPC.onDownloadProgress(null);
    };
  }, []);

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h1>Downloading Update</h1>
      <p>The update is being downloaded. Please wait...</p>
      {downloadProgress !== null && (
        <p>Download Progress: {downloadProgress}%</p>
      )}
    </div>
  );
};

export default UpdateDownload;