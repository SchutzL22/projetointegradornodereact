# Documentação Técnica — AV1
# Sistema de Gestão de Doações FMP

---

## CAPA / IDENTIFICAÇÃO

| | |
|---|---|
| **Instituição** | Faculdade Municipal de Palhoça — FMP |
| **Curso** | Análise e Desenvolvimento de Sistemas |
| **Disciplina** | Programação III (Full Stack) — Módulo 1 |
| **Semestre** | 2026/2 |
| **Professor** | Rafael Novo da Rosa |
| **Tema do Projeto** | Sistema de Gestão de Doações FMP |
| **Data de Entrega** | Conforme calendário acadêmico 2026 |

### Integrantes do Grupo

| Nome Completo | Função no Projeto |
|---|---|
| Eduardo Silva | Desenvolvedor Full Stack |
| Davi Aravechia | Desenvolvedor Full Stack |
| Lucas Alexandre Vieira Schutz | Desenvolvedor Full Stack |

---

## SUMÁRIO

1. Visão Geral da Aplicação
2. APIs Públicas Utilizadas
3. Evidências por Aula
   - Aula 02 — Git, SCSS, Box Model e Flexbox
   - Aula 03 — Responsividade e JavaScript Moderno
   - Aula 04 — React, Hooks e Rotas
   - Aula 05 — API, Next.js, Testes e Deploy
4. Links de Acesso Final

---

## 1. VISÃO GERAL DA APLICAÇÃO

### 1.1 Objetivo

O **Sistema de Gestão de Doações FMP** é uma aplicação web Full Stack desenvolvida no Projeto Integrador II do curso de Análise e Desenvolvimento de Sistemas da Faculdade Municipal de Palhoça (FMP). O sistema digitaliza o ciclo completo de campanhas solidárias geridas pela COPER — a Coordenadoria de Extensão da FMP.

O problema que o sistema resolve é a dependência de processos manuais em papel para registrar, validar e computar doações. Com a plataforma, alunos acessam campanhas ativas, registram doações de alimentos, roupas e material escolar, e recebem automaticamente as horas complementares de extensão após validação da COPER. Cada ação gera um certificado PDF com token único de autenticidade.

### 1.2 Tecnologias Utilizadas

| Camada | Tecnologia | Versão |
|---|---|---|
| Front-end SPA | React + Vite | React 19 / Vite 8 |
| Estilização | SCSS Modules | sass 1.104 |
| Roteamento | React Router DOM | 7.18 |
| Requisições HTTP | Axios | 1.20 |
| Testes | Vitest + React Testing Library | Vitest 5 |
| Página Institucional | Next.js + Tailwind CSS | Next 16 / Tailwind 4 |
| Back-end | Spring Boot + Java 21 | Spring Boot 3.x |
| Banco de Dados | H2 (dev) / PostgreSQL (prod) | — |

### 1.3 Estrutura do Repositório

```
Projeto integrador em node react/
├── fmp-doacoes/          ← Aplicação React/Vite (SPA principal)
│   ├── src/
│   │   ├── components/   ← Componentes reutilizáveis
│   │   ├── pages/        ← Páginas do React Router
│   │   ├── hooks/        ← Custom Hooks
│   │   ├── services/     ← Consumo de APIs (Axios)
│   │   ├── utils/        ← Funções auxiliares testáveis
│   │   ├── styles/       ← SCSS global (_variables, _mixins)
│   │   └── __tests__/    ← Suítes de testes automatizados
│   ├── vite.config.js
│   └── package.json
├── pagina-institucional/ ← Página Next.js + Tailwind CSS
│   ├── app/
│   │   ├── page.js       ← Landing page institucional
│   │   ├── layout.js     ← Layout raiz (metadados, fonte)
│   │   └── globals.css   ← Tailwind + variáveis FMP
│   └── package.json
└── backend/              ← API Spring Boot (Java 21)
    └── src/main/java/com/example/demo/
```

---

## 2. APIs PÚBLICAS UTILIZADAS

### 2.1 API ViaCEP — Consulta de Endereço por CEP

**URL base:** `https://viacep.com.br/ws/{cep}/json/`

**Método:** `GET` — sem autenticação necessária.

**Finalidade no sistema:** Ao preencher o formulário de doação, o aluno digita o CEP do ponto de coleta. O sistema consulta o ViaCEP automaticamente e preenche os campos de logradouro, bairro, cidade e estado — eliminando digitação manual e reduzindo erros.

**Exemplo de requisição:**

```
GET https://viacep.com.br/ws/88130000/json/
```

**Exemplo de resposta JSON (sucesso):**

```json
{
  "cep": "88130-000",
  "logradouro": "Rua João Pereira dos Santos",
  "complemento": "",
  "bairro": "Ponte do Imaruim",
  "localidade": "Palhoça",
  "uf": "SC",
  "ibge": "4211900",
  "gia": "",
  "ddd": "48",
  "siafi": "8247"
}
```

**Exemplo de resposta JSON (CEP não encontrado):**

```json
{
  "erro": "true"
}
```

**Tratamento de erros implementado:** O sistema verifica o campo `"erro": "true"` e lança exceção com mensagem amigável. Em caso de falha de rede (timeout ou offline), ativa automaticamente um fallback com dados mockados locais (`mockEnderecos.json`), garantindo que a demonstração funcione sem internet.

---

### 2.2 API de Campanhas — JSONPlaceholder (Simulação)

**URL base:** `https://jsonplaceholder.typicode.com`

**Endpoints utilizados:**

| Endpoint | Uso |
|---|---|
| `GET /posts?_limit=12` | Lista de campanhas (dados transformados) |
| `GET /users` | Estatísticas de alunos participantes |
| `GET /todos?_limit=20` | Cálculo de total de doações |

**Finalidade:** Por se tratar de um projeto acadêmico, os dados de campanhas são gerados transformando os posts do JSONPlaceholder com metadados institucionais (categoria, meta, horas por unidade, local de entrega).

**Exemplo de resposta transformada (campanha mapeada):**

```json
{
  "id": 1,
  "titulo": "Campanha Alimentos — 2026",
  "descricao": "Arrecadação de alimentos não perecíveis para famílias carentes da região...",
  "categoria": "Alimentos",
  "status": "ativa",
  "urgente": true,
  "dataLimite": "2026-11-30T00:00:00.000Z",
  "meta": 50,
  "arrecadado": 27,
  "horasPorUnidade": 2,
  "localEntrega": "Bloco A — Sala da COPER"
}
```

**Fallback resiliente:** Em ambiente offline ou com falha de rede, o sistema carrega automaticamente `mockCampanhas.json` — um arquivo local com dados reais das campanhas da FMP — garantindo disponibilidade total em apresentações.

---

## 3. EVIDÊNCIAS POR AULA

---

### AULA 02 — Git, SCSS, Box Model e Flexbox

#### 3.1 Estrutura de Arquivos SCSS

O projeto adota arquitetura SCSS com separação de responsabilidades:

```
src/styles/
├── _variables.scss   ← Paleta de cores, tipografia, espaçamentos, breakpoints
├── _mixins.scss      ← Mixins reutilizáveis (Flexbox, botões, cards, media queries)
├── _reset.scss       ← Reset CSS normalizado
└── main.scss         ← Arquivo raiz que importa os parciais
```

Cada componente possui seu próprio arquivo `.module.scss` com escopeamento automático pelo Vite:

```
src/components/
├── CampaignCard/CampaignCard.module.scss
├── DonationForm/DonationForm.module.scss
├── Header/Header.module.scss
└── ...
```

---

#### 3.2 Variáveis SCSS — `_variables.scss`

```scss
// ============================================================
// _variables.scss — Variáveis Institucionais FMP
// ============================================================

// --- Cores Institucionais FMP ---
$color-primary:        #003F7D;   // Azul FMP escuro
$color-primary-light:  #0066CC;   // Azul FMP médio
$color-primary-dark:   #002855;   // Azul FMP muito escuro
$color-secondary:      #1A8FE3;   // Azul claro / céu
$color-accent:         #F0A500;   // Amarelo/dourado destaque

// --- Gradientes ---
$gradient-primary:     linear-gradient(135deg, $color-primary-dark 0%, $color-primary-light 100%);
$gradient-hero:        linear-gradient(135deg, $color-primary-dark 0%, $color-secondary 100%);

// --- Tipografia ---
$font-family-base:     'Inter', 'Segoe UI', system-ui, -apple-system, sans-serif;
$font-size-sm:         0.875rem;  // 14px
$font-size-base:       1rem;      // 16px
$font-weight-bold:     700;
$font-weight-extrabold:800;

// --- Espaçamentos ---
$spacing-4:   1rem;      // 16px
$spacing-6:   1.5rem;    // 24px
$spacing-8:   2rem;      // 32px

// --- Breakpoints (Mobile-First) ---
$bp-sm:   480px;
$bp-md:   768px;
$bp-lg:   1024px;
$bp-xl:   1280px;

// --- Bordas e Sombras ---
$border-radius-xl:     1rem;
$border-radius-full:   9999px;
$shadow-md:    0 4px 6px rgba(0, 0, 0, 0.07), 0 2px 4px rgba(0, 0, 0, 0.06);
$shadow-hover: 0 8px 30px rgba($color-primary, 0.2);

// --- Transições ---
$transition-base:    all 0.25s ease;
$transition-spring:  all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);

// --- Layout ---
$container-max:    1200px;
$header-height:    70px;
```

---

#### 3.3 Mixins SCSS — `_mixins.scss`

Os mixins encapsulam padrões repetitivos de layout, garantindo consistência visual e eliminando duplicação de código:

```scss
// --- Mixin: Flexbox Centralizado ---
@mixin flex-center {
  display: flex;
  align-items: center;
  justify-content: center;
}

// --- Mixin: Flexbox com Gap configurável ---
@mixin flex-row($gap: $spacing-4, $wrap: nowrap) {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: $gap;
  flex-wrap: $wrap;
}

// --- Mixin: Flexbox Coluna ---
@mixin flex-col($gap: $spacing-4) {
  display: flex;
  flex-direction: column;
  gap: $gap;
}

// --- Mixin: Container Responsivo ---
@mixin container {
  width: 100%;
  max-width: $container-max;
  margin-inline: auto;
  padding-inline: $spacing-4;

  @include respond-to('md') {
    padding-inline: $spacing-6;
  }
  @include respond-to('lg') {
    padding-inline: $spacing-8;
  }
}

// --- Mixin: Botão estilizado com hover e active ---
@mixin btn-style($bg: $color-primary, $color: $color-white, $hover-bg: $color-primary-dark) {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: $spacing-2;
  padding: $spacing-3 $spacing-6;
  background-color: $bg;
  color: $color;
  border: none;
  border-radius: $border-radius-lg;
  font-size: $font-size-sm;
  font-weight: $font-weight-semibold;
  cursor: pointer;
  transition: $transition-base;

  &:hover {
    background-color: $hover-bg;
    transform: translateY(-1px);
    box-shadow: $shadow-lg;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
}

// --- Mixin: Card Base com hover ---
@mixin card-base {
  background: $color-white;
  border-radius: $border-radius-xl;
  border: 1px solid $color-gray-200;
  box-shadow: $shadow-md;
  transition: $transition-base;
  overflow: hidden;

  &:hover {
    box-shadow: $shadow-hover;
    transform: translateY(-4px);
    border-color: rgba($color-primary, 0.2);
  }
}
```

---

#### 3.4 Nesting SCSS e Uso de Mixins no CampaignCard

O arquivo `CampaignCard.module.scss` demonstra o aninhamento (nesting) e consumo dos mixins:

```scss
// CampaignCard.module.scss
.card {
  @include card-base;               // ← Mixin de card
  display: flex;
  flex-direction: column;
  position: relative;

  // Borda superior decorativa com gradiente
  &::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 4px;
    background: $gradient-primary;  // ← Variável de gradiente
    border-radius: $border-radius-xl $border-radius-xl 0 0;
    transition: $transition-base;
  }

  // Nesting: modifica o pseudo-elemento no hover do card
  &:hover::before {
    height: 6px;
  }

  // Variação para campanha inativa (BEM-like com nesting)
  &Inactive {
    opacity: 0.7;
    &::before { background: $color-gray-400; }
    &:hover   { transform: none; box-shadow: $shadow-md; }
  }
}

// Cabeçalho do card — aplica mixin de Flexbox
.cardHeader {
  @include flex-row($gap: $spacing-2, $wrap: wrap);
  justify-content: space-between;
  padding: $spacing-4 $spacing-5 $spacing-3;
  border-bottom: 1px solid $color-gray-100;
}

// Badge de status ativo
.badgeActive {
  @include badge($color-success-light, $color-success); // ← Mixin de badge
}

// Badge urgente com animação de pulso
.badgeUrgent {
  @include badge($color-danger-light, $color-danger);
  animation: pulse-badge 2s ease-in-out infinite;

  @keyframes pulse-badge {
    0%, 100% { opacity: 1; }
    50%       { opacity: 0.7; }
  }
}
```

---

#### 3.5 Layout Flexbox no Header

O `Header.module.scss` demonstra o uso de Flexbox para posicionamento responsivo:

```scss
// Header.module.scss
.header {
  position: fixed;
  top: 0; left: 0; right: 0;
  z-index: $z-fixed;
  height: $header-height;
  background: rgba($color-primary-dark, 0.98);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba($color-white, 0.08);

  // Aumenta altura no desktop
  @include respond-to('md') {
    height: $header-height-md;
  }
}

// Container aplica Flexbox via mixin para alinhar logo + nav + CTA
.container {
  @include container;
  height: 100%;
  @include flex-row($gap: 0);
  justify-content: space-between;  // ← Logo à esquerda, nav ao centro, CTA à direita
}
```

---

> 📌 **[INSERIR AQUI]** — Print do repositório GitHub público mostrando os commits e a estrutura de branches do projeto.

---

### AULA 03 — Responsividade e JavaScript Moderno

#### 3.6 Media Queries — Abordagem Mobile-First

O mixin `respond-to` do `_mixins.scss` centraliza todos os breakpoints e é consumido em todos os componentes e páginas:

```scss
// _mixins.scss — Mixin de Media Query Mobile-First
@mixin respond-to($breakpoint) {
  @if $breakpoint == 'sm' {
    @media (min-width: #{$bp-sm}) { @content; }  // ≥ 480px
  } @else if $breakpoint == 'md' {
    @media (min-width: #{$bp-md}) { @content; }  // ≥ 768px  (Tablet)
  } @else if $breakpoint == 'lg' {
    @media (min-width: #{$bp-lg}) { @content; }  // ≥ 1024px (Desktop)
  } @else if $breakpoint == 'xl' {
    @media (min-width: #{$bp-xl}) { @content; }  // ≥ 1280px (Wide)
  }
}
```

**Aplicação prática — Grid de campanhas responsivo (`Campanhas.module.scss`):**

```scss
// Grid adapta colunas conforme o tamanho da tela
.cardsGrid {
  display: grid;
  grid-template-columns: 1fr;             // Mobile: 1 coluna

  @include respond-to('md') {
    grid-template-columns: repeat(2, 1fr); // Tablet: 2 colunas
  }

  @include respond-to('lg') {
    grid-template-columns: repeat(3, 1fr); // Desktop: 3 colunas
  }
  
  gap: $spacing-6;
}
```

**Aplicação prática — Tipografia responsiva do título da página:**

```scss
.pageTitle {
  font-size: $font-size-2xl;          // Mobile:  30px
  font-weight: $font-weight-extrabold;
  color: $color-white;

  @include respond-to('md') {
    font-size: $font-size-3xl;        // Desktop: 36px
  }
}
```

**Aplicação prática — Filtros empilhados no mobile, lado a lado no tablet:**

```scss
.filtersBar {
  @include flex-col($gap: $spacing-4);  // Mobile: coluna (empilhado)

  @include respond-to('md') {
    flex-direction: row;                // Tablet+: linha (lado a lado)
    align-items: center;
    flex-wrap: wrap;
  }
}
```

**Aplicação prática — Menu mobile (drawer lateral) vs. menu desktop (horizontal):**

```scss
.nav {
  // Mobile: menu drawer lateral (fora da tela por padrão)
  position: fixed;
  right: -100%;
  width: min(320px, 85vw);
  height: 100vh;
  transition: right 0.35s cubic-bezier(0.4, 0, 0.2, 1);

  &.navOpen {
    right: 0;  // Desliza para dentro da tela quando aberto
  }

  // Tablet e acima: menu horizontal no header
  @include respond-to('md') {
    position: static;
    width: auto;
    height: auto;
    flex-direction: row;
    transition: none;
  }
}
```

---

#### 3.7 JavaScript Moderno — `.map()`, `.filter()` e `useState`

**Uso de `.filter()` para filtragem reativa de campanhas (`Campanhas.jsx`):**

```jsx
// helpers.js — Função pura testável
export function filtrarCampanhas(campanhas, status = 'all', categoria = 'all') {
  return campanhas.filter((c) => {
    const statusOk    = status    === 'all' || c.status    === status;
    const categoriaOk = categoria === 'all' || c.categoria === categoria;
    return statusOk && categoriaOk;
  });
}

// Campanhas.jsx — Busca textual com .filter() + useMemo
const campanhasFiltradas = useMemo(() => {
  let resultado = filtrarCampanhas(campanhas, filtroStatus, filtroCategoria);

  if (busca.trim()) {
    const termo = busca.toLowerCase().trim();
    resultado = resultado.filter(
      (c) =>
        c.titulo.toLowerCase().includes(termo)    ||
        c.descricao.toLowerCase().includes(termo) ||
        c.categoria.toLowerCase().includes(termo)
    );
  }

  return resultado;
}, [campanhas, filtroStatus, filtroCategoria, busca]);
```

**Uso de `.map()` para renderizar lista de campanhas:**

```jsx
// Campanhas.jsx — Renderização com .map() e key única
<div className={styles.cardsGrid} role="list">
  {campanhasFiltradas.map((campanha) => (
    <div key={campanha.id} role="listitem">
      <CampaignCard {...campanha} />
    </div>
  ))}
</div>
```

**Uso de `useState` para gerenciamento de filtros:**

```jsx
// Campanhas.jsx — Múltiplos estados de controle de UI
const [filtroStatus,    setFiltroStatus]    = useState('all');
const [filtroCategoria, setFiltroCategoria] = useState('all');
const [busca,           setBusca]           = useState('');

const handleLimparFiltros = () => {
  setFiltroStatus('all');
  setFiltroCategoria('all');
  setBusca('');
};
```

---

> 📌 **[INSERIR AQUI]** — Prints do Chrome DevTools mostrando a responsividade nos três breakpoints:
> - **Mobile** (375px — iPhone SE)
> - **Tablet** (768px — iPad)
> - **Desktop** (1280px)

---

### AULA 04 — React, Hooks e Rotas

#### 3.8 Estrutura de Pastas do Projeto (Vite)

```
fmp-doacoes/
├── public/
│   └── vite.svg
├── src/
│   ├── __tests__/            ← Suítes de testes automatizados
│   │   ├── setup.js
│   │   ├── helpers.test.js
│   │   ├── CampaignCard.test.jsx
│   │   ├── DonationForm.test.jsx
│   │   └── hooks.test.jsx
│   ├── assets/
│   │   └── hero.png
│   ├── components/           ← Componentes reutilizáveis
│   │   ├── CampaignCard/
│   │   │   ├── CampaignCard.jsx
│   │   │   └── CampaignCard.module.scss
│   │   ├── DonationForm/
│   │   │   ├── DonationForm.jsx
│   │   │   └── DonationForm.module.scss
│   │   ├── Header/
│   │   │   ├── Header.jsx
│   │   │   └── Header.module.scss
│   │   ├── Footer/
│   │   │   ├── Footer.jsx
│   │   │   └── Footer.module.scss
│   │   ├── HoursBadge/
│   │   │   ├── HoursBadge.jsx
│   │   │   └── HoursBadge.module.scss
│   │   └── Toast/
│   │       ├── ToastContext.jsx
│   │       └── Toast.module.scss
│   ├── data/
│   │   ├── mockCampanhas.json
│   │   ├── mockEnderecos.json
│   │   └── mockStats.json
│   ├── hooks/                ← Custom Hooks
│   │   ├── useCampaigns.js
│   │   ├── useViaCep.js
│   │   └── useToast.js
│   ├── pages/                ← Páginas (React Router)
│   │   ├── Home/
│   │   ├── Campanhas/
│   │   └── Doar/
│   ├── services/
│   │   └── api.js            ← Axios + fallback resiliente
│   ├── styles/
│   │   ├── _variables.scss
│   │   ├── _mixins.scss
│   │   ├── _reset.scss
│   │   └── main.scss
│   ├── utils/
│   │   └── helpers.js        ← Funções puras e testáveis
│   ├── App.jsx               ← Roteamento principal
│   └── main.jsx              ← Ponto de entrada
├── vite.config.js
└── package.json
```

---

#### 3.9 Componentes Reutilizáveis

| Componente | Arquivo | Responsabilidade |
|---|---|---|
| `Header` | `components/Header/Header.jsx` | Navegação principal, menu hamburger mobile, NavLink ativo |
| `CampaignCard` | `components/CampaignCard/CampaignCard.jsx` | Exibe dados de uma campanha (título, progresso, badges, CTA) |
| `DonationForm` | `components/DonationForm/DonationForm.jsx` | Formulário completo de doação com integração ViaCEP |
| `HoursBadge` | `components/HoursBadge/HoursBadge.jsx` | Badge de horas complementares estimadas |
| `Footer` | `components/Footer/Footer.jsx` | Rodapé institucional com links |
| `ToastContext` | `components/Toast/ToastContext.jsx` | Contexto global para notificações toast |

---

#### 3.10 Roteamento com React Router DOM

**Configuração das rotas em `App.jsx`:**

```jsx
// App.jsx — Roteamento com React Router DOM v7
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastProvider } from './components/Toast/ToastContext';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import Home      from './pages/Home/Home';
import Campanhas from './pages/Campanhas/Campanhas';
import Doar      from './pages/Doar/Doar';

export default function App() {
  return (
    <ToastProvider>
      <BrowserRouter>
        <div className="page-wrapper">
          <Header />
          <main id="main-content">
            <Routes>
              <Route path="/"          element={<Home />} />
              <Route path="/campanhas" element={<Campanhas />} />
              <Route path="/doar"      element={<Doar />} />
              <Route path="*"          element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </ToastProvider>
  );
}
```

---

#### 3.11 `useState` e `useEffect` — Componente Header

```jsx
// Header.jsx — useState para menu mobile e scroll detection
import { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);  // ← Controla menu hambúrguer
  const [scrolled, setScrolled] = useState(false);  // ← Detecta scroll para estilo
  const location = useLocation();

  // Fecha o menu automaticamente ao navegar para outra rota
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  // Altera aparência do header ao rolar a página
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll); // Limpeza
  }, []);

  return (
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ''}`}>
      <div className={styles.container}>
        {/* Logo com Link do React Router */}
        <Link to="/" className={styles.logo}>
          <div className={styles.logoIcon}>🤝</div>
          <div className={styles.logoText}>
            <span className={styles.logoName}>COPER</span>
            <span className={styles.logoSub}>FMP Doações</span>
          </div>
        </Link>

        {/* NavLink com detecção de rota ativa */}
        <nav className={`${styles.nav} ${menuOpen ? styles.navOpen : ''}`}>
          {[
            { to: '/',          label: 'Dashboard',        icon: '🏠' },
            { to: '/campanhas', label: 'Campanhas',        icon: '📢' },
            { to: '/doar',      label: 'Registrar Doação', icon: '🤝' },
          ].map(({ to, label, icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `${styles.navLink} ${isActive ? styles.active : ''}`
              }
            >
              <span aria-hidden="true">{icon}</span>
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Botão hambúrguer (mobile) com controle de acessibilidade */}
        <button
          className={styles.hamburger}
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-expanded={menuOpen}
          aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
        >
          <span className={styles.bar} />
          <span className={styles.bar} />
          <span className={styles.bar} />
        </button>
      </div>
    </header>
  );
}
```

---

#### 3.12 Navegação com `state` entre Rotas

O componente `CampaignCard` passa dados da campanha selecionada para o formulário de doação via `state` do React Router:

```jsx
// CampaignCard.jsx — Link com state para pré-selecionar campanha
import { Link } from 'react-router-dom';

{isAtiva && (
  <Link
    to="/doar"
    state={{ campanhaId: id, campanhaTitulo: titulo }}
    className={styles.btnDoar}
  >
    Contribuir →
  </Link>
)}

// DonationForm.jsx — Lê o state da rota anterior
import { useLocation } from 'react-router-dom';

const location = useLocation();

const [form, setForm] = useState(() => {
  const preselected = location.state?.campanhaId
    ? { campanhaId: String(location.state.campanhaId) }
    : {};
  return { ...INITIAL_STATE, ...preselected };
});
```

---

> 📌 **[INSERIR AQUI]** — Print da aplicação rodando no navegador mostrando:
> - Página `/campanhas` com os cards
> - Clique no botão "Contribuir" navegando para `/doar` com a campanha pré-selecionada

---

### AULA 05 — Consumo de API, Next.js, Testes e Deploy

#### 3.13 Consumo Assíncrono com Axios — `api.js`

```javascript
// services/api.js — Instâncias Axios e função de busca com fallback

import axios from 'axios';
import mockCampanhas from '../data/mockCampanhas.json';

// Instância para campanhas (JSONPlaceholder)
export const apiMock = axios.create({
  baseURL: 'https://jsonplaceholder.typicode.com',
  timeout: 6000,
  headers: { 'Content-Type': 'application/json' },
});

// Instância para ViaCEP
export const apiCep = axios.create({
  baseURL: 'https://viacep.com.br/ws',
  timeout: 6000,
});

// Busca campanhas com fallback automático para dados locais
export async function getCampaigns() {
  try {
    const { data } = await apiMock.get('/posts?_limit=12');

    const mapped = data.map((post, index) => ({
      id:             post.id,
      titulo:         `Campanha ${CATEGORIAS[index % 5]} — ${new Date().getFullYear()}`,
      descricao:      post.body.replace(/\n/g, ' ').slice(0, 120) + '...',
      categoria:      CATEGORIAS[index % 5],
      status:         STATUS_LIST[index % 5],
      urgente:        URGENCIA_LIST[index % 5],
      dataLimite:     new Date(Date.now() + ((index % 3) + 1) * 30 * 24 * 60 * 60 * 1000).toISOString(),
      meta:           (index + 1) * 50,
      arrecadado:     Math.floor((index + 1) * 50 * (0.4 + (index % 5) * 0.1)),
      horasPorUnidade:[1, 2, 0.5, 1.5, 3][index % 5],
      localEntrega:   ['Bloco A — COPER', 'Biblioteca Central FMP'][index % 2],
    }));

    return { campanhas: mapped, isFallback: false };

  } catch (error) {
    // Em caso de falha de rede, retorna dados locais
    console.warn('[API] Ativando fallback:', error.message);
    return { campanhas: mockCampanhas, isFallback: true };
  }
}

// Busca endereço pelo CEP com tratamento completo de erros
export async function getEnderecoPorCep(cep) {
  const cepLimpo = String(cep).replace(/\D/g, '');

  if (cepLimpo.length !== 8) {
    throw new Error('CEP deve conter exatamente 8 dígitos.');
  }

  try {
    const { data } = await apiCep.get(`/${cepLimpo}/json/`);

    if (data.erro) {
      throw new Error('CEP não encontrado');
    }

    return {
      cep:          data.cep,
      logradouro:   data.logradouro || '',
      bairro:       data.bairro     || '',
      cidade:       data.localidade || '',
      estado:       data.uf         || '',
      isFallback:   false,
    };
  } catch (error) {
    if (error.message.includes('CEP não encontrado')) throw error;
    // Fallback para erros de rede
    return { /* ...dados mockados locais... */ isFallback: true };
  }
}
```

---

#### 3.14 Custom Hook `useCampaigns` — `useEffect` + `useState`

```javascript
// hooks/useCampaigns.js
import { useState, useEffect, useCallback } from 'react';
import { getCampaigns } from '../services/api';

export function useCampaigns() {
  const [campanhas,  setCampanhas]  = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState('');
  const [isFallback, setIsFallback] = useState(false);

  useEffect(() => {
    let cancel = false;

    async function initialFetch() {
      setLoading(true);
      try {
        const { campanhas: data, isFallback: fallback } = await getCampaigns();
        if (!cancel) {
          setCampanhas(data || []);
          setIsFallback(Boolean(fallback));
        }
      } catch (err) {
        if (!cancel) setError(err.message);
      } finally {
        if (!cancel) setLoading(false);
      }
    }

    initialFetch();
    return () => { cancel = true; }; // Cleanup: evita atualizar componente desmontado
  }, []);

  return { campanhas, loading, error, isFallback };
}
```

---

#### 3.15 Custom Hook `useViaCep` — Máscara e Preenchimento Automático

```javascript
// hooks/useViaCep.js
import { useState, useCallback, useRef } from 'react';
import { getEnderecoPorCep } from '../services/api';

export function formatarMascaraCep(value) {
  const digits = String(value || '').replace(/\D/g, '').slice(0, 8);
  return digits.length > 5
    ? `${digits.slice(0, 5)}-${digits.slice(5)}`
    : digits;
}

export function useViaCep(initialCep = '', onAddressFound = null) {
  const [cep,     setCep]     = useState(() => formatarMascaraCep(initialCep));
  const [address, setAddress] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');
  const activeRequestRef      = useRef(0); // Evita race conditions

  const buscarCep = useCallback(async (cepInput) => {
    const rawDigits = String(cepInput).replace(/\D/g, '');
    if (rawDigits.length !== 8) return;

    const requestId = ++activeRequestRef.current;
    setLoading(true);
    setError('');

    try {
      const resultado = await getEnderecoPorCep(rawDigits);
      if (requestId !== activeRequestRef.current) return; // Descarta chamadas antigas

      setAddress(resultado);
      if (onAddressFound) onAddressFound(resultado);
    } catch (err) {
      if (requestId !== activeRequestRef.current) return;
      setAddress(null);
      setError(err.message || 'Erro ao consultar o CEP.');
    } finally {
      if (requestId === activeRequestRef.current) setLoading(false);
    }
  }, [onAddressFound]);

  // Handler do input: aplica máscara e dispara busca ao completar 8 dígitos
  const handleCepChange = useCallback((e) => {
    const digits = String(e?.target?.value || '').replace(/\D/g, '').slice(0, 8);
    setCep(formatarMascaraCep(digits));
    setError('');

    if (digits.length === 8) buscarCep(digits);
    else setAddress(null);
  }, [buscarCep]);

  return { address, endereco: address, loading, error, cep, handleCepChange, buscarCep };
}
```

---

#### 3.16 Página Institucional — Next.js com Tailwind CSS

A pasta `pagina-institucional/` contém uma landing page independente criada com Next.js 16 e Tailwind CSS v4.

**Estrutura do App Router:**

```
pagina-institucional/
├── app/
│   ├── layout.js     ← Layout raiz (metadados, fonte Inter)
│   ├── page.js       ← Landing page completa (Server Component)
│   └── globals.css   ← @theme com paleta FMP + Tailwind v4
├── next.config.ts
├── postcss.config.mjs
└── tsconfig.json
```

**Configuração de cores FMP no `globals.css` (Tailwind CSS v4):**

```css
/* globals.css — Tokens de cor FMP via @theme do Tailwind v4 */
@import "tailwindcss";

@theme {
  --color-fmp-900: #002855;
  --color-fmp-800: #003f7d;
  --color-fmp-700: #005aaa;
  --color-fmp-600: #0073cc;
  --color-fmp-500: #1a8fe0;
  --color-fmp-400: #42a9f0;
  --color-fmp-100: #dff0ff;
  --color-fmp-50:  #f0f8ff;

  --color-fmp-gold-400: #fbbf24;
  --color-fmp-gold-300: #fcd34d;

  --font-sans: var(--font-inter), ui-sans-serif, system-ui, sans-serif;
}
```

**Exemplo de seção Hero com responsividade Tailwind:**

```jsx
// app/page.js — Hero Section com breakpoints sm: md: lg:
<section
  id="hero"
  className="relative bg-gradient-to-br from-fmp-900 via-fmp-800 to-fmp-600
             text-white py-20 md:py-28 lg:py-36 overflow-hidden"
  aria-labelledby="hero-titulo"
>
  <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">

    <h1
      id="hero-titulo"
      className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl
                 font-extrabold leading-tight tracking-tight mb-6"
    >
      Sistema de Gestão de{' '}
      <span className="text-fmp-gold-400">Doações FMP</span>
    </h1>

    <p className="text-base sm:text-lg md:text-xl lg:text-2xl
                  text-blue-100 max-w-3xl mx-auto mb-10 leading-relaxed">
      Doe alimentos, roupas ou material escolar e veja suas boas ações se
      transformarem em <strong className="text-white">horas complementares</strong>.
    </p>

    <div className="flex flex-col sm:flex-row gap-4 justify-center">
      <a href="http://localhost:5173/campanhas"
         className="w-full sm:w-auto bg-white text-fmp-900 font-bold
                    px-8 py-4 rounded-full hover:bg-blue-50
                    transition-all duration-200 shadow-lg hover:-translate-y-1">
        📢 Ver Campanhas Ativas
      </a>
      <a href="http://localhost:5173/doar"
         className="w-full sm:w-auto bg-fmp-gold-400 text-fmp-900 font-bold
                    px-8 py-4 rounded-full hover:bg-fmp-gold-300
                    transition-all duration-200 shadow-lg hover:-translate-y-1">
        ❤️ Registrar Doação
      </a>
    </div>
  </div>
</section>
```

**Seções presentes na landing page:**

| Seção | Conteúdo |
|---|---|
| Header | Logo, navegação âncora, CTA "Acessar Sistema" |
| Hero | Título, subtítulo e dois CTAs principais |
| Métricas | 4 cards: 2.400h validadas, 500+ alunos, 12 pontos de coleta, 1.200+ doações |
| Sobre | Explicação do sistema, diferenciais técnicos, cartão institucional FMP |
| Como Funciona | Fluxo em 4 passos com ícones e conectores visuais |
| Campanhas em Destaque | 3 cards com barra de progresso e badge de horas |
| Equipe | 4 cards com avatares gerados por iniciais |
| CTA Final | Botões para acessar o sistema e ver campanhas |
| Footer | Logo, links do sistema, portal FMP, dados do projeto |

---

#### 3.17 Testes Automatizados — Vitest + React Testing Library

**Configuração em `vite.config.js`:**

```javascript
// vite.config.js — Bloco de configuração Vitest
test: {
  globals: true,                              // describe/it/expect sem import
  environment: 'jsdom',                       // Simula o DOM do navegador
  setupFiles: './src/__tests__/setup.js',     // Importa @testing-library/jest-dom
  css: true,                                  // Processa SCSS nos testes
  coverage: {
    provider: 'v8',
    reporter: ['text', 'html'],
  },
},
```

**`setup.js` — Configuração global:**

```javascript
// src/__tests__/setup.js
import '@testing-library/jest-dom';
// Habilita matchers como: toBeInTheDocument(), toHaveValue(), toHaveAttribute()
```

---

**Suíte 1 — `helpers.test.js` — Testes Unitários (20 testes)**

```javascript
// helpers.test.js — Testes das funções utilitárias puras
import { describe, it, expect } from 'vitest';
import { validarEmailInstitucional, calcularHorasDoacao, filtrarCampanhas } from '../utils/helpers';

describe('validarEmailInstitucional', () => {
  it('deve aceitar e-mail institucional válido @aluno.fmpsc.edu.br', () => {
    expect(validarEmailInstitucional('joao.silva@aluno.fmpsc.edu.br')).toBe(true);
  });

  it('deve rejeitar e-mail de domínio externo', () => {
    expect(validarEmailInstitucional('joao@gmail.com')).toBe(false);
    expect(validarEmailInstitucional('joao@fmpsc.edu.br')).toBe(false); // sem "aluno."
  });

  it('deve rejeitar entradas nulas e vazias', () => {
    expect(validarEmailInstitucional('')).toBe(false);
    expect(validarEmailInstitucional(null)).toBe(false);
    expect(validarEmailInstitucional(undefined)).toBe(false);
  });

  it('deve ser case-insensitive', () => {
    expect(validarEmailInstitucional('JOAO@ALUNO.FMPSC.EDU.BR')).toBe(true);
  });
});

describe('calcularHorasDoacao', () => {
  it('deve calcular corretamente', () => {
    expect(calcularHorasDoacao(5, 2)).toBe(10);    // 5 itens × 2h = 10h
    expect(calcularHorasDoacao(3, 1.5)).toBe(4.5); // 3 × 1.5h = 4.5h
  });

  it('deve respeitar o limite máximo padrão de 10h', () => {
    expect(calcularHorasDoacao(100, 2)).toBe(10);  // 200h → limitado a 10h
  });

  it('deve retornar 0 para entradas inválidas', () => {
    expect(calcularHorasDoacao(0, 2)).toBe(0);
    expect(calcularHorasDoacao('abc', 2)).toBe(0);
    expect(calcularHorasDoacao(null, 2)).toBe(0);
  });
});

describe('filtrarCampanhas', () => {
  const mock = [
    { id: 1, titulo: 'C1', descricao: '', status: 'ativa',     categoria: 'Alimentos' },
    { id: 2, titulo: 'C2', descricao: '', status: 'encerrada', categoria: 'Roupas'    },
  ];

  it('deve retornar todas com status "all"', () => {
    expect(filtrarCampanhas(mock, 'all', 'all')).toHaveLength(2);
  });

  it('deve filtrar por status ativa', () => {
    expect(filtrarCampanhas(mock, 'ativa', 'all')).toHaveLength(1);
  });

  it('deve combinar filtro de status e categoria', () => {
    expect(filtrarCampanhas(mock, 'ativa', 'Alimentos')).toHaveLength(1);
    expect(filtrarCampanhas(mock, 'encerrada', 'Alimentos')).toHaveLength(0);
  });
});
```

---

**Suíte 2 — `CampaignCard.test.jsx` — Testes de Componente (17 testes)**

```jsx
// CampaignCard.test.jsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import CampaignCard from '../components/CampaignCard/CampaignCard';

const campanhaAtivaMock = {
  id: 1,
  titulo: 'Campanha Alimentos 2026',
  descricao: 'Arrecadação de alimentos não perecíveis para famílias carentes.',
  categoria: 'Alimentos',
  status: 'ativa',
  urgente: false,
  dataLimite: '2026-12-31T00:00:00.000Z',
  meta: 100,
  arrecadado: 45,
  horasPorUnidade: 2,
  localEntrega: 'Bloco A — Sala da Coper',
};

function renderCard(props = campanhaAtivaMock) {
  return render(
    <BrowserRouter><CampaignCard {...props} /></BrowserRouter>
  );
}

describe('CampaignCard — Renderização', () => {
  it('deve renderizar o título da campanha', () => {
    renderCard();
    expect(screen.getByText('Campanha Alimentos 2026')).toBeInTheDocument();
  });

  it('deve renderizar a barra de progresso com atributos aria corretos', () => {
    renderCard();
    const bar = screen.getByRole('progressbar');
    expect(bar).toHaveAttribute('aria-valuenow', '45');
    expect(bar).toHaveAttribute('aria-valuemax', '100');
  });

  it('deve exibir badge "Urgente" quando urgente=true e status=ativa', () => {
    renderCard({ ...campanhaAtivaMock, urgente: true });
    expect(screen.getByText(/urgente/i)).toBeInTheDocument();
  });

  it('não deve exibir botão "Contribuir" para campanhas encerradas', () => {
    renderCard({ ...campanhaAtivaMock, status: 'encerrada' });
    expect(screen.queryByText(/Contribuir/i)).not.toBeInTheDocument();
  });
});
```

---

**Suíte 3 — `DonationForm.test.jsx` — Teste de Integração Async (4 testes)**

```jsx
// DonationForm.test.jsx
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import DonationForm from '../components/DonationForm/DonationForm';
import { ToastProvider } from '../components/Toast/ToastContext';
import * as api from '../services/api';

function renderDonationForm() {
  return render(
    <ToastProvider><BrowserRouter><DonationForm /></BrowserRouter></ToastProvider>
  );
}

describe('DonationForm — Preenchimento Automático via ViaCEP', () => {
  beforeEach(() => vi.clearAllMocks());

  it('deve aplicar a máscara 00000-000 ao digitar o CEP', () => {
    renderDonationForm();
    const cepInput = screen.getByLabelText(/cep do ponto de coleta/i);
    fireEvent.change(cepInput, { target: { value: '88130000' } });
    expect(cepInput.value).toBe('88130-000');
  });

  it('deve preencher logradouro e bairro automaticamente após CEP válido', async () => {
    // Mock da API: substitui a chamada real ao ViaCEP
    vi.spyOn(api, 'getEnderecoPorCep').mockResolvedValueOnce({
      cep: '88130-000',
      logradouro: 'Rua João Pereira dos Santos',
      bairro: 'Ponte do Imaruim',
      cidade: 'Palhoça',
      estado: 'SC',
      isFallback: false,
    });

    renderDonationForm();
    fireEvent.change(screen.getByLabelText(/cep do ponto de coleta/i), {
      target: { value: '88130000' },
    });

    // Aguarda a resolução da Promise mockada
    await waitFor(() => {
      expect(screen.getByLabelText(/logradouro/i)).toHaveValue('Rua João Pereira dos Santos');
    });

    expect(screen.getByLabelText(/bairro/i)).toHaveValue('Ponte do Imaruim');
    expect(api.getEnderecoPorCep).toHaveBeenCalledWith('88130000');
  });

  it('deve exibir mensagem de erro acessível para CEP inválido', async () => {
    vi.spyOn(api, 'getEnderecoPorCep').mockRejectedValueOnce(
      new Error('CEP não encontrado no ViaCEP. Verifique o número informado.')
    );

    renderDonationForm();
    fireEvent.change(screen.getByLabelText(/cep do ponto de coleta/i), {
      target: { value: '99999999' },
    });

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(/cep não encontrado/i);
    });
  });
});
```

---

**Suíte 4 — `hooks.test.jsx` — Testes de Custom Hooks (5 testes)**

```jsx
// hooks.test.jsx
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useViaCep, formatarMascaraCep } from '../hooks/useViaCep';
import { useCampaigns } from '../hooks/useCampaigns';
import * as api from '../services/api';

describe('Custom Hook — useViaCep', () => {
  it('formatarMascaraCep deve formatar 8 dígitos com hífen', () => {
    expect(formatarMascaraCep('88130000')).toBe('88130-000');
    expect(formatarMascaraCep('88.130-000')).toBe('88130-000'); // Remove pontuação
    expect(formatarMascaraCep('')).toBe('');
  });

  it('deve inicializar com valores padrão corretos', () => {
    const { result } = renderHook(() => useViaCep());
    expect(result.current.cep).toBe('');
    expect(result.current.endereco).toBeNull();
    expect(result.current.loading).toBe(false);
  });

  it('deve buscar e preencher endereço ao chamar handleCepChange com 8 dígitos', async () => {
    vi.spyOn(api, 'getEnderecoPorCep').mockResolvedValueOnce({
      cep: '88130-000',
      logradouro: 'Rua Central FMP',
      bairro: 'Centro',
      cidade: 'Palhoça',
      estado: 'SC',
      isFallback: false,
    });

    const { result } = renderHook(() => useViaCep());

    act(() => { result.current.handleCepChange({ target: { value: '88130000' } }); });
    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.endereco?.logradouro).toBe('Rua Central FMP');
    });
  });
});

describe('Custom Hook — useCampaigns', () => {
  it('deve carregar campanhas na montagem do componente', async () => {
    vi.spyOn(api, 'getCampaigns').mockResolvedValueOnce({
      campanhas: [{ id: 1, titulo: 'Campanha A', categoria: 'Alimentos', status: 'ativa' }],
      isFallback: false,
    });

    const { result } = renderHook(() => useCampaigns());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.campanhas).toHaveLength(1);
      expect(result.current.campanhas[0].titulo).toBe('Campanha A');
    });
  });
});
```

---

**Resultado da execução de todos os testes:**

```
 RUN  v5.0.1

 ✓ src/__tests__/helpers.test.js       (20 testes)   9ms
 ✓ src/__tests__/hooks.test.jsx         (5 testes) 261ms
 ✓ src/__tests__/CampaignCard.test.jsx (17 testes) 341ms
 ✓ src/__tests__/DonationForm.test.jsx  (4 testes) 314ms

 Test Files  4 passed (4)
      Tests  46 passed (46)
   Start at  21:23:45
   Duration  3.73s
```

---

## 4. LINKS DE ACESSO FINAL

| Recurso | Link |
|---|---|
| 🐙 Repositório GitHub (público) | `https://github.com/SchutzL22/projetointegradornodereact.git` |
| 🚀 Deploy — Aplicação React (Vite) | `[https://fmp-doacoes.vercel.app](https://vercel.com/schutzls-projects/pagina-institucional/Giz2TDm9Z83JBuv9sG3jVMXAVnFz)` |
| 🌐 Deploy — Página Institucional (Next.js) | `[https://fmp-institucional.vercel.app](https://pagina-institucional-psi.vercel.app/)` |
| 🏛️ Portal Institucional FMP | `https://www.fmpsc.edu.br` |

> **Nota:** Substituir os placeholders acima pelos links reais após realização do deploy no GitHub e Vercel.

---

## CONSIDERAÇÕES FINAIS

O **Sistema de Gestão de Doações FMP** demonstra na prática os conhecimentos acumulados ao longo das cinco aulas do Módulo 1 de Programação III:

- **Aula 02:** A arquitetura SCSS com variáveis, mixins e nesting garante manutenibilidade e consistência visual em todo o sistema
- **Aula 03:** A abordagem Mobile-First com o mixin `respond-to` e JavaScript moderno com `.map()`, `.filter()` e desestruturação tornam o código conciso e legível
- **Aula 04:** A componentização React com hooks (`useState`, `useEffect`, custom hooks) e o roteamento com React Router DOM criam uma SPA fluida e bem organizada
- **Aula 05:** O consumo resiliente de APIs com Axios, a landing page Next.js com Tailwind CSS e os 46 testes automatizados demonstram maturidade técnica e preocupação com qualidade de software

O sistema atinge todos os requisitos propostos: digitalização das doações, cômputo automático de horas complementares, interface acessível e responsiva, e uma suíte de testes que garante a confiabilidade das funcionalidades críticas.

---

*Documentação gerada para AV1 — Programação III (Full Stack) | FMP · 2026/2*
*Eduardo Silva · Davi Aravechia · Lucas Alexandre V. Schutz
