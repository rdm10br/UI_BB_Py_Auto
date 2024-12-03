import React, { useEffect, useState } from "react";
import styles from "./UpdateNotification.module.css";
import { useRouter } from "next/router";

function UpdateNotification() {
  const [state, setState] = useState({
    updateAvailable: false,
    updateDownloaded: false,
    downloadProgress: null,
  });
  const router = useRouter();

  useEffect(() => {
    const onUpdateAvailable = () => {
      console.log("An update is available!");
      setState({
        updateAvailable: true,
        updateDownloaded: false,
        downloadProgress: null,
      });

      // Redirect to the download page if not already there
      if (router.pathname !== "/update-download") {
        router.push("/update-download");
      }
    };

    const onUpdateDownloaded = () => {
      console.log(
        "A new update is ready to install. Restart the app to apply it."
      );
      setState({
        updateAvailable: false,
        updateDownloaded: true,
        downloadProgress: null,
      });
      alert("A new update is ready to install. Restart the app to apply it.");
    };

    const onDownloadProgress = (progressObj) => {
      if (progressObj && progressObj.percent !== undefined) {
        setState((prevState) => ({
          ...prevState,
          downloadProgress: progressObj.percent.toFixed(2),
        }));
      } else {
        console.warn("Invalid progress object received:", progressObj);
      }
    };

    // Register IPC listeners
    window.MainIPC.onUpdateAvailable(onUpdateAvailable);
    window.MainIPC.onUpdateDownloaded(onUpdateDownloaded);
    window.MainIPC.onDownloadProgress(onDownloadProgress);

    return () => {
      // Unregister IPC listeners
      // window.MainIPC.offUpdateAvailable(onUpdateAvailable);
      // window.MainIPC.offUpdateDownloaded(onUpdateDownloaded);
      // window.MainIPC.offDownloadProgress(onDownloadProgress);
    };
  }, [router]);

  const handleRestart = () => {
    window.MainIPC.restartApp();
  };

  return (
    <>
      {state.updateAvailable && !state.updateDownloaded && (
        <div className={styles["update-notification"]}>
          <p>Update available! It will download in the background.</p>
          {state.downloadProgress !== null && (
            <p>Download progress: {state.downloadProgress}%</p>
          )}
        </div>
      )}
      {state.updateDownloaded && (
        <div className={styles["update-notification"]}>
          <p>Update downloaded! Restart to apply the update.</p>
          <button onClick={handleRestart}>Restart to Update</button>
        </div>
      )}
    </>
  );
}

export default UpdateNotification;