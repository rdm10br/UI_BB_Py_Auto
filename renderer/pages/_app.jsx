import React from "react";
import AppSideBar from '../components/AppSideBar';
import '../styles/global.css'
import { appWithTranslation } from 'next-i18next';

function MyApp({ Component, pageProps }) {
  return (
    <>
      <AppSideBar/>
      <div>
        <Component {...pageProps} />
      </div>
    </>
  );
}

export default appWithTranslation(MyApp);