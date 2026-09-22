// ============================================================
// helpers.test.js — Testes Unitários das Funções Utilitárias
// Aula 05: Testes automatizados com Vitest
// ============================================================
import { describe, it, expect } from 'vitest';
import {
  validarEmailInstitucional,
  calcularHorasDoacao,
  formatarCep,
  calcularProgresso,
  filtrarCampanhas,
  capitalize,
} from '../utils/helpers';

// ── TESTE 1: validarEmailInstitucional ────────────────────────
describe('validarEmailInstitucional', () => {
  it('deve aceitar e-mail válido @aluno.fmpsc.edu.br', () => {
    expect(validarEmailInstitucional('joao.silva@aluno.fmpsc.edu.br')).toBe(true);
    expect(validarEmailInstitucional('maria123@aluno.fmpsc.edu.br')).toBe(true);
    expect(validarEmailInstitucional('a.b.c@aluno.fmpsc.edu.br')).toBe(true);
  });

  it('deve rejeitar e-mail de outros domínios', () => {
    expect(validarEmailInstitucional('joao@gmail.com')).toBe(false);
    expect(validarEmailInstitucional('joao@fmpsc.edu.br')).toBe(false);
    expect(validarEmailInstitucional('joao@aluno.fmp.edu.br')).toBe(false);
    expect(validarEmailInstitucional('joao@outlook.com')).toBe(false);
  });

  it('deve rejeitar entradas inválidas', () => {
    expect(validarEmailInstitucional('')).toBe(false);
    expect(validarEmailInstitucional(null)).toBe(false);
    expect(validarEmailInstitucional(undefined)).toBe(false);
    expect(validarEmailInstitucional('nao-e-email')).toBe(false);
    expect(validarEmailInstitucional('@aluno.fmpsc.edu.br')).toBe(false);
  });

  it('deve ser case-insensitive', () => {
    expect(validarEmailInstitucional('JOAO@ALUNO.FMPSC.EDU.BR')).toBe(true);
    expect(validarEmailInstitucional('Maria@Aluno.Fmpsc.Edu.Br')).toBe(true);
  });
});

// ── TESTE 2: calcularHorasDoacao ──────────────────────────────
describe('calcularHorasDoacao', () => {
  it('deve calcular corretamente horas para quantidade e fator simples', () => {
    expect(calcularHorasDoacao(5, 2)).toBe(10);      // 5 itens × 2h = 10h
    expect(calcularHorasDoacao(3, 1.5)).toBe(4.5);   // 3 × 1.5 = 4.5h
    expect(calcularHorasDoacao(1, 3)).toBe(3);
  });

  it('deve respeitar o limite máximo de horas (padrão 10h)', () => {
    expect(calcularHorasDoacao(10, 5)).toBe(10);     // 50h → limitado a 10h
    expect(calcularHorasDoacao(100, 2)).toBe(10);    // 200h → limitado a 10h
  });

  it('deve respeitar limite máximo personalizado', () => {
    expect(calcularHorasDoacao(10, 5, 20)).toBe(20); // 50h → limitado a 20h
    expect(calcularHorasDoacao(3, 1, 5)).toBe(3);    // 3h < 5h (limite)
  });

  it('deve retornar 0 para entradas inválidas', () => {
    expect(calcularHorasDoacao(0, 2)).toBe(0);
    expect(calcularHorasDoacao(-1, 2)).toBe(0);
    expect(calcularHorasDoacao(5, -1)).toBe(0);
    expect(calcularHorasDoacao('abc', 2)).toBe(0);
    expect(calcularHorasDoacao(null, 2)).toBe(0);
  });

  it('deve arredondar para 1 casa decimal', () => {
    expect(calcularHorasDoacao(1, 1.333)).toBe(1.3);
    expect(calcularHorasDoacao(2, 0.75)).toBe(1.5);
  });
});

// ── Testes adicionais das demais funções ─────────────────────
describe('formatarCep', () => {
  it('deve formatar CEP de 8 dígitos com hífen', () => {
    expect(formatarCep('88130000')).toBe('88130-000');
    expect(formatarCep('01310100')).toBe('01310-100');
  });

  it('deve retornar o valor original se CEP inválido', () => {
    expect(formatarCep('1234')).toBe('1234');
    expect(formatarCep('abc')).toBe('abc');
  });
});

describe('calcularProgresso', () => {
  it('deve calcular percentual correto', () => {
    expect(calcularProgresso(50, 100)).toBe(50);
    expect(calcularProgresso(100, 100)).toBe(100);
    expect(calcularProgresso(0, 100)).toBe(0);
  });

  it('deve limitar a 100 mesmo que ultrapasse a meta', () => {
    expect(calcularProgresso(150, 100)).toBe(100);
  });

  it('deve retornar 0 se meta for 0 ou inválida', () => {
    expect(calcularProgresso(10, 0)).toBe(0);
    expect(calcularProgresso(10, null)).toBe(0);
  });
});

describe('filtrarCampanhas', () => {
  const campanhasMock = [
    { id: 1, titulo: 'C1', descricao: '', status: 'ativa',     categoria: 'Alimentos' },
    { id: 2, titulo: 'C2', descricao: '', status: 'encerrada', categoria: 'Roupas'    },
    { id: 3, titulo: 'C3', descricao: '', status: 'ativa',     categoria: 'Roupas'    },
  ];

  it('deve retornar todas com status "all"', () => {
    expect(filtrarCampanhas(campanhasMock, 'all', 'all')).toHaveLength(3);
  });

  it('deve filtrar por status', () => {
    expect(filtrarCampanhas(campanhasMock, 'ativa', 'all')).toHaveLength(2);
    expect(filtrarCampanhas(campanhasMock, 'encerrada', 'all')).toHaveLength(1);
  });

  it('deve filtrar por categoria', () => {
    expect(filtrarCampanhas(campanhasMock, 'all', 'Roupas')).toHaveLength(2);
    expect(filtrarCampanhas(campanhasMock, 'all', 'Alimentos')).toHaveLength(1);
  });

  it('deve combinar filtros de status e categoria', () => {
    expect(filtrarCampanhas(campanhasMock, 'ativa', 'Roupas')).toHaveLength(1);
    expect(filtrarCampanhas(campanhasMock, 'encerrada', 'Alimentos')).toHaveLength(0);
  });
});

describe('capitalize', () => {
  it('deve capitalizar cada palavra', () => {
    expect(capitalize('olá mundo')).toBe('Olá Mundo');
    expect(capitalize('joão da silva')).toBe('João Da Silva');
  });

  it('deve retornar string vazia para entrada vazia', () => {
    expect(capitalize('')).toBe('');
    expect(capitalize(null)).toBe('');
  });
});
