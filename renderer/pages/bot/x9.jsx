import React from "react";
import Head from "next/head";
// import Link from "next/link";
import Runner from "../../components/Runner/runner";
import Accordion from "../../components/Accordion/accordion";
import ObsComponent from "../../components/obsComponent/obsComponent"

export default function NextPage() {
  return (
    <React.Fragment>
      <Head>
        <title>X9</title>
      </Head>
      <div>
        <h2>X9</h2>
        <div className="card-tutorial">
          <Accordion
            pageProps={
              <>
                <p>
                  Para utilizar este robô, é necessário preencher o ID da sala
                  desejada na aba "Salas" da planilha, na coluna "ID".
                  Certifique-se de salvar e fechar a planilha antes de iniciar a
                  execução.
                </p>
                <p>
                  Este robô verificará todas as configurações dos itens na sala
                  informada e retornará o resultado na planilha, devidamente
                  organizado em colunas na aba "Salas".
                </p>
                <ObsComponent/>
              </>
            }
          />
        </div>
        <Runner script="Main_config_doublecheck.py"></Runner>
      </div>
    </React.Fragment>
  );
}