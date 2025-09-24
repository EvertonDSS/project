<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
      <!-- Header -->
      <div class="bg-gradient-to-r from-primary-600 to-secondary-600 text-white p-6">
        <div class="flex justify-between items-center">
          <div>
            <h2 class="text-2xl font-bold">Adicionar Rodada</h2>
            <p class="text-primary-100">Adicione uma nova rodada ao relatório</p>
          </div>
          <button 
            @click="$emit('close')"
            class="text-white hover:text-primary-200 transition-colors"
          >
            <XMarkIcon class="w-6 h-6" />
          </button>
        </div>
      </div>

      <!-- Content -->
      <div class="p-6 overflow-y-auto flex-1">
        <form @submit.prevent="adicionarRodada" class="space-y-6">
          <!-- Seleção de Rodada -->
          <div>
            <label class="block text-sm font-medium text-neutral-700 mb-2">
              <CalendarIcon class="w-4 h-4 inline mr-1" />
              Rodada
              <span class="text-red-500">*</span>
            </label>
            <FormSelectSearchable
              v-model="formData.rodadaId"
              :options="rodadaOptions"
              :disabled="loadingRodadas"
              placeholder="Selecione uma rodada..."
              required
            />
          </div>

          <!-- Seleção de Cavalo -->
          <div>
            <label class="block text-sm font-medium text-neutral-700 mb-2">
              <SparklesIcon class="w-4 h-4 inline mr-1" />
              Cavalo
              <span class="text-red-500">*</span>
            </label>
            <FormSelectSearchable
              v-model="formData.cavaloId"
              :options="cavaloOptions"
              :disabled="loading"
              placeholder="Selecione um cavalo..."
              required
            />
          </div>

          <!-- Valor da Aposta -->
          <div>
            <FormInput
              label="Valor da Aposta"
              type="number"
              step="0.01"
              v-model="formData.valorAposta"
              required
              prefix="R$"
              icon="CurrencyDollarIcon"
            />
          </div>

          <!-- Porcentagem -->
          <div>
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

          <!-- Total da Rodada -->
          <div>
            <FormInput
              label="Total da Rodada"
              type="number"
              step="0.01"
              v-model="formData.totalRodada"
              required
              prefix="R$"
              icon="BanknotesIcon"
            />
          </div>

          <!-- Preview da Chave -->
          <div v-if="formData.cavaloId" class="bg-neutral-50 p-4 rounded-lg">
            <h3 class="text-sm font-medium text-neutral-700 mb-2">Preview da Chave:</h3>
            <p class="text-lg font-semibold text-primary-600">{{ previewChave }}</p>
          </div>

          <!-- Preview do Prêmio Individual -->
          <div v-if="formData.valorAposta && formData.porcentagem" class="bg-neutral-50 p-4 rounded-lg">
            <h3 class="text-sm font-medium text-neutral-700 mb-2">Preview do Prêmio Individual:</h3>
            <p class="text-lg font-semibold text-secondary-600">{{ formatCurrency(previewPremio) }}</p>
          </div>
        </form>
      </div>

      <!-- Footer -->
      <div class="bg-neutral-100 px-6 py-4 flex justify-end space-x-3 flex-shrink-0">
        <button 
          @click="$emit('close')"
          class="px-4 py-2 text-neutral-600 hover:text-neutral-800 transition-colors"
        >
          Cancelar
        </button>
        <button 
          @click="adicionarRodada"
          :disabled="!isFormValid"
          class="px-6 py-2 bg-primary-600 text-white rounded hover:bg-primary-700 disabled:bg-neutral-300 disabled:cursor-not-allowed transition-colors"
        >
          Adicionar Rodada
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { 
  XMarkIcon, 
  CalendarIcon, 
  SparklesIcon, 
  CurrencyDollarIcon, 
  CalculatorIcon, 
  BanknotesIcon 
} from '@heroicons/vue/24/outline'

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  campeonatoId: {
    type: [Number, String],
    default: null
  },
  apostadorId: {
    type: [Number, String],
    default: null
  }
})

const emit = defineEmits(['close', 'adicionar'])

const { getRodadasCampeonatoDetalhadas, getCavalos } = useApi()

// Estados reativos
const formData = ref({
  rodadaId: '',
  cavaloId: '',
  valorAposta: '',
  porcentagem: '',
  totalRodada: ''
})

const rodadaOptions = ref([])
const cavaloOptions = ref([])
const loadingRodadas = ref(false)
const loading = ref(false)

// Computed properties
const isFormValid = computed(() => {
  return Object.values(formData.value).every(value => value !== '')
})

const previewChave = computed(() => {
  if (!formData.value.cavaloId) return ''
  const cavalo = cavaloOptions.value.find(c => c.value === formData.value.cavaloId)
  if (!cavalo) return ''
  return `${formData.value.cavaloId.toString().padStart(2, '0')}- ${cavalo.label}`
})

const previewPremio = computed(() => {
  if (!formData.value.valorAposta || !formData.value.porcentagem) return 0
  return (parseFloat(formData.value.valorAposta) * parseFloat(formData.value.porcentagem)) / 100
})

// Carregar dados quando modal abrir
watch(() => props.isOpen, async (isOpen) => {
  if (isOpen) {
    await carregarDados()
  } else {
    // Limpar formulário quando fechar
    formData.value = {
      rodadaId: '',
      cavaloId: '',
      valorAposta: '',
      porcentagem: '',
      totalRodada: ''
    }
  }
})

const carregarDados = async () => {
  await Promise.all([
    carregarRodadas(),
    carregarCavalos()
  ])
}

const carregarRodadas = async () => {
  if (!props.campeonatoId) return

  loadingRodadas.value = true
  try {
    const rodadas = await getRodadasCampeonatoDetalhadas(parseInt(props.campeonatoId))
    rodadaOptions.value = rodadas.map(rodada => ({
      value: rodada.id,
      label: rodada.rodada.nomeRodada
    }))
  } catch (error) {
    console.error('Erro ao carregar rodadas:', error)
  } finally {
    loadingRodadas.value = false
  }
}

const carregarCavalos = async () => {
  loading.value = true
  try {
    const cavalos = await getCavalos()
    cavaloOptions.value = cavalos.map(cavalo => ({
      value: cavalo.id,
      label: cavalo.nome
    }))
  } catch (error) {
    console.error('Erro ao carregar cavalos:', error)
  } finally {
    loading.value = false
  }
}

const adicionarRodada = () => {
  if (!isFormValid.value) return

  const cavalo = cavaloOptions.value.find(c => c.value === formData.value.cavaloId)
  const rodada = rodadaOptions.value.find(r => r.value === formData.value.rodadaId)

  const novaAposta = {
    rodada: rodada?.label || 'N/A',
    chave: `${formData.value.cavaloId.toString().padStart(2, '0')}- ${cavalo?.label || ''}`,
    valorAposta: parseFloat(formData.value.valorAposta),
    porcentagem: parseFloat(formData.value.porcentagem),
    premioIndividual: previewPremio.value,
    totalRodada: parseFloat(formData.value.totalRodada)
  }

  emit('adicionar', novaAposta)
}

const formatCurrency = (value) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value)
}
</script>
