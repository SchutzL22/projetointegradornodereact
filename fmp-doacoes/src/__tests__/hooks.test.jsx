// ============================================================
// hooks.test.jsx — Testes dos Custom Hooks useViaCep e useCampaigns
// ============================================================
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useViaCep, formatarMascaraCep } from '../hooks/useViaCep';
import { useCampaigns } from '../hooks/useCampaigns';
import * as api from '../services/api';

describe('Custom Hook — useViaCep', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('formatarMascaraCep deve formatar dígitos corretamente', () => {
    expect(formatarMascaraCep('88130')).toBe('88130');
    expect(formatarMascaraCep('88130000')).toBe('88130-000');
    expect(formatarMascaraCep('88.130-000')).toBe('88130-000');
    expect(formatarMascaraCep('')).toBe('');
  });

  it('deve inicializar com valores vazios', () => {
    const { result } = renderHook(() => useViaCep());
    expect(result.current.cep).toBe('');
    expect(result.current.endereco).toBeNull();
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe('');
  });

  it('deve buscar e preencher dados do endereço ao chamar buscarCep', async () => {
    const mockEndereco = {
      cep: '88130-000',
      logradouro: 'Rua Central FMP',
      bairro: 'Centro',
      cidade: 'Palhoça',
      estado: 'SC',
      isFallback: false,
    };

    vi.spyOn(api, 'getEnderecoPorCep').mockResolvedValueOnce(mockEndereco);

    const { result } = renderHook(() => useViaCep());

    act(() => {
      result.current.handleCepChange({ target: { value: '88130000' } });
    });

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.endereco).toEqual(mockEndereco);
      expect(result.current.error).toBe('');
    });
  });

  it('deve limpar endereço e definir erro se buscarCep falhar', async () => {
    vi.spyOn(api, 'getEnderecoPorCep').mockRejectedValueOnce(new Error('CEP não encontrado'));

    const { result } = renderHook(() => useViaCep());

    act(() => {
      result.current.buscarCep('00000000');
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.endereco).toBeNull();
      expect(result.current.error).toBe('CEP não encontrado');
    });
  });
});

describe('Custom Hook — useCampaigns', () => {
  it('deve carregar a lista de campanhas na montagem', async () => {
    const mockList = [
      { id: 1, titulo: 'Campanha A', categoria: 'Alimentos', status: 'ativa' },
    ];
    vi.spyOn(api, 'getCampaigns').mockResolvedValueOnce({
      campanhas: mockList,
      isFallback: false,
    });

    const { result } = renderHook(() => useCampaigns());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.campanhas).toEqual(mockList);
      expect(result.current.isFallback).toBe(false);
    });
  });
});
