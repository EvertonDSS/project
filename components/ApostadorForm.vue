<template>
    <div class="mb-8 animate-fade-in">
      <div class="card p-8 max-w-2xl mx-auto">
        <div class="text-center mb-8">
          <h1 class="text-4xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent mb-2">
            Apostador
          </h1>
          <p class="text-neutral-600">Cadastre um novo apostador no sistema</p>
        </div>
        
        <form @submit.prevent="submitApostador" class="space-y-6">
          <div class="max-w-md mx-auto">
            <FormInput
              label="Nome"
              type="text"
              v-model="formData.nome"
              required
              icon="UserIcon"
              placeholder="Digite o nome completo"
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
  
  const emit = defineEmits(['apostadorSubmitted'])
  
  const formData = ref({
    nome: ''
  })
  
  const isFormValid = computed(() => {
    return formData.value.nome.trim() !== ''
  })
  
  const submitApostador = () => {
    if (!isFormValid.value) return
  
    const apostador = {
      nome: formData.value.nome.trim()
    }
  
    emit('apostadorSubmitted', apostador)
    
    // Reset form
    formData.value.nome = ''
  }
  </script>