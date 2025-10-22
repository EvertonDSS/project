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
            <DialogPanel class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-6xl">
              <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div class="sm:flex sm:items-start">
                  <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                    <PencilSquareIcon class="h-6 w-6 text-blue-600" aria-hidden="true" />
                  </div>
                  <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <DialogTitle as="h3" class="text-lg leading-6 font-medium text-neutral-900">
                      Editar Apostas - {{ apostador?.nome }}
                    </DialogTitle>
                    <p class="text-sm text-neutral-500 mt-1">
                      {{ campeonato?.nome }} - {{ campeonato?.ano }}
                    </p>

                    <!-- Loading -->
                    <div v-if="loading" class="text-center py-8">
                      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                      <p class="text-neutral-600">Carregando apostas...</p>
                    </div>

                    <!-- Erro -->
                    <div v-if="erro" class="bg-red-50 border border-red-200 rounded-lg p-4 mt-4">
                      <p class="text-red-700 text-sm">{{ erro }}</p>
                    </div>

                    <!-- Lista de Apostas -->
                    <div v-if="!loading && !erro && apostas.length > 0" class="mt-4 space-y-3 max-h-[65vh] overflow-y-auto">
                      <div
                        v-for="aposta in apostas"
                        :key="aposta.id"
                        class="border rounded-lg p-4 bg-neutral-50 hover:bg-neutral-100 transition-colors"
                      >
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <!-- Informações da Aposta -->
                          <div class="space-y-2">
                            <div class="flex items-start justify-between">
                              <div class="flex-1">
                                <h4 class="font-semibold text-neutral-800 flex items-center space-x-2">
                                  <span class="text-blue-600">#{{ aposta.id }}</span>
                                  <span>{{ aposta.rodadas?.rodada?.nomeRodada || 'N/A' }}</span>
                                </h4>
                                <p class="text-sm text-neutral-600 mt-1">
                                  Tipo: {{ getTipoNome(aposta.rodadas?.tipoId) }}
                                </p>
                              </div>
                              <button
                                v-if="!apostaEditando || apostaEditando.id !== aposta.id"
                                @click="iniciarEdicao(aposta)"
                                class="text-blue-600 hover:text-blue-700 text-sm flex items-center space-x-1"
                              >
                                <PencilIcon class="w-4 h-4" />
                                <span>Editar</span>
                              </button>
                            </div>

                            <div class="text-sm space-y-1">
                              <p class="text-neutral-700">
                                <span class="font-medium">Cavalos:</span> {{ aposta.cavalos }}
                              </p>
                              <p class="text-neutral-700">
                                <span class="font-medium">Grupo:</span> {{ aposta.grupoId }}
                              </p>
                              <p class="text-neutral-700">
                                <span class="font-medium">Rodada:</span> R$ {{ Number(aposta.rodadas?.valorRodada || 0).toFixed(2) }}
                              </p>
                            </div>
                          </div>

                          <!-- Valores Editáveis -->
                          <div v-if="apostaEditando?.id === aposta.id" class="space-y-3">
                            <div>
                              <label class="block text-sm font-medium text-neutral-700 mb-1">
                                Valor Unitário
                              </label>
                              <input
                                v-model="apostaEditando.valorUnitario"
                                type="number"
                                step="0.01"
                                class="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              />
                            </div>
                            <div>
                              <label class="block text-sm font-medium text-neutral-700 mb-1">
                                Porcentagem (%)
                              </label>
                              <input
                                v-model="apostaEditando.porcentagem"
                                type="number"
                                step="0.01"
                                max="100"
                                class="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              />
                            </div>
                            <div class="flex space-x-2">
                              <button
                                @click="salvarEdicao"
                                :disabled="salvando"
                                class="flex-1 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                              >
                                {{ salvando ? 'Salvando...' : 'Salvar' }}
                              </button>
                              <button
                                @click="cancelarEdicao"
                                :disabled="salvando"
                                class="flex-1 px-3 py-2 bg-neutral-600 text-white rounded-lg hover:bg-neutral-700 transition-colors disabled:opacity-50"
                              >
                                Cancelar
                              </button>
                            </div>
                          </div>

                          <!-- Valores Somente Leitura -->
                          <div v-else class="space-y-2">
                            <div class="bg-white rounded-lg p-3 border border-neutral-200">
                              <p class="text-xs text-neutral-500">Valor Unitário</p>
                              <p class="text-lg font-bold text-neutral-800">
                                R$ {{ Number(aposta.valorUnitario || 0).toFixed(2) }}
                              </p>
                            </div>
                            <div class="bg-white rounded-lg p-3 border border-neutral-200">
                              <p class="text-xs text-neutral-500">Porcentagem</p>
                              <p class="text-lg font-bold text-blue-600">
                                {{ Number(aposta.porcentagem || 0).toFixed(2) }}%
                              </p>
                            </div>
                            <div class="bg-blue-50 rounded-lg p-3 border border-blue-200">
                              <p class="text-xs text-blue-600">Total</p>
                              <p class="text-xl font-bold text-blue-700">
                                R$ {{ Number(aposta.total || 0).toFixed(2) }}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <!-- Mensagem quando não há apostas -->
                    <div v-if="!loading && !erro && apostas.length === 0" class="text-center py-8">
                      <p class="text-neutral-600">Nenhuma aposta encontrada</p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Botões de Ação -->
              <div class="bg-neutral-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  :disabled="salvando"
                  @click="fecharModal"
                  class="w-full inline-flex justify-center rounded-md border border-neutral-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-neutral-700 hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:w-auto sm:text-sm"
                >
                  Fechar
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
import { ref, watch } from 'vue'
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue'
import { PencilSquareIcon, PencilIcon } from '@heroicons/vue/24/outline'

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true
  },
  campeonato: {
    type: Object,
    required: true
  },
  apostador: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['close', 'aposta-atualizada'])

const { getTodasApostasPorApostador, putAposta, getTiposRodada } = useApi()

const loading = ref(false)
const salvando = ref(false)
const erro = ref('')
const apostas = ref([])
const tipos = ref([])
const apostaEditando = ref(null)

// Carregar apostas quando modal abrir
watch(() => props.isOpen, async (isOpen) => {
  if (isOpen) {
    await carregarDados()
  } else {
    resetarModal()
  }
})

const carregarDados = async () => {
  if (!props.campeonato?.id || !props.apostador?.id) return

  loading.value = true
  erro.value = ''

  try {
    const [tiposData, apostasData] = await Promise.all([
      getTiposRodada(),
      getTodasApostasPorApostador(props.campeonato.id, props.apostador.id)
    ])

    tipos.value = tiposData
    apostas.value = apostasData
  } catch (error) {
    console.error('Erro ao carregar dados:', error)
    erro.value = 'Erro ao carregar apostas. Tente novamente.'
  } finally {
    loading.value = false
  }
}

const getTipoNome = (tipoId) => {
  const tipo = tipos.value.find(t => t.id === tipoId)
  return tipo?.nome || 'Não definido'
}

const iniciarEdicao = (aposta) => {
  apostaEditando.value = {
    id: aposta.id,
    valorUnitario: Number(aposta.valorUnitario || 0),
    porcentagem: Number(aposta.porcentagem || 0)
  }
}

const cancelarEdicao = () => {
  apostaEditando.value = null
}

const salvarEdicao = async () => {
  if (!apostaEditando.value) return

  salvando.value = true
  erro.value = ''

  try {
    const dados = {
      valorUnitario: parseFloat(apostaEditando.value.valorUnitario),
      porcentagem: parseFloat(apostaEditando.value.porcentagem)
    }

    await putAposta(apostaEditando.value.id, dados)
    await carregarDados()
    
    apostaEditando.value = null
    emit('aposta-atualizada')
  } catch (error) {
    console.error('Erro ao salvar aposta:', error)
    erro.value = 'Erro ao salvar alterações. Tente novamente.'
  } finally {
    salvando.value = false
  }
}

const resetarModal = () => {
  apostas.value = []
  tipos.value = []
  apostaEditando.value = null
  erro.value = ''
}

const fecharModal = () => {
  if (!salvando.value) {
    emit('close')
  }
}
</script>

