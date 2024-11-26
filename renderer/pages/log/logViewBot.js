import React from "react";
import Head from "next/head";
import Link from "next/link";
import LogView from "../../components/logViewer/logView";

export default function NextPage() {
  return (
    <React.Fragment>
      <Head>
        <title>Test</title>
      </Head>
      <h2>Log View / Bot</h2>
      <LogView dir='bot' />
    </React.Fragment>
  );
}