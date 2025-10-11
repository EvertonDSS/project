<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div class="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[80vh] overflow-hidden">
      <!-- Header -->
      <div class="bg-gradient-to-r from-primary-600 to-secondary-600 text-white p-6">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-2xl font-bold">Selecionar Rodada</h2>
            <p class="text-primary-100 mt-1">{{ campeonatoNome }}</p>
          </div>
          <button 
            @click="$emit('close')"
            class="text-white hover:text-primary-200 transition-colors"
          >
            <XMarkIcon class="w-6 h-6" />
          </button>
        </div>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="p-8 text-center">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-4"></div>
        <p class="text-neutral-600">Carregando rodadas...</p>
      </div>

      <!-- Error -->
      <div v-else-if="error" class="p-8 text-center">
        <div class="bg-red-50 border border-red-200 rounded-lg p-4">
          <p class="text-red-700 mb-3">{{ error }}</p>
          <button 
            @click="$emit('reload')" 
            class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            Tentar novamente
          </button>
        </div>
      </div>

      <!-- Content -->
      <div v-else class="p-6">
        <!-- Filtros -->
        <div class="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-neutral-700 mb-2">
              Filtrar por Nome da Rodada
            </label>
            <input
              v-model="filtroNome"
              type="text"
              placeholder="Digite o nome da rodada..."
              class="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-neutral-700 mb-2">
              Filtrar por Tipo
            </label>
            <select
              v-model="filtroTipo"
              class="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              :disabled="loadingTipos"
            >
              <option value="">{{ loadingTipos ? 'Carregando tipos...' : 'Todos os tipos' }}</option>
              <option v-for="tipo in tiposUnicos" :key="tipo.id" :value="tipo.id">
                {{ tipo.nome }}
              </option>
            </select>
          </div>
        </div>

        <div v-if="rodadas.length === 0" class="text-center py-8">
          <div class="text-neutral-400 mb-4">
            <CalendarIcon class="w-16 h-16 mx-auto" />
          </div>
          <h3 class="text-lg font-semibold text-neutral-600 mb-2">Nenhuma rodada encontrada</h3>
          <p class="text-neutral-500">Este campeonato não possui rodadas cadastradas.</p>
        </div>

        <div v-else-if="rodadasFiltradas.length === 0" class="text-center py-8">
          <div class="text-neutral-400 mb-4">
            <CalendarIcon class="w-16 h-16 mx-auto" />
          </div>
          <h3 class="text-lg font-semibold text-neutral-600 mb-2">Nenhuma rodada encontrada</h3>
          <p class="text-neutral-500">Nenhuma rodada corresponde aos filtros aplicados.</p>
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
          <div
            v-for="rodada in rodadasFiltradas"
            :key="rodada.id"
            @click="selectRodada(rodada)"
            class="border border-neutral-200 rounded-lg p-4 hover:border-primary-300 hover:shadow-md cursor-pointer transition-all duration-200"
            :class="{ 'border-primary-500 bg-primary-50': selectedRodada?.id === rodada.id }"
          >
            <div class="flex items-center justify-between mb-3">
              <div class="flex items-center space-x-2">
                <CalendarIcon class="w-5 h-5 text-primary-600" />
                <h3 class="font-semibold text-neutral-800">{{ rodada.rodada.nomeRodada }}</h3>
              </div>
              <div class="text-sm text-neutral-500">
                ID: {{ rodada.id }}
              </div>
            </div>
            
            <div class="space-y-2">
              <div class="flex justify-between items-center">
                <span class="text-sm text-neutral-600">Tipo:</span>
                <span class="font-semibold text-purple-600">{{ getNomeTipoPorId(rodada.tipoId) }}</span>
              </div>
              
              <div class="flex justify-between items-center">
                <span class="text-sm text-neutral-600">Valor da Rodada:</span>
                <span class="font-semibold text-primary-600">{{ formatCurrency(rodada.valorRodada) }}</span>
              </div>
              
              <div class="flex justify-between items-center">
                <span class="text-sm text-neutral-600">Porcentagem:</span>
                <span class="font-semibold text-secondary-600">{{ rodada.porcentagem }}%</span>
              </div>
              
              <div class="flex justify-between items-center">
                <span class="text-sm text-neutral-600">Valor do Prêmio:</span>
                <span class="font-semibold text-accent-600">{{ formatCurrency(rodada.valorPremio) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div v-if="!loading && !error" class="bg-neutral-50 px-6 py-4 flex justify-between items-center">
        <div v-if="selectedRodada" class="text-sm text-neutral-600">
          Selecionado: <span class="font-semibold text-primary-600">{{ selectedRodada.rodada.nomeRodada }}</span>
        </div>
        <div v-else class="text-sm text-neutral-500">
          Clique em uma rodada para selecionar
        </div>
        
        <div class="flex space-x-3">
          <button 
            @click="$emit('close')"
            class="px-4 py-2 text-neutral-600 hover:text-neutral-800 transition-colors"
          >
            Cancelar
          </button>
          <button 
            @click="confirmSelection"
            :disabled="!selectedRodada"
            class="px-6 py-2 bg-primary-600 text-white rounded hover:bg-primary-700 disabled:bg-neutral-300 disabled:cursor-not-allowed transition-colors"
          >
            Selecionar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { XMarkIcon, CalendarIcon } from '@heroicons/vue/24/outline'

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  campeonatoId: {
    type: [Number, String],
    default: null
  },
  campeonatoNome: {
    type: String,
    default: ''
  },
  rodadas: {
    type: Array,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  },
  error: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['close', 'select', 'reload'])

const { getTiposRodada } = useApi()

const selectedRodada = ref(null)
const filtroNome = ref('')
const filtroTipo = ref('')
const tipos = ref([])
const loadingTipos = ref(false)

// Carregar tipos da API
const carregarTipos = async () => {
  loadingTipos.value = true
  try {
    tipos.value = await getTiposRodada()
  } catch (error) {
    console.error('Erro ao carregar tipos:', error)
    tipos.value = []
  } finally {
    loadingTipos.value = false
  }
}

// Computed para obter nome do tipo por ID
const getNomeTipoPorId = (tipoId) => {
  const tipo = tipos.value.find(t => t.id === tipoId)
  return tipo?.nome || 'Não definido'
}

// Computed para tipos únicos presentes nas rodadas
const tiposUnicos = computed(() => {
  const tiposIds = new Set()
  props.rodadas.forEach(rodada => {
    if (rodada.tipoId) {
      tiposIds.add(rodada.tipoId)
    }
  })
  
  // Mapear IDs para objetos de tipos
  return Array.from(tiposIds)
    .map(id => tipos.value.find(t => t.id === id))
    .filter(tipo => tipo !== undefined)
    .sort((a, b) => a.nome.localeCompare(b.nome))
})

// Computed para rodadas filtradas
const rodadasFiltradas = computed(() => {
  let resultado = props.rodadas

  // Filtrar por nome
  if (filtroNome.value) {
    const termo = filtroNome.value.toLowerCase()
    resultado = resultado.filter(rodada => 
      rodada.rodada?.nomeRodada?.toLowerCase().includes(termo)
    )
  }

  // Filtrar por tipo (usando tipoId)
  if (filtroTipo.value) {
    resultado = resultado.filter(rodada => 
      rodada.tipoId === parseInt(filtroTipo.value)
    )
  }

  return resultado
})

const selectRodada = (rodada) => {
  selectedRodada.value = rodada
}

const confirmSelection = () => {
  if (selectedRodada.value) {
    emit('select', selectedRodada.value)
    selectedRodada.value = null
  }
}

const formatCurrency = (value) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(parseFloat(value))
}

// Gerenciar estado da modal
watch(() => props.isOpen, (isOpen, wasOpen) => {
  if (isOpen && tipos.value.length === 0) {
    carregarTipos()
  }
  
  if (!isOpen) {
    // Limpar seleção e filtros quando fechar
    selectedRodada.value = null
    filtroNome.value = ''
    filtroTipo.value = ''
  }
})
</script>
