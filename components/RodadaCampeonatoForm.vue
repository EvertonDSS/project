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
        <FormSelectSearchable
          label="Campeonato"
          v-model="formData.campeonatoId"
          :options="campeonatoOptions"
          :disabled="loading"
          required
          icon="TrophyIcon"
          placeholder="Digite o nome do campeonato..."
        />
        
        <div class="flex items-end space-x-2">
          <div class="flex-1">
            <FormSelectSearchable
              label="Rodada"
              v-model="formData.rodadaId"
              :options="rodadaOptions"
              :disabled="loading"
              required
              icon="PlayIcon"
              placeholder="Digite o nome da rodada..."
            />
          </div>
          <button
            type="button"
            @click="abrirModalAdicionarRodada"
            :disabled="loading"
            class="mb-2 w-8 h-8 bg-green-600 text-white rounded hover:bg-green-700 transition-colors flex items-center justify-center"
            title="Adicionar nova rodada"
          >
            <PlusIcon class="w-5 h-5" />
          </button>
        </div>
        
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
          :max="100"
        />
        
        <div class="flex items-end space-x-2">
          <div class="flex-1">
            <FormSelectSearchable
              label="Tipo de Rodada"
              v-model="formData.tipoId"
              :options="tipoRodadaOptions"
              :disabled="loading"
              required
              icon="TagIcon"
              placeholder="Digite o nome do tipo..."
            />
          </div>
          <button
            type="button"
            @click="abrirModalTipoRodada"
            :disabled="loading"
            class="mb-2 w-8 h-8 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors flex items-center justify-center"
            title="Criar novo tipo de rodada"
          >
            <PlusIcon class="w-5 h-5" />
          </button>
        </div>
        
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

    <!-- Modal para adicionar rodada -->
    <ModalAdicionarRodada
      :isOpen="showModalAdicionarRodada"
      @close="fecharModalAdicionarRodada"
      @adicionar="adicionarNovaRodada"
    />

    <!-- Modal para criar tipo de rodada -->
    <ModalTipoRodada
      :isOpen="showModalTipoRodada"
      @close="fecharModalTipoRodada"
      @criar="criarTipoRodada"
    />
  </div>
</template>

<script setup>
import { PaperAirplaneIcon, PlusIcon, CogIcon } from '@heroicons/vue/24/outline'

const emit = defineEmits(['rodadaCampeonatoSubmitted'])

const { getCampeonatos, getRodadas, postRodada, getTiposRodada, postTipoRodada } = useApi()

const formData = ref({
  campeonatoId: '',
  rodadaId: '',
  valorRodada: '',
  porcentagem: '',
  tipoId: ''
})

const campeonatoOptions = ref([])
const rodadaOptions = ref([])
const tipoRodadaOptions = ref([])
const loading = ref(false)

// Estados dos modais
const showModalAdicionarRodada = ref(false)
const showModalTipoRodada = ref(false)

// Carregar dados quando o componente for montado
onMounted(async () => {
  await loadFormData()
  
  // Escutar evento de nova rodada adicionada
  window.addEventListener('rodada-adicionada', handleNovaRodadaAdicionada)
})

// Limpar listener quando componente for desmontado
onUnmounted(() => {
  window.removeEventListener('rodada-adicionada', handleNovaRodadaAdicionada)
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
    await loadRodadas()
    
    // Carregar tipos de rodada
    await loadTiposRodada()
  } catch (err) {
    console.error('Erro ao carregar dados:', err)
  } finally {
    loading.value = false
  }
}

const loadRodadas = async () => {
  try {
    const rodadas = await getRodadas()
    rodadaOptions.value = rodadas.map(rodada => ({
      value: rodada.id,
      label: rodada.nomeRodada
    }))
  } catch (err) {
    console.error('Erro ao carregar rodadas:', err)
  }
}

const loadTiposRodada = async () => {
  try {
    const tipos = await getTiposRodada()
    tipoRodadaOptions.value = tipos.map(tipo => ({
      value: tipo.id,
      label: tipo.nome
    }))
  } catch (err) {
    console.error('Erro ao carregar tipos de rodada:', err)
  }
}

const handleNovaRodadaAdicionada = async () => {
  console.log('Nova rodada adicionada, recarregando lista de rodadas...')
  await loadRodadas()
}

const isFormValid = computed(() => {
  return formData.value.campeonatoId !== '' && 
         formData.value.rodadaId !== '' && 
         formData.value.valorRodada !== '' && 
         formData.value.porcentagem !== '' &&
         formData.value.tipoId !== ''
})

// Funções dos modais
const abrirModalAdicionarRodada = () => {
  showModalAdicionarRodada.value = true
}

const abrirModalTipoRodada = () => {
  showModalTipoRodada.value = true
}

const fecharModalAdicionarRodada = () => {
  showModalAdicionarRodada.value = false
}

const fecharModalTipoRodada = () => {
  showModalTipoRodada.value = false
}

const adicionarNovaRodada = async (nomeRodada) => {
  try {
    await postRodada({ nomeRodada })
    await loadRodadas()
    // Emitir evento global para atualizar selects de rodadas
    await nextTick()
    window.dispatchEvent(new CustomEvent('rodada-adicionada'))
    showModalAdicionarRodada.value = false
  } catch (error) {
    console.error('Erro ao adicionar rodada:', error)
  }
}

const criarTipoRodada = async (tipoRodada) => {
  try {
    await postTipoRodada(tipoRodada)
    await loadTiposRodada()
    // Emitir evento global para atualizar selects de tipos de rodada
    await nextTick()
    window.dispatchEvent(new CustomEvent('tipo-rodada-adicionado'))
    showModalTipoRodada.value = false
  } catch (error) {
    console.error('Erro ao criar tipo de rodada:', error)
  }
}

const submitRodadaCampeonato = () => {
  if (!isFormValid.value) return

  const rodadaCampeonato = {
    id: Date.now().toString(),
    campeonatoId: parseInt(formData.value.campeonatoId),
    rodadaId: parseInt(formData.value.rodadaId),
    valorRodada: parseFloat(formData.value.valorRodada),
    porcentagem: parseFloat(formData.value.porcentagem),
    tipoId: parseInt(formData.value.tipoId)
  }

  emit('rodadaCampeonatoSubmitted', rodadaCampeonato)
  
  // Reset form
  formData.value.campeonatoId = ''
  formData.value.rodadaId = ''
  formData.value.valorRodada = ''
  formData.value.porcentagem = ''
  formData.value.tipoId = ''
}
</script>
