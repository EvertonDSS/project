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
          
          <FormInput
            label="Valor Total"
            type="number"
            step="0.01"
            v-model="formData.valorTotal"
            required
            prefix="R$"
            icon="CurrencyDollarIcon"
          />
          
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
  </div>
</template>

<script setup>
import { PaperAirplaneIcon } from '@heroicons/vue/24/outline'

const emit = defineEmits(['betSubmitted'])
const { api, getApostadores, getCavalos, getCampeonatos } = useApi()

const formData = ref({
  apostador: '',
  cavalo: '',
  campeonato: '',
  valorTotal: '',
  valorAposta: '',
  porcentagem: ''
})

// Estados reativos para os dados do backend
const apostadorOptions = ref([])
const cavaloOptions = ref([])
const campeonatoOptions = ref([])
const loading = ref(false)
const error = ref('')

// Carregar dados do backend quando o componente for montado
onMounted(async () => {
  await loadFormData()
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


const isFormValid = computed(() => {
  return Object.values(formData.value).every(value => value !== '')
})

const submitBet = async () => {
  if (!isFormValid.value) return
  
  const apostaData = {
    cavaloId: parseInt(formData.value.cavalo),
    campeonatoId: parseInt(formData.value.campeonato),
    apostadorId: parseInt(formData.value.apostador),
    total: parseFloat(formData.value.valorTotal),
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
      valorTotal: apostaData.total,
      valorAposta: apostaData.valorUnitario,
      porcentagem: apostaData.porcentagem,
      dataAposta: new Date()
    })
    
    // Reset form
    Object.keys(formData.value).forEach(key => {
      formData.value[key] = ''
    })
  } catch (error) {
    console.error('Erro ao enviar aposta:', error)
    error.value = 'Erro ao enviar aposta. Tente novamente.'
  }
}
</script>