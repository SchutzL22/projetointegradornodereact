// ============================================================
// useViaCep.js — Custom Hook para Consulta e Validação de CEP
// Requisitos Técnicos:
// 1. Estados internos: address, loading, error
// 2. Máscara de CEP (00000-000) e sanitização numérica
// 3. Tratamento crítico de payload { "erro": "true" } -> "CEP não encontrado"
// 4. Tratamento de erros de rede (HTTP 4xx/5xx) com try/catch
// ============================================================
import { useState, useCallback, useRef } from 'react';
import { getEnderecoPorCep } from '../services/api';

/**
 * Formata um valor de CEP aplicando máscara 00000-000
 * @param {string} value
 * @returns {string}
 */
export function formatarMascaraCep(value) {
  const digits = String(value || '').replace(/\D/g, '').slice(0, 8);
  if (digits.length > 5) {
    return `${digits.slice(0, 5)}-${digits.slice(5)}`;
  }
  return digits;
}

export function useViaCep(initialCep = '', onAddressFound = null) {
  const [cep, setCep] = useState(() => formatarMascaraCep(initialCep));
  const [address, setAddress] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isMockFallback, setIsMockFallback] = useState(false);

  // Evita race conditions em requisições assíncronas concorrentes
  const activeRequestRef = useRef(0);

  /**
   * Executa a busca de endereço pelo CEP informado
   * @param {string} cepInput
   */
  const buscarCep = useCallback(
    async (cepInput) => {
      // Sanitização: remove caracteres não numéricos
      const rawDigits = String(cepInput || '').replace(/\D/g, '');

      if (rawDigits.length !== 8) {
        setAddress(null);
        setError('O CEP deve conter exatamente 8 dígitos.');
        return null;
      }

      const requestId = ++activeRequestRef.current;
      setLoading(true);
      setError('');

      try {
        const resultado = await getEnderecoPorCep(rawDigits);

        // Descarta requisições antigas se uma nova busca foi disparada
        if (requestId !== activeRequestRef.current) return null;

        setAddress(resultado);
        setIsMockFallback(Boolean(resultado?.isFallback));
        setError('');

        if (onAddressFound) {
          onAddressFound(resultado);
        }

        return resultado;
      } catch (err) {
        if (requestId !== activeRequestRef.current) return null;

        setAddress(null);
        setIsMockFallback(false);

        // Tratamento da mensagem de erro (ex: CEP não encontrado)
        const mensagemErro = err.message || 'Erro ao consultar o CEP informado.';
        setError(mensagemErro);
        return null;
      } finally {
        if (requestId === activeRequestRef.current) {
          setLoading(false);
        }
      }
    },
    [onAddressFound]
  );

  /**
   * Handler para evento de input com máscara e disparo automático ao atingir 8 dígitos
   */
  const handleCepChange = useCallback(
    (e) => {
      const raw = typeof e === 'string' ? e : e?.target?.value;
      const digits = String(raw || '').replace(/\D/g, '').slice(0, 8);
      const masked = formatarMascaraCep(digits);

      setCep(masked);
      setError('');

      if (digits.length < 8) {
        setAddress(null);
        setIsMockFallback(false);
      } else if (digits.length === 8) {
        buscarCep(digits);
      }
    },
    [buscarCep]
  );

  /**
   * Limpa o estado atual do CEP e endereço
   */
  const resetAddress = useCallback(() => {
    setCep('');
    setAddress(null);
    setError('');
    setLoading(false);
    setIsMockFallback(false);
  }, []);

  return {
    address,
    endereco: address, // alias para retrocompatibilidade
    loading,
    error,
    cep,
    setCep,
    handleCepChange,
    buscarCep,
    resetAddress,
    resetEndereco: resetAddress,
    isMockFallback,
  };
}

export default useViaCep;
