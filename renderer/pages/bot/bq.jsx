import React from "react";
import Head from "next/head";
import Runner from "../../components/Runner/runner";
import Accordion from "../../components/Accordion/accordion";
import ObsComponent from "../../components/obsComponent/obsComponent"

export default function NextPage() {
  return (
    <React.Fragment>
      <Head>
        <title>BQ</title>
      </Head>
      <div>
        <h2>BQ</h2>
        <div className="card-tutorial">
          <Accordion
            pageProps={
              <>
                <p>
                  Para a utilização deste robô, é necessário apenas que, nas
                  variáveis de ambiente nas configurações, exista a variável
                  "ID_REPOSITORIO_BQ" com o ID da sala desejada. Além disso,
                  durante a execução do robô, ele solicitará quais Bancos de
                  Questões devem ser utilizados e se são do tipo "Junção". Após
                  essa etapa, ele seguirá com a criação conforme selecionado
                  previamente.
                </p>
                <ObsComponent/>
              </>
            }
          />
        </div>
        <Runner script="Main_BQ.py"></Runner>
      </div>
    </React.Fragment>
  );
}