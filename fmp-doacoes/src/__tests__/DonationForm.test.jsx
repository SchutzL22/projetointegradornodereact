// ============================================================
// DonationForm.test.jsx — Testes de Integração e Preenchimento Automático
// Requisito AV1: Simulação do preenchimento automático do endereço ao digitar o CEP
// ============================================================
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import DonationForm from '../components/DonationForm/DonationForm';
import { ToastProvider } from '../components/Toast/ToastContext';
import * as api from '../services/api';

// Helper para renderizar com todos os providers necessários
function renderDonationForm() {
  return render(
    <ToastProvider>
      <BrowserRouter>
        <DonationForm />
      </BrowserRouter>
    </ToastProvider>
  );
}

describe('DonationForm — Preenchimento Automático via CEP (ViaCEP)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('deve formatar o CEP com máscara 00000-000 em tempo real ao digitar', () => {
    renderDonationForm();

    const cepInput = screen.getByLabelText(/cep do ponto de coleta/i);
    expect(cepInput).toBeInTheDocument();

    // Digita os 8 dígitos sem pontuação
    fireEvent.change(cepInput, { target: { value: '88130000' } });

    // Verifica se a máscara foi aplicada automaticamente
    expect(cepInput.value).toBe('88130-000');
  });

  it('deve preencher automaticamente logradouro, bairro e cidade ao digitar um CEP válido de 8 dígitos', async () => {
    // Espia e mocka o retorno do getEnderecoPorCep
    const mockEndereco = {
      cep: '88130-000',
      logradouro: 'Rua João Pereira dos Santos',
      complemento: 'Campus FMP - Ponte do Imaruim',
      bairro: 'Ponte do Imaruim',
      cidade: 'Palhoça',
      estado: 'SC',
      ibge: '4211900',
      enderecoCompleto: 'Rua João Pereira dos Santos, Ponte do Imaruim, Palhoça, SC',
      isFallback: false,
    };

    vi.spyOn(api, 'getEnderecoPorCep').mockResolvedValueOnce(mockEndereco);

    renderDonationForm();

    const cepInput = screen.getByLabelText(/cep do ponto de coleta/i);

    // Inicialmente os campos de endereço não estão visíveis (aguardam busca)
    expect(screen.queryByLabelText(/logradouro/i)).not.toBeInTheDocument();

    // Simula a digitação do CEP completo
    fireEvent.change(cepInput, { target: { value: '88130000' } });

    // Aguarda a chamada assíncrona resolver e os campos serem preenchidos
    await waitFor(() => {
      const logradouroInput = screen.getByLabelText(/logradouro/i);
      expect(logradouroInput).toBeInTheDocument();
      expect(logradouroInput).toHaveValue('Rua João Pereira dos Santos');
    });

    const bairroInput = screen.getByLabelText(/bairro/i);
    const cidadeInput = screen.getByLabelText(/cidade/i);

    expect(bairroInput).toHaveValue('Ponte do Imaruim');
    expect(cidadeInput).toHaveValue('Palhoça - SC');

    // Verifica que a API foi chamada com o CEP limpo
    expect(api.getEnderecoPorCep).toHaveBeenCalledWith('88130000');
  });

  it('deve exibir mensagem amigável de erro caso o CEP seja inválido ou não encontrado', async () => {
    vi.spyOn(api, 'getEnderecoPorCep').mockRejectedValueOnce(
      new Error('CEP não encontrado no ViaCEP. Verifique o número informado.')
    );

    renderDonationForm();

    const cepInput = screen.getByLabelText(/cep do ponto de coleta/i);

    // Digita um CEP inexistente de 8 dígitos
    fireEvent.change(cepInput, { target: { value: '99999999' } });

    // Aguarda a exibição da mensagem de erro acessível
    await waitFor(() => {
      const errorMsg = screen.getByRole('alert');
      expect(errorMsg).toHaveTextContent(/cep não encontrado/i);
    });

    // Campos de endereço não devem ter sido renderizados
    expect(screen.queryByLabelText(/logradouro/i)).not.toBeInTheDocument();
  });

  it('deve exibir o aviso de modo de contingência offline quando a busca usa o fallback local', async () => {
    const mockFallback = {
      cep: '88130-000',
      logradouro: 'Rua João Pereira dos Santos',
      bairro: 'Ponte do Imaruim',
      cidade: 'Palhoça',
      estado: 'SC',
      enderecoCompleto: 'Rua João Pereira dos Santos, Ponte do Imaruim, Palhoça, SC',
      isFallback: true,
    };

    vi.spyOn(api, 'getEnderecoPorCep').mockResolvedValueOnce(mockFallback);

    renderDonationForm();

    const cepInput = screen.getByLabelText(/cep do ponto de coleta/i);
    fireEvent.change(cepInput, { target: { value: '88130000' } });

    await waitFor(() => {
      expect(screen.getByText(/modo resiliente ativo/i)).toBeInTheDocument();
    });
  });
});
