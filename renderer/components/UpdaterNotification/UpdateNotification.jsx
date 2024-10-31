import React, { useEffect, useState } from 'react';

function UpdateNotification() {
  const [updateAvailable, setUpdateAvailable] = useState(false);

  useEffect(() => {
    window.MainIPC.onUpdateAvailable(() => {
      setUpdateAvailable(true);
      console.log('An update is available!');
    });

    window.MainIPC.onUpdateDownloaded(() => {
      setUpdateAvailable(false);
      alert('A new update is ready to install. Restart the app to apply it.');
    });
  }, []);

  const handleRestart = () => {
    window.MainIPC.restartApp();
  };

  return (
    <>
      {updateAvailable && (
        <div>
          <p>Update available! It will download in the background.</p>
          <button onClick={handleRestart}>Restart to Update</button>
        </div>
      )}
    </>
  );
}

export default UpdateNotification;