import { useEffect, useMemo, useState } from 'react';

const emptyForm = {
  name: '',
  specialty: '',
  instagram: '',
  gmn: '',
  ads: '',
};

const socialChecklist = [
  'Bio clara e com autoridade',
  'Destaques Estratégicos',
  'Identidade Visual Premium',
  'Frequência de Stories/Feed',
];

const gmnChecklist = [
  'Avaliações (+4.5 estrelas)',
  'Fotos da Clínica e Médico',
  'Horários e Contatos corretos',
  'Postagens recentes no Perfil',
];

const adsChecklist = [
  'Anúncios de Fundo de Funil',
  'Landing Page Mobile First',
  'Píxeis/Tags de Conversão',
  'Negativação de Palavras',
];

const sectionConfig = {
  dashboard: {
    title: 'Dashboard',
    desc: 'Performance estratégica da rede.',
  },
  clients: {
    title: 'Gestão de Clientes',
    desc: 'Cadastre e edite sua base de médicos.',
  },
  strategy: {
    title: 'Planejamento LL Cultural',
    desc: 'Diagnóstico + Proposta vendedora.',
  },
  audits: {
    title: 'Auditoria 360',
    desc: 'Análise técnica de ativos digitais.',
  },
};

const Home = () => {
  const [section, setSection] = useState('dashboard');
  const [clients, setClients] = useState([]);
  const [activeClientId, setActiveClientId] = useState(null);
  const [formData, setFormData] = useState(emptyForm);
  const [editId, setEditId] = useState(null);
  const [briefing, setBriefing] = useState('');
  const [briefingTicket, setBriefingTicket] = useState('');
  const [briefingDesejo, setBriefingDesejo] = useState('');
  const [llOutput, setLlOutput] = useState(
    'O diagnóstico final e a proposta comercial personalizada aparecerão aqui após o processamento.'
  );
  const [auditResult, setAuditResult] = useState(
    'Preencha os checklists acima e peça à IA para analisar os canais digitais do cliente.'
  );
  const [dashboardInsights, setDashboardInsights] = useState([
    'Cadastre um cliente e selecione-o para ver insights automáticos.',
  ]);

  useEffect(() => {
    const storedClients = JSON.parse(localStorage.getItem('grow_clients') || '[]');
    setClients(storedClients);
  }, []);

  useEffect(() => {
    localStorage.setItem('grow_clients', JSON.stringify(clients));
  }, [clients]);

  const activeClient = useMemo(
    () => clients.find((client) => client.id === activeClientId),
    [clients, activeClientId]
  );

  const clientsWithStrategy = useMemo(
    () => clients.filter((client) => client.strategy).length,
    [clients]
  );

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const clearClientForm = () => {
    setFormData(emptyForm);
    setEditId(null);
  };

  const saveClient = () => {
    if (!formData.name.trim()) {
      alert('Nome é obrigatório');
      return;
    }

    if (editId) {
      setClients((prev) =>
        prev.map((client) =>
          client.id === editId
            ? {
                ...client,
                name: formData.name,
                specialty: formData.specialty,
                links: {
                  instagram: formData.instagram,
                  gmn: formData.gmn,
                  ads: formData.ads,
                },
              }
            : client
        )
      );
    } else {
      const newClient = {
        id: Date.now(),
        name: formData.name,
        specialty: formData.specialty,
        links: {
          instagram: formData.instagram,
          gmn: formData.gmn,
          ads: formData.ads,
        },
        strategy: null,
        audits: [],
      };
      setClients((prev) => [...prev, newClient]);
    }

    clearClientForm();
  };

  const editClient = (id) => {
    const client = clients.find((item) => item.id === id);
    if (!client) return;
    setEditId(client.id);
    setFormData({
      name: client.name,
      specialty: client.specialty,
      instagram: client.links?.instagram || '',
      gmn: client.links?.gmn || '',
      ads: client.links?.ads || '',
    });
  };

  const deleteClient = (id) => {
    if (!confirm('Deseja realmente excluir este cliente?')) return;
    setClients((prev) => prev.filter((client) => client.id !== id));
    if (activeClientId === id) {
      setActiveClientId(null);
      setDashboardInsights([
        'Cadastre um cliente e selecione-o para ver insights automáticos.',
      ]);
    }
  };

  const setActiveClient = (id) => {
    setActiveClientId(id);
    const client = clients.find((item) => item.id === id);
    if (client) {
      generateDashboardInsights(client);
    }
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchGemini = async (prompt, system) => {
    const apiKey = '';
    const payload = {
      contents: [{ parts: [{ text: prompt }] }],
      systemInstruction: { parts: [{ text: system }] },
    };

    for (let i = 0; i < 3; i += 1) {
      try {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          }
        );
        const data = await response.json();
        return data.candidates?.[0]?.content?.parts?.[0]?.text;
      } catch (error) {
        await new Promise((resolve) => setTimeout(resolve, 500));
      }
    }

    return 'Erro ao processar inteligência.';
  };

  const generateLLStrategy = async () => {
    if (!activeClient) return;

    if (!briefing.trim()) {
      alert('Preencha o briefing para a IA analisar.');
      return;
    }

    setLlOutput('Executando Método LL Cultural...');

    const systemPrompt = `Você é o GPT OFICIAL DE DIAGNÓSTICO da LL Cultural. Sua função é criar a VERSÃO FINAL, completa, elegante e altamente vendedora de um Diagnóstico Estratégico + Proposta Comercial.
USE O MÉTODO 4M, SPIN, BOA e FOCO EM VENDER O PLANO COMPLETO LL CULTURAL (R$ 2.997/mês).
SIGA EXATAMENTE AS 16 SEÇÕES DO DIAGNÓSTICO E A ESTRUTURA DA PROPOSTA.`;

    const prompt = `CLIENTE: ${activeClient.name} (${activeClient.specialty}). BRIEFING: ${briefing}. TICKET: ${briefingTicket}. DESEJO: ${briefingDesejo}. LINKS: Insta(${activeClient.links.instagram}), GMN(${activeClient.links.gmn}), Ads(${activeClient.links.ads}).`;

    const result = await fetchGemini(prompt, systemPrompt);
    setLlOutput(result || 'Erro ao processar inteligência.');
    setClients((prev) =>
      prev.map((client) =>
        client.id === activeClient.id ? { ...client, strategy: result } : client
      )
    );
  };

  const generateAuditAI = async () => {
    if (!activeClient) return;

    setAuditResult('Cruzando dados dos links com o checklist técnico...');

    const system =
      'Você é um auditor técnico de marketing médico. Sua missão é analisar os canais do cliente e apontar onde ele está perdendo dinheiro e autoridade.';
    const prompt = `Analise os canais do cliente ${activeClient.name} (${activeClient.specialty}): Instagram: ${activeClient.links.instagram}, GMN: ${activeClient.links.gmn}, Ads: ${activeClient.links.ads}. Forneça um diagnóstico rápido (3 parágrafos) focando em: 1. Atratividade Visual, 2. Conversão Técnica, 3. Presença Local.`;

    const result = await fetchGemini(prompt, system);
    setAuditResult(result || 'Erro ao processar inteligência.');
  };

  const generateDashboardInsights = async (client) => {
    if (!client) return;

    setDashboardInsights(['Atualizando insights...']);
    const prompt = `Gere 3 insights rápidos para o dashboard de ${client.name}.`;
    const result = await fetchGemini(prompt, 'Estrategista Grow.');
    if (!result) {
      setDashboardInsights(['Erro ao processar inteligência.']);
      return;
    }

    const lines = result
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.length > 3);
    setDashboardInsights(lines.length ? lines : [result]);
  };

  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="sidebar__brand">
          <div className="sidebar__icon">
            <i className="fas fa-stethoscope" aria-hidden="true"></i>
          </div>
          <div>
            <span className="sidebar__title">GROW HUB</span>
            <span className="sidebar__subtitle">LL Cultural Method</span>
          </div>
        </div>
        <nav className="sidebar__nav">
          {Object.keys(sectionConfig).map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => setSection(key)}
              className={`sidebar__link ${section === key ? 'is-active' : ''}`}
            >
              <i
                className={`fas ${
                  key === 'dashboard'
                    ? 'fa-chart-line'
                    : key === 'clients'
                      ? 'fa-users'
                      : key === 'strategy'
                        ? 'fa-chess-knight'
                        : 'fa-clipboard-check'
                }`}
                aria-hidden="true"
              ></i>
              {sectionConfig[key].title}
            </button>
          ))}
        </nav>
        <div className="sidebar__footer">Vigência 2026 • IA Ativa</div>
      </aside>

      <main className="main">
        <header className="main__header">
          <div>
            <h1>{sectionConfig[section].title}</h1>
            <p>{sectionConfig[section].desc}</p>
          </div>
          <div
            className={`client-badge ${activeClient ? 'client-badge--visible' : ''}`}
          >
            <i className="fas fa-user-circle" aria-hidden="true"></i>
            Cliente: <span>{activeClient?.name || 'Nenhum'}</span>
          </div>
        </header>

        {section === 'dashboard' && (
          <section className="section">
            <div className="stats-grid">
              <div className="stat-card stat-card--blue">
                <h3>Total de Clientes</h3>
                <p>{clients.length}</p>
              </div>
              <div className="stat-card stat-card--green">
                <h3>Diagnósticos Concluídos</h3>
                <p>{clientsWithStrategy}</p>
              </div>
              <div className="stat-card stat-card--indigo">
                <h3>CPL Médio Rede</h3>
                <p>R$ 14,50</p>
              </div>
            </div>
            <div className="panel">
              <div className="panel__header">
                <h3>Feed de Inteligência</h3>
              </div>
              <div className="insights">
                {dashboardInsights.map((insight) => (
                  <div key={insight} className="insight">
                    <i className="fas fa-lightbulb" aria-hidden="true"></i>
                    <span>{insight}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {section === 'clients' && (
          <section className="section">
            <div className="clients-grid">
              <div className="panel panel--sticky">
                <div className="panel__header">
                  <h3>{editId ? 'Editar Cliente' : 'Novo Cliente'}</h3>
                </div>
                <div className="form">
                  <input
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Nome do Médico/Clínica"
                  />
                  <input
                    name="specialty"
                    value={formData.specialty}
                    onChange={handleInputChange}
                    placeholder="Especialidade (ex: Dermatologia)"
                  />
                  <div className="form__divider">
                    <h4>Links de Auditoria</h4>
                  </div>
                  <label className="form__icon">
                    <i className="fab fa-instagram" aria-hidden="true"></i>
                    <input
                      name="instagram"
                      value={formData.instagram}
                      onChange={handleInputChange}
                      placeholder="Link Instagram"
                    />
                  </label>
                  <label className="form__icon">
                    <i className="fas fa-map-marker-alt" aria-hidden="true"></i>
                    <input
                      name="gmn"
                      value={formData.gmn}
                      onChange={handleInputChange}
                      placeholder="Link Google Meu Negócio"
                    />
                  </label>
                  <label className="form__icon">
                    <i className="fab fa-google" aria-hidden="true"></i>
                    <input
                      name="ads"
                      value={formData.ads}
                      onChange={handleInputChange}
                      placeholder="Link/ID Google Ads"
                    />
                  </label>
                  <div className="form__actions">
                    <button className="btn btn--primary" type="button" onClick={saveClient}>
                      {editId ? 'Salvar Alterações' : 'Salvar Cliente'}
                    </button>
                    {editId && (
                      <button
                        className="btn btn--ghost"
                        type="button"
                        onClick={clearClientForm}
                      >
                        Cancelar
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div className="panel panel--list">
                <div className="panel__header">
                  <h3>Clientes Cadastrados</h3>
                </div>
                <div className="clients-list">
                  {clients.length === 0 && (
                    <p className="empty-state">
                      Ainda não há clientes cadastrados.
                    </p>
                  )}
                  {clients.map((client) => (
                    <div
                      key={client.id}
                      className={`client-card ${
                        client.id === activeClientId ? 'client-card--active' : ''
                      }`}
                    >
                      <div className="client-card__info">
                        <div className="client-card__avatar">
                          {client.name.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <h4>
                            {client.name}{' '}
                            {client.id === activeClientId ? '✨' : ''}
                          </h4>
                          <p>{client.specialty || 'Especialidade não informada'}</p>
                        </div>
                      </div>
                      <div className="client-card__actions">
                        <button
                          className={`btn btn--small ${
                            client.id === activeClientId
                              ? 'btn--success'
                              : 'btn--primary'
                          }`}
                          type="button"
                          onClick={() => setActiveClient(client.id)}
                        >
                          {client.id === activeClientId ? 'Ativo' : 'Selecionar'}
                        </button>
                        <button
                          className="btn btn--small btn--ghost"
                          type="button"
                          onClick={() => editClient(client.id)}
                        >
                          <i className="fas fa-edit" aria-hidden="true"></i>
                        </button>
                        <button
                          className="btn btn--small btn--danger"
                          type="button"
                          onClick={() => deleteClient(client.id)}
                        >
                          <i className="fas fa-trash" aria-hidden="true"></i>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {section === 'strategy' && (
          <section className="section">
            {!activeClient && (
              <div className="warning">
                <i className="fas fa-exclamation-triangle" aria-hidden="true"></i>
                <div>
                  <p>Nenhum cliente selecionado!</p>
                  <span>
                    Vá em "Gestão de Clientes" e selecione um médico para iniciar
                    o planejamento.
                  </span>
                </div>
              </div>
            )}
            {activeClient && (
              <div className="strategy-grid">
                <div className="panel">
                  <div className="panel__header panel__header--between">
                    <h3>Briefing do Diagnóstico</h3>
                    <span className="badge">Método LL Cultural</span>
                  </div>
                  <div className="form">
                    <label className="form__label">
                      Mente & Marca (Diagnóstico Inicial)
                    </label>
                    <textarea
                      value={briefing}
                      onChange={(event) => setBriefing(event.target.value)}
                      placeholder="Descreva o estado atual: confusões do cliente, o que ele vende hoje, qual a percepção atual do mercado, maiores dificuldades em converter..."
                    ></textarea>
                    <div className="form__grid">
                      <div>
                        <label className="form__label">Ticket Médio</label>
                        <input
                          value={briefingTicket}
                          onChange={(event) => setBriefingTicket(event.target.value)}
                          placeholder="R$ 500,00"
                        />
                      </div>
                      <div>
                        <label className="form__label">Desejo de Venda</label>
                        <input
                          value={briefingDesejo}
                          onChange={(event) => setBriefingDesejo(event.target.value)}
                          placeholder="Cirurgia X, Procedimento Y"
                        />
                      </div>
                    </div>
                    <button className="btn btn--primary btn--block" type="button" onClick={generateLLStrategy}>
                      <i className="fas fa-wand-magic-sparkles" aria-hidden="true"></i>
                      Gerar Diagnóstico + Proposta ✨
                    </button>
                  </div>
                </div>

                <div className="panel panel--dark">
                  <div className="panel__header panel__header--between">
                    <div className="window-dots">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                    <button
                      type="button"
                      className="btn btn--ghost btn--tiny"
                      onClick={() => copyToClipboard(llOutput)}
                    >
                      <i className="fas fa-copy" aria-hidden="true"></i>
                      Copiar Tudo
                    </button>
                  </div>
                  <div className="panel__content panel__content--scroll">
                    {llOutput.split('\n').map((line, index) => (
                      <p key={`${line}-${index}`}>{line}</p>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </section>
        )}

        {section === 'audits' && (
          <section className="section">
            {!activeClient && (
              <div className="warning">
                <i className="fas fa-exclamation-triangle" aria-hidden="true"></i>
                <div>
                  <p>Nenhum cliente selecionado!</p>
                  <span>Selecione um cliente para auditar seus canais digitais.</span>
                </div>
              </div>
            )}
            {activeClient && (
              <div className="audit-grid">
                <div className="audit-card audit-card--pink">
                  <h3>
                    <i className="fab fa-instagram" aria-hidden="true"></i> Social Media
                  </h3>
                  <div className="checklist">
                    {socialChecklist.map((item) => (
                      <label key={item} className="checklist__item">
                        <input type="checkbox" />
                        <span>{item}</span>
                      </label>
                    ))}
                  </div>
                  <div className="audit-link">
                    {activeClient.links.instagram || 'Sem link cadastrado'}
                  </div>
                </div>

                <div className="audit-card audit-card--green">
                  <h3>
                    <i className="fas fa-map-marker-alt" aria-hidden="true"></i> Local
                    SEO (GMN)
                  </h3>
                  <div className="checklist">
                    {gmnChecklist.map((item) => (
                      <label key={item} className="checklist__item">
                        <input type="checkbox" />
                        <span>{item}</span>
                      </label>
                    ))}
                  </div>
                  <div className="audit-link">
                    {activeClient.links.gmn || 'Sem link cadastrado'}
                  </div>
                </div>

                <div className="audit-card audit-card--blue">
                  <h3>
                    <i className="fab fa-google" aria-hidden="true"></i> Tráfego Pago
                  </h3>
                  <div className="checklist">
                    {adsChecklist.map((item) => (
                      <label key={item} className="checklist__item">
                        <input type="checkbox" />
                        <span>{item}</span>
                      </label>
                    ))}
                  </div>
                  <div className="audit-link">
                    {activeClient.links.ads || 'Sem link cadastrado'}
                  </div>
                </div>

                <div className="panel audit-result">
                  <div className="panel__header panel__header--between">
                    <h3>Análise Crítica da Auditoria</h3>
                    <button className="btn btn--primary" type="button" onClick={generateAuditAI}>
                      <i className="fas fa-robot" aria-hidden="true"></i>
                      IA: Analisar Canais ✨
                    </button>
                  </div>
                  <div className="panel__content">
                    {auditResult.split('\n').map((line, index) => (
                      <p key={`${line}-${index}`}>{line}</p>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </section>
        )}
      </main>
    </div>
  );
};

export default Home;
