import style from "./ObsComponent.module.css"

const ObsComponent = () => {
  return (
    <div className={style.obs}>
      obs:
      <p>
        Qualquer erro ou demora pode ser reportado por meio do botão de Feedback
        abaixo. Isso abrirá uma issue no GitHub do repositório, que será
        analisada e resolvida em breve. Recomenda-se que o feedback seja enviado
        logo após o problema ocorrer.
      </p>
      <p>
        Em caso de instabilidades na plataforma, pode ocorrer um erro de
        timeout. Nesse caso, basta executar o robô novamente, e ele continuará
        do ponto onde parou.
      </p>
    </div>
  );
};

export default ObsComponent;