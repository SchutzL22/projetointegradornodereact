// ============================================================
// DonationForm.jsx — Formulário de Registro de Doação FMP
// Aula 04: useState | Aula 05: ViaCEP Custom Hook (useViaCep) + Toasts
// ============================================================
import { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { useViaCep } from '../../hooks/useViaCep';
import { useToast } from '../../hooks/useToast';
import { validarEmailInstitucional, calcularHorasDoacao } from '../../utils/helpers';
import mockCampanhas from '../../data/mockCampanhas.json';
import styles from './DonationForm.module.scss';

const CATEGORIAS_ITENS = {
  Alimentos: ['Arroz (kg)', 'Feijão (kg)', 'Macarrão (kg)', 'Óleo (litro)', 'Açúcar (kg)', 'Sal (kg)', 'Farinha (kg)'],
  Roupas: ['Camisa', 'Calça', 'Vestido', 'Casaco/Blusa', 'Meias (par)', 'Roupa Infantil', 'Cobertor'],
  Higiene: ['Shampoo', 'Condicionador', 'Sabonete', 'Pasta de dente', 'Absorvente', 'Papel higiênico', 'Álcool em gel'],
  'Material Escolar': ['Caderno', 'Lápis (caixa)', 'Caneta (pacote)', 'Borracha', 'Régua', 'Mochila', 'Estojo'],
  Brinquedos: ['Boneca', 'Carrinho', 'Jogo de tabuleiro', 'Bola', 'Quebra-cabeça', 'Pelúcia'],
};

const INITIAL_STATE = {
  nome: '',
  email: '',
  matricula: '',
  curso: '',
  campanhaId: '',
  tipoItem: '',
  quantidade: '',
  observacoes: '',
  numero: '',
  complemento: '',
};

export default function DonationForm() {
  const location = useLocation();
  const toast = useToast();

  const [form, setForm] = useState(() => {
    const preselected = location.state?.campanhaId
      ? { campanhaId: String(location.state.campanhaId) }
      : {};
    return { ...INITIAL_STATE, ...preselected };
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState(null);
  const [horasCalculadas, setHorasCalculadas] = useState(0);

  // Callback acionado quando o useViaCep localiza o endereço
  const handleAddressFound = useCallback((addressData) => {
    if (addressData?.isFallback) {
      toast.warning(
        `Endereço carregado via contingência local (${addressData.cidade} - ${addressData.estado || addressData.uf}).`,
        'Modo Resiliente'
      );
    } else {
      toast.info(
        `${addressData.logradouro || 'Endereço'} localizado com sucesso!`,
        'CEP Encontrado'
      );
    }
  }, [toast]);

  // Consumo do Custom Hook useViaCep
  const {
    address,
    loading: loadingCep,
    error: cepError,
    cep,
    handleCepChange,
    resetAddress,
    isMockFallback,
  } = useViaCep('', handleAddressFound);

  // Notificação e toast para erros de validação ou inexistência do CEP
  useEffect(() => {
    if (cepError) {
      toast.error(cepError, 'Erro no CEP');
    }
  }, [cepError, toast]);

  // Campanhas disponíveis
  const campanhasDisponiveis = mockCampanhas.filter((c) => c.status === 'ativa');

  // Cálculo reativo de horas complementares
  useEffect(() => {
    const campanha = campanhasDisponiveis.find((c) => String(c.id) === form.campanhaId);
    const qtd = parseFloat(form.quantidade) || 0;
    if (campanha && qtd > 0) {
      setHorasCalculadas(calcularHorasDoacao(qtd, campanha.horasPorUnidade));
    } else {
      setHorasCalculadas(0);
    }
  }, [form.campanhaId, form.quantidade, campanhasDisponiveis]);

  // Handler para inputs do formulário
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  // Validação geral do formulário
  const validate = () => {
    const newErrors = {};
    if (!form.nome.trim()) newErrors.nome = 'Nome é obrigatório.';
    if (!validarEmailInstitucional(form.email)) {
      newErrors.email = 'Use seu e-mail institucional (@aluno.fmpsc.edu.br).';
    }
    if (!form.matricula.trim()) newErrors.matricula = 'Matrícula é obrigatória.';
    if (!form.curso.trim()) newErrors.curso = 'Curso é obrigatório.';
    if (!form.campanhaId) newErrors.campanhaId = 'Selecione uma campanha.';
    if (!form.tipoItem) newErrors.tipoItem = 'Selecione o tipo de item.';
    if (!form.quantidade || parseFloat(form.quantidade) <= 0) {
      newErrors.quantidade = 'Informe uma quantidade válida superior a 0.';
    }

    const cleanCep = cep.replace(/\D/g, '');
    if (!cleanCep || cleanCep.length < 8) {
      newErrors.cep = 'Informe um CEP válido com 8 dígitos.';
    } else if (cepError) {
      newErrors.cep = cepError;
    }

    return newErrors;
  };

  // Submissão do formulário
  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast.error('Por favor, revise os campos destacados antes de prosseguir.', 'Atenção');
      return;
    }

    setSubmitting(true);
    setSubmitResult(null);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1200));

      setSubmitResult('success');
      toast.success(
        `Doação cadastrada com sucesso! Horas estimadas: ${horasCalculadas}h complementares.`,
        'Sucesso'
      );
      setForm(INITIAL_STATE);
      resetAddress();
      setHorasCalculadas(0);
    } catch {
      setSubmitResult('error');
      toast.error('Erro ao conectar com o servidor para registro da doação.', 'Falha');
    } finally {
      setSubmitting(false);
    }
  };

  const campanhaAtual = campanhasDisponiveis.find((c) => String(c.id) === form.campanhaId);
  const itensDisponiveis = campanhaAtual ? CATEGORIAS_ITENS[campanhaAtual.categoria] || [] : [];

  return (
    <div className={styles.formWrapper}>
      <div className={styles.formCard}>
        {/* Cabeçalho */}
        <div className={styles.formHeader}>
          <div className={styles.headerIcon} aria-hidden="true">🤝</div>
          <div>
            <h2 className={styles.formTitle}>Registrar Doação</h2>
            <p className={styles.formSubtitle}>
              Contribua com as campanhas solidárias FMP e acumule horas complementares de extensão
            </p>
          </div>
        </div>

        {/* Feedback visual de sucesso */}
        {submitResult === 'success' && (
          <div className={`${styles.alert} ${styles.alertSuccess}`} role="alert">
            <span style={{ fontSize: '1.4rem' }}>✅</span>
            <div>
              <strong>Doação registrada com sucesso!</strong>
              <p>Você receberá um e-mail de confirmação. A equipe da COPER validará os itens entregues em até 48 horas.</p>
            </div>
          </div>
        )}

        {/* Feedback visual de erro */}
        {submitResult === 'error' && (
          <div className={`${styles.alert} ${styles.alertError}`} role="alert">
            <span style={{ fontSize: '1.4rem' }}>❌</span>
            <p>Não foi possível concluir o registro da doação. Por favor, tente novamente.</p>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className={styles.form} id="donation-form">
          {/* --- Seção 1: Dados do Aluno --- */}
          <fieldset className={styles.fieldset}>
            <legend className={styles.legend}>
              <span>👤</span> Dados do Aluno
            </legend>
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label htmlFor="nome" className={styles.label}>
                  Nome Completo *
                </label>
                <input
                  id="nome"
                  name="nome"
                  type="text"
                  value={form.nome}
                  onChange={handleChange}
                  placeholder="Ex: Lucas da Silva"
                  className={`${styles.input} ${errors.nome ? styles.inputError : ''}`}
                  autoComplete="name"
                  aria-invalid={Boolean(errors.nome)}
                  aria-describedby={errors.nome ? 'erro-nome' : undefined}
                />
                {errors.nome && (
                  <span id="erro-nome" className={styles.errorMsg} role="alert">
                    ⚠️ {errors.nome}
                  </span>
                )}
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="email" className={styles.label}>
                  E-mail Institucional *
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="seu.nome@aluno.fmpsc.edu.br"
                  className={`${styles.input} ${errors.email ? styles.inputError : ''}`}
                  autoComplete="email"
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby={errors.email ? 'erro-email' : undefined}
                />
                {errors.email && (
                  <span id="erro-email" className={styles.errorMsg} role="alert">
                    ⚠️ {errors.email}
                  </span>
                )}
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="matricula" className={styles.label}>
                  Matrícula *
                </label>
                <input
                  id="matricula"
                  name="matricula"
                  type="text"
                  value={form.matricula}
                  onChange={handleChange}
                  placeholder="Ex: 202401928"
                  className={`${styles.input} ${errors.matricula ? styles.inputError : ''}`}
                  aria-invalid={Boolean(errors.matricula)}
                  aria-describedby={errors.matricula ? 'erro-matricula' : undefined}
                />
                {errors.matricula && (
                  <span id="erro-matricula" className={styles.errorMsg} role="alert">
                    ⚠️ {errors.matricula}
                  </span>
                )}
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="curso" className={styles.label}>
                  Curso *
                </label>
                <input
                  id="curso"
                  name="curso"
                  type="text"
                  value={form.curso}
                  onChange={handleChange}
                  placeholder="Ex: Análise e Desenvolvimento de Sistemas"
                  className={`${styles.input} ${errors.curso ? styles.inputError : ''}`}
                  aria-invalid={Boolean(errors.curso)}
                  aria-describedby={errors.curso ? 'erro-curso' : undefined}
                />
                {errors.curso && (
                  <span id="erro-curso" className={styles.errorMsg} role="alert">
                    ⚠️ {errors.curso}
                  </span>
                )}
              </div>
            </div>
          </fieldset>

          {/* --- Seção 2: Dados da Doação --- */}
          <fieldset className={styles.fieldset}>
            <legend className={styles.legend}>
              <span>📦</span> Dados da Doação
            </legend>
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label htmlFor="campanhaId" className={styles.label}>
                  Campanha *
                </label>
                <select
                  id="campanhaId"
                  name="campanhaId"
                  value={form.campanhaId}
                  onChange={(e) => {
                    handleChange(e);
                    setForm((prev) => ({ ...prev, tipoItem: '' }));
                  }}
                  className={`${styles.input} ${errors.campanhaId ? styles.inputError : ''}`}
                  aria-invalid={Boolean(errors.campanhaId)}
                  aria-describedby={errors.campanhaId ? 'erro-campanha' : undefined}
                >
                  <option value="">Selecione uma campanha...</option>
                  {campanhasDisponiveis.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.titulo} ({c.horasPorUnidade}h por unidade)
                    </option>
                  ))}
                </select>
                {errors.campanhaId && (
                  <span id="erro-campanha" className={styles.errorMsg} role="alert">
                    ⚠️ {errors.campanhaId}
                  </span>
                )}
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="tipoItem" className={styles.label}>
                  Tipo de Item *
                </label>
                <select
                  id="tipoItem"
                  name="tipoItem"
                  value={form.tipoItem}
                  onChange={handleChange}
                  disabled={!form.campanhaId}
                  className={`${styles.input} ${errors.tipoItem ? styles.inputError : ''}`}
                  aria-invalid={Boolean(errors.tipoItem)}
                  aria-describedby={errors.tipoItem ? 'erro-tipoItem' : undefined}
                >
                  <option value="">
                    {form.campanhaId ? 'Selecione o item...' : 'Selecione a campanha primeiro'}
                  </option>
                  {itensDisponiveis.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
                {errors.tipoItem && (
                  <span id="erro-tipoItem" className={styles.errorMsg} role="alert">
                    ⚠️ {errors.tipoItem}
                  </span>
                )}
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="quantidade" className={styles.label}>
                  Quantidade *
                </label>
                <input
                  id="quantidade"
                  name="quantidade"
                  type="number"
                  min="1"
                  step="1"
                  value={form.quantidade}
                  onChange={handleChange}
                  placeholder="1"
                  className={`${styles.input} ${errors.quantidade ? styles.inputError : ''}`}
                  aria-invalid={Boolean(errors.quantidade)}
                  aria-describedby={errors.quantidade ? 'erro-quantidade' : undefined}
                />
                {errors.quantidade && (
                  <span id="erro-quantidade" className={styles.errorMsg} role="alert">
                    ⚠️ {errors.quantidade}
                  </span>
                )}
              </div>

              {/* Preview Dinâmico de Horas */}
              {horasCalculadas > 0 && (
                <div className={styles.hoursPreview} role="status" aria-live="polite">
                  <span className={styles.hoursIcon} aria-hidden="true">⭐</span>
                  <div>
                    <strong>{horasCalculadas}h</strong>
                    <span> complementares estimadas para cômputo</span>
                  </div>
                </div>
              )}

              <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                <label htmlFor="observacoes" className={styles.label}>
                  Observações adicionais
                </label>
                <textarea
                  id="observacoes"
                  name="observacoes"
                  value={form.observacoes}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Informações adicionais sobre o estado dos itens ou previsão de entrega..."
                  className={`${styles.input} ${styles.textarea}`}
                />
              </div>
            </div>
          </fieldset>

          {/* --- Seção 3: Ponto de Coleta e Endereço (ViaCEP com useViaCep) --- */}
          <fieldset className={styles.fieldset}>
            <legend className={styles.legend}>
              <span>📍</span> Ponto de Coleta e Endereço
            </legend>
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label htmlFor="cep" className={styles.label}>
                  <span>CEP do Ponto de Coleta *</span>
                  <span className={styles.hint}>Formato: 00000-000</span>
                </label>
                <div className={styles.cepWrapper}>
                  <input
                    id="cep"
                    name="cep"
                    type="text"
                    value={cep}
                    onChange={handleCepChange}
                    placeholder="00000-000"
                    maxLength={9}
                    className={`${styles.input} ${errors.cep || cepError ? styles.inputError : ''}`}
                    autoComplete="postal-code"
                    aria-label="CEP do ponto de coleta"
                    aria-describedby={errors.cep || cepError ? 'cep-error' : 'cep-hint'}
                    aria-invalid={Boolean(errors.cep || cepError)}
                  />
                  {loadingCep && (
                    <div
                      className={styles.cepSpinner}
                      role="status"
                      aria-label="Consultando endereço via CEP..."
                    />
                  )}
                  {!loadingCep && address && !cepError && (
                    <span className={styles.cepSuccessIcon} title="Endereço localizado">✓</span>
                  )}
                </div>

                {(errors.cep || cepError) && (
                  <span id="cep-error" className={styles.errorMsg} role="alert">
                    ⚠️ {cepError || errors.cep}
                  </span>
                )}
                <span id="cep-hint" className={styles.hint}>
                  💡 Digite os 8 números do CEP para autocompletar o endereço
                </span>
              </div>

              {/* Indicador de contingência quando a API externa está indisponível */}
              {isMockFallback && (
                <div className={styles.offlineNotice} role="status">
                  <span>🛡️</span>
                  <span>Modo Resiliente Ativo: Endereço carregado da base institucional FMP.</span>
                </div>
              )}

              {/* Indicadores visuais de carregamento (Skeletons) enquanto busca o CEP */}
              {loadingCep && (
                <>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Rua / Logradouro</label>
                    <div className={styles.skeletonField} />
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Bairro</label>
                    <div className={styles.skeletonField} />
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Cidade</label>
                    <div className={styles.skeletonField} />
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Estado (UF)</label>
                    <div className={styles.skeletonField} />
                  </div>
                </>
              )}

              {/* Campos preenchidos automaticamente com Número e Complemento editáveis */}
              {!loadingCep && address && (
                <>
                  {/* Rua / Logradouro (Preenchido automaticamente) */}
                  <div className={styles.formGroup}>
                    <label htmlFor="logradouro" className={styles.label}>
                      Rua / Logradouro
                    </label>
                    <input
                      id="logradouro"
                      name="logradouro"
                      type="text"
                      value={address.logradouro || ''}
                      readOnly
                      disabled={loadingCep}
                      className={`${styles.input} ${styles.inputReadonly}`}
                    />
                  </div>

                  {/* Número (Editável pelo usuário) */}
                  <div className={styles.formGroup}>
                    <label htmlFor="numero" className={styles.label}>
                      Número *
                    </label>
                    <input
                      id="numero"
                      name="numero"
                      type="text"
                      value={form.numero}
                      onChange={handleChange}
                      placeholder="Ex: 100 ou S/N"
                      disabled={loadingCep}
                      className={styles.input}
                    />
                  </div>

                  {/* Complemento (Editável pelo usuário) */}
                  <div className={styles.formGroup}>
                    <label htmlFor="complemento" className={styles.label}>
                      Complemento
                    </label>
                    <input
                      id="complemento"
                      name="complemento"
                      type="text"
                      value={form.complemento || address.complemento || ''}
                      onChange={handleChange}
                      placeholder="Bloco A, Sala COPER, etc."
                      disabled={loadingCep}
                      className={styles.input}
                    />
                  </div>

                  {/* Bairro (Preenchido automaticamente) */}
                  <div className={styles.formGroup}>
                    <label htmlFor="bairro" className={styles.label}>
                      Bairro
                    </label>
                    <input
                      id="bairro"
                      name="bairro"
                      type="text"
                      value={address.bairro || ''}
                      readOnly
                      disabled={loadingCep}
                      className={`${styles.input} ${styles.inputReadonly}`}
                    />
                  </div>

                  {/* Cidade (Preenchido automaticamente) */}
                  <div className={styles.formGroup}>
                    <label htmlFor="cidade" className={styles.label}>
                      Cidade / UF
                    </label>
                    <input
                      id="cidade"
                      name="cidade"
                      type="text"
                      value={address.cidade ? `${address.cidade} - ${address.estado || address.uf || 'SC'}` : ''}
                      readOnly
                      disabled={loadingCep}
                      className={`${styles.input} ${styles.inputReadonly}`}
                    />
                  </div>

                  {/* Estado (UF) (Preenchido automaticamente) */}
                  <div className={styles.formGroup}>
                    <label htmlFor="estado" className={styles.label}>
                      Estado (UF)
                    </label>
                    <input
                      id="estado"
                      name="estado"
                      type="text"
                      value={address.uf || address.estado || ''}
                      readOnly
                      disabled={loadingCep}
                      className={`${styles.input} ${styles.inputReadonly}`}
                    />
                  </div>
                </>
              )}
            </div>
          </fieldset>

          {/* --- Ações do Formulário --- */}
          <div className={styles.formActions}>
            <button
              type="submit"
              id="btn-submit-doacao"
              disabled={submitting || loadingCep}
              className={styles.submitBtn}
            >
              {submitting ? (
                <>
                  <div className={styles.btnSpinner} aria-hidden="true" />
                  <span>Registrando Doação...</span>
                </>
              ) : (
                <>
                  <span>❤️</span>
                  <span>Confirmar e Registrar Doação</span>
                </>
              )}
            </button>
            <p className={styles.disclaimer}>
              * Campos obrigatórios. A validação das horas complementares está sujeita à conferência presencial no ponto de coleta FMP.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
