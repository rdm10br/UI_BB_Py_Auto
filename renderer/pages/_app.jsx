import React from "react";
import AppSideBar from '../components/SideBar/AppSideBar';
import UpdateNotification from "../components/UpdaterNotification/UpdateNotification";
import '../styles/global.css'

function MyApp({ Component, pageProps }) {
  return (
    <>
      <AppSideBar/>
      <div>
        <Component {...pageProps} />
      </div>
      <UpdateNotification />
    </>
  );
}

export default MyApp;