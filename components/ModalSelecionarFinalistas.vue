<template>
  <TransitionRoot as="template" :show="isOpen">
    <Dialog as="div" class="relative z-50" @close="fecharModal">
      <TransitionChild
        as="template"
        enter="ease-out duration-300"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="ease-in duration-200"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-neutral-500 bg-opacity-75 transition-opacity" />
      </TransitionChild>

      <div class="fixed inset-0 z-50 overflow-y-auto">
        <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <TransitionChild
            as="template"
            enter="ease-out duration-300"
            enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enter-to="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leave-from="opacity-100 translate-y-0 sm:scale-100"
            leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <DialogPanel class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-4xl">
              <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div class="sm:flex sm:items-start">
                  <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                    <TrophyIcon class="h-6 w-6 text-blue-600" aria-hidden="true" />
                  </div>
                  <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <DialogTitle as="h3" class="text-lg leading-6 font-medium text-neutral-900">
                      Selecionar Finalistas - {{ campeonato.nome }}
                    </DialogTitle>
                    <p class="text-sm text-neutral-500 mt-1">
                      {{ tipoSelecionado ? `Selecione os finalistas para: ${tipoSelecionado.tipoNome}` : 'Selecione um tipo de rodada' }}
                    </p>

                    <!-- Loading -->
                    <div v-if="loading" class="text-center py-8">
                      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                      <p class="text-neutral-600">{{ loadingMessage }}</p>
                    </div>

                    <!-- Erro -->
                    <div v-if="erro" class="bg-red-50 border border-red-200 rounded-lg p-4 mt-4">
                      <p class="text-red-700 text-sm">{{ erro }}</p>
                    </div>

                    <!-- Etapa 1: Seleção de Tipo -->
                    <div v-if="!loading && !erro && !tipoSelecionado && tipos.length > 0" class="mt-4">
                      <h4 class="text-sm font-medium text-neutral-700 mb-3">Escolha o tipo de rodada:</h4>
                      <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
                        <button
                          v-for="tipo in tipos"
                          :key="tipo.tipoId"
                          @click="selecionarTipo(tipo)"
                          class="p-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all transform hover:scale-105 shadow-md hover:shadow-lg flex flex-col items-center justify-center space-y-2"
                        >
                          <TagIcon class="w-6 h-6" />
                          <span class="font-semibold text-center">{{ tipo.tipoNome }}</span>
                          <span class="text-xs opacity-90">{{ tipo.cavalos.length }} cavalos</span>
                        </button>
                      </div>
                    </div>

                    <!-- Etapa 2: Seleção de Cavalos -->
                    <div v-if="!loading && !erro && tipoSelecionado" class="mt-4">
                      <!-- Botão para voltar -->
                      <button
                        @click="voltarParaTipos"
                        class="mb-4 flex items-center space-x-2 text-blue-600 hover:text-blue-700 text-sm"
                      >
                        <ArrowLeftIcon class="w-4 h-4" />
                        <span>Voltar para tipos</span>
                      </button>

                      <!-- Informação sobre finalistas carregados -->
                      <div v-if="cavalosSelecionadosDoTipo.length > 0" class="mb-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <p class="text-sm text-blue-800">
                          ✓ {{ cavalosSelecionadosDoTipo.length }} finalista(s) atual(is) carregado(s) e pré-selecionado(s)
                        </p>
                      </div>
                      <div v-else class="mb-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <p class="text-sm text-yellow-800">
                          ℹ Nenhum finalista atual encontrado para este tipo
                        </p>
                      </div>

                      <!-- Lista de Cavalos -->
                      <div v-if="tipoSelecionado.cavalos.length > 0" class="space-y-2 max-h-96 overflow-y-auto">
                        <div
                          v-for="cavalo in tipoSelecionado.cavalos"
                          :key="`${cavalo.cavaloId}-${cavalo.grupoId}`"
                          class="flex items-center justify-between p-3 bg-neutral-50 border rounded-lg hover:border-blue-300 transition-colors cursor-pointer"
                          :class="{ 'border-blue-500 bg-blue-50': isCavaloSelecionado(cavalo.cavaloId, cavalo.grupoId) }"
                          @click="toggleCavalo(cavalo)"
                        >
                          <div class="flex items-center space-x-3">
                            <input
                              type="checkbox"
                              :checked="isCavaloSelecionado(cavalo.cavaloId, cavalo.grupoId)"
                              class="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                              @click.stop="toggleCavalo(cavalo)"
                            />
                            <div>
                              <p class="font-medium text-neutral-800">{{ cavalo.cavaloNome }}</p>
                              <p class="text-xs text-neutral-500">
                                Pareo: {{ cavalo.numeroPareo }} | Grupo: {{ cavalo.grupoId }} | Valor Total: R$ {{ cavalo.valorTotal }}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div v-else class="text-center py-8 text-neutral-500">
                        Nenhum cavalo disponível para este tipo
                      </div>

                      <!-- Resumo de Seleções -->
                      <div v-if="cavalosSelecionadosDoTipo.length > 0" class="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                        <p class="text-sm font-medium text-green-800">
                          {{ cavalosSelecionadosDoTipo.length }} cavalo(s) selecionado(s)
                        </p>
                      </div>
                    </div>

                    <!-- Mensagem quando não há tipos -->
                    <div v-if="!loading && !erro && tipos.length === 0" class="text-center py-8">
                      <p class="text-neutral-600">Nenhum tipo encontrado para este campeonato</p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Botões de Ação -->
              <div class="bg-neutral-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  v-if="tipoSelecionado"
                  type="button"
                  :disabled="loading || salvando"
                  @click="salvarFinalistas"
                  class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {{ salvando ? 'Salvando...' : 'Salvar Finalistas' }}
                </button>
                <button
                  type="button"
                  :disabled="salvando"
                  @click="fecharModal"
                  class="mt-3 w-full inline-flex justify-center rounded-md border border-neutral-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-neutral-700 hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  {{ tipoSelecionado ? 'Cancelar' : 'Fechar' }}
                </button>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue'
import { TrophyIcon, TagIcon, ArrowLeftIcon } from '@heroicons/vue/24/outline'

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true
  },
  campeonato: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['close', 'finalistas-salvos'])

const { getTiposPorCampeonato, getFinalistasCampeonato, putFinalistasCampeonato } = useApi()

const loading = ref(false)
const loadingMessage = ref('Carregando...')
const salvando = ref(false)
const erro = ref('')
const tipos = ref([])
const tipoSelecionado = ref(null)
const finalistasAtuais = ref([])
const cavalosSelecionados = ref([])

// Computed para cavalos selecionados do tipo atual
const cavalosSelecionadosDoTipo = computed(() => {
  if (!tipoSelecionado.value) return []
  return cavalosSelecionados.value.filter(c => c.tipoId === tipoSelecionado.value.tipoId)
})

// Carregar tipos quando modal abrir
watch(() => props.isOpen, async (isOpen) => {
  if (isOpen) {
    await carregarTipos()
  } else {
    // Resetar ao fechar
    resetarModal()
  }
})

const carregarTipos = async () => {
  if (!props.campeonato?.id) return

  loading.value = true
  loadingMessage.value = 'Carregando tipos...'
  erro.value = ''
  
  try {
    tipos.value = await getTiposPorCampeonato(props.campeonato.id)
  } catch (error) {
    console.error('Erro ao carregar tipos:', error)
    erro.value = 'Erro ao carregar tipos. Tente novamente.'
  } finally {
    loading.value = false
  }
}

const selecionarTipo = async (tipo) => {
  tipoSelecionado.value = tipo
  loading.value = true
  loadingMessage.value = 'Carregando finalistas...'
  erro.value = ''

  try {
    // Buscar finalistas atuais do campeonato
    const responseData = await getFinalistasCampeonato(props.campeonato.id)
    
    console.log('=== DEBUG FINALISTAS ===')
    console.log('Resposta da API:', JSON.parse(JSON.stringify(responseData)))
    console.log('Tipo selecionado:', { tipoId: tipo.tipoId, tipoNome: tipo.tipoNome })
    
    // A API retorna um array de objetos com a estrutura: { tipoId, tipoNome, finalistas: [...] }
    // Encontrar o objeto do tipo selecionado
    const tipoData = responseData.find(t => t.tipoId === tipo.tipoId)
    
    console.log('Dados do tipo encontrado:', tipoData)
    
    // Extrair os finalistas de dentro do objeto
    const finalistasDoTipo = tipoData?.finalistas || []
    
    console.log('Finalistas extraídos:', JSON.parse(JSON.stringify(finalistasDoTipo)))
    console.log('Total de finalistas:', finalistasDoTipo.length)
    
    // Limpar seleções anteriores deste tipo
    cavalosSelecionados.value = cavalosSelecionados.value.filter(c => c.tipoId !== tipo.tipoId)
    
    // Adicionar os finalistas atuais como selecionados
    finalistasDoTipo.forEach(finalista => {
      cavalosSelecionados.value.push({
        tipoId: tipo.tipoId, // Usar o tipoId do tipo selecionado
        cavaloId: finalista.cavaloId,
        grupoId: finalista.grupoId
      })
    })
    
    console.log('Cavalos selecionados após carregar:', JSON.parse(JSON.stringify(cavalosSelecionados.value)))
    console.log('=== FIM DEBUG ===')
    
    // Armazenar os dados atualizados
    finalistasAtuais.value = responseData
  } catch (error) {
    console.error('Erro ao carregar finalistas:', error)
    // Não bloquear a exibição dos cavalos se houver erro ao carregar finalistas
    console.warn('Continuando sem finalistas pré-selecionados')
  } finally {
    loading.value = false
  }
}

const voltarParaTipos = () => {
  tipoSelecionado.value = null
  // Manter as seleções feitas
}

const isCavaloSelecionado = (cavaloId, grupoId) => {
  if (!tipoSelecionado.value) return false
  return cavalosSelecionados.value.some(
    c => c.tipoId === tipoSelecionado.value.tipoId && c.cavaloId === cavaloId && c.grupoId === grupoId
  )
}

const toggleCavalo = (cavalo) => {
  if (!tipoSelecionado.value) return

  const index = cavalosSelecionados.value.findIndex(
    c => c.tipoId === tipoSelecionado.value.tipoId && c.cavaloId === cavalo.cavaloId && c.grupoId === cavalo.grupoId
  )

  if (index > -1) {
    // Remover se já está selecionado
    cavalosSelecionados.value.splice(index, 1)
  } else {
    // Adicionar se não está selecionado
    cavalosSelecionados.value.push({
      tipoId: tipoSelecionado.value.tipoId,
      cavaloId: cavalo.cavaloId,
      grupoId: cavalo.grupoId
    })
  }
}

const salvarFinalistas = async () => {
  if (!tipoSelecionado.value) return

  salvando.value = true
  erro.value = ''

  try {
    // Preparar o payload sem tipoId (apenas cavaloId e grupoId)
    const payload = cavalosSelecionadosDoTipo.value.map(finalista => ({
      cavaloId: finalista.cavaloId,
      grupoId: finalista.grupoId
    }))
    
    console.log('Salvando finalistas:', {
      campeonatoId: props.campeonato.id,
      tipoId: tipoSelecionado.value.tipoId,
      payload: JSON.parse(JSON.stringify(payload))
    })
    
    // Enviar com tipoId na URL
    await putFinalistasCampeonato(props.campeonato.id, tipoSelecionado.value.tipoId, payload)
    emit('finalistas-salvos')
    resetarModal()
    emit('close')
  } catch (error) {
    console.error('Erro ao salvar finalistas:', error)
    erro.value = 'Erro ao salvar finalistas. Tente novamente.'
  } finally {
    salvando.value = false
  }
}

const resetarModal = () => {
  tipos.value = []
  tipoSelecionado.value = null
  finalistasAtuais.value = []
  cavalosSelecionados.value = []
  erro.value = ''
}

const fecharModal = () => {
  if (!salvando.value) {
    emit('close')
  }
}
</script>
