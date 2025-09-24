<template>
  <div class="mb-8 animate-fade-in">
    <div class="card p-8 max-w-2xl mx-auto">
      <div class="text-center mb-8">
        <h1 class="text-4xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent mb-2">
          Campeonato
        </h1>
        <p class="text-neutral-600">Cadastre um novo campeonato no sistema</p>
      </div>
      
      <form @submit.prevent="submitCampeonato" class="space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormInput
            label="Nome"
            type="text"
            v-model="formData.nome"
            required
            icon="TrophyIcon"
            placeholder="Digite o nome do campeonato"
          />
          
          <FormInput
            label="Ano"
            type="number"
            v-model="formData.ano"
            required
            icon="CalendarIcon"
            placeholder="Ex: 2024"
            :min="2000"
            :max="2100"
          />
        </div>
        
        <div class="flex justify-center pt-6">
          <button 
            type="submit" 
            class="btn-primary flex items-center space-x-2"
            :disabled="!isFormValid"
          >
            <PaperAirplaneIcon class="w-5 h-5" />
            <span>Enviar</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { PaperAirplaneIcon } from '@heroicons/vue/24/outline'

const emit = defineEmits(['campeonatoSubmitted'])

const formData = ref({
  nome: '',
  ano: ''
})

const isFormValid = computed(() => {
  return formData.value.nome.trim() !== '' && 
         formData.value.ano !== '' && 
         formData.value.ano >= 2000 && 
         formData.value.ano <= 2100
})

const submitCampeonato = () => {
  if (!isFormValid.value) return

  const campeonato = {
    id: Date.now().toString(),
    nome: formData.value.nome.trim(),
    ano: parseInt(formData.value.ano)
  }

  emit('campeonatoSubmitted', campeonato)
  
  // Reset form
  formData.value.nome = ''
  formData.value.ano = ''
}
</script>
