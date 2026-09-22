// ============================================================
// api.js — Serviços de API (Axios) com Fallback Mock Resiliente
// Aula 05: Consumo de APIs públicas + Resiliência para Apresentação
// ============================================================
import axios from 'axios';
import mockCampanhas from '../data/mockCampanhas.json';
import mockEnderecos from '../data/mockEnderecos.json';
import mockStats from '../data/mockStats.json';

// --- Instância base — JSONPlaceholder (simulando campanhas) ---
export const apiMock = axios.create({
  baseURL: 'https://jsonplaceholder.typicode.com',
  timeout: 6000,
  headers: { 'Content-Type': 'application/json' },
});

// --- Instância ViaCEP ---
export const apiCep = axios.create({
  baseURL: 'https://viacep.com.br/ws',
  timeout: 6000,
});

const CATEGORIAS = ['Alimentos', 'Roupas', 'Higiene', 'Material Escolar', 'Brinquedos'];
const STATUS_LIST = ['ativa', 'ativa', 'ativa', 'encerrada', 'ativa'];
const URGENCIA_LIST = [true, false, true, false, false];

/**
 * Busca lista de campanhas.
 * Tenta consumir da API externa (JSONPlaceholder); em caso de falha de rede/offline,
 * ativa automaticamente o fallback local com os dados mockados da FMP.
 * @returns {Promise<{ data: Array, isFallback: boolean }>}
 */
export async function getCampaigns() {
  try {
    const { data } = await apiMock.get('/posts?_limit=12');

    const mapped = data.map((post, index) => ({
      id: post.id,
      titulo: `Campanha ${CATEGORIAS[index % CATEGORIAS.length]} — ${new Date().getFullYear()}`,
      descricao: post.body.replace(/\n/g, ' ').slice(0, 120) + '...',
      categoria: CATEGORIAS[index % CATEGORIAS.length],
      status: STATUS_LIST[index % STATUS_LIST.length],
      urgente: URGENCIA_LIST[index % URGENCIA_LIST.length],
      dataLimite: new Date(
        Date.now() + ((index % 3) + 1) * 30 * 24 * 60 * 60 * 1000
      ).toISOString(),
      meta: (index + 1) * 50,
      arrecadado: Math.floor((index + 1) * 50 * (0.4 + (index % 5) * 0.1)),
      horasPorUnidade: [1, 2, 0.5, 1.5, 3][index % 5],
      localEntrega: [
        'Bloco A — Sala da COPER',
        'Biblioteca Central FMP',
        'Secretaria Acadêmica FMP',
        'Portaria Principal FMP',
      ][index % 4],
    }));

    return { campanhas: mapped, isFallback: false };
  } catch (error) {
    console.warn('[API FMP] Falha ao conectar à API externa. Ativando fallback mock local:', error.message);
    return { campanhas: mockCampanhas, isFallback: true };
  }
}

/**
 * Busca endereço completo pelo CEP via ViaCEP com resiliência e fallback mock.
 * @param {string} cep — CEP (pode conter pontuação ou só dígitos)
 * @returns {Promise<{ cep: string, logradouro: string, complemento: string, bairro: string, cidade: string, estado: string, ibge?: string, enderecoCompleto: string, isFallback?: boolean }>}
 */
export async function getEnderecoPorCep(cep) {
  const cepLimpo = String(cep || '').replace(/\D/g, '');

  if (cepLimpo.length !== 8) {
    throw new Error('CEP deve conter exatamente 8 dígitos.');
  }

  // CEPs inválidos conhecidos (todos dígitos iguais)
  if (/^(\d)\1{7}$/.test(cepLimpo)) {
    throw new Error('CEP inválido. Verifique o número informado.');
  }

  try {
    const { data } = await apiCep.get(`/${cepLimpo}/json/`);

    if (data.erro === 'true' || data.erro === true || data.erro) {
      throw new Error('CEP não encontrado');
    }

    return {
      cep: data.cep || `${cepLimpo.slice(0, 5)}-${cepLimpo.slice(5)}`,
      logradouro: data.logradouro || '',
      complemento: data.complemento || '',
      bairro: data.bairro || '',
      cidade: data.localidade || '',
      estado: data.uf || '',
      uf: data.uf || '',
      ibge: data.ibge || '',
      enderecoCompleto: [data.logradouro, data.bairro, data.localidade, data.uf]
        .filter(Boolean)
        .join(', '),
      isFallback: false,
    };
  } catch (error) {
    // Se o erro foi expressamente 'CEP não encontrado' ou validação de dígitos, propaga diretamente
    if (
      error.message.includes('CEP não encontrado') ||
      error.message.includes('CEP inválido') ||
      error.message.includes('8 dígitos')
    ) {
      throw error;
    }

    // Se foi erro de rede/timeout/offline, utiliza fallback de contingência
    console.warn('[ViaCEP] API externa indisponível. Verificando base local de contingência:', error.message);
    if (mockEnderecos[cepLimpo]) {
      const fallback = mockEnderecos[cepLimpo];
      return {
        ...fallback,
        enderecoCompleto: [fallback.logradouro, fallback.bairro, fallback.cidade, fallback.estado]
          .filter(Boolean)
          .join(', '),
        isFallback: true,
      };
    }

    // Fallback genérico para apresentação offline sem internet
    return {
      cep: `${cepLimpo.slice(0, 5)}-${cepLimpo.slice(5)}`,
      logradouro: 'Avenida FMP Solidária, 100',
      complemento: 'Campus Palhoça - Ponto de Coleta',
      bairro: 'Ponte do Imaruim',
      cidade: 'Palhoça',
      estado: 'SC',
      ibge: '4211900',
      enderecoCompleto: 'Avenida FMP Solidária, 100, Ponte do Imaruim, Palhoça, SC',
      isFallback: true,
    };
  }
}

/**
 * Busca estatísticas do dashboard (com fallback)
 */
export async function getDashboardStats() {
  try {
    const { data: users } = await apiMock.get('/users');
    const { data: todos } = await apiMock.get('/todos?_limit=20');

    const totalDoacoes = todos.filter((t) => t.completed).length;
    const campanhasAtivas = 8;
    const alunosParticipantes = users.length;
    const horasGeradas = totalDoacoes * 2;

    return {
      stats: { totalDoacoes, campanhasAtivas, alunosParticipantes, horasGeradas },
      isFallback: false,
    };
  } catch (error) {
    console.warn('[Stats FMP] Falha na requisição. Ativando fallback local:', error.message);
    return { stats: mockStats, isFallback: true };
  }
}
