<template>
  <div class="mb-8 animate-fade-in">
    <div class="card p-6">
      <div class="text-center mb-6">
        <h2 class="text-2xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent mb-2">
          Rodada
        </h2>
        <p class="text-neutral-600 text-sm">Cadastre uma nova rodada</p>
      </div>
      
      <form @submit.prevent="submitRodada" class="space-y-4">
        <FormInput
          label="Nome da Rodada"
          type="text"
          v-model="formData.nomeRodada"
          required
          icon="PlayIcon"
          placeholder="Ex: Rodada 1"
        />
        
        <div class="flex justify-center pt-4">
          <button 
            type="submit" 
            class="btn-primary flex items-center space-x-2 text-sm px-4 py-2"
            :disabled="!isFormValid"
          >
            <PaperAirplaneIcon class="w-4 h-4" />
            <span>Cadastrar</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { PaperAirplaneIcon } from '@heroicons/vue/24/outline'

const emit = defineEmits(['rodadaSubmitted'])

const formData = ref({
  nomeRodada: ''
})

const isFormValid = computed(() => {
  return formData.value.nomeRodada.trim() !== ''
})

const submitRodada = () => {
  if (!isFormValid.value) return

  const rodada = {
    id: Date.now().toString(),
    nomeRodada: formData.value.nomeRodada.trim()
  }

  emit('rodadaSubmitted', rodada)
  
  // Reset form
  formData.value.nomeRodada = ''
}
</script>
