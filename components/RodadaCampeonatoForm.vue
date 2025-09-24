<template>
  <div class="mb-8 animate-fade-in">
    <div class="card p-6">
      <div class="text-center mb-6">
        <h2 class="text-2xl font-bold bg-gradient-to-r from-accent-600 to-primary-600 bg-clip-text text-transparent mb-2">
          Rodadas
        </h2>
        <p class="text-neutral-600 text-sm">Associe rodadas a campeonatos</p>
      </div>
      
      <form @submit.prevent="submitRodadaCampeonato" class="space-y-4">
        <FormSelect
          label="Campeonato"
          v-model="formData.campeonatoId"
          :options="campeonatoOptions"
          :disabled="loading"
          required
          icon="TrophyIcon"
        />
        
        <FormSelect
          label="Rodada"
          v-model="formData.rodadaId"
          :options="rodadaOptions"
          :disabled="loading"
          required
          icon="PlayIcon"
        />
        
        <FormInput
          label="Valor da Rodada"
          type="number"
          step="0.01"
          v-model="formData.valorRodada"
          required
          prefix="R$"
          icon="CurrencyDollarIcon"
        />
        
        <FormInput
          label="Porcentagem"
          type="number"
          step="0.01"
          v-model="formData.porcentagem"
          required
          suffix="%"
          icon="CalculatorIcon"
        />
        
        <div class="flex justify-center pt-4">
          <button 
            type="submit" 
            class="btn-primary flex items-center space-x-2 text-sm px-4 py-2"
            :disabled="!isFormValid || loading"
          >
            <PaperAirplaneIcon class="w-4 h-4" />
            <span>Associar</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { PaperAirplaneIcon } from '@heroicons/vue/24/outline'

const emit = defineEmits(['rodadaCampeonatoSubmitted'])

const { getCampeonatos, getRodadas } = useApi()

const formData = ref({
  campeonatoId: '',
  rodadaId: '',
  valorRodada: '',
  porcentagem: ''
})

const campeonatoOptions = ref([])
const rodadaOptions = ref([])
const loading = ref(false)

// Carregar dados quando o componente for montado
onMounted(async () => {
  await loadFormData()
})

const loadFormData = async () => {
  loading.value = true
  
  try {
    // Carregar campeonatos
    const campeonatos = await getCampeonatos()
    campeonatoOptions.value = campeonatos.map(campeonato => ({
      value: campeonato.id,
      label: `${campeonato.nome} (${campeonato.ano})`
    }))

    // Carregar rodadas
    const rodadas = await getRodadas()
    rodadaOptions.value = rodadas.map(rodada => ({
      value: rodada.id,
      label: rodada.nomeRodada
    }))
  } catch (err) {
    console.error('Erro ao carregar dados:', err)
  } finally {
    loading.value = false
  }
}

const isFormValid = computed(() => {
  return formData.value.campeonatoId !== '' && 
         formData.value.rodadaId !== '' && 
         formData.value.valorRodada !== '' && 
         formData.value.porcentagem !== ''
})

const submitRodadaCampeonato = () => {
  if (!isFormValid.value) return

  const rodadaCampeonato = {
    id: Date.now().toString(),
    campeonatoId: parseInt(formData.value.campeonatoId),
    rodadaId: parseInt(formData.value.rodadaId),
    valorRodada: parseFloat(formData.value.valorRodada),
    porcentagem: parseFloat(formData.value.porcentagem)
  }

  emit('rodadaCampeonatoSubmitted', rodadaCampeonato)
  
  // Reset form
  formData.value.campeonatoId = ''
  formData.value.rodadaId = ''
  formData.value.valorRodada = ''
  formData.value.porcentagem = ''
}
</script>
