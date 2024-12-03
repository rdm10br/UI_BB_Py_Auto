import React, { useEffect, useState } from 'react';
import { style } from "./UpdateNotification.module.css";
import { useRouter } from "next/router";

function UpdateNotification() {
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(null);
  const [updateDownloaded, setUpdateDownloaded] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const onUpdateAvailable = () => {
      setUpdateAvailable(true);
      setUpdateDownloaded(false);
      console.log('An update is available!');
      
      // Redirect to the download page
       router.push("/update-download");
    };

    const onUpdateDownloaded = () => {
      setUpdateAvailable(false);
      setUpdateDownloaded(true);
      console.log('A new update is ready to install. Restart the app to apply it.');
      alert('A new update is ready to install. Restart the app to apply it.');
    };

    const onDownloadProgress = (progressObj) => {
      setDownloadProgress(progressObj.percent.toFixed(2));
    };

    // Register IPC listeners
    window.MainIPC.onUpdateAvailable(onUpdateAvailable);
    window.MainIPC.onUpdateDownloaded(onUpdateDownloaded);
    window.MainIPC.onDownloadProgress(onDownloadProgress);
    
    return () => {
    };
  }, [router]);

  const handleRestart = () => {
    window.MainIPC.restartApp();
  };

  return (
    <>
      {updateAvailable && !updateDownloaded && (
        <div className={style.update-notification}>
          <p>Update available! It will download in the background.</p>
          {downloadProgress !== null && (
            <p>Download progress: {downloadProgress}%</p>
          )}
        </div>
      )}
      {updateDownloaded && (
        <div className={style.update-notification}>
          <p>Update downloaded! Restart to apply the update.</p>
          <button onClick={handleRestart}>Restart to Update</button>
        </div>
      )}
    </>
  );
}

export default UpdateNotification;