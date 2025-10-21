<template>
  <div class="animate-slide-up">
    <div class="text-center mb-6">
      <h3 class="text-xl font-bold text-neutral-800 mb-2">Apostadores do Campeonato</h3>
      <p class="text-neutral-600 text-sm">{{ campeonato.nome }} - {{ campeonato.ano }}</p>
      
      <!-- Botões de gerenciamento -->
      <div class="mt-4 flex items-center justify-center space-x-3">
        <button 
          @click="abrirModalCavalos"
          class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors flex items-center space-x-2"
        >
          <CogIcon class="w-4 h-4" />
          <span>Gerenciar Cavalos</span>
        </button>
        
        <button 
          @click="abrirModalFinalistas"
          class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <TrophyIcon class="w-4 h-4" />
          <span>Selecionar Finalistas</span>
        </button>
      </div>
    </div>
    
    <div class="space-y-3 max-h-96 overflow-y-auto">
      <div
        v-for="(apostador, index) in apostadores"
        :key="apostador.id"
        class="card p-4 hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 cursor-pointer"
        :style="{ animationDelay: `${index * 50}ms` }"
        @click="handleApostadorClick(apostador)"
      >
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center">
              <UserIcon class="w-5 h-5 text-white" />
            </div>
            <div>
              <h4 class="font-semibold text-neutral-800">{{ apostador.nome }}</h4>
              <p class="text-xs text-neutral-500">Clique para ver apostas</p>
            </div>
          </div>
          <ChevronRightIcon class="w-5 h-5 text-neutral-400" />
        </div>
      </div>
    </div>
    
    <!-- Botão para voltar -->
    <div class="mt-6 text-center">
      <button 
        @click="voltar"
        class="px-4 py-2 bg-neutral-600 text-white rounded hover:bg-neutral-700 transition-colors"
      >
        Voltar aos Campeonatos
      </button>
    </div>

    <!-- Modal para gerenciar cavalos -->
    <ModalGerenciarCavalos
      :isOpen="showModalCavalos"
      :campeonato="campeonato"
      @close="fecharModalCavalos"
      @cavalos-adicionados="handleCavalosAdicionados"
    />

    <!-- Modal para selecionar finalistas -->
    <ModalSelecionarFinalistas
      :isOpen="showModalFinalistas"
      :campeonato="campeonato"
      @close="fecharModalFinalistas"
      @finalistas-salvos="handleFinalistasSalvos"
    />
  </div>
</template>

<script setup>
import { UserIcon, ChevronRightIcon, CogIcon, TrophyIcon } from '@heroicons/vue/24/outline'

defineProps({
  campeonato: Object,
  apostadores: Array
})

const emit = defineEmits(['apostadorClicked', 'voltar', 'cavalosAdicionados', 'finalistasSalvos'])

const showModalCavalos = ref(false)
const showModalFinalistas = ref(false)

const handleApostadorClick = (apostador) => {
  emit('apostadorClicked', apostador)
}

const voltar = () => {
  emit('voltar')
}

const abrirModalCavalos = () => {
  showModalCavalos.value = true
}

const fecharModalCavalos = () => {
  showModalCavalos.value = false
}

const handleCavalosAdicionados = (cavalos) => {
  emit('cavalosAdicionados', cavalos)
  fecharModalCavalos()
}

const abrirModalFinalistas = () => {
  showModalFinalistas.value = true
}

const fecharModalFinalistas = () => {
  showModalFinalistas.value = false
}

const handleFinalistasSalvos = () => {
  emit('finalistasSalvos')
  fecharModalFinalistas()
}
</script>
