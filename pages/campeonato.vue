<template>
  <div class="min-h-screen">
    <main class="container mx-auto px-4 py-8">
      <CampeonatoForm @campeonato-submitted="handleCampeonatoSubmission" />
      
      <!-- Loading dos campeonatos -->
      <div v-if="loadingCampeonatos" class="text-center py-8">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-4"></div>
        <p class="text-neutral-600">Carregando campeonatos...</p>
      </div>
      
      <!-- Erro ao carregar campeonatos -->
      <div v-if="errorCampeonatos" class="text-center py-8">
        <div class="bg-red-50 border border-red-200 rounded-lg p-4 max-w-md mx-auto">
          <p class="text-red-700 mb-3">{{ errorCampeonatos }}</p>
          <button 
            @click="loadCampeonatos" 
            class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            Tentar novamente
          </button>
        </div>
      </div>
      
      <!-- Lista de campeonatos ou apostadores -->
      <CampeonatoResults 
        v-if="submittedCampeonatos.length > 0 && !loadingCampeonatos && !mostrandoApostadores" 
        :campeonatos="submittedCampeonatos"
        @campeonato-clicked="handleCampeonatoClick"
      />
      
      <!-- Lista de apostadores -->
      <ListaApostadores
        v-if="mostrandoApostadores && apostadores.length > 0"
        :campeonato="campeonatoSelecionado"
        :apostadores="apostadores"
        @apostador-clicked="handleApostadorClick"
        @voltar="voltarParaCampeonatos"
      />
      
      <!-- Mensagem quando não há campeonatos -->
      <div v-if="submittedCampeonatos.length === 0 && !loadingCampeonatos && !errorCampeonatos" class="text-center py-12">
        <div class="text-neutral-400 mb-4">
          <svg class="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"></path>
          </svg>
        </div>
        <h3 class="text-lg font-semibold text-neutral-600 mb-2">Nenhum campeonato encontrado</h3>
        <p class="text-neutral-500">Cadastre o primeiro campeonato usando o formulário acima.</p>
      </div>
    </main>

    <!-- Modal do Apostador -->
    <ModalApostador
      :is-open="modalApostadorOpen"
      :apostador="apostadorSelecionado"
      :campeonato="campeonatoSelecionado"
      :apostas="apostasApostador"
      @close="fecharModalApostador"
    />
  </div>
</template>

<script setup>
const { getCampeonatos, postCampeonato, getApostasPorCampeonato } = useApi()
const submittedCampeonatos = ref([])
const loadingCampeonatos = ref(false)
const errorCampeonatos = ref('')

// Estados para apostadores
const mostrandoApostadores = ref(false)
const campeonatoSelecionado = ref(null)
const apostadores = ref([])
const loadingApostadores = ref(false)

// Estados para modal do apostador
const modalApostadorOpen = ref(false)
const apostadorSelecionado = ref(null)
const apostasApostador = ref([])

// Carregar campeonatos do backend quando o componente for montado
onMounted(async () => {
  await loadCampeonatos()
})

const loadCampeonatos = async () => {
  loadingCampeonatos.value = true
  errorCampeonatos.value = ''
  
  try {
    const campeonatos = await getCampeonatos()
    submittedCampeonatos.value = campeonatos.map(campeonato => ({
      id: campeonato.id.toString(),
      nome: campeonato.nome,
      ano: campeonato.ano
    }))
  } catch (err) {
    errorCampeonatos.value = 'Erro ao carregar campeonatos do servidor.'
    console.error('Erro ao carregar campeonatos:', err)
  } finally {
    loadingCampeonatos.value = false
  }
}

const handleCampeonatoSubmission = async (campeonato) => {
  try {
    // Enviar para o backend
    await postCampeonato({ 
      nome: campeonato.nome, 
      ano: campeonato.ano 
    })
    
    // Adicionar novo campeonato no início da lista
    submittedCampeonatos.value.unshift(campeonato)
    
    // Recarregar campeonatos do backend para garantir sincronização
    await loadCampeonatos()
  } catch (error) {
    console.error('Erro ao cadastrar campeonato:', error)
    errorCampeonatos.value = 'Erro ao cadastrar campeonato. Tente novamente.'
  }
}

// Funções para gerenciar apostadores
const handleCampeonatoClick = async (campeonato) => {
  campeonatoSelecionado.value = campeonato
  loadingApostadores.value = true
  
  try {
    const apostasData = await getApostasPorCampeonato(parseInt(campeonato.id))
    
    // Agrupar apostas por apostador
    const apostadoresMap = new Map()
    
    apostasData.forEach(aposta => {
      const apostadorId = aposta.apostadorId
      
      if (!apostadoresMap.has(apostadorId)) {
        apostadoresMap.set(apostadorId, {
          id: aposta.apostador.id,
          nome: aposta.apostador.nome,
          apostas: []
        })
      }
      
      apostadoresMap.get(apostadorId).apostas.push({
        id: aposta.id,
        cavalo: aposta.cavalo.nome,
        total: parseFloat(aposta.total),
        valorUnitario: parseFloat(aposta.valorUnitario),
        porcentagem: parseFloat(aposta.porcentagem)
      })
    })
    
    // Converter Map para Array
    apostadores.value = Array.from(apostadoresMap.values())
    mostrandoApostadores.value = true
  } catch (error) {
    console.error('Erro ao carregar apostas:', error)
    errorCampeonatos.value = 'Erro ao carregar apostas do campeonato.'
  } finally {
    loadingApostadores.value = false
  }
}

const voltarParaCampeonatos = () => {
  mostrandoApostadores.value = false
  campeonatoSelecionado.value = null
  apostadores.value = []
}

// Funções para o modal do apostador
const handleApostadorClick = (apostador) => {
  apostadorSelecionado.value = apostador
  
  // Usar os dados reais das apostas do apostador
  apostasApostador.value = apostador.apostas.map(aposta => ({
    rodada: `Rodada ${aposta.id}`, // Você pode ajustar conforme necessário
    cavalo: aposta.cavalo,
    valorAposta: aposta.valorUnitario,
    porcentagem: aposta.porcentagem,
    premioIndividual: (aposta.valorUnitario * aposta.porcentagem) / 100, // Cálculo do prêmio
    totalRodada: aposta.total
  }))
  
  modalApostadorOpen.value = true
}

const fecharModalApostador = () => {
  modalApostadorOpen.value = false
  apostadorSelecionado.value = null
  apostasApostador.value = []
}
</script>
