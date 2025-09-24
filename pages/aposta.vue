<template>
    <div class="min-h-screen">
      <main class="container mx-auto px-4 py-8">
        <BettingForm @bet-submitted="handleBetSubmission" />
        
        <!-- Loading das apostas -->
        <div v-if="loadingBets" class="text-center py-8">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p class="text-neutral-600">Carregando apostas...</p>
        </div>
        
        <!-- Erro ao carregar apostas -->
        <div v-if="errorBets" class="text-center py-8">
          <div class="bg-red-50 border border-red-200 rounded-lg p-4 max-w-md mx-auto">
            <p class="text-red-700 mb-3">{{ errorBets }}</p>
            <button 
              @click="loadBets" 
              class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
            >
              Tentar novamente
            </button>
          </div>
        </div>
        
        <!-- Cabeçalho das últimas apostas -->
        <div v-if="submittedBets.length > 0 && !loadingBets" class="text-center mb-6">
          <h2 class="text-2xl font-bold text-neutral-800 mb-2">Últimas Apostas</h2>
          <p class="text-neutral-600">
            Exibindo as últimas {{ ultimasApostas.length }} de {{ submittedBets.length }} apostas
          </p>
        </div>
        
        <!-- Lista de apostas (últimas 6) -->
        <BetResults v-if="ultimasApostas.length > 0 && !loadingBets" :bets="ultimasApostas" />
        
        <!-- Mensagem quando não há apostas -->
        <div v-if="ultimasApostas.length === 0 && !loadingBets && !errorBets" class="text-center py-12">
          <div class="text-neutral-400 mb-4">
            <svg class="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
          </div>
          <h3 class="text-lg font-semibold text-neutral-600 mb-2">Nenhuma aposta encontrada</h3>
          <p class="text-neutral-500">Faça sua primeira aposta usando o formulário acima.</p>
        </div>
      </main>
    </div>
  </template>
  
  <script setup>
  const { getApostas } = useApi()
  const submittedBets = ref([])
  const loadingBets = ref(false)
  const errorBets = ref('')

  // Computed para as últimas 6 apostas
  const ultimasApostas = computed(() => {
    return submittedBets.value.slice(0, 6)
  })
  
  // Carregar apostas do backend quando o componente for montado
  onMounted(async () => {
    await loadBets()
  })
  
  const loadBets = async () => {
    loadingBets.value = true
    errorBets.value = ''
    
    try {
      const apostas = await getApostas()
      console.log(apostas)
      
      // Mapear e ordenar apostas por data (mais recentes primeiro)
      const apostasMapeadas = apostas.map(aposta => ({
        id: aposta.id.toString(),
        apostador: aposta.apostador?.nome || 'N/A',
        cavalo: aposta.cavalo?.nome || 'N/A',
        campeonato: aposta.campeonato?.nome || 'N/A',
        valorTotal: aposta.total,
        valorAposta: aposta.valorUnitario,
        porcentagem: aposta.porcentagem,
        dataAposta: new Date(aposta.createdAt || aposta.dataAposta)
      }))
      
      // Ordenar por data (mais recentes primeiro)
      submittedBets.value = apostasMapeadas.sort((a, b) => b.dataAposta - a.dataAposta)
    } catch (err) {
      errorBets.value = 'Erro ao carregar apostas do servidor.'
      console.error('Erro ao carregar apostas:', err)
    } finally {
      loadingBets.value = false
    }
  }
  
  const handleBetSubmission = (bet) => {
    // Adicionar nova aposta no início da lista
    submittedBets.value.unshift(bet)
    // Recarregar apostas do backend para garantir sincronização
    loadBets()
  }
  </script>