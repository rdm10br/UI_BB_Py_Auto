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
        <title>Master</title>
      </Head>
      <div>
        <h2>Double Check - Master</h2>
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
                  Este robô fara o doublecheck dos itens [Organize seus estudos
                  com a Sofia, Pasta de Avaliações, Ser Melhor], ele retornará o
                  resultado na planilha na mesma aba.
                </p>
                <ObsComponent/>
              </>
            }
          />
        </div>
        <Runner script="Main_doublecheck_Master.py"></Runner>
      </div>
    </React.Fragment>
  );
}