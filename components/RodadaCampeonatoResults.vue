<template>
  <div class="animate-slide-up">
    <div class="text-center mb-6">
      <h3 class="text-xl font-bold text-neutral-800 mb-2">Rodadas de Campeonatos</h3>
      <p class="text-neutral-600 text-sm">{{ rodadasCampeonato.length }} associação{{ rodadasCampeonato.length !== 1 ? 'ões' : '' }}</p>
    </div>
    
    <div class="space-y-3 max-h-96 overflow-y-auto">
      <div
        v-for="(item, index) in rodadasCampeonato"
        :key="item.id"
        class="card p-4 hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300"
        :style="{ animationDelay: `${index * 50}ms` }"
      >
        <div class="space-y-2">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-2">
              <TrophyIcon class="w-4 h-4 text-yellow-500" />
              <span class="text-sm font-medium text-neutral-700">Campeonato ID: {{ item.campeonatoId }}</span>
            </div>
            <div class="flex items-center space-x-2">
              <PlayIcon class="w-4 h-4 text-primary-500" />
              <span class="text-sm font-medium text-neutral-700">Rodada ID: {{ item.rodadaId }}</span>
            </div>
          </div>
          
          <div class="bg-gradient-to-r from-primary-50 to-secondary-50 p-3 rounded-lg">
            <div class="grid grid-cols-1 gap-3 text-sm">
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-2">
                  <CurrencyDollarIcon class="w-4 h-4 text-green-500" />
                  <span class="text-neutral-600">Valor da Rodada:</span>
                </div>
                <span class="font-semibold text-green-600">{{ formatCurrency(item.valorRodada) }}</span>
              </div>
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-2">
                  <GiftIcon class="w-4 h-4 text-purple-500" />
                  <span class="text-neutral-600">Valor do Prêmio:</span>
                </div>
                <span class="font-semibold text-purple-600">{{ formatCurrency(item.valorPremio || 0) }}</span>
              </div>
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-2">
                  <CalculatorIcon class="w-4 h-4 text-blue-500" />
                  <span class="text-neutral-600">Porcentagem:</span>
                </div>
                <span class="font-semibold text-blue-600">{{ item.porcentagem }}%</span>
              </div>
            </div>
          </div>
          
          <p class="text-xs text-neutral-500">ID: #{{ item.id.slice(-6) }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { TrophyIcon, PlayIcon, CurrencyDollarIcon, CalculatorIcon, GiftIcon } from '@heroicons/vue/24/outline'

defineProps({
  rodadasCampeonato: Array
})

const formatCurrency = (value) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value)
}
</script>
