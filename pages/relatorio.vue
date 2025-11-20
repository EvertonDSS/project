<template>
  <div class="min-h-screen bg-neutral-50">
    <main class="container mx-auto px-4 py-8">
      <!-- Header -->
      <div class="text-center mb-8">
        <h1 class="text-4xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent mb-2">
          Relatório de Apostas
        </h1>
        <p class="text-neutral-600">Gere relatórios detalhados de apostas por apostador e campeonato</p>
      </div>

      <!-- Formulário de Seleção -->
      <div class="card p-8 max-w-4xl mx-auto mb-8">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Seleção de Campeonato -->
          <div>
            <label class="block text-sm font-medium text-neutral-700 mb-2">
              <TrophyIcon class="w-4 h-4 inline mr-1" />
              Campeonato
              <span class="text-red-500">*</span>
            </label>
            <FormSelectSearchable
              v-model="campeonatoSelecionado"
              :options="campeonatoOptions"
              :disabled="loading"
              placeholder="Selecione um campeonato..."
              @update:modelValue="onCampeonatoChange"
            />
          </div>

          <!-- Seleção de Apostador -->
          <div>
            <label class="block text-sm font-medium text-neutral-700 mb-2">
              <UserIcon class="w-4 h-4 inline mr-1" />
              Apostador
              <span class="text-red-500">*</span>
            </label>
            <FormSelectSearchable
              v-model="apostadorSelecionado"
              :options="apostadorOptions"
              :disabled="loading || !campeonatoSelecionado"
              placeholder="Selecione um apostador..."
            />
          </div>
        </div>

        <!-- Botão para carregar apostas -->
        <div class="mt-6 text-center">
          <button
            @click="carregarApostas"
            :disabled="!campeonatoSelecionado || !apostadorSelecionado || loadingApostas"
            class="btn-primary flex items-center space-x-2 mx-auto"
          >
            <MagnifyingGlassIcon class="w-5 h-5" />
            <span>{{ loadingApostas ? 'Carregando...' : 'Carregar Apostas' }}</span>
          </button>
        </div>
      </div>

      <!-- Dropdown FINALISTAS -->
      <div class="max-w-4xl mx-auto mb-6">
        <div class="bg-white rounded-lg shadow-lg overflow-hidden">
          <!-- Header do Dropdown -->
          <button
            @click="toggleDropdownFinalistas"
            class="w-full px-6 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-left flex items-center justify-between hover:from-purple-700 hover:to-indigo-700 transition-colors"
          >
            <div class="flex items-center space-x-3">
              <span class="text-2xl">🏆</span>
              <h2 class="text-xl font-semibold">FINALISTAS</h2>
            </div>
            <svg 
              :class="['w-6 h-6 transition-transform duration-200', dropdownFinalistasAberto ? 'rotate-180' : '']"
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </button>

          <!-- Conteúdo do Dropdown -->
          <div v-if="dropdownFinalistasAberto" class="p-6">
            <!-- Seleção de Campeonato -->
            <div class="mb-6">
              <label class="block text-sm font-medium text-neutral-700 mb-2">
                <TrophyIcon class="w-4 h-4 inline mr-1" />
                Campeonato
                <span class="text-red-500">*</span>
              </label>
              <FormSelectSearchable
                v-model="campeonatoFinalistas"
                :options="campeonatoOptions"
                :disabled="loading || carregandoFinalistas"
                placeholder="Selecione um campeonato..."
                @update:modelValue="onCampeonatoFinalistasChange"
              />
            </div>

            <!-- Botão para carregar finalistas -->
            <div class="text-center">
              <button
                @click="carregarFinalistas"
                :disabled="!campeonatoFinalistas || carregandoFinalistas"
                class="btn-primary flex items-center space-x-2 mx-auto"
              >
                <MagnifyingGlassIcon class="w-5 h-5" />
                <span>{{ carregandoFinalistas ? 'Carregando...' : 'Carregar Finalistas' }}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Loading das apostas -->
      <div v-if="loadingApostas" class="text-center py-8">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-4"></div>
        <p class="text-neutral-600">Carregando apostas...</p>
      </div>

      <!-- Erro ao carregar apostas -->
      <div v-if="errorApostas" class="text-center py-8">
        <div class="bg-red-50 border border-red-200 rounded-lg p-4 max-w-md mx-auto">
          <p class="text-red-700 mb-3">{{ errorApostas }}</p>
          <button 
            @click="carregarApostas" 
            class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            Tentar novamente
          </button>
        </div>
      </div>

      <!-- Relatório -->
      <div v-if="apostasCarregadas.length > 0" class="card p-8 max-w-6xl mx-auto">
        <!-- Cabeçalho do Relatório -->
        <div class="mb-8">
          <div class="flex items-center gap-6 mb-6">
            <img src="/images/aa.png" alt="JOGOS ONLINE" class="h-20 w-auto border-4 rounded-lg" style="border-color: #ffcc00;" />
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
              <div class="text-black p-3 rounded" style="background-color: #ffcc00;">
                <p class="font-semibold">NOME APOSTADOR</p>
                <p class="text-lg">{{ apostadorSelecionadoNome }}</p>
              </div>
              <div class="text-black p-3 rounded" style="background-color: #ffcc00;">
                <p class="font-semibold">NOME CAMPEONATO</p>
                <p class="text-lg">{{ campeonatoSelecionadoNome }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Tabela de Apostas (Original) -->
        <div class="overflow-x-auto mb-6">
          <table class="w-full border-collapse">
            <thead>
              <tr class="text-white" style="background-color: #000000;">
                <th class="border border-neutral-300 px-4 py-3 text-left font-semibold">RODADA</th>
                <th class="border border-neutral-300 px-4 py-3 text-left font-semibold">CHAVE</th>
                <th class="border border-neutral-300 px-4 py-3 text-left font-semibold">VALOR DA APOSTA</th>
                <th class="border border-neutral-300 px-4 py-3 text-left font-semibold">%</th>
                <th class="border border-neutral-300 px-4 py-3 text-left font-semibold">PRÊMIO INDIVIDUAL</th>
                <th class="border border-neutral-300 px-4 py-3 text-left font-semibold">TOTAL DA RODADA</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(aposta, index) in apostasCarregadas" :key="index" class="hover:bg-neutral-50">
                <td class="border border-neutral-300 px-4 py-3 bg-white">{{ aposta.rodada }}</td>
                <td class="border border-neutral-300 px-4 py-3 bg-white">{{ aposta.chave }}</td>
                <td class="border border-neutral-300 px-4 py-3 bg-white">{{ formatCurrency(aposta.valorAposta) }}</td>
                <td class="border border-neutral-300 px-4 py-3 bg-white">{{ aposta.porcentagem }}%</td>
                <td class="border border-neutral-300 px-4 py-3 bg-white">{{ formatCurrency(aposta.premioIndividual) }}</td>
                <td class="border border-neutral-300 px-4 py-3 bg-white">{{ formatCurrency(aposta.totalRodada) }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Resumos Originais -->
        <div class="grid grid-cols-1 md:grid-cols-1 gap-6 mb-8">
          <!-- Valor Total da Aposta --> 
          <div class="text-black p-4 rounded" style="background-color: #ffcc00;">
            <h3 class="font-semibold text-lg mb-2">VALOR TOTAL DA APOSTA:</h3>
            <p class="text-2xl font-bold">{{ formatCurrency(valorTotalApostas) }}</p>
          </div>

         
        </div>

        <!-- Seção de Agrupamento por Tipo e Cavalo -->
        <div class="mb-6">
          <div class="text-center mb-6">
            <h2 class="text-2xl font-bold text-neutral-800 mb-2">Resumo por Tipo e Cavalo</h2>
            <p class="text-neutral-600">Apostas agrupadas e somadas por tipo de rodada e cavalo</p>
          </div>

          <div v-for="(tipoData, tipo) in apostasAgrupadas" :key="tipo" class="mb-6">
            <!-- Cabeçalho do Tipo -->
            <div class="text-black p-4 rounded-t-lg" style="background-color: #ffcc00;">
              <h3 class="text-lg font-bold text-center">{{ tipo }}</h3>
            </div>

            <!-- Lista de Cavalos com Valores -->
            <div class="border border-neutral-300 border-t-0 rounded-b-lg overflow-hidden">
              <div v-for="cavalo in Object.keys(tipoData).filter(key => !key.startsWith('_'))" :key="cavalo" class="bg-green-100 border-b border-neutral-200 last:border-b-0">
                <div class="flex justify-between items-center px-4 py-3">
                  <span class="font-medium text-neutral-800">{{ cavalo }}</span>
                  <span class="font-bold text-neutral-900">{{ formatCurrency(tipoData[cavalo].premioIndividual) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Resumos por Tipo -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-for="(tipoData, tipo) in apostasAgrupadas" :key="tipo" class="text-black p-6 rounded-lg" style="background-color: #ffcc00;">
            <h3 class="font-semibold text-lg mb-2">{{ tipo }}</h3>
            <div class="space-y-2">
              <div class="flex justify-between">
                <span class="text-sm opacity-90">Total Prêmios:</span>
                <span class="font-bold">{{ formatCurrency(tipoData._totalPremio) }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-sm opacity-90">Cavalos:</span>
                <span class="font-bold">{{ Object.keys(tipoData).filter(key => !key.startsWith('_')).length }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Botões de Ação -->
        <div class="mt-8 flex justify-center space-x-4">
          <button
            @click="adicionarRodada"
            class="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors flex items-center space-x-2"
          >
            <PlusIcon class="w-4 h-4" />
            <span>Adicionar Rodada</span>
          </button>
          <button
            @click="gerarPDF"
            class="px-6 py-2 bg-primary-600 text-white rounded hover:bg-primary-700 transition-colors flex items-center space-x-2"
          >
            <DocumentArrowDownIcon class="w-4 h-4" />
            <span>Gerar PDF</span>
          </button>
        </div>
      </div>

      <!-- Modal para adicionar rodada -->
      <ModalAdicionarRodada
        :isOpen="showModalRodada"
        :campeonatoId="campeonatoSelecionado"
        :apostadorId="apostadorSelecionado"
        @close="fecharModalRodada"
        @adicionar="adicionarApostaRodada"
      />

      <!-- Modal de Finalistas -->
      <div v-if="modalFinalistasAberto" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white rounded-lg shadow-xl max-w-6xl w-full mx-4 max-h-[90vh] overflow-hidden">
          <!-- Header da Modal -->
          <div class="flex justify-between items-center p-4 border-b">
            <h2 class="text-xl font-bold text-gray-800">Finalistas - {{ campeonatoFinalistasNome }}</h2>
            <button 
              @click="fecharModalFinalistas"
              class="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg"
            >
              Fechar
            </button>
          </div>
          
          <!-- Conteúdo da Modal -->
          <div class="overflow-auto max-h-[calc(90vh-80px)]">
            <div v-html="htmlFinalistas" class="p-6"></div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { 
  TrophyIcon, 
  UserIcon, 
  MagnifyingGlassIcon, 
  PlusIcon, 
  DocumentArrowDownIcon 
} from '@heroicons/vue/24/outline'

const corridaApi = useCorridaApi()

// Estados reativos
const campeonatoSelecionado = ref('')
const apostadorSelecionado = ref('')
const campeonatoOptions = ref([])
const apostadorOptions = ref([])
const loading = ref(false)
const loadingApostas = ref(false)
const errorApostas = ref('')

// Dados do relatório
const apostasCarregadas = ref([])
const showModalRodada = ref(false)

// Estados para Finalistas
const campeonatoFinalistas = ref('')
const carregandoFinalistas = ref(false)
const modalFinalistasAberto = ref(false)
const dropdownFinalistasAberto = ref(false)
const htmlFinalistas = ref('')
const finalistasData = ref([])

// Computed properties
const campeonatoSelecionadoNome = computed(() => {
  return campeonatoOptions.value.find(opt => opt.value === campeonatoSelecionado.value)?.label || ''
})

const apostadorSelecionadoNome = computed(() => {
  return apostadorOptions.value.find(opt => opt.value === apostadorSelecionado.value)?.label || ''
})

// Agrupar apostas por tipo e cavalo
const apostasAgrupadas = computed(() => {
  const agrupado = {}
  
  apostasCarregadas.value.forEach(aposta => {
    const tipo = aposta.tipo
    const cavalo = aposta.cavalo
    
    // Inicializar tipo se não existir
    if (!agrupado[tipo]) {
      agrupado[tipo] = {
        _totalPremio: 0,
        _totalRodada: 0
      }
    }
    
    // Inicializar cavalo se não existir
    if (!agrupado[tipo][cavalo]) {
      agrupado[tipo][cavalo] = {
        rodada: aposta.rodada,
        porcentagem: aposta.porcentagem,
        premioIndividual: 0,
        totalRodada: 0
      }
    }
    
    // Somar valores
    agrupado[tipo][cavalo].premioIndividual += aposta.premioIndividual
    agrupado[tipo][cavalo].totalRodada += aposta.totalRodada
    agrupado[tipo]._totalPremio += aposta.premioIndividual
    agrupado[tipo]._totalRodada += aposta.totalRodada
  })
  
  return agrupado
})

const valorTotalApostas = computed(() => {
  return apostasCarregadas.value.reduce((total, aposta) => total + aposta.valorAposta, 0)
})

const valorTotalPremios = computed(() => {
  return apostasCarregadas.value.reduce((total, aposta) => total + aposta.premioIndividual, 0)
})

const chaveUnica = computed(() => {
  if (apostasCarregadas.value.length === 0) return ''
  return apostasCarregadas.value[0].chave
})

const campeonatoFinalistasNome = computed(() => {
  return campeonatoOptions.value.find(opt => opt.value === campeonatoFinalistas.value)?.label || ''
})

// Carregar dados iniciais
onMounted(async () => {
  await carregarCampeonatos()
})

const carregarCampeonatos = async () => {
  loading.value = true
  try {
    const campeonatos = await corridaApi.getAll()
    campeonatoOptions.value = Array.isArray(campeonatos) 
      ? campeonatos.map(campeonato => ({
          value: campeonato.id,
          label: campeonato.nome
        }))
      : []
  } catch (error) {
    console.error('Erro ao carregar campeonatos:', error)
    campeonatoOptions.value = []
  } finally {
    loading.value = false
  }
}

const onCampeonatoChange = async (campeonatoId) => {
  if (!campeonatoId) {
    apostadorOptions.value = []
    apostadorSelecionado.value = ''
    return
  }

  try {
    const resposta = await corridaApi.getApostadores(campeonatoId)
    const apostadores = resposta?.apostadores || []
    apostadorOptions.value = Array.isArray(apostadores) 
      ? apostadores.map(apostador => ({
          value: apostador.id,
          label: apostador.nome
        }))
      : []
    apostadorSelecionado.value = ''
  } catch (error) {
    console.error('Erro ao carregar apostadores:', error)
    apostadorOptions.value = []
  }
}

const carregarApostas = async () => {
  if (!campeonatoSelecionado.value || !apostadorSelecionado.value) return

  loadingApostas.value = true
  errorApostas.value = ''

  try {
    const dados = await corridaApi.getPdfDados(
      parseInt(campeonatoSelecionado.value),
      parseInt(apostadorSelecionado.value)
    )

    // Verificar se retornou dados válidos
    if (!dados || !dados.apostasPorRodada || !Array.isArray(dados.apostasPorRodada) || dados.apostasPorRodada.length === 0) {
      apostasCarregadas.value = []
      errorApostas.value = 'Não há aposta válida para este apostador neste campeonato.'
      return
    }

    // Mapear apostas para o formato do relatório
    const apostasComTipos = []
    
    dados.apostasPorRodada.forEach((rodada) => {
      if (!rodada.apostas || !Array.isArray(rodada.apostas)) return
      
      const nomeTipo = rodada.tipoRodada?.nome || 'SEM TIPO'
      const nomeRodada = rodada.nomeRodada || 'N/A'
      const valorRodada = parseFloat(rodada.valorRodada || 0)
      
      rodada.apostas.forEach((aposta) => {
        // Obter dados do pareo
        if (!aposta.pareo || !aposta.pareo.cavalos || !Array.isArray(aposta.pareo.cavalos)) {
          return
        }
        
        const cavalosNomes = aposta.pareo.cavalos.map(cavalo => cavalo.nome).join(' / ')
        const nomeCavalo = `${aposta.pareo.numero || ''} - ${cavalosNomes}`
        const chave = nomeCavalo
        
        apostasComTipos.push({
          rodada: nomeRodada,
          chave: chave,
          valorAposta: parseFloat(aposta.valor || 0),
          porcentagem: parseFloat(aposta.porcentagemAposta || 0),
          premioIndividual: parseFloat(aposta.valorPremio || 0),
          totalRodada: valorRodada,
          tipo: nomeTipo,
          cavalo: nomeCavalo
        })
      })
    })

    // Verificar se há apostas válidas
    if (apostasComTipos.length === 0) {
      apostasCarregadas.value = []
      errorApostas.value = 'Não há aposta válida para este apostador neste campeonato.'
      return
    }
    
    apostasCarregadas.value = apostasComTipos
  } catch (error) {
    console.error('Erro ao carregar apostas:', error)
    errorApostas.value = 'Erro ao carregar apostas do apostador.'
  } finally {
    loadingApostas.value = false
  }
}

const adicionarRodada = () => {
  showModalRodada.value = true
}

const fecharModalRodada = () => {
  showModalRodada.value = false
}

const adicionarApostaRodada = (novaAposta) => {
  apostasCarregadas.value.push(novaAposta)
  showModalRodada.value = false
}

const formatCurrency = (value) => {
  const numValue = parseFloat(value)
  if (isNaN(numValue) || numValue === null || numValue === undefined) {
    return 'R$ 0,00'
  }
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(numValue)
}

// Funções para Finalistas
const onCampeonatoFinalistasChange = async (campeonatoId) => {
  // Não precisa fazer nada especial aqui, apenas limpar dados anteriores
  if (!campeonatoId) {
    finalistasData.value = []
  }
}

const carregarFinalistas = async () => {
  if (!campeonatoFinalistas.value) return

  carregandoFinalistas.value = true
  finalistasData.value = []

  try {
    // Buscar tipos de rodadas do campeonato
    const tiposRodadasResponse = await corridaApi.getTiposRodadasCampeonato(campeonatoFinalistas.value)
    
    // Filtrar tipos que contém "FINAL" no nome (case insensitive)
    const tiposFinais = tiposRodadasResponse.tipos?.filter(tipo => 
      tipo.nome.toLowerCase().includes('final')
    ) || []

    if (tiposFinais.length === 0) {
      htmlFinalistas.value = '<div class="p-6 text-center text-gray-600">Nenhum tipo de rodada com "FINAL" encontrado para este campeonato.</div>'
      modalFinalistasAberto.value = true
      return
    }

    // Buscar apostas para cada tipo final
    const apostasPorTipo = {}
    
    for (const tipo of tiposFinais) {
      try {
        const apostas = await corridaApi.getApostas(campeonatoFinalistas.value, tipo.id)
        
        if (apostas && apostas.length > 0) {
          apostasPorTipo[tipo.nome] = apostas
        }
      } catch (error) {
        console.error(`Erro ao buscar apostas para tipo ${tipo.nome}:`, error)
      }
    }

    // Processar dados para exibição
    finalistasData.value = {
      campeonato: campeonatoFinalistasNome.value,
      tipos: apostasPorTipo
    }

    // Gerar HTML do relatório
    htmlFinalistas.value = gerarHTMLFinalistas(apostasPorTipo)
    modalFinalistasAberto.value = true

  } catch (error) {
    console.error('Erro ao carregar finalistas:', error)
    htmlFinalistas.value = '<div class="p-6 text-center text-red-600">Erro ao carregar finalistas. Tente novamente.</div>'
    modalFinalistasAberto.value = true
  } finally {
    carregandoFinalistas.value = false
  }
}

const gerarHTMLFinalistas = (apostasPorTipo) => {
  let html = `
    <style>
      .relatorio-finalistas {
        font-family: 'Arial', sans-serif;
        font-size: 12px;
        line-height: 1.4;
        color: #333;
        background: white;
      }

      .header-finalistas {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 30px;
        padding-bottom: 20px;
        border-bottom: 2px solid #D4AF37;
      }

      .logo-finalistas {
        display: flex;
        align-items: center;
        gap: 10px;
      }

      .logo-icon-finalistas {
        width: 40px;
        height: 40px;
        background: #D4AF37;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: bold;
        font-size: 16px;
      }

      .logo-text-finalistas {
        font-size: 18px;
        font-weight: bold;
        color: #D4AF37;
      }

      .campeonato-name-finalistas {
        background: #D4AF37;
        color: white;
        padding: 8px 16px;
        border-radius: 4px;
        font-weight: bold;
        font-size: 14px;
      }

      .title-finalistas {
        text-align: center;
        font-size: 20px;
        font-weight: bold;
        color: #D4AF37;
        margin-bottom: 30px;
      }

      .tipo-section {
        margin-bottom: 40px;
      }

      .tipo-title {
        background: #D4AF37;
        color: white;
        padding: 12px 16px;
        font-weight: bold;
        font-size: 16px;
        margin-bottom: 15px;
        border-radius: 4px;
      }

      .pareo-group {
        margin-bottom: 20px;
        border: 1px solid #ddd;
        border-radius: 4px;
        overflow: hidden;
        background: white;
      }

      .pareo-header {
        background: #f5f5f5;
        padding: 12px 16px;
        font-weight: bold;
        border-bottom: 2px solid #D4AF37;
        font-size: 14px;
      }

      .cavalos-container {
        padding: 0;
      }

      .cavalo-item {
        padding: 12px 16px;
        border-bottom: 1px solid #e5e5e5;
        background: white;
      }

      .cavalo-item:last-child {
        border-bottom: none;
      }

      .cavalo-item:nth-child(even) {
        background: #f9f9f9;
      }

      .cavalo-nome {
        font-weight: bold;
        color: #333;
        font-size: 13px;
        margin-bottom: 4px;
      }

      .cavalo-detalhes {
        font-size: 11px;
        color: #666;
        margin-top: 4px;
      }

      .cavalo-id {
        font-size: 10px;
        color: #999;
        margin-top: 2px;
      }

      .empty-state {
        padding: 20px;
        text-align: center;
        color: #666;
        font-style: italic;
      }
    </style>
    
    <div class="relatorio-finalistas">
      <div class="header-finalistas">
        <div class="logo-finalistas">
          <div class="logo-icon-finalistas">🐎</div>
          <div class="logo-text-finalistas">JOGOS ONLINE</div>
        </div>
        <div class="campeonato-name-finalistas">${campeonatoFinalistasNome.value}</div>
      </div>

      <div class="title-finalistas">RELATÓRIO DE FINALISTAS</div>
  `

  // Verificar se há dados
  if (Object.keys(apostasPorTipo).length === 0) {
    html += `
      <div class="empty-state">
        <p>Nenhuma aposta encontrada para os tipos finalistas.</p>
      </div>
    `
  } else {
    // Gerar seções por tipo
    Object.keys(apostasPorTipo).forEach(tipoNome => {
      const apostas = apostasPorTipo[tipoNome]
      
      html += `
        <div class="tipo-section">
          <div class="tipo-title">${tipoNome.toUpperCase()}</div>
      `

      // Agrupar apostas por pareo usando um Set para evitar duplicatas
      const pareosProcessados = new Set()
      const pareosUnicos = []
      
      apostas.forEach(aposta => {
        // Verificar se a aposta tem pareo e cavalos
        if (aposta.pareo && aposta.pareo.cavalos && aposta.pareo.cavalos.length > 0) {
          const pareoNumero = aposta.pareo.numero
          const chavePareo = `${pareoNumero}`
          
          if (!pareosProcessados.has(chavePareo)) {
            pareosProcessados.add(chavePareo)
            pareosUnicos.push({
              numero: pareoNumero,
              cavalos: aposta.pareo.cavalos
            })
          }
        }
      })

      if (pareosUnicos.length === 0) {
        html += `
          <div class="empty-state">
            <p>Nenhum pareo encontrado para este tipo.</p>
          </div>
        `
      } else {
        // Exibir pareos únicos
        pareosUnicos.forEach(pareoData => {
          const cavalosNomes = pareoData.cavalos.map(c => c.nome).join(' / ')
          
          html += `
            <div class="pareo-group">
              <div class="pareo-header">Pareo ${pareoData.numero} - ${cavalosNomes}</div>
              <div class="cavalos-container">
          `
          
          // Separar e exibir cada cavalo individualmente
          pareoData.cavalos.forEach((cavalo, index) => {
            html += `
              <div class="cavalo-item">
                <div class="cavalo-nome">${cavalo.nome || 'N/A'}</div>
                ${cavalo.identificador ? `<div class="cavalo-detalhes">Identificador: ${cavalo.identificador}</div>` : ''}
                ${cavalo.id ? `<div class="cavalo-id">ID: ${cavalo.id}</div>` : ''}
              </div>
            `
          })

          html += `
              </div>
            </div>
          `
        })
      }

      html += `
        </div>
      `
    })
  }

  html += `
    </div>
  `

  return html
}

const toggleDropdownFinalistas = () => {
  dropdownFinalistasAberto.value = !dropdownFinalistasAberto.value
}

const fecharModalFinalistas = () => {
  modalFinalistasAberto.value = false
}

const gerarPDF = () => {
  // Criar conteúdo HTML para o PDF
  const content = `
    <html>
      <head>
        <title>Relatório de Apostas - ${apostadorSelecionadoNome.value}</title>
        <style>
          body { 
            font-family: Arial, sans-serif; 
            margin: 20px; 
            background-color: #f5f5f5;
          }
          .container {
            max-width: 1200px;
            margin: 0 auto;
            background-color: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          }
          .header { 
            text-align: center; 
            margin-bottom: 30px; 
            border-bottom: 2px solid #e5e5e5;
            padding-bottom: 20px;
          }
          .logo {
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 20px;
          }
          .title { 
            font-size: 28px; 
            font-weight: bold; 
            color: #333; 
            margin: 0;
          }
          .subtitle { 
            font-size: 14px; 
            color: #666; 
            margin: 0;
          }
          .info-card {
            background: #ffcc00;
            color: black;
            padding: 15px;
            border-radius: 8px;
            text-align: center;
          }
          .info-label {
            font-size: 12px;
            font-weight: bold;
            margin-bottom: 5px;
            opacity: 0.9;
          }
          .info-value {
            font-size: 18px;
            font-weight: bold;
          }
          table { 
            width: 100%; 
            border-collapse: collapse; 
            margin-bottom: 30px; 
            background-color: white;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          }
          th, td { 
            border: 1px solid #e5e5e5; 
            padding: 12px; 
            text-align: left; 
          }
          th { 
            background: #000000;
            color: white;
            font-weight: bold;
            font-size: 14px;
          }
          td {
            background-color: white;
            font-size: 14px;
          }
          tr:nth-child(even) td {
            background-color: #f9f9f9;
          }
          .summary-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin-top: 30px;
          }
          .summary-card {
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          }
          .summary-header {
            background: #000000;
            color: white;
            padding: 15px;
            text-align: center;
            font-weight: bold;
            font-size: 16px;
          }
          .summary-content {
            background: #ffcc00;
            color: black;
            padding: 20px;
            text-align: center;
          }
          .summary-value {
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 10px;
          }
          .boloes-section {
            background-color: white;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          }
          .boloes-header {
            background: #000000;
            color: white;
            padding: 15px;
            text-align: center;
            font-weight: bold;
            font-size: 16px;
          }
          .boloes-subheader {
            background: #ffcc00;
            color: black;
            padding: 10px;
            text-align: center;
            font-weight: bold;
            font-size: 14px;
          }
          .boloes-content {
            display: grid;
            grid-template-columns: 1fr 1fr;
            background-color: #f0fdf4;
          }
          .boloes-item {
            padding: 15px;
            border: 1px solid #e5e5e5;
            font-size: 14px;
          }
          .boloes-item:first-child {
            background-color: #f0fdf4;
            color: #666;
          }
          .boloes-item:last-child {
            background-color: #f0fdf4;
            color: #333;
            font-weight: bold;
          }
          @media print {
            body { margin: 0; }
            .container { box-shadow: none; }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div style="display: flex; align-items: center; gap: 30px; margin-bottom: 30px;">
              <img src="/images/aa.png" alt="JOGOS ONLINE" style="height: 80px; width: auto; border: 4px solid #ffcc00; border-radius: 8px;" />
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; flex: 1;">
                <div class="info-card">
                  <div class="info-label">NOME APOSTADOR</div>
                  <div class="info-value">${apostadorSelecionadoNome.value}</div>
                </div>
                <div class="info-card">
                  <div class="info-label">NOME CAMPEONATO</div>
                  <div class="info-value">${campeonatoSelecionadoNome.value}</div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Tabela Original de Apostas -->
          <h2 style="font-size: 24px; font-weight: bold; color: #333; margin: 30px 0 20px 0; text-align: center;">Apostas Detalhadas</h2>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px; background-color: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
            <thead>
              <tr style="background: #000000; color: white;">
                <th style="border: 1px solid #e5e5e5; padding: 12px; text-align: left; font-weight: bold; font-size: 14px;">RODADA</th>
                <th style="border: 1px solid #e5e5e5; padding: 12px; text-align: left; font-weight: bold; font-size: 14px;">CHAVE</th>
                <th style="border: 1px solid #e5e5e5; padding: 12px; text-align: left; font-weight: bold; font-size: 14px;">VALOR DA APOSTA</th>
                <th style="border: 1px solid #e5e5e5; padding: 12px; text-align: left; font-weight: bold; font-size: 14px;">%</th>
                <th style="border: 1px solid #e5e5e5; padding: 12px; text-align: left; font-weight: bold; font-size: 14px;">PRÊMIO INDIVIDUAL</th>
                <th style="border: 1px solid #e5e5e5; padding: 12px; text-align: left; font-weight: bold; font-size: 14px;">TOTAL DA RODADA</th>
              </tr>
            </thead>
            <tbody>
              ${apostasCarregadas.value.map(aposta => `
                <tr>
                  <td style="border: 1px solid #e5e5e5; padding: 12px; background-color: white; font-size: 14px;">${aposta.rodada}</td>
                  <td style="border: 1px solid #e5e5e5; padding: 12px; background-color: white; font-size: 14px;">${aposta.chave}</td>
                  <td style="border: 1px solid #e5e5e5; padding: 12px; background-color: white; font-size: 14px;">${formatCurrency(aposta.valorAposta)}</td>
                  <td style="border: 1px solid #e5e5e5; padding: 12px; background-color: white; font-size: 14px;">${aposta.porcentagem}%</td>
                  <td style="border: 1px solid #e5e5e5; padding: 12px; background-color: white; font-size: 14px;">${formatCurrency(aposta.premioIndividual)}</td>
                  <td style="border: 1px solid #e5e5e5; padding: 12px; background-color: white; font-size: 14px;">${formatCurrency(aposta.totalRodada)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <!-- Resumos Originais -->
          <div style="display: grid; grid-template-columns: 1fr; gap: 20px; margin-bottom: 30px;">
            <div style="border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
              <div style="background: #000000; color: white; padding: 15px; text-align: center; font-weight: bold; font-size: 16px;">VALOR TOTAL DA APOSTA</div>
              <div style="background: #ffcc00; color: black; padding: 20px; text-align: center;">
                <div style="font-size: 24px; font-weight: bold;">${formatCurrency(valorTotalApostas.value)}</div>
              </div>
            </div>
           
          </div>

          <!-- Seção de Agrupamento -->
          <h2 style="font-size: 24px; font-weight: bold; color: #333; margin: 30px 0 20px 0; text-align: center;">Resumo por Tipo e Cavalo</h2>
          <p style="text-align: center; color: #666; margin-bottom: 30px; font-size: 14px;">Apostas agrupadas e somadas por tipo de rodada e cavalo</p>
          
          ${Object.entries(apostasAgrupadas.value).map(([tipo, tipoData]) => `
            <div style="margin-bottom: 30px;">
              <h3 style="background: #ffcc00; color: black; padding: 15px; margin: 0; font-size: 18px; font-weight: bold;">${tipo}</h3>
              <table style="border-collapse: collapse; width: 100%; border: 1px solid #e5e5e5;">
                <thead>
                  <tr style="background: #f5f5f5;">
                  </tr>
                </thead>
                <tbody>
                  ${Object.entries(tipoData).filter(([key]) => !key.startsWith('_')).map(([cavalo, cavaloData]) => `
                    <tr>
                      <td style="border: 1px solid #e5e5e5; padding: 12px; background: white; font-weight: bold;">${cavalo}</td>
                      <td style="border: 1px solid #e5e5e5; padding: 12px; background: white;">${formatCurrency(cavaloData.premioIndividual)}</td>
                    </tr>
                  `).join('')}
                </tbody>
               
              </table>
            </div>
          `).join('')}
          
          
      </body>
    </html>
  `

  // Criar nova janela para impressão
  const printWindow = window.open('', '_blank')
  printWindow.document.write(content)
  printWindow.document.close()
  
  // Aguardar carregamento e imprimir
  printWindow.onload = () => {
    printWindow.print()
  }
}
</script>
