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
      <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
        <form @submit.prevent="submitForm">
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="sm:flex sm:items-start">
              <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                <CogIcon class="h-6 w-6 text-blue-600" aria-hidden="true" />
              </div>
              <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                <h3 class="text-lg leading-6 font-medium text-neutral-900" id="modal-title">
                  Criar Tipo de Rodada
                </h3>
                <div class="mt-4">
                  <FormInput
                    label="Nome do Tipo"
                    type="text"
                    v-model="formData.nome"
                    required
                    icon="TagIcon"
                    placeholder="Ex: FINAL, ELIMINATÓRIA, CLASSIFICATÓRIA"
                    ref="inputRef"
                  />
                  <p class="mt-2 text-sm text-neutral-500">
                    Exemplo: "FINAL" será salvo como {"nome": "FINAL"}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div class="bg-neutral-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="submit"
              :disabled="!isFormValid || loading"
              class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span v-if="loading">Criando...</span>
              <span v-else>Criar</span>
            </button>
            <button
              type="button"
              @click="$emit('close')"
              class="mt-3 w-full inline-flex justify-center rounded-md border border-neutral-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-neutral-700 hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, nextTick } from 'vue'
import { CogIcon } from '@heroicons/vue/24/outline'

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close', 'criar'])

const formData = ref({
  nome: ''
})

const loading = ref(false)
const inputRef = ref(null)

const isFormValid = computed(() => {
  return formData.value.nome.trim() !== ''
})

const submitForm = async () => {
  if (!isFormValid.value || loading.value) return

  loading.value = true
  try {
    await emit('criar', {
      nome: formData.value.nome.trim()
    })
    formData.value.nome = ''
  } catch (error) {
    console.error('Erro ao criar tipo de rodada:', error)
  } finally {
    loading.value = false
  }
}

// Focus no input quando modal abrir
watch(() => props.isOpen, async (newValue) => {
  if (newValue) {
    await nextTick()
    if (inputRef.value && inputRef.value.$refs && inputRef.value.$refs.input) {
      inputRef.value.$refs.input.focus()
    }
  }
})
</script>
