<template>
  <div class="min-h-screen">
    <main class="container mx-auto px-4 py-8">
      <CampeonatoForm @campeonato-submitted="handleCampeonatoSubmission" />
      
      <!-- Filtro de busca -->
      <div v-if="submittedCampeonatos.length > 0 && !mostrandoApostadores" class="mb-8">
        <div class="card p-6 max-w-2xl mx-auto">
          <div class="text-center mb-4">
            <h3 class="text-xl font-semibold text-neutral-800 mb-2">Filtrar Campeonatos</h3>
            <p class="text-neutral-600 text-sm">Busque por nome ou ano do campeonato</p>
          </div>
          
          <div class="flex flex-col sm:flex-row gap-4">
            <div class="flex-1">
              <FormInput
                label="Nome do Campeonato"
                type="text"
                v-model="filtroNome"
                placeholder="Digite o nome do campeonato"
                icon="MagnifyingGlassIcon"
              />
            </div>
            
            <div class="flex-1">
              <FormInput
                label="Ano"
                type="number"
                v-model="filtroAno"
                placeholder="20__ (digite apenas os 2 últimos dígitos)"
                icon="CalendarIcon"
                :min="2020"
                :max="2100"
              />
            </div>
            
            <div class="flex items-end">
              <button 
                @click="limparFiltros"
                class="px-4 py-2 bg-neutral-600 text-white rounded hover:bg-neutral-700 transition-colors text-sm"
              >
                Limpar
              </button>
            </div>
          </div>
          
          <!-- Resultados do filtro -->
          <div v-if="filtroNome || filtroAno" class="mt-4 text-center">
            <p class="text-sm text-neutral-600">
              {{ campeonatosFiltrados.length }} campeonato{{ campeonatosFiltrados.length !== 1 ? 's' : '' }} encontrado{{ campeonatosFiltrados.length !== 1 ? 's' : '' }}
            </p>
          </div>
        </div>
      </div>
      
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
        v-if="campeonatosParaExibir.length > 0 && !loadingCampeonatos && !mostrandoApostadores" 
        :campeonatos="campeonatosParaExibir"
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
      
      <!-- Mensagem quando não há apostadores -->
      <div v-if="mostrandoApostadores && apostadores.length === 0 && !loadingApostadores" class="text-center py-12">
        <div class="text-neutral-400 mb-4">
          <svg class="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
          </svg>
        </div>
        <h3 class="text-lg font-semibold text-neutral-600 mb-2">Nenhum apostador encontrado</h3>
        <p class="text-neutral-500 mb-6">Este campeonato ainda não possui apostadores cadastrados.</p>
        
        <!-- Botão para voltar -->
        <button 
          @click="voltarParaCampeonatos"
          class="px-6 py-2 bg-primary-600 text-white rounded hover:bg-primary-700 transition-colors"
        >
          Voltar aos Campeonatos
        </button>
      </div>
      
      <!-- Mensagem quando não há resultados do filtro -->
      <div v-if="submittedCampeonatos.length > 0 && campeonatosParaExibir.length === 0 && !loadingCampeonatos && !mostrandoApostadores" class="text-center py-12">
        <div class="text-neutral-400 mb-4">
          <svg class="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
        </div>
        <h3 class="text-lg font-semibold text-neutral-600 mb-2">Nenhum campeonato encontrado</h3>
        <p class="text-neutral-500 mb-6">Não foram encontrados campeonatos com os critérios de busca informados.</p>
        <button 
          @click="limparFiltros"
          class="px-6 py-2 bg-primary-600 text-white rounded hover:bg-primary-700 transition-colors"
        >
          Limpar Filtros
        </button>
      </div>
      
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
const { getCampeonatos, postCampeonato, getApostadoresPorCampeonato, getApostasPorApostador } = useApi()
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

// Estados para filtro
const filtroNome = ref('')
const filtroAno = ref(new Date().getFullYear()) // Inicializa com o ano atual

// Computeds para filtro
const campeonatosFiltrados = computed(() => {
  let filtrados = submittedCampeonatos.value

  // Filtrar por nome
  if (filtroNome.value.trim()) {
    filtrados = filtrados.filter(campeonato => 
      campeonato.nome.toLowerCase().includes(filtroNome.value.toLowerCase())
    )
  }

  // Filtrar por ano
  if (filtroAno.value) {
    filtrados = filtrados.filter(campeonato => 
      campeonato.ano === parseInt(filtroAno.value)
    )
  }

  return filtrados
})

const campeonatosParaExibir = computed(() => {
  // Se há filtros ativos, mostrar resultados filtrados
  if (filtroNome.value.trim() || filtroAno.value) {
    return campeonatosFiltrados.value
  }
  // Senão, mostrar todos os campeonatos
  return submittedCampeonatos.value
})

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
    const apostadoresData = await getApostadoresPorCampeonato(parseInt(campeonato.id))
    
    // Verificar se há apostadores
    if (apostadoresData && apostadoresData.length > 0) {
      // Mapear apostadores (sem apostas ainda)
      apostadores.value = apostadoresData.map(apostador => ({
        id: apostador.id,
        nome: apostador.nome,
        apostas: [] // Será carregado quando clicar no apostador
      }))
    } else {
      // Array vazio - nenhum apostador encontrado
      apostadores.value = []
    }
    
    mostrandoApostadores.value = true
  } catch (error) {
    console.error('Erro ao carregar apostadores:', error)
    errorCampeonatos.value = 'Erro ao carregar apostadores do campeonato.'
    apostadores.value = []
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
const handleApostadorClick = async (apostador) => {
  apostadorSelecionado.value = apostador
  
  try {
    // Buscar apostas do apostador no campeonato
    const apostasData = await getApostasPorApostador(
      parseInt(campeonatoSelecionado.value.id), 
      parseInt(apostador.id)
    )
    
    // Mapear apostas para o formato do modal com dados reais da API
    apostasApostador.value = apostasData.map(aposta => ({
      id: aposta.id,
      cavaloId: aposta.cavaloId,
      cavalo: aposta.cavalo.nome,
      campeonatoId: aposta.campeonatoId,
      campeonato: aposta.campeonato,
      apostadorId: aposta.apostadorId,
      total: parseFloat(aposta.total),
      valorUnitario: parseFloat(aposta.valorUnitario),
      porcentagem: parseFloat(aposta.porcentagem),
      rodadasId: aposta.rodadasId,
      rodadas: aposta.rodadas, // ← Incluir objeto rodadas completo
      // Usar valorPremio real da API
      premioIndividual: parseFloat(aposta.rodadas?.valorPremio || 0),
      totalRodada: parseFloat(aposta.rodadas?.valorRodada || 0)
    }))
    
    modalApostadorOpen.value = true
  } catch (error) {
    console.error('Erro ao carregar apostas do apostador:', error)
    errorCampeonatos.value = 'Erro ao carregar apostas do apostador.'
  }
}

const fecharModalApostador = () => {
  modalApostadorOpen.value = false
  apostadorSelecionado.value = null
  apostasApostador.value = []
}

// Função para limpar filtros
const limparFiltros = () => {
  filtroNome.value = ''
  filtroAno.value = new Date().getFullYear() // Reset para o ano atual
}
</script>
