import React, { useEffect, useState } from "react";
import styles from "./UpdateNotification.module.css";
import { useRouter } from "next/router";

const isProd = process.env.NODE_ENV === "production";

function UpdateNotification() {
  const [state, setState] = useState({
    updateAvailable: false,
    updateDownloaded: false,
    downloadProgress: null,
  });
  const [visible, setVisible] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (visible) {
      const timeout = setTimeout(() => {
        setFadeOut(true); // Trigger the fade-out animation
        setTimeout(() => setVisible(false), 500); // Hide after animation completes
      }, 7*1000); // 7 seconds delay

      return () => clearTimeout(timeout);
    }
  }, [visible]);

  useEffect(() => {
    const onUpdateAvailable = () => {
      console.log("An update is available!");
      setState({
        updateAvailable: true,
        updateDownloaded: false,
        downloadProgress: null,
      });
      setVisible(true);
      setFadeOut(false);

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
      setVisible(true);
      setFadeOut(false);
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
    if (isProd) {
      window.MainIPC.onUpdateAvailable(onUpdateAvailable);
      window.MainIPC.onUpdateDownloaded(onUpdateDownloaded);
      window.MainIPC.onDownloadProgress(onDownloadProgress);
    }
    
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
    visible && (
      <div
        className={`${styles["update-notification"]} ${
          fadeOut ? styles["fade-out"] : ""
        }`}
      >
        {state.updateAvailable && !state.updateDownloaded && (
          <>
            <p>Update available! It will download in the background.</p>
            {state.downloadProgress !== null && (
              <p>Download progress: {state.downloadProgress}%</p>
            )}
          </>
        )}
        {state.updateDownloaded && (
          <>
            <p>Update downloaded! Restart to apply the update.</p>
            <button onClick={handleRestart}>Restart to Update</button>
          </>
        )}
      </div>
    )
  );
}

export default UpdateNotification;