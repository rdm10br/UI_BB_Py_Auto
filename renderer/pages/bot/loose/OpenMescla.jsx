import React from "react";
import Head from "next/head";
// import Link from "next/link";
import Runner from "../../../components/Runner/runner";
import Accordion from "../../../components/Accordion/accordion";
import ObsComponent from "../../../components/obsComponent/obsComponent"

export default function NextPage() {
  return (
    <React.Fragment>
      <Head>
        <title>Open Mescla</title>
      </Head>
      <div>
        <h2>Avulso - Open Mescla</h2>
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
                  Este robô alterara as datas dos itens [Fale com o Tutor,
                  Desafio Colaborativo] funcionando e retornará o resultado na
                  planilha, devidamente organizado em colunas na aba "Salas".
                </p>
                <ObsComponent/>
              </>
            }
          />
        </div>
        <Runner script="Main_Open_Mescla.py"></Runner>
      </div>
    </React.Fragment>
  );
}