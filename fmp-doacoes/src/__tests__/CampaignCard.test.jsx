// ============================================================
// CampaignCard.test.jsx — Testes de Componente React
// Aula 05: React Testing Library + Vitest
// ============================================================
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import CampaignCard from '../components/CampaignCard/CampaignCard';

// Props base de uma campanha ativa
const campanhaAtivaMock = {
  id: 1,
  titulo: 'Campanha Alimentos 2026',
  descricao: 'Arrecadação de alimentos não perecíveis para famílias carentes da região.',
  categoria: 'Alimentos',
  status: 'ativa',
  urgente: false,
  dataLimite: '2026-12-31T00:00:00.000Z',
  meta: 100,
  arrecadado: 45,
  horasPorUnidade: 2,
  localEntrega: 'Bloco A — Sala da Coper',
};

// Helper: renderiza o card dentro de BrowserRouter (necessário para <Link>)
function renderCard(props = campanhaAtivaMock) {
  return render(
    <BrowserRouter>
      <CampaignCard {...props} />
    </BrowserRouter>
  );
}

// ── TESTE 3: Renderização básica do componente ─────────────────
describe('CampaignCard — Renderização', () => {
  it('deve renderizar o título da campanha', () => {
    renderCard();
    expect(screen.getByText('Campanha Alimentos 2026')).toBeInTheDocument();
  });

  it('deve renderizar a descrição corretamente', () => {
    renderCard();
    expect(
      screen.getByText(/arrecadação de alimentos/i)
    ).toBeInTheDocument();
  });

  it('deve exibir a categoria com ícone', () => {
    renderCard();
    // "Alimentos" aparece no badge, no título e na descrição — usamos getAllByText
    const elementos = screen.getAllByText(/Alimentos/i);
    expect(elementos.length).toBeGreaterThanOrEqual(1);
    // Verifica que o badge de categoria existe
    const badge = document.querySelector('[class*="categoryBadge"]');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveTextContent('Alimentos');
  });

  it('deve exibir o badge de status "Ativa"', () => {
    renderCard();
    expect(screen.getByText(/ativa/i)).toBeInTheDocument();
  });

  it('deve renderizar a barra de progresso com aria correto', () => {
    renderCard();
    const progressBar = screen.getByRole('progressbar');
    expect(progressBar).toBeInTheDocument();
    expect(progressBar).toHaveAttribute('aria-valuenow', '45');
    expect(progressBar).toHaveAttribute('aria-valuemax', '100');
  });

  it('deve exibir informação de horas por item', () => {
    renderCard();
    expect(screen.getByText('2h/item')).toBeInTheDocument();
  });

  it('deve exibir o local de entrega', () => {
    renderCard();
    expect(screen.getByText(/Bloco A/i)).toBeInTheDocument();
  });

  it('deve ter o data-testid correto', () => {
    renderCard();
    expect(screen.getByTestId('campaign-card')).toBeInTheDocument();
  });

  it('deve exibir o botão "Contribuir" para campanhas ativas', () => {
    renderCard();
    expect(screen.getByText(/Contribuir/i)).toBeInTheDocument();
  });
});

// ── TESTE 4: Campanha Encerrada e Badge Urgente ───────────────
describe('CampaignCard — Estados e Variações', () => {
  it('deve exibir badge "Encerrada" para campanha inativa', () => {
    renderCard({ ...campanhaAtivaMock, status: 'encerrada' });
    expect(screen.getByText(/encerrada/i)).toBeInTheDocument();
  });

  it('não deve exibir botão "Contribuir" para campanhas encerradas', () => {
    renderCard({ ...campanhaAtivaMock, status: 'encerrada' });
    expect(screen.queryByText(/Contribuir/i)).not.toBeInTheDocument();
  });

  it('deve exibir badge "Urgente" quando urgente=true e status=ativa', () => {
    renderCard({ ...campanhaAtivaMock, urgente: true });
    expect(screen.getByText(/urgente/i)).toBeInTheDocument();
  });

  it('não deve exibir badge "Urgente" quando urgente=false', () => {
    renderCard({ ...campanhaAtivaMock, urgente: false });
    expect(screen.queryByText(/urgente/i)).not.toBeInTheDocument();
  });

  it('não deve exibir badge "Urgente" em campanha encerrada mesmo com urgente=true', () => {
    renderCard({ ...campanhaAtivaMock, urgente: true, status: 'encerrada' });
    expect(screen.queryByText(/urgente/i)).not.toBeInTheDocument();
  });

  it('deve calcular e exibir 45% de progresso corretamente', () => {
    renderCard();
    const progressBar = screen.getByRole('progressbar');
    expect(progressBar).toHaveAttribute('aria-valuenow', '45');
  });

  it('deve renderizar com meta 100% atingida', () => {
    renderCard({ ...campanhaAtivaMock, arrecadado: 100, meta: 100 });
    const progressBar = screen.getByRole('progressbar');
    expect(progressBar).toHaveAttribute('aria-valuenow', '100');
  });

  it('deve ter atributo aria-label descrevendo a campanha', () => {
    renderCard();
    const article = screen.getByRole('article');
    expect(article).toHaveAttribute('aria-label', 'Campanha: Campanha Alimentos 2026');
  });
});
