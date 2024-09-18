import React from "react";

const Tutorial = ({ pageProps }) => {
  return (
    <>
      <div className="card-tutorial">
        <h3>Tutorial</h3>
        <Component {...pageProps} />
      </div>
    </>
  );
};

export default Tutorial;