<template>
  <div class="animate-slide-up">
    <div class="text-center mb-8">
      <h2 class="text-3xl font-bold bg-gradient-to-r from-accent-600 to-primary-600 bg-clip-text text-transparent mb-2">
        Cavalos Cadastrados
      </h2>
      <p class="text-neutral-600">{{ cavalos.length }} cavalo{{ cavalos.length !== 1 ? 's' : '' }} registrado{{ cavalos.length !== 1 ? 's' : '' }}</p>
    </div>
    
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
      <div
        v-for="(cavalo, index) in cavalos"
        :key="cavalo.id"
        class="card p-6 hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 animate-bounce-subtle"
        :style="{ animationDelay: `${index * 100}ms` }"
      >
        <div class="text-center">
          <div class="flex justify-center mb-4">
            <div class="w-16 h-16 bg-gradient-to-r from-accent-500 to-primary-500 rounded-full flex items-center justify-center">
              <SparklesIcon class="w-8 h-8 text-white" />
            </div>
          </div>
          
          <h3 class="text-xl font-bold text-neutral-800 mb-2">{{ cavalo.nome }}</h3>
          
          <div class="mt-4 text-xs text-neutral-500 bg-neutral-100 px-3 py-1 rounded-full inline-block">
            ID: #{{ cavalo.id.slice(-6) }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { SparklesIcon } from '@heroicons/vue/24/outline'

defineProps({
  cavalos: Array
})
</script>
