<template>
  <div class="animate-slide-up">
    <div class="text-center mb-6">
      <h3 class="text-xl font-bold text-neutral-800 mb-2">Rodadas Cadastradas</h3>
      <p class="text-neutral-600 text-sm">{{ rodadas.length }} rodada{{ rodadas.length !== 1 ? 's' : '' }}</p>
    </div>
    
    <div class="space-y-3 max-h-96 overflow-y-auto">
      <div
        v-for="(rodada, index) in rodadas"
        :key="rodada.id"
        class="card p-4 hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300"
        :style="{ animationDelay: `${index * 50}ms` }"
      >
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center">
              <PlayIcon class="w-5 h-5 text-white" />
            </div>
            <div>
              <h4 class="font-semibold text-neutral-800">{{ rodada.nomeRodada }}</h4>
              <p class="text-xs text-neutral-500">ID: #{{ rodada.id.slice(-6) }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { PlayIcon } from '@heroicons/vue/24/outline'

defineProps({
  rodadas: Array
})
</script>
