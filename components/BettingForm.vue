<template>
  <div class="mb-8 animate-fade-in">
    <div class="card p-8 max-w-4xl mx-auto">
      <div class="text-center mb-8">
        <h1 class="text-4xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent mb-2">
          Aposta
        </h1>
        <p class="text-neutral-600">Preencha os dados para registrar sua aposta</p>
        
        <!-- Indicador de loading -->
        <div v-if="loading" class="mt-4 flex items-center justify-center space-x-2 text-primary-600">
          <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-600"></div>
          <span>Carregando dados...</span>
        </div>
        
        <!-- Mensagem de erro -->
        <div v-if="error" class="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700">
          <div class="flex items-center justify-between">
            <span>{{ error }}</span>
            <button 
              @click="loadFormData" 
              class="ml-3 px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition-colors"
            >
              Tentar novamente
            </button>
          </div>
        </div>
      </div>
      
      <form @submit.prevent="submitBet" class="space-y-6" :class="{ 'opacity-50 pointer-events-none': loading }">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <FormSelectSearchable
            label="Apostador"
            v-model="formData.apostador"
            :options="apostadorOptions"
            :disabled="loading"
            required
            icon="UserIcon"
            placeholder="Digite o nome do apostador..."
          />
          
          <FormSelectSearchable
            label="Cavalo"
            v-model="formData.cavalo"
            :options="cavaloOptions"
            :disabled="loading"
            required
            icon="SparklesIcon"
            placeholder="Digite o nome do cavalo..."
          />
          
          <FormSelectSearchable
            label="Campeonato"
            v-model="formData.campeonato"
            :options="campeonatoOptions"
            :disabled="loading"
            required
            icon="TrophyIcon"
            placeholder="Digite o nome do campeonato..."
          />
          
          <div class="flex flex-col">
            <label class="block text-sm font-medium text-neutral-700 mb-2">
              <CalendarIcon class="w-4 h-4 inline mr-1" />
              Rodada
              <span class="text-red-500">*</span>
            </label>
            <button
              type="button"
              @click="abrirModalRodada"
              :disabled="loading || !formData.campeonato"
              class="w-full px-4 py-3 border border-neutral-300 rounded-lg text-left bg-white hover:border-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-neutral-100 disabled:cursor-not-allowed transition-colors"
              :class="{ 'border-red-500': !rodadaSelecionada && formData.campeonato }"
            >
              <span v-if="rodadaSelecionada" class="text-neutral-800">
                {{ rodadaSelecionada.rodada.nomeRodada }}
              </span>
              <span v-else class="text-neutral-500">
                {{ formData.campeonato ? 'Clique para selecionar uma rodada' : 'Selecione um campeonato primeiro' }}
              </span>
            </button>
          </div>
          
          <FormInput
            label="Valor da Aposta"
            type="number"
            step="0.01"
            v-model="formData.valorAposta"
            required
            prefix="R$"
            icon="BanknotesIcon"
          />
          
          <FormInput
            label="Porcentagem"
            type="number"
            step="0.01"
            v-model="formData.porcentagem"
            required
            suffix="%"
            icon="CalculatorIcon"
            :max="100"
          />
          
          <div class="flex flex-col">
            <label class="block text-sm font-medium text-neutral-700 mb-2">
              <CurrencyDollarIcon class="w-4 h-4 inline mr-1" />
              Valor Total da Rodada
            </label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span class="text-neutral-500 text-sm">R$</span>
              </div>
              <input
                type="text"
                :value="rodadaSelecionada ? formatCurrency(parseFloat(rodadaSelecionada.valorPremio || 0)) : '0,00'"
                readonly
                class="w-full pl-10 pr-4 py-3 border border-neutral-300 rounded-lg bg-neutral-50 text-neutral-600 cursor-not-allowed"
              />
            </div>
            <p class="text-xs text-neutral-500 mt-1">
              Valor do prêmio da rodada selecionada
            </p>
          </div>
        </div>
        
        <div class="flex justify-center pt-6">
          <button 
            type="submit" 
            class="btn-primary flex items-center space-x-2"
            :disabled="!isFormValid"
          >
            <PaperAirplaneIcon class="w-5 h-5" />
            <span>Enviar Aposta</span>
          </button>
        </div>
      </form>
    </div>

    <!-- Modal de Seleção de Rodada -->
    <ModalSelecaoRodada
      :isOpen="showModalRodada"
      :campeonatoId="formData.campeonato"
      :campeonatoNome="campeonatoOptions.find(opt => opt.value === formData.campeonato)?.label || ''"
      :rodadas="rodadasDisponiveis"
      :loading="loadingRodadas"
      :error="errorRodadas"
      @close="fecharModalRodada"
      @select="selecionarRodada"
      @reload="carregarRodadas"
    />
  </div>
</template>

<script setup>
import { PaperAirplaneIcon, CalendarIcon, CurrencyDollarIcon } from '@heroicons/vue/24/outline'

const emit = defineEmits(['betSubmitted'])
const { api, getApostadores, getCavalos, getCampeonatos, getRodadasCampeonatoDetalhadas } = useApi()

const formData = ref({
  apostador: '',
  cavalo: '',
  campeonato: '',
  valorAposta: '',
  porcentagem: ''
})

// Estados reativos para os dados do backend
const apostadorOptions = ref([])
const cavaloOptions = ref([])
const campeonatoOptions = ref([])
const loading = ref(false)
const error = ref('')

// Estados para modal de rodada
const showModalRodada = ref(false)
const rodadasDisponiveis = ref([])
const loadingRodadas = ref(false)
const errorRodadas = ref('')
const rodadaSelecionada = ref(null)

// Carregar dados do backend quando o componente for montado
onMounted(async () => {
  await loadFormData()
})

// Watcher para limpar rodada quando campeonato for alterado
watch(() => formData.value.campeonato, (newCampeonatoId) => {
  if (!newCampeonatoId) {
    // Limpar rodada se campeonato for desmarcado
    rodadaSelecionada.value = null
  }
})

const loadFormData = async () => {
  loading.value = true
  error.value = ''
  
  try {
    // Carregar apostadores do backend
    const apostadores = await getApostadores()
    apostadorOptions.value = apostadores.map(apostador => ({
      value: apostador.id,
      label: apostador.nome
    }))

    // Carregar cavalos do backend
    const cavalos = await getCavalos()
    cavaloOptions.value = cavalos.map(cavalo => ({
      value: cavalo.id,
      label: cavalo.nome
    }))

    // Carregar campeonatos do backend
    const campeonatos = await getCampeonatos()
    campeonatoOptions.value = campeonatos.map(campeonato => ({
      value: campeonato.id,
      label: campeonato.nome
    }))

    // Rodadas serão carregadas via modal quando necessário
  } catch (err) {
    error.value = 'Erro ao carregar dados do servidor. Usando dados padrão.'
    console.error('Erro ao carregar dados:', err)
    
    // Fallback para dados estáticos em caso de erro
    apostadorOptions.value = []
    cavaloOptions.value = []
    campeonatoOptions.value = []
  } finally {
    loading.value = false
  }
}

// Funções para modal de rodada
const abrirModalRodada = async () => {
  if (!formData.value.campeonato) {
    error.value = 'Selecione um campeonato primeiro'
    return
  }
  
  showModalRodada.value = true
  await carregarRodadas()
}

const carregarRodadas = async () => {
  loadingRodadas.value = true
  errorRodadas.value = ''
  
  try {
    const rodadas = await getRodadasCampeonatoDetalhadas(parseInt(formData.value.campeonato))
    rodadasDisponiveis.value = rodadas
  } catch (err) {
    console.error('Erro ao carregar rodadas:', err)
    errorRodadas.value = 'Erro ao carregar rodadas do campeonato'
  } finally {
    loadingRodadas.value = false
  }
}

const selecionarRodada = (rodada) => {
  rodadaSelecionada.value = rodada
  showModalRodada.value = false
}

const fecharModalRodada = () => {
  showModalRodada.value = false
}

// Função para formatar moeda
const formatCurrency = (value) => {
  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value)
}


const isFormValid = computed(() => {
  const allFieldsFilled = Object.values(formData.value).every(value => value !== '')
  const rodadaSelected = !!rodadaSelecionada.value
  
  console.log('Validação do formulário:', {
    formData: formData.value,
    allFieldsFilled,
    rodadaSelected,
    rodadaSelecionada: rodadaSelecionada.value,
    isValid: allFieldsFilled && rodadaSelected
  })
  
  return allFieldsFilled && rodadaSelected
})

const submitBet = async () => {
  if (!isFormValid.value) return
  
  const apostaData = {
    cavaloId: parseInt(formData.value.cavalo),
    campeonatoId: parseInt(formData.value.campeonato),
    apostadorId: parseInt(formData.value.apostador),
    rodadasId: rodadaSelecionada.value.id,
    total: parseFloat(rodadaSelecionada.value.valorPremio || 0),
    valorUnitario: parseFloat(formData.value.valorAposta),
    porcentagem: parseFloat(formData.value.porcentagem)
  }
  
  try {
    const response = await useApi().postAposta(apostaData)
    console.log('Aposta enviada com sucesso:', response)
    
    // Emitir evento para o componente pai
    emit('betSubmitted', {
      id: Date.now().toString(),
      apostador: apostadorOptions.value.find(opt => opt.value === formData.value.apostador)?.label || '',
      cavalo: cavaloOptions.value.find(opt => opt.value === formData.value.cavalo)?.label || '',
      campeonato: campeonatoOptions.value.find(opt => opt.value === formData.value.campeonato)?.label || '',
      rodada: rodadaSelecionada.value?.rodada?.nomeRodada || '',
      valorTotal: apostaData.total,
      valorAposta: apostaData.valorUnitario,
      porcentagem: apostaData.porcentagem,
      dataAposta: new Date()
    })
    
    // Reset form
    Object.keys(formData.value).forEach(key => {
      formData.value[key] = ''
    })
    rodadaSelecionada.value = null
  } catch (error) {
    console.error('Erro ao enviar aposta:', error)
    error.value = 'Erro ao enviar aposta. Tente novamente.'
  }
}
</script>