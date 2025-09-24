<template>
  <div class="animate-slide-up">
    <div class="text-center mb-8">
      <h2 class="text-3xl font-bold bg-gradient-to-r from-accent-600 to-primary-600 bg-clip-text text-transparent mb-2">
        Campeonatos Cadastrados
      </h2>
      <p class="text-neutral-600">{{ campeonatos.length }} campeonato{{ campeonatos.length !== 1 ? 's' : '' }} registrado{{ campeonatos.length !== 1 ? 's' : '' }}</p>
    </div>
    
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
      <div
        v-for="(campeonato, index) in campeonatos"
        :key="campeonato.id"
        class="card p-6 hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 animate-bounce-subtle"
        :style="{ animationDelay: `${index * 100}ms` }"
      >
        <div class="text-center">
          <div class="flex justify-center mb-4">
            <div class="w-16 h-16 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center">
              <TrophyIcon class="w-8 h-8 text-white" />
            </div>
          </div>
          
          <h3 class="text-xl font-bold text-neutral-800 mb-2">{{ campeonato.nome }}</h3>
          
          <div class="bg-gradient-to-r from-yellow-50 to-orange-50 p-3 rounded-xl mb-4">
            <div class="flex items-center justify-center space-x-2 text-sm text-neutral-600">
              <CalendarIcon class="w-4 h-4" />
              <span>Ano:</span>
            </div>
            <p class="font-semibold text-yellow-600 mt-1">{{ campeonato.ano }}</p>
          </div>
          
          <div class="mt-4 text-xs text-neutral-500 bg-neutral-100 px-3 py-1 rounded-full inline-block">
            ID: #{{ campeonato.id.slice(-6) }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { TrophyIcon, CalendarIcon } from '@heroicons/vue/24/outline'

defineProps({
  campeonatos: Array
})
</script>
