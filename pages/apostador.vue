<template>
  <div class="min-h-screen">
    <main class="container mx-auto px-4 py-8">
      <ApostadorForm @apostador-submitted="handleApostadorSubmission" />
      
      <!-- Loading dos apostadores -->
      <div v-if="loadingApostadores" class="text-center py-8">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-4"></div>
        <p class="text-neutral-600">Carregando apostadores...</p>
      </div>
      
      <!-- Erro ao carregar apostadores -->
      <div v-if="errorApostadores" class="text-center py-8">
        <div class="bg-red-50 border border-red-200 rounded-lg p-4 max-w-md mx-auto">
          <p class="text-red-700 mb-3">{{ errorApostadores }}</p>
          <button 
            @click="loadApostadores" 
            class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            Tentar novamente
          </button>
        </div>
      </div>
      
      <!-- Lista de apostadores -->
      <ApostadorResults v-if="submittedApostadores.length > 0 && !loadingApostadores" :apostadores="submittedApostadores" />
      
      <!-- Mensagem quando não há apostadores -->
      <div v-if="submittedApostadores.length === 0 && !loadingApostadores && !errorApostadores" class="text-center py-12">
        <div class="text-neutral-400 mb-4">
          <svg class="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
          </svg>
        </div>
        <h3 class="text-lg font-semibold text-neutral-600 mb-2">Nenhum apostador encontrado</h3>
        <p class="text-neutral-500">Cadastre o primeiro apostador usando o formulário acima.</p>
      </div>
    </main>
  </div>
</template>

<script setup>
const { getApostadores } = useApi()
const submittedApostadores = ref([])
const loadingApostadores = ref(false)
const errorApostadores = ref('')

// Carregar apostadores do backend quando o componente for montado
onMounted(async () => {
  await loadApostadores()
})

const loadApostadores = async () => {
  loadingApostadores.value = true
  errorApostadores.value = ''
  
  try {
    const apostadores = await getApostadores()
    submittedApostadores.value = apostadores.map(apostador => ({
      id: apostador.id.toString(),
      nome: apostador.nome
    }))
  } catch (err) {
    errorApostadores.value = 'Erro ao carregar apostadores do servidor.'
    console.error('Erro ao carregar apostadores:', err)
  } finally {
    loadingApostadores.value = false
  }
}

const handleApostadorSubmission = (apostador) => {
  // Adicionar novo apostador no início da lista
  submittedApostadores.value.unshift(apostador)
  // Recarregar apostadores do backend para garantir sincronização
  loadApostadores()
}
</script>