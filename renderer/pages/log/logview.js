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
      {/* <p>
            Teste - <Link href="/home">Go to home page</Link>
          </p> */}
      <h2>Teste</h2>
      <LogView />
    </React.Fragment>
  );
}
