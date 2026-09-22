// ============================================================
// page.js — Landing Page Institucional | FMP Doações
// Next.js 16 App Router · Tailwind CSS v4 · Server Component
// ============================================================

// ── Dados estáticos ──────────────────────────────────────────

/** Cards de métricas de impacto */
const METRICAS = [
  {
    valor: '2.400h',
    label: 'Horas de Ação Social Validadas',
    icon: '⭐',
    desc: 'Horas complementares creditadas via COPER',
  },
  {
    valor: '500+',
    label: 'Alunos Participantes',
    icon: '👥',
    desc: 'Estudantes engajados nas campanhas',
  },
  {
    valor: '12',
    label: 'Pontos de Coleta Ativos',
    icon: '📍',
    desc: 'Espalhados pelo campus FMP',
  },
  {
    valor: '1.200+',
    label: 'Doações Registradas',
    icon: '📦',
    desc: 'Itens entregues e validados pela equipe',
  },
];

/** Passos do fluxo de doação */
const COMO_FUNCIONA = [
  {
    passo: '01',
    titulo: 'Acesse com E-mail Institucional',
    desc: 'Entre com seu e-mail @aluno.fmpsc.edu.br para acessar o painel seguro do aluno.',
    icon: '🔐',
  },
  {
    passo: '02',
    titulo: 'Escolha uma Campanha',
    desc: 'Visualize campanhas ativas, itens prioritários e prazos de arrecadação.',
    icon: '📢',
  },
  {
    passo: '03',
    titulo: 'Registre sua Doação',
    desc: 'Preencha o formulário, localize o ponto de coleta via CEP e confirme a entrega.',
    icon: '📋',
  },
  {
    passo: '04',
    titulo: 'Receba Horas Complementares',
    desc: 'Após validação da COPER, as horas são creditadas e o certificado emitido automaticamente.',
    icon: '⭐',
  },
];

/** Campanhas em destaque para a landing page */
const CAMPANHAS_DESTAQUE = [
  {
    titulo: 'Campanha Alimentos 2026',
    desc: 'Arrecadação de alimentos não perecíveis para famílias em situação de vulnerabilidade na região.',
    meta: 200,
    arrecadado: 134,
    icon: '🍎',
    urgente: true,
    horasPorItem: '2h/item',
  },
  {
    titulo: 'Campanha Roupas de Inverno',
    desc: 'Coleta de agasalhos e roupas de frio para doação antes das temperaturas mais baixas.',
    meta: 150,
    arrecadado: 89,
    icon: '👕',
    urgente: false,
    horasPorItem: '1h/item',
  },
  {
    titulo: 'Campanha Material Escolar',
    desc: 'Kits de material escolar completos para crianças de escolas públicas do município.',
    meta: 100,
    arrecadado: 72,
    icon: '📚',
    urgente: false,
    horasPorItem: '1.5h/item',
  },
];

/** Diferenciais técnicos do sistema */
const DIFERENCIAIS = [
  { icon: '🔒', label: 'LGPD + Criptografia AES-256' },
  { icon: '📱', label: 'Design 100% Responsivo' },
  { icon: '⚡', label: 'Resposta em menos de 3s' },
  { icon: '📄', label: 'Certificado PDF com Token Único' },
  { icon: '🛡️', label: 'Modo Resiliente Offline' },
  { icon: '♿', label: 'Acessibilidade WCAG 2.1' },
];

/** Integrantes da equipe */
const EQUIPE = [
  { nome: 'Eduardo Silva',             papel: 'Desenvolvedor Full Stack' },
  { nome: 'Davi Aravechia',            papel: 'Desenvolvedor Full Stack' },
  { nome: 'Lucas Alexandre V. Schutz', papel: 'Desenvolvedor Full Stack' },
  { nome: 'Vitor Emanuel',             papel: 'Desenvolvedor Full Stack' },
];

// ── URL base do sistema React/Vite ───────────────────────────
const SISTEMA_URL = 'http://localhost:5173';

// ── Componente principal ─────────────────────────────────────
export default function PaginaInstitucional() {
  return (
    <div className="min-h-screen bg-white">

      {/* ════════════════════════════════════════════════════
          HEADER — Navegação Sticky
      ════════════════════════════════════════════════════ */}
      <header className="bg-fmp-900 text-white sticky top-0 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">

            {/* Logotipo */}
            <div className="flex items-center gap-3 flex-shrink-0">
              <div
                className="w-10 h-10 bg-fmp-700 rounded-xl flex items-center justify-center text-xl font-bold"
                aria-hidden="true"
              >
                🤝
              </div>
              <div>
                <p className="text-sm font-extrabold tracking-wide leading-none">COPER — FMP</p>
                <p className="text-xs text-fmp-400 hidden sm:block leading-none mt-0.5">
                  Sistema de Gestão de Doações
                </p>
              </div>
            </div>

            {/* Navegação desktop */}
            <nav
              className="hidden md:flex items-center gap-1"
              aria-label="Navegação principal"
            >
              {[
                { label: 'Sobre', href: '#sobre' },
                { label: 'Como Funciona', href: '#como-funciona' },
                { label: 'Campanhas', href: '#campanhas' },
                { label: 'Equipe', href: '#equipe' },
              ].map(({ label, href }) => (
                <a
                  key={href}
                  href={href}
                  className="px-4 py-2 rounded-lg text-sm font-medium text-blue-200 hover:text-white hover:bg-fmp-800 transition-all duration-200"
                >
                  {label}
                </a>
              ))}
            </nav>

            {/* CTA do header */}
            <a
              href={SISTEMA_URL}
              className="flex-shrink-0 bg-fmp-gold-400 hover:bg-fmp-gold-300 text-fmp-900 font-bold text-sm px-4 py-2 rounded-full transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5"
              id="header-btn-acessar"
            >
              Acessar Sistema →
            </a>
          </div>
        </div>
      </header>

      {/* ════════════════════════════════════════════════════
          HERO — Chamada principal
      ════════════════════════════════════════════════════ */}
      <section
        id="hero"
        className="relative bg-gradient-to-br from-fmp-900 via-fmp-800 to-fmp-600 text-white py-20 md:py-28 lg:py-36 overflow-hidden"
        aria-labelledby="hero-titulo"
      >
        {/* Elementos decorativos de fundo */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
          <div className="absolute -top-20 -right-20 w-96 h-96 bg-fmp-700 rounded-full opacity-20 blur-3xl" />
          <div className="absolute -bottom-10 -left-10 w-72 h-72 bg-sky-500 rounded-full opacity-15 blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-fmp-800 rounded-full opacity-10 blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Badge institucional */}
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white text-xs sm:text-sm font-semibold px-4 sm:px-5 py-2 rounded-full mb-8">
            🎓 Faculdade Municipal de Palhoça · Projeto Integrador II · 2026.1
          </div>

          {/* Título principal */}
          <h1
            id="hero-titulo"
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight tracking-tight mb-6"
          >
            Sistema de Gestão{' '}
            <br className="hidden sm:block" />
            de{' '}
            <span className="text-fmp-gold-400">Doações FMP</span>
          </h1>

          {/* Subtítulo */}
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-blue-100 max-w-3xl mx-auto mb-10 leading-relaxed">
            Doe alimentos, roupas ou material escolar às campanhas da COPER e veja
            suas boas ações se transformarem em{' '}
            <strong className="text-white">horas complementares</strong> — tudo
            digitalizado, transparente e auditável.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href={`${SISTEMA_URL}/campanhas`}
              className="w-full sm:w-auto bg-white text-fmp-900 font-bold px-8 py-4 rounded-full hover:bg-blue-50 transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-1 text-base"
              id="hero-btn-campanhas"
            >
              📢 Ver Campanhas Ativas
            </a>
            <a
              href={`${SISTEMA_URL}/doar`}
              className="w-full sm:w-auto bg-fmp-gold-400 text-fmp-900 font-bold px-8 py-4 rounded-full hover:bg-fmp-gold-300 transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-1 text-base"
              id="hero-btn-doar"
            >
              ❤️ Registrar Doação
            </a>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════
          MÉTRICAS — Cards de Impacto
      ════════════════════════════════════════════════════ */}
      <section
        id="main-content"
        className="py-12 md:py-16 bg-white border-b border-gray-100"
        aria-labelledby="metricas-titulo"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <span className="text-fmp-700 font-semibold text-xs uppercase tracking-widest">
              Impacto Real
            </span>
            <h2
              id="metricas-titulo"
              className="text-2xl sm:text-3xl font-extrabold text-gray-900 mt-2"
            >
              Números que{' '}
              <span className="text-fmp-700">transformam vidas</span>
            </h2>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {METRICAS.map(({ valor, label, icon, desc }) => (
              <div
                key={label}
                className="flex flex-col items-center text-center p-5 sm:p-6 rounded-2xl bg-gray-50 border border-gray-200 hover:border-fmp-400 hover:bg-fmp-50 hover:-translate-y-1 transition-all duration-300 group"
              >
                <span
                  className="text-3xl sm:text-4xl mb-3 group-hover:scale-110 transition-transform duration-300"
                  aria-hidden="true"
                >
                  {icon}
                </span>
                <span className="text-2xl sm:text-4xl font-extrabold text-fmp-800 leading-none">
                  {valor}
                </span>
                <span className="text-xs sm:text-sm font-semibold text-gray-700 mt-2 leading-tight">
                  {label}
                </span>
                <span className="text-xs text-gray-400 mt-1 hidden sm:block">{desc}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════
          SOBRE — O Projeto e a FMP
      ════════════════════════════════════════════════════ */}
      <section
        id="sobre"
        className="py-16 md:py-20 lg:py-24 bg-gray-50"
        aria-labelledby="sobre-titulo"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

            {/* Coluna de texto */}
            <div>
              <span className="text-fmp-700 font-semibold text-xs uppercase tracking-widest">
                Sobre o Projeto
              </span>
              <h2
                id="sobre-titulo"
                className="text-3xl sm:text-4xl font-extrabold text-gray-900 mt-3 mb-6 leading-tight"
              >
                Digitalizando a{' '}
                <span className="text-fmp-700">Solidariedade</span> na FMP
              </h2>
              <p className="text-gray-600 text-base sm:text-lg leading-relaxed mb-4">
                O <strong>Sistema de Gestão de Doações FMP</strong> digitaliza o ciclo
                completo das campanhas solidárias da Faculdade Municipal de Palhoça,
                do cadastro da doação até a emissão do certificado de horas complementares.
              </p>
              <p className="text-gray-500 leading-relaxed mb-8">
                As doações de <strong>mantimentos, roupas e material escolar</strong> são
                registradas pelos alunos, validadas pela COPER e convertidas em horas
                complementares de extensão — automaticamente. Cada ação social gera
                impacto real e reconhecimento acadêmico.
              </p>

              {/* Diferenciais */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {DIFERENCIAIS.map(({ icon, label }) => (
                  <div
                    key={label}
                    className="flex items-center gap-3 p-3 bg-white rounded-xl border border-gray-200 shadow-sm hover:border-fmp-300 transition-colors duration-200"
                  >
                    <span className="text-lg flex-shrink-0" aria-hidden="true">{icon}</span>
                    <span className="text-sm font-medium text-gray-700">{label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Cartão institucional */}
            <div className="bg-gradient-to-br from-fmp-900 to-fmp-600 rounded-3xl p-8 text-white shadow-2xl">
              <div className="text-5xl mb-6" aria-hidden="true">🏛️</div>
              <h3 className="text-xl sm:text-2xl font-extrabold mb-3">
                Faculdade Municipal de Palhoça
              </h3>
              <p className="text-blue-100 leading-relaxed mb-6 text-sm sm:text-base">
                A FMP oferece ensino superior de qualidade à comunidade de Palhoça/SC.
                O Sistema de Doações reforça o compromisso social da instituição,
                conectando extensão universitária com ação solidária.
              </p>

              <ul className="space-y-2">
                {[
                  '✅ Doações físicas totalmente digitalizadas',
                  '✅ Certificado PDF com token de autenticidade',
                  '✅ Cômputo automático de horas complementares',
                  '✅ Transparência e auditoria em tempo real',
                  '✅ Integração com sistema acadêmico da FMP',
                ].map((item) => (
                  <li key={item} className="text-sm text-blue-100 font-medium">{item}</li>
                ))}
              </ul>
            </div>

          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════
          COMO FUNCIONA — Processo em 4 Passos
      ════════════════════════════════════════════════════ */}
      <section
        id="como-funciona"
        className="py-16 md:py-20 lg:py-24 bg-white"
        aria-labelledby="como-titulo"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 md:mb-16">
            <span className="text-fmp-700 font-semibold text-xs uppercase tracking-widest">
              Processo Simples
            </span>
            <h2
              id="como-titulo"
              className="text-3xl sm:text-4xl font-extrabold text-gray-900 mt-3 mb-4"
            >
              Como <span className="text-fmp-700">Funciona</span>
            </h2>
            <p className="text-gray-500 text-base sm:text-lg max-w-2xl mx-auto">
              Em 4 passos você já contribui com as campanhas e acumula horas complementares
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {COMO_FUNCIONA.map(({ passo, titulo, desc, icon }, idx) => (
              <div
                key={passo}
                className="relative flex flex-col items-center text-center p-6 sm:p-8 bg-gray-50 rounded-2xl border border-gray-200 hover:border-fmp-300 hover:bg-fmp-50 hover:-translate-y-2 transition-all duration-300 group"
              >
                {/* Conector visual entre cards (somente desktop) */}
                {idx < COMO_FUNCIONA.length - 1 && (
                  <div
                    className="hidden lg:block absolute top-10 -right-3 w-6 h-0.5 bg-fmp-200 z-10"
                    aria-hidden="true"
                  />
                )}

                {/* Número do passo */}
                <span className="text-xs font-extrabold text-fmp-500 uppercase tracking-widest mb-3">
                  Passo {passo}
                </span>

                {/* Ícone */}
                <span
                  className="text-4xl sm:text-5xl mb-4 group-hover:scale-110 transition-transform duration-300"
                  aria-hidden="true"
                >
                  {icon}
                </span>

                <h3 className="text-sm sm:text-base font-bold text-gray-900 mb-3">{titulo}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════
          CAMPANHAS EM DESTAQUE
      ════════════════════════════════════════════════════ */}
      <section
        id="campanhas"
        className="py-16 md:py-20 lg:py-24 bg-gray-50"
        aria-labelledby="campanhas-titulo"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-fmp-700 font-semibold text-xs uppercase tracking-widest">
              Ativas Agora
            </span>
            <h2
              id="campanhas-titulo"
              className="text-3xl sm:text-4xl font-extrabold text-gray-900 mt-3 mb-4"
            >
              Campanhas em <span className="text-fmp-700">Destaque</span>
            </h2>
            <p className="text-gray-500 text-base sm:text-lg">
              Campanhas com maior necessidade de contribuições neste momento
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {CAMPANHAS_DESTAQUE.map(({ titulo, desc, meta, arrecadado, icon, urgente, horasPorItem }) => {
              const progresso = Math.min(Math.round((arrecadado / meta) * 100), 100);
              return (
                <article
                  key={titulo}
                  className="bg-white rounded-2xl border border-gray-200 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col"
                  aria-label={`Campanha: ${titulo}`}
                >
                  {/* Barra de identidade visual no topo */}
                  <div className="h-1.5 bg-gradient-to-r from-fmp-900 to-fmp-500" aria-hidden="true" />

                  <div className="p-6 flex flex-col flex-1">
                    {/* Cabeçalho do card */}
                    <div className="flex items-start justify-between mb-4">
                      <span className="text-3xl" aria-hidden="true">{icon}</span>
                      <div className="flex gap-2 flex-wrap justify-end">
                        {urgente && (
                          <span className="bg-red-50 text-red-600 text-xs font-bold px-2 py-1 rounded-full uppercase tracking-wide">
                            🔥 Urgente
                          </span>
                        )}
                        <span className="bg-green-50 text-green-700 text-xs font-bold px-2 py-1 rounded-full">
                          ● Ativa
                        </span>
                      </div>
                    </div>

                    <h3 className="text-base font-bold text-gray-900 mb-2">{titulo}</h3>
                    <p className="text-sm text-gray-500 leading-relaxed mb-4 flex-1">{desc}</p>

                    {/* Badge de horas */}
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-fmp-700 bg-fmp-50 px-3 py-1.5 rounded-full w-fit mb-4">
                      <span aria-hidden="true">⭐</span>
                      {horasPorItem} complementar
                    </div>

                    {/* Barra de progresso */}
                    <div className="space-y-1.5 mb-5">
                      <div className="flex justify-between text-xs text-gray-400">
                        <span>Meta atingida</span>
                        <span className="font-bold text-fmp-700">{progresso}%</span>
                      </div>
                      <div
                        className="w-full bg-gray-200 rounded-full h-2"
                        role="progressbar"
                        aria-valuenow={progresso}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-label={`${progresso}% da meta de ${titulo} atingida`}
                      >
                        <div
                          className="bg-gradient-to-r from-fmp-800 to-fmp-500 h-2 rounded-full transition-all duration-700"
                          style={{ width: `${progresso}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-xs text-gray-400">
                        <span>{arrecadado} itens coletados</span>
                        <span>Meta: {meta} itens</span>
                      </div>
                    </div>

                    {/* CTA do card */}
                    <a
                      href={`${SISTEMA_URL}/doar`}
                      className="w-full text-center bg-fmp-800 hover:bg-fmp-900 text-white font-semibold text-sm py-3 rounded-xl transition-all duration-200 hover:shadow-lg"
                    >
                      Contribuir →
                    </a>
                  </div>
                </article>
              );
            })}
          </div>

          {/* Link para todas as campanhas */}
          <div className="text-center mt-10">
            <a
              href={`${SISTEMA_URL}/campanhas`}
              className="inline-flex items-center gap-2 border-2 border-fmp-800 text-fmp-800 hover:bg-fmp-800 hover:text-white font-semibold px-8 py-3 rounded-full transition-all duration-200"
              id="btn-ver-todas-campanhas"
            >
              Ver todas as campanhas ativas →
            </a>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════
          EQUIPE — Desenvolvedores
      ════════════════════════════════════════════════════ */}
      <section
        id="equipe"
        className="py-16 md:py-20 lg:py-24 bg-white"
        aria-labelledby="equipe-titulo"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-fmp-700 font-semibold text-xs uppercase tracking-widest">
            Projeto Integrador II
          </span>
          <h2
            id="equipe-titulo"
            className="text-3xl sm:text-4xl font-extrabold text-gray-900 mt-3 mb-4"
          >
            Nossa <span className="text-fmp-700">Equipe</span>
          </h2>
          <p className="text-gray-500 text-base sm:text-lg mb-12 max-w-xl mx-auto">
            Desenvolvido por alunos de ADS sob orientação do Prof. Rafael Novo da Rosa · 2026.1
          </p>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {EQUIPE.map(({ nome, papel }) => {
              const iniciais = nome
                .split(' ')
                .filter((_, i) => i === 0 || i === nome.split(' ').length - 1)
                .map((n) => n[0])
                .join('');
              return (
                <div
                  key={nome}
                  className="flex flex-col items-center p-5 sm:p-6 bg-gray-50 rounded-2xl border border-gray-200 hover:border-fmp-300 hover:bg-fmp-50 transition-all duration-300 hover:-translate-y-1 group"
                >
                  {/* Avatar com iniciais */}
                  <div
                    className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-fmp-800 to-fmp-500 rounded-2xl flex items-center justify-center text-white font-extrabold text-lg sm:text-xl shadow-md mb-4 group-hover:scale-105 transition-transform duration-300"
                    aria-hidden="true"
                  >
                    {iniciais}
                  </div>
                  <h3 className="font-bold text-gray-900 text-xs sm:text-sm leading-tight">{nome}</h3>
                  <p className="text-xs text-gray-400 mt-1">{papel}</p>
                  <p className="text-xs text-fmp-600 mt-1 font-semibold">ADS — FMP</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════
          CTA FINAL — Chamada para ação
      ════════════════════════════════════════════════════ */}
      <section
        className="py-16 md:py-20 bg-gradient-to-br from-fmp-900 via-fmp-800 to-fmp-600 text-white"
        aria-label="Chamada para ação principal"
      >
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="text-5xl sm:text-6xl mb-6" aria-hidden="true">🤝</div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold mb-4">
            Pronto para fazer a diferença?
          </h2>
          <p className="text-blue-100 text-base sm:text-lg mb-10 leading-relaxed max-w-xl mx-auto">
            Acesse o sistema, escolha uma campanha e registre sua doação.
            Cada item conta — e você ainda acumula{' '}
            <strong className="text-white">horas complementares</strong>!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={SISTEMA_URL}
              className="bg-white text-fmp-900 font-extrabold px-8 py-4 rounded-full hover:bg-blue-50 transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-1 text-sm sm:text-base"
              id="cta-btn-sistema"
            >
              🚀 Acessar o Sistema
            </a>
            <a
              href={`${SISTEMA_URL}/campanhas`}
              className="bg-fmp-gold-400 text-fmp-900 font-extrabold px-8 py-4 rounded-full hover:bg-fmp-gold-300 transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-1 text-sm sm:text-base"
              id="cta-btn-campanhas"
            >
              📢 Ver Campanhas
            </a>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════
          FOOTER — Rodapé Institucional
      ════════════════════════════════════════════════════ */}
      <footer className="bg-fmp-900 text-white py-12" role="contentinfo">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">

            {/* Coluna 1 — Identidade */}
            <div className="sm:col-span-2 lg:col-span-1">
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-10 h-10 bg-fmp-700 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                  aria-hidden="true"
                >
                  🤝
                </div>
                <div>
                  <p className="font-extrabold text-sm leading-none">COPER — FMP</p>
                  <p className="text-xs text-fmp-400 mt-0.5">Sistema de Gestão de Doações</p>
                </div>
              </div>
              <p className="text-sm text-blue-300 leading-relaxed">
                Digitalizando o processo solidário da Faculdade Municipal de Palhoça.
              </p>
            </div>

            {/* Coluna 2 — Sistema */}
            <div>
              <h3 className="font-bold text-xs uppercase tracking-widest text-fmp-400 mb-4">
                Sistema
              </h3>
              <ul className="space-y-2 text-sm text-blue-300">
                <li>
                  <a href={SISTEMA_URL} className="hover:text-white transition-colors duration-200">
                    Dashboard
                  </a>
                </li>
                <li>
                  <a href={`${SISTEMA_URL}/campanhas`} className="hover:text-white transition-colors duration-200">
                    Campanhas Ativas
                  </a>
                </li>
                <li>
                  <a href={`${SISTEMA_URL}/doar`} className="hover:text-white transition-colors duration-200">
                    Registrar Doação
                  </a>
                </li>
              </ul>
            </div>

            {/* Coluna 3 — Institucional */}
            <div>
              <h3 className="font-bold text-xs uppercase tracking-widest text-fmp-400 mb-4">
                Institucional
              </h3>
              <ul className="space-y-2 text-sm text-blue-300">
                <li>
                  <a
                    href="https://www.fmpsc.edu.br"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors duration-200"
                  >
                    Portal FMP ↗
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.fmpsc.edu.br/coper"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors duration-200"
                  >
                    COPER FMP ↗
                  </a>
                </li>
                <li>
                  <a
                    href="mailto:coper@fmpsc.edu.br"
                    className="hover:text-white transition-colors duration-200"
                  >
                    coper@fmpsc.edu.br
                  </a>
                </li>
              </ul>
            </div>

            {/* Coluna 4 — Projeto */}
            <div>
              <h3 className="font-bold text-xs uppercase tracking-widest text-fmp-400 mb-4">
                Projeto
              </h3>
              <ul className="space-y-2 text-sm text-blue-300">
                <li>Projeto Integrador II</li>
                <li>ADS — FMP · 2026.1</li>
                <li className="pt-1">
                  <span className="text-xs text-blue-400">Orientador:</span>
                  <br />
                  Prof. Rafael Novo da Rosa
                </li>
              </ul>
            </div>

          </div>

          {/* Divisor e créditos */}
          <div className="border-t border-fmp-800 pt-6">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-blue-400">
              <p>
                © {new Date().getFullYear()} FMP — Faculdade Municipal de Palhoça.
                Sistema desenvolvido para fins acadêmicos.
              </p>
              <p>
                Eduardo Silva · Davi Aravechia · Lucas Schutz · Vitor Emanuel
              </p>
            </div>
          </div>

        </div>
      </footer>

    </div>
  );
}
