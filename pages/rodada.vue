<template>
  <div class="min-h-screen">
    <main class="container mx-auto px-4 py-8">
      <div class="text-center mb-8">
        <h1 class="text-4xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent mb-2">
          Rodadas
        </h1>
        <p class="text-neutral-600">Gerencie rodadas e suas associações com campeonatos</p>
      </div>

      <!-- Layout centralizado -->
      <div class="max-w-4xl mx-auto">
        
        <!-- Formulário de Associação de Rodadas -->
        <div class="space-y-6">
          <RodadaCampeonatoForm @rodada-campeonato-submitted="handleRodadaCampeonatoSubmission" />
          
          <!-- Loading das rodadas de campeonato -->
          <div v-if="loadingRodadasCampeonato" class="text-center py-4">
            <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-accent-600 mx-auto mb-2"></div>
            <p class="text-neutral-600 text-sm">Carregando associações...</p>
          </div>
          
          <!-- Erro ao carregar rodadas de campeonato -->
          <div v-if="errorRodadasCampeonato" class="bg-red-50 border border-red-200 rounded-lg p-3">
            <p class="text-red-700 text-sm mb-2">{{ errorRodadasCampeonato }}</p>
            <button 
              @click="loadRodadasCampeonato" 
              class="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition-colors"
            >
              Tentar novamente
            </button>
          </div>
          
          <!-- Lista de rodadas de campeonato -->
          <RodadaCampeonatoResults v-if="submittedRodadasCampeonato.length > 0 && !loadingRodadasCampeonato" :rodadas-campeonato="submittedRodadasCampeonato" />
          
          <!-- Mensagem quando não há rodadas de campeonato -->
          <div v-if="submittedRodadasCampeonato.length === 0 && !loadingRodadasCampeonato && !errorRodadasCampeonato" class="text-center py-8">
            <div class="text-neutral-400 mb-3">
              <svg class="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"></path>
              </svg>
            </div>
            <h3 class="text-sm font-semibold text-neutral-600 mb-1">Nenhuma associação encontrada</h3>
            <p class="text-neutral-500 text-xs">Associe rodadas a campeonatos usando o formulário acima.</p>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
const { 
  getRodadas, 
  getRodadasCampeonato, 
  postRodadaCampeonato 
} = useApi()

// Estados para rodadas de campeonato
const submittedRodadasCampeonato = ref([])
const loadingRodadasCampeonato = ref(false)
const errorRodadasCampeonato = ref('')

// Carregar dados quando o componente for montado
onMounted(async () => {
  await loadRodadasCampeonato()
})

// Funções para rodadas de campeonato
const loadRodadasCampeonato = async () => {
  loadingRodadasCampeonato.value = true
  errorRodadasCampeonato.value = ''
  
  try {
    const rodadasCampeonato = await getRodadasCampeonato()
    submittedRodadasCampeonato.value = rodadasCampeonato.map(item => ({
      id: item.id.toString(),
      campeonatoId: item.campeonatoId,
      rodadaId: item.rodadaId,
      valorRodada: item.valorRodada,
      valorPremio: item.valorPremio,
      porcentagem: item.porcentagem
    }))
  } catch (err) {
    errorRodadasCampeonato.value = 'Erro ao carregar associações do servidor.'
    console.error('Erro ao carregar rodadas de campeonato:', err)
  } finally {
    loadingRodadasCampeonato.value = false
  }
}

const handleRodadaCampeonatoSubmission = async (rodadaCampeonato) => {
  try {
    await postRodadaCampeonato({
      campeonatoId: rodadaCampeonato.campeonatoId,
      rodadaId: rodadaCampeonato.rodadaId,
      valorRodada: rodadaCampeonato.valorRodada,
      porcentagem: rodadaCampeonato.porcentagem,
      tipoId: rodadaCampeonato.tipoId
    })
    submittedRodadasCampeonato.value.unshift(rodadaCampeonato)
    await loadRodadasCampeonato()
  } catch (error) {
    console.error('Erro ao associar rodada:', error)
    errorRodadasCampeonato.value = 'Erro ao associar rodada. Tente novamente.'
  }
}
</script>
