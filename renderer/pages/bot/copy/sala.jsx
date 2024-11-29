import React from "react";
import Head from "next/head";
// import Link from 'next/link'
import Runner from "../../../components/Runner/runner";
import Accordion from "../../../components/Accordion/accordion";
import ObsComponent from "../../../components/obsComponent/obsComponent"

export default function NextPage() {
  return (
    <React.Fragment>
      <Head>
        <title>Sala</title>
      </Head>
      <div>
        <h2>Cópia - Sala Nova</h2>
        <div className="card-tutorial">
          <Accordion
            pageProps={
              <>
                <p>
                  Para utilizar este robô, é necessário preencher o ID da sala
                  desejada na aba "salaCopia" da planilha, na coluna
                  "ID_DESTINY" (a sala destino, para aonde a cópia vai ser
                  efetuada) e "ID_ORIGIN" (sala de origem, a de onde a cópia é
                  baseada). Certifique-se de salvar e fechar a planilha antes de
                  iniciar a execução.
                </p>
                <p>
                  Este robô fara a criação e copia para uma sala nova, e
                  retornará o resultado na planilha, devidamente organizado em
                  colunas na aba "salascopia".
                </p>
                <ObsComponent/>
              </>
            }
          />
        </div>
        <Runner script="Main_copy_sala.py"></Runner>
      </div>
    </React.Fragment>
  );
}