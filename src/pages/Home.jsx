const Home = () => {
  return (
    <section className="home">
      <h2>Home</h2>
      <p>
        Este é o ponto de partida para o seu painel. Em breve você poderá
        visualizar métricas, criar campanhas e acompanhar resultados em tempo
        real.
      </p>
      <div className="home__highlights">
        <div className="card">
          <h3>Planejamento</h3>
          <p>Defina objetivos, orçamento e calendário das campanhas.</p>
        </div>
        <div className="card">
          <h3>Monitoramento</h3>
          <p>Acompanhe desempenho com indicadores essenciais.</p>
        </div>
        <div className="card">
          <h3>Otimização</h3>
          <p>Priorize ações com base em dados e insights rápidos.</p>
        </div>
      </div>
    </section>
  );
};

export default Home;
