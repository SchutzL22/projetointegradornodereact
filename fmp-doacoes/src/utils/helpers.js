// ============================================================
// helpers.js — Funções Utilitárias do Sistema FMP
// Aula 03: JavaScript moderno | Aula 05: Testáveis com Vitest
// ============================================================

/**
 * Valida se o e-mail é um e-mail institucional FMP
 * @param {string} email
 * @returns {boolean}
 */
export function validarEmailInstitucional(email) {
  if (!email || typeof email !== 'string') return false;
  const emailNorm = email.trim().toLowerCase();
  const regex = /^[a-z0-9._%+-]+@aluno\.fmpsc\.edu\.br$/;
  return regex.test(emailNorm);
}

/**
 * Calcula horas complementares concedidas por doação
 * @param {number} quantidade — Número de itens doados
 * @param {number} fatorConversao — Horas por unidade (ex: 2h/kg)
 * @param {number} limiteMaximo — Limite máximo de horas por campanha (default 10)
 * @returns {number} Total de horas arredondado para 1 casa decimal
 */
export function calcularHorasDoacao(quantidade, fatorConversao, limiteMaximo = 10) {
  if (
    typeof quantidade !== 'number' ||
    typeof fatorConversao !== 'number' ||
    quantidade < 0 ||
    fatorConversao < 0
  ) {
    return 0;
  }

  const horasCalculadas = quantidade * fatorConversao;
  const horasFinais = Math.min(horasCalculadas, limiteMaximo);
  return Math.round(horasFinais * 10) / 10;
}

/**
 * Formata uma data ISO para padrão pt-BR
 * @param {string} dateString — Data em formato ISO 8601
 * @param {Object} options — Opções adicionais do Intl.DateTimeFormat
 * @returns {string} Data formatada em pt-BR
 */
export function formatarData(dateString, options = {}) {
  if (!dateString) return '—';

  try {
    const data = new Date(dateString);
    if (isNaN(data.getTime())) return '—';

    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      ...options,
    }).format(data);
  } catch {
    return '—';
  }
}

/**
 * Formata o CEP adicionando hífen (ex: 88130000 → 88130-000)
 * @param {string} cep
 * @returns {string}
 */
export function formatarCep(cep) {
  const cepLimpo = String(cep).replace(/\D/g, '');
  if (cepLimpo.length !== 8) return cep;
  return `${cepLimpo.slice(0, 5)}-${cepLimpo.slice(5)}`;
}

/**
 * Valida se um CPF é válido (formato e dígitos verificadores)
 * @param {string} cpf
 * @returns {boolean}
 */
export function validarCPF(cpf) {
  const c = String(cpf).replace(/\D/g, '');
  if (c.length !== 11 || /^(\d)\1{10}$/.test(c)) return false;

  let sum = 0;
  for (let i = 0; i < 9; i++) sum += parseInt(c[i]) * (10 - i);
  let rest = (sum * 10) % 11;
  if (rest === 10 || rest === 11) rest = 0;
  if (rest !== parseInt(c[9])) return false;

  sum = 0;
  for (let i = 0; i < 10; i++) sum += parseInt(c[i]) * (11 - i);
  rest = (sum * 10) % 11;
  if (rest === 10 || rest === 11) rest = 0;
  return rest === parseInt(c[10]);
}

/**
 * Calcula progresso de meta em porcentagem
 * @param {number} arrecadado
 * @param {number} meta
 * @returns {number} 0–100
 */
export function calcularProgresso(arrecadado, meta) {
  if (!meta || meta <= 0) return 0;
  return Math.min(Math.round((arrecadado / meta) * 100), 100);
}

/**
 * Capitaliza a primeira letra de cada palavra
 * @param {string} str
 * @returns {string}
 */
export function capitalize(str) {
  if (!str) return '';
  return str
    .toLowerCase()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Filtra campanhas por status e/ou categoria
 * @param {Array} campanhas
 * @param {string} status — 'all' | 'ativa' | 'encerrada'
 * @param {string} categoria — 'all' | nome da categoria
 * @returns {Array}
 */
export function filtrarCampanhas(campanhas, status = 'all', categoria = 'all') {
  return campanhas.filter((c) => {
    const statusOk = status === 'all' || c.status === status;
    const categoriaOk = categoria === 'all' || c.categoria === categoria;
    return statusOk && categoriaOk;
  });
}

/**
 * Retorna label amigável do status da doação
 * @param {string} status
 * @returns {string}
 */
export function labelStatus(status) {
  const labels = {
    ativa: 'Ativa',
    encerrada: 'Encerrada',
    pendente: 'Pendente',
    aprovada: 'Aprovada',
    reprovada: 'Reprovada',
  };
  return labels[status] || capitalize(status);
}
