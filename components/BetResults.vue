<template>
  <div class="animate-slide-up">
    <div class="text-center mb-8">
      <h2 class="text-3xl font-bold bg-gradient-to-r from-accent-600 to-primary-600 bg-clip-text text-transparent mb-2">
        Apostas Cadastradas
      </h2>
      <p class="text-neutral-600">{{ bets.length }} aposta{{ bets.length !== 1 ? 's' : '' }} registrada{{ bets.length !== 1 ? 's' : '' }}</p>
    </div>
    
    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      <div
        v-for="(bet, index) in bets"
        :key="bet.id"
        class="card p-6 hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 animate-bounce-subtle"
        :style="{ animationDelay: `${index * 100}ms` }"
      >
        
        
        <div class="space-y-3">
          <div class="flex items-center justify-between">
            <span class="text-sm text-neutral-600 flex items-center space-x-2">
              <UserIcon class="w-4 h-4" />
              <span>Apostador:</span>
            </span>
            <span class="font-semibold text-neutral-800">{{ bet.apostador }}</span>
          </div>
          
          <div class="flex items-center justify-between">
            <span class="text-sm text-neutral-600 flex items-center space-x-2">
              <SparklesIcon class="w-4 h-4" />
              <span>Cavalo:</span>
            </span>
            <span class="font-semibold text-accent-600">{{ bet.cavalo }}</span>
          </div>
          
          <div class="flex items-center justify-between">
            <span class="text-sm text-neutral-600 flex items-center space-x-2">
              <TrophyIcon class="w-4 h-4" />
              <span>Campeonato:</span>
            </span>
            <span class="font-semibold text-neutral-800">{{ bet.campeonato }}</span>
          </div>
          
          <div class="flex items-center justify-between">
            <span class="text-sm text-neutral-600 flex items-center space-x-2">
              <CalendarIcon class="w-4 h-4" />
              <span>Rodada:</span>
            </span>
            <span class="font-semibold text-neutral-800">{{ bet.rodada }}</span>
          </div>
          
          <div class="bg-gradient-to-r from-primary-50 to-secondary-50 p-4 rounded-xl space-y-2 mt-4">
            <div class="flex items-center justify-between">
              <span class="text-sm text-neutral-600 flex items-center space-x-2">
                <CurrencyDollarIcon class="w-4 h-4" />
                <span>Valor Total:</span>
              </span>
              <span class="font-bold text-primary-600">{{ formatCurrency(bet.valorTotal) }}</span>
            </div>
            
            <div class="flex items-center justify-between">
              <span class="text-sm text-neutral-600 flex items-center space-x-2">
                <BanknotesIcon class="w-4 h-4" />
                <span>Valor da Aposta:</span>
              </span>
              <span class="font-bold text-secondary-600">{{ formatCurrency(bet.valorAposta) }}</span>
            </div>
            
            <div class="flex items-center justify-between">
              <span class="text-sm text-neutral-600 flex items-center space-x-2">
                <CalculatorIcon class="w-4 h-4" />
                <span>Porcentagem:</span>
              </span>
              <span class="font-bold text-accent-600">{{ bet.porcentagem }}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { 
  UserIcon, 
  SparklesIcon, 
  TrophyIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  BanknotesIcon,
  CalculatorIcon
} from '@heroicons/vue/24/outline'

defineProps({
  bets: Array
})


const formatCurrency = (value) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value)
}
</script>