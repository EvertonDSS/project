<template>
  <div class="min-h-screen">
    <main class="container mx-auto px-4 py-8">
      <CavaloForm @cavalo-submitted="handleCavaloSubmission" />
      
      <!-- Loading dos cavalos -->
      <div v-if="loadingCavalos" class="text-center py-8">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-4"></div>
        <p class="text-neutral-600">Carregando cavalos...</p>
      </div>
      
      <!-- Erro ao carregar cavalos -->
      <div v-if="errorCavalos" class="text-center py-8">
        <div class="bg-red-50 border border-red-200 rounded-lg p-4 max-w-md mx-auto">
          <p class="text-red-700 mb-3">{{ errorCavalos }}</p>
          <button 
            @click="loadCavalos" 
            class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            Tentar novamente
          </button>
        </div>
      </div>
      
      <!-- Lista de cavalos -->
      <CavaloResults v-if="submittedCavalos.length > 0 && !loadingCavalos" :cavalos="submittedCavalos" />
      
      <!-- Mensagem quando não há cavalos -->
      <div v-if="submittedCavalos.length === 0 && !loadingCavalos && !errorCavalos" class="text-center py-12">
        <div class="text-neutral-400 mb-4">
          <svg class="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
          </svg>
        </div>
        <h3 class="text-lg font-semibold text-neutral-600 mb-2">Nenhum cavalo encontrado</h3>
        <p class="text-neutral-500">Cadastre o primeiro cavalo usando o formulário acima.</p>
      </div>
    </main>
  </div>
</template>

<script setup>
const { getCavalos, postCavalo } = useApi()
const submittedCavalos = ref([])
const loadingCavalos = ref(false)
const errorCavalos = ref('')

// Carregar cavalos do backend quando o componente for montado
onMounted(async () => {
  await loadCavalos()
})

const loadCavalos = async () => {
  loadingCavalos.value = true
  errorCavalos.value = ''
  
  try {
    const cavalos = await getCavalos()
    submittedCavalos.value = cavalos.map(cavalo => ({
      id: cavalo.id.toString(),
      nome: cavalo.nome
    }))
  } catch (err) {
    errorCavalos.value = 'Erro ao carregar cavalos do servidor.'
    console.error('Erro ao carregar cavalos:', err)
  } finally {
    loadingCavalos.value = false
  }
}

const handleCavaloSubmission = async (cavalo) => {
  try {
    // Enviar para o backend
    await postCavalo({ nome: cavalo.nome })
    
    // Adicionar novo cavalo no início da lista
    submittedCavalos.value.unshift(cavalo)
    
    // Recarregar cavalos do backend para garantir sincronização
    await loadCavalos()
  } catch (error) {
    console.error('Erro ao cadastrar cavalo:', error)
    errorCavalos.value = 'Erro ao cadastrar cavalo. Tente novamente.'
  }
}
</script>
