import React from "react";
import Head from "next/head";
import Runner from "../../components/Runner/runner";

export default function NextPage() {
  return (
    <React.Fragment>
      <Head>
        <title>BQ</title>
      </Head>
      <div>
        <h2>BQ</h2>
        <div className="card-tutorial">
          <h3>Tutorial</h3>
          <p>
            Para a utilização deste robô, é necessário apenas que, nas variáveis
            de ambiente, exista a variável "ID_REPOSITORIO_BQ" com o ID da
            sala desejada. Além disso, durante a execução do robô, ele
            solicitará quais Bancos de Questões devem ser utilizados e se são do
            tipo "Junção". Após essa etapa, ele seguirá com a criação conforme
            selecionado previamente.
          </p>
          <p>
            Qualquer erro ou demora pode ser reportado por meio do Feedback
            abaixo. Isso abrirá uma issue no GitHub do repositório, que será
            tratada e resolvida em breve. Recomendo que o feedback seja enviado
            logo após o problema ocorrer.
          </p>
          <p>
            Em caso de instabilidades na plataforma, pode ocorrer um erro de
            timeout. Nesse caso, basta executar o robô novamente, e ele
            continuará do ponto onde parou.
          </p>
        </div>
        <Runner script="Main_BQ.py"></Runner>
      </div>
    </React.Fragment>
  );
}
