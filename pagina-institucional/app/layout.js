// ============================================================
// layout.js — Layout Raiz | Next.js App Router
// Next.js 16 · Tailwind CSS v4 · Google Fonts (Inter)
// ============================================================
import { Inter } from 'next/font/google';
import './globals.css';

// Carregamento otimizado da fonte Inter via next/font
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
  weight: ['400', '500', '600', '700', '800', '900'],
});

// Metadata estática — SEO + Open Graph
export const metadata = {
  title: {
    default: 'FMP — Sistema de Gestão de Doações',
    template: '%s | FMP Doações',
  },
  description:
    'Conheça o Sistema de Gestão de Doações da Faculdade Municipal de Palhoça (FMP). ' +
    'Conectamos alunos solidários a campanhas da COPER e convertemos doações em horas complementares.',
  keywords: [
    'FMP', 'Palhoça', 'doações', 'horas complementares',
    'COPER', 'solidariedade', 'Projeto Integrador',
  ],
  authors: [{ name: 'Equipe Projeto Integrador II — FMP 2026.1' }],
  metadataBase: new URL('https://fmp-doacoes.vercel.app'),
  openGraph: {
    title: 'FMP — Sistema de Gestão de Doações',
    description: 'Doe, conecte e transforme vidas na FMP. Registre doações e acumule horas complementares.',
    locale: 'pt_BR',
    type: 'website',
    siteName: 'FMP Doações',
  },
  robots: {
    index: true,
    follow: true,
  },
};

/**
 * Layout raiz da aplicação.
 * Envolve todas as páginas com <html>, <body> e fonte Inter.
 * @param {{ children: React.ReactNode }} props
 */
export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR" className={inter.variable}>
      <body className="font-sans antialiased bg-white text-slate-900 selection:bg-fmp-100 selection:text-fmp-900">
        {/* Skip link para acessibilidade (leitores de tela / teclado) */}
        <a href="#main-content" className="skip-link">
          Pular para o conteúdo principal
        </a>

        {children}
      </body>
    </html>
  );
}
