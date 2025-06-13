import Head from "next/head";
import React from "react";
import Link from "next/link";

// import { useState} from "react";
// import Tooltip from "../components/tooltip/Tooltip";

export default function HomePage() {
  // const [showTooltip, setShowTooltip] = useState(false);
  return (
    <React.Fragment>
      <Head>
        <title>Home</title>
      </Head>
      <div className="title">
        <h2>BlackBot - Home</h2>
      </div>
      {/* <Link href="/update-download">update view</Link> */}
      <div className="card">
        <h3>Para começar a usar essa aplicação: </h3>
        <ul>
          <li>
            Adicione o seu login e senha do Ambiente Virtual de Aprendizagem
            (AVA) na aba de Configuração
          </li>
          <li>
            Crie o arquivo ".env" contendo as informações requeridas do arquivo
          </li>
          <li>Siga as instruções dos tutoriais para cada robô</li>
        </ul>
      </div>
      <div className="card">
        <h3>Para Utilizar a Planilha: </h3>
        <ul>
          <li>
            A planilha pode ser acessada atraves do botão "Planilha" no menu
            lateral
          </li>
          <li>Na planilha existem 3 abas (salas, salaCopia, atividades)</li>
          <br />
          <li>
            Na aba "salas" da planilha existem 2 colunas (ID, STATUS) :
            <ul>
              <li>
                a coluna "ID" deve ser preenchida com o ID das salas que os
                robôs atuem
              </li>
              <li>
                a coluna "STATUS" deve ser preenchida pelos robôs após a
                execução informando o resultado da execução
              </li>
            </ul>
          </li>
          <br />
          <li>
            Na aba "salaCopia" existem 3 colunas (ID_DESTINY, ID_ORIGIN, STATUS)
            :
            <ul>
              <li>
                a coluna "ID_DESTINY" deve ser preenchida com o ID destino da
                cópia (para onde vai ser efetuado a cópia)
              </li>
              <li>
                a coluna "ID_ORIGIN" deve ser preenchida com o ID origem da
                cópia (de onde vai ser efetuado a cópia)
              </li>
              <li>
                a coluna "STATUS" deve ser preenchida pelos robôs após a
                execução informando o resultado da execução
              </li>
              {/* <li>
                <button
                  onMouseEnter={() => setShowTooltip(true)}
                  onMouseLeave={() => setShowTooltip(false)}
                >
                  qweifuhqweoifghef
                <Tooltip text="I'm a tooltip!" visible={showTooltip} />
                </button>
              </li> */}
              {/* <li>
                <Link href='/update-download'>
                  teste update
                </Link>
              </li> */}
            </ul>
          </li>
        </ul>
      </div>
    </React.Fragment>
  );
}