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
        <div v-if="rodadas.length === 0" class="text-center py-8">
          <div class="text-neutral-400 mb-4">
            <CalendarIcon class="w-16 h-16 mx-auto" />
          </div>
          <h3 class="text-lg font-semibold text-neutral-600 mb-2">Nenhuma rodada encontrada</h3>
          <p class="text-neutral-500">Este campeonato não possui rodadas cadastradas.</p>
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
          <div
            v-for="rodada in rodadas"
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

const selectedRodada = ref(null)

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

// Limpar seleção quando modal fechar
watch(() => props.isOpen, (isOpen) => {
  if (!isOpen) {
    selectedRodada.value = null
  }
})
</script>
