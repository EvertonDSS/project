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
        <div class="text-center mb-8">
          <div class="flex items-center justify-center mb-4">
            <div class="w-16 h-16 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-full flex items-center justify-center mr-4">
              <span class="text-white font-bold text-xl">J</span>
            </div>
            <div class="text-left">
              <h2 class="text-2xl font-bold text-neutral-800">JOGOS</h2>
              <p class="text-sm text-neutral-600">ONLINE</p>
            </div>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div class="bg-blue-600 text-white p-3 rounded">
              <p class="font-semibold">NOME APOSTADOR</p>
              <p class="text-lg">{{ apostadorSelecionadoNome }}</p>
            </div>
            <div class="bg-blue-600 text-white p-3 rounded">
              <p class="font-semibold">NOME CAMPEONATO</p>
              <p class="text-lg">{{ campeonatoSelecionadoNome }}</p>
            </div>
          </div>
        </div>

        <!-- Tabela de Apostas (Original) -->
        <div class="overflow-x-auto mb-6">
          <table class="w-full border-collapse">
            <thead>
              <tr class="bg-red-600 text-white">
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
          <div class="bg-red-600 text-white p-4 rounded">
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
            <div class="bg-red-600 text-white p-4 rounded-t-lg">
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
          <div v-for="(tipoData, tipo) in apostasAgrupadas" :key="tipo" class="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-lg">
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

const { getCampeonatos, getApostadoresPorCampeonato, getApostasPorApostador, getTipoPorId, getGrupoPorCampeonato } = useApi()

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

// Carregar dados iniciais
onMounted(async () => {
  await carregarCampeonatos()
})

const carregarCampeonatos = async () => {
  loading.value = true
  try {
    const campeonatos = await getCampeonatos()
    campeonatoOptions.value = campeonatos.map(campeonato => ({
      value: campeonato.id,
      label: campeonato.nome
    }))
  } catch (error) {
    console.error('Erro ao carregar campeonatos:', error)
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
    const apostadores = await getApostadoresPorCampeonato(campeonatoId)
    apostadorOptions.value = apostadores.map(apostador => ({
      value: apostador.id,
      label: apostador.nome
    }))
    apostadorSelecionado.value = ''
  } catch (error) {
    console.error('Erro ao carregar apostadores:', error)
  }
}

const carregarApostas = async () => {
  if (!campeonatoSelecionado.value || !apostadorSelecionado.value) return

  loadingApostas.value = true
  errorApostas.value = ''

  try {
    const apostas = await getApostasPorApostador(
      parseInt(campeonatoSelecionado.value),
      parseInt(apostadorSelecionado.value)
    )

    // Mapear apostas para o formato do relatório, buscando nomes dos tipos e dados do grupo
    const apostasComTipos = await Promise.all(apostas.map(async (aposta) => {
      let nomeTipo = aposta.rodadas?.tipo?.nome || 'SEM TIPO'
      
      // Se não tiver nome do tipo, buscar pelo endpoint
      if (!aposta.rodadas?.tipo?.nome && aposta.rodadas?.tipoId) {
        try {
          const tipoInfo = await getTipoPorId(aposta.rodadas.tipoId)
          nomeTipo = tipoInfo.nome
        } catch (error) {
          console.error('Erro ao buscar tipo:', error)
          nomeTipo = `Tipo ${aposta.rodadas.tipoId}`
        }
      }
      
      // Buscar dados do grupo para obter pareo e cavalos
      let nomeCavalo = 'Grupo Desconhecido'
      if (aposta.grupoId) {
        try {
          const grupoInfo = await getGrupoPorCampeonato(aposta.campeonatoId, aposta.grupoId)
          nomeCavalo = `${grupoInfo.pareo} - ${grupoInfo.cavalos}`
        } catch (error) {
          console.error('Erro ao buscar dados do grupo:', error)
          nomeCavalo = `Grupo ${aposta.grupoId}`
        }
      }
      
      return {
        rodada: aposta.rodadas?.rodada?.nomeRodada || 'N/A',
        chave: nomeCavalo,
        valorAposta: parseFloat(aposta.valorUnitario),
        porcentagem: parseFloat(aposta.porcentagem),
        premioIndividual: parseFloat(aposta.total || 0),
        totalRodada: parseFloat(aposta.rodadas?.valorRodada || 0),
        tipo: nomeTipo,
        cavalo: nomeCavalo
      }
    }))

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
          .logo-icon {
            width: 60px;
            height: 60px;
            background: linear-gradient(135deg, #3b82f6, #8b5cf6);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-right: 15px;
            color: white;
            font-size: 24px;
            font-weight: bold;
          }
          .logo-text {
            text-align: left;
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
          .info-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin-bottom: 30px;
          }
          .info-card {
            background: linear-gradient(135deg, #3b82f6, #1d4ed8);
            color: white;
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
            background: linear-gradient(135deg, #dc2626, #b91c1c);
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
            background: linear-gradient(135deg, #dc2626, #b91c1c);
            color: white;
            padding: 15px;
            text-align: center;
            font-weight: bold;
            font-size: 16px;
          }
          .summary-content {
            background: linear-gradient(135deg, #3b82f6, #1d4ed8);
            color: white;
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
            background: linear-gradient(135deg, #dc2626, #b91c1c);
            color: white;
            padding: 15px;
            text-align: center;
            font-weight: bold;
            font-size: 16px;
          }
          .boloes-subheader {
            background: linear-gradient(135deg, #3b82f6, #1d4ed8);
            color: white;
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
            <div class="logo">
              <div class="logo-icon">J</div>
              <div class="logo-text">
                <div class="title">JOGOS</div>
                <div class="subtitle">ONLINE</div>
              </div>
            </div>
          </div>
          
          <div class="info-grid">
            <div class="info-card">
              <div class="info-label">NOME APOSTADOR</div>
              <div class="info-value">${apostadorSelecionadoNome.value}</div>
            </div>
            <div class="info-card">
              <div class="info-label">NOME CAMPEONATO</div>
              <div class="info-value">${campeonatoSelecionadoNome.value}</div>
            </div>
          </div>
          
          <!-- Tabela Original de Apostas -->
          <h2 style="font-size: 24px; font-weight: bold; color: #333; margin: 30px 0 20px 0; text-align: center;">Apostas Detalhadas</h2>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px; background-color: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
            <thead>
              <tr style="background: linear-gradient(135deg, #dc2626, #b91c1c); color: white;">
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
              <div style="background: linear-gradient(135deg, #dc2626, #b91c1c); color: white; padding: 15px; text-align: center; font-weight: bold; font-size: 16px;">VALOR TOTAL DA APOSTA</div>
              <div style="background: linear-gradient(135deg, #3b82f6, #1d4ed8); color: white; padding: 20px; text-align: center;">
                <div style="font-size: 24px; font-weight: bold;">${formatCurrency(valorTotalApostas.value)}</div>
              </div>
            </div>
           
          </div>

          <!-- Seção de Agrupamento -->
          <h2 style="font-size: 24px; font-weight: bold; color: #333; margin: 30px 0 20px 0; text-align: center;">Resumo por Tipo e Cavalo</h2>
          <p style="text-align: center; color: #666; margin-bottom: 30px; font-size: 14px;">Apostas agrupadas e somadas por tipo de rodada e cavalo</p>
          
          ${Object.entries(apostasAgrupadas.value).map(([tipo, tipoData]) => `
            <div style="margin-bottom: 30px;">
              <h3 style="background: #2563eb; color: white; padding: 15px; margin: 0; font-size: 18px; font-weight: bold;">${tipo}</h3>
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
