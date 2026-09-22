// ============================================================
// useCampaigns.js — Custom Hook para Consumo de Campanhas FMP
// Aula 05: Axios + Resiliência com Fallback Local Mock
// ============================================================
import { useState, useEffect, useCallback } from 'react';
import { getCampaigns } from '../services/api';

export function useCampaigns() {
  const [campanhas, setCampanhas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isFallback, setIsFallback] = useState(false);

  const carregarCampanhas = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const { campanhas: data, isFallback: fallbackAtivo } = await getCampaigns();
      setCampanhas(data || []);
      setIsFallback(Boolean(fallbackAtivo));
    } catch (err) {
      setError(err.message || 'Não foi possível carregar as campanhas no momento.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let cancel = false;

    async function initialFetch() {
      setLoading(true);
      setError('');
      try {
        const { campanhas: data, isFallback: fallbackAtivo } = await getCampaigns();
        if (!cancel) {
          setCampanhas(data || []);
          setIsFallback(Boolean(fallbackAtivo));
        }
      } catch (err) {
        if (!cancel) {
          setError(err.message || 'Não foi possível carregar as campanhas.');
        }
      } finally {
        if (!cancel) {
          setLoading(false);
        }
      }
    }

    initialFetch();

    return () => {
      cancel = true;
    };
  }, []);

  return {
    campanhas,
    loading,
    error,
    isFallback,
    recarregar: carregarCampanhas,
  };
}

export default useCampaigns;
