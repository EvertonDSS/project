<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 z-50 overflow-y-auto"
    aria-labelledby="modal-title"
    role="dialog"
    aria-modal="true"
  >
    <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      <!-- Background overlay -->
      <div
        class="fixed inset-0 bg-neutral-500 bg-opacity-75 transition-opacity"
        aria-hidden="true"
        @click="$emit('close')"
      ></div>

      <!-- Center the modal -->
      <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

      <!-- Modal panel -->
      <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
        <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
          <div class="sm:flex sm:items-start">
            <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-green-100 sm:mx-0 sm:h-10 sm:w-10">
              <CogIcon class="h-6 w-6 text-green-600" aria-hidden="true" />
            </div>
            <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
              <h3 class="text-lg leading-6 font-medium text-neutral-900" id="modal-title">
                Gerenciar Cavalos - {{ campeonato.nome }}
              </h3>
              <p class="text-sm text-neutral-500 mt-1">
                Adicione cavalos ao campeonato. Use Enter para adicionar mais cavalos.
              </p>
              
              <!-- Lista de cavalos atuais -->
              <div v-if="cavalosAtuais.length > 0" class="mt-4">
                <h4 class="text-sm font-medium text-neutral-700 mb-2">Cavalos atuais no campeonato:</h4>
                <div class="bg-neutral-50 rounded-lg p-3 max-h-32 overflow-y-auto">
                  <div v-for="cavalo in cavalosAtuais" :key="cavalo.pareo" class="flex items-center justify-between text-sm py-1">
                    <span>{{ cavalo.pareo }} - {{ cavalo.cavalos }}</span>
                  </div>
                </div>
              </div>
              
              <!-- Formulário de adição de cavalos -->
              <div class="mt-6">
                <h4 class="text-sm font-medium text-neutral-700 mb-3">Adicionar novos cavalos:</h4>
                
                <div v-for="(linha, index) in linhasCavalos" :key="index" class="mb-4 p-3 border border-neutral-200 rounded-lg">
                  <div class="flex items-center justify-between mb-2">
                    <span class="text-sm font-medium text-neutral-700">Páreo {{ linha.numeroPareo }}</span>
                    <button
                      v-if="linhasCavalos.length > 1"
                      @click="removerLinha(index)"
                      type="button"
                      class="px-2 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
                    >
                      Remover Páreo
                    </button>
                  </div>
                  
                  <!-- Lista de cavalos selecionados nesta linha -->
                  <div v-if="linha.cavalosSelecionados.length > 0" class="mb-3">
                    <div class="flex flex-wrap gap-2">
                      <div 
                        v-for="(cavalo, cavaloIndex) in linha.cavalosSelecionados" 
                        :key="cavaloIndex"
                        class="flex items-center space-x-1 bg-green-100 text-green-800 px-2 py-1 rounded text-sm"
                      >
                        <span>{{ cavalo.label }}</span>
                        <button
                          @click="removerCavaloDaLinha(index, cavaloIndex)"
                          type="button"
                          class="text-green-600 hover:text-green-800"
                        >
                          ×
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <!-- Select para adicionar cavalo à linha -->
                  <div class="flex items-center space-x-2">
                    <div class="flex-1">
                      <FormSelectSearchable
                        v-model="linha.cavaloSelecionado"
                        :options="cavalosDisponiveisParaLinha(index)"
                        placeholder="Selecione um cavalo para adicionar..."
                        @update:modelValue="adicionarCavaloALinha(index)"
                        ref="selectRefs"
                      />
                    </div>
                    <button
                      @click="adicionarProximaLinha(index)"
                      type="button"
                      class="px-3 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                    >
                      Novo Páreo
                    </button>
                  </div>
                </div>
                
                <!-- Botão para adicionar mais páreos -->
                <button
                  @click="adicionarNovaLinha"
                  type="button"
                  class="mt-2 px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                >
                  + Adicionar mais páreos
                </button>
              </div>
            </div>
          </div>
        </div>
        <div class="bg-neutral-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
          <button
            type="button"
            @click="adicionarCavalos"
            :disabled="!podeAdicionar || loading"
            class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="loading">Adicionando...</span>
            <span v-else>Adicionar Cavalos</span>
          </button>
          <button
            type="button"
            @click="$emit('close')"
            class="mt-3 w-full inline-flex justify-center rounded-md border border-neutral-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-neutral-700 hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, nextTick, watch } from 'vue'
import { CogIcon } from '@heroicons/vue/24/outline'

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  campeonato: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['close', 'cavalosAdicionados'])

const { getCavalos, getCavalosPorCampeonato, postCavalosCampeonato } = useApi()

// Estados
const cavaloOptions = ref([])
const cavalosAtuais = ref([])
const loading = ref(false)
const selectRefs = ref([])

// Linhas de cavalos para adicionar
const linhasCavalos = ref([
  {
    numeroPareo: '01',
    cavaloSelecionado: '',
    cavalosSelecionados: []
  }
])

// Computed
const podeAdicionar = computed(() => {
  return linhasCavalos.value.some(linha => linha.cavalosSelecionados.length > 0) && !loading.value
})

// Função para obter cavalos disponíveis para uma linha (excluindo já selecionados)
const cavalosDisponiveisParaLinha = (linhaIndex) => {
  const linha = linhasCavalos.value[linhaIndex]
  const cavalosJaSelecionados = linha.cavalosSelecionados.map(c => c.value)
  
  return cavaloOptions.value.filter(cavalo => !cavalosJaSelecionados.includes(cavalo.value))
}

// Watchers
watch(() => props.isOpen, async (newValue) => {
  if (newValue) {
    await carregarDados()
    resetarFormulario()
  }
})

// Funções
const carregarDados = async () => {
  try {
    // Carregar todos os cavalos disponíveis
    const cavalos = await getCavalos()
    cavaloOptions.value = cavalos.map(cavalo => ({
      value: cavalo.id,
      label: cavalo.nome
    }))
    
    // Carregar cavalos já adicionados ao campeonato
    const cavalosCampeonato = await getCavalosPorCampeonato(props.campeonato.id)
    cavalosAtuais.value = cavalosCampeonato
  } catch (error) {
    console.error('Erro ao carregar dados:', error)
  }
}

const resetarFormulario = () => {
  linhasCavalos.value = [
    {
      numeroPareo: '01',
      cavaloSelecionado: '',
      cavalosSelecionados: []
    }
  ]
}

const adicionarNovaLinha = () => {
  const proximoNumero = String(linhasCavalos.value.length + 1).padStart(2, '0')
  linhasCavalos.value.push({
    numeroPareo: proximoNumero,
    cavaloSelecionado: '',
    cavalosSelecionados: []
  })
}

const adicionarProximaLinha = (indexAtual) => {
  adicionarNovaLinha()
  nextTick(() => {
    // Focar no próximo select
    if (selectRefs.value && selectRefs.value[indexAtual + 1]) {
      selectRefs.value[indexAtual + 1].focus()
    }
  })
}

const removerLinha = (index) => {
  linhasCavalos.value.splice(index, 1)
  
  // Renumerar as linhas
  linhasCavalos.value.forEach((linha, index) => {
    linha.numeroPareo = String(index + 1).padStart(2, '0')
  })
}

// Função para adicionar cavalo a uma linha específica
const adicionarCavaloALinha = (linhaIndex) => {
  const linha = linhasCavalos.value[linhaIndex]
  const cavaloSelecionado = linha.cavaloSelecionado
  
  if (cavaloSelecionado && !linha.cavalosSelecionados.find(c => c.value === cavaloSelecionado)) {
    const cavalo = cavaloOptions.value.find(c => c.value === cavaloSelecionado)
    if (cavalo) {
      linha.cavalosSelecionados.push(cavalo)
      linha.cavaloSelecionado = '' // Limpar seleção
    }
  }
}

// Função para remover cavalo de uma linha específica
const removerCavaloDaLinha = (linhaIndex, cavaloIndex) => {
  linhasCavalos.value[linhaIndex].cavalosSelecionados.splice(cavaloIndex, 1)
}

const adicionarCavalos = async () => {
  if (!podeAdicionar.value) return
  
  loading.value = true
  
  try {
    // Coletar todos os cavalos selecionados de todas as linhas
    const cavalosSelecionados = []
    
    linhasCavalos.value.forEach(linha => {
      linha.cavalosSelecionados.forEach(cavalo => {
        cavalosSelecionados.push({
          cavaloId: parseInt(cavalo.value),
          numeroPareo: linha.numeroPareo
        })
      })
    })
    
    if (cavalosSelecionados.length === 0) {
      return
    }
    
    const dados = {
      campeonatoId: props.campeonato.id,
      cavalos: cavalosSelecionados
    }
    
    await postCavalosCampeonato(dados)
    
    // Emitir evento de sucesso
    emit('cavalosAdicionados', cavalosSelecionados)
    
    // Recarregar dados
    await carregarDados()
    resetarFormulario()
    
  } catch (error) {
    console.error('Erro ao adicionar cavalos:', error)
  } finally {
    loading.value = false
  }
}
</script>
