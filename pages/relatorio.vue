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

        <!-- Tabela de Apostas -->
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

        <!-- Resumos -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Valor Total da Aposta -->
          <div class="bg-red-600 text-white p-4 rounded">
            <h3 class="font-semibold text-lg mb-2">VALOR TOTAL DA APOSTA:</h3>
            <p class="text-2xl font-bold">{{ formatCurrency(valorTotalApostas) }}</p>
          </div>

          <!-- Bolões de Chave -->
          <div>
            <div class="bg-red-600 text-white p-3 rounded mb-2">
              <h3 class="font-semibold">BOLÕES DE CHAVE</h3>
            </div>
            <div class="bg-blue-600 text-white p-3 rounded mb-2">
              <p class="font-semibold">VALOR</p>
            </div>
            <div class="grid grid-cols-2 gap-2">
              <div class="bg-green-100 p-3 rounded border">
                <p class="text-sm text-neutral-600">{{ chaveUnica }}</p>
              </div>
              <div class="bg-green-100 p-3 rounded border">
                <p class="text-sm font-semibold text-neutral-800">{{ formatCurrency(valorTotalPremios) }}</p>
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

const { getCampeonatos, getApostadoresPorCampeonato, getApostasPorApostador } = useApi()

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

    // Mapear apostas para o formato do relatório
    apostasCarregadas.value = apostas.map(aposta => ({
      rodada: aposta.rodadas?.rodada?.nomeRodada || 'N/A',
      chave: `${aposta.cavalo.nome}`,
      valorAposta: parseFloat(aposta.valorUnitario),
      porcentagem: parseFloat(aposta.porcentagem),
      premioIndividual: parseFloat(aposta.total || 0),
      totalRodada: parseFloat(aposta.rodadas?.valorRodada || 0)
    }))
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
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value)
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
          
          <table>
            <thead>
              <tr>
                <th>RODADA</th>
                <th>CHAVE</th>
                <th>VALOR DA APOSTA</th>
                <th>%</th>
                <th>PRÊMIO INDIVIDUAL</th>
                <th>TOTAL DA RODADA</th>
              </tr>
            </thead>
            <tbody>
              ${apostasCarregadas.value.map(aposta => `
                <tr>
                  <td>${aposta.rodada}</td>
                  <td>${aposta.chave}</td>
                  <td>${formatCurrency(aposta.valorAposta)}</td>
                  <td>${aposta.porcentagem}%</td>
                  <td>${formatCurrency(aposta.premioIndividual)}</td>
                  <td>${formatCurrency(aposta.totalRodada)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          
          <div class="summary-grid">
            <div class="summary-card">
              <div class="summary-header">VALOR TOTAL DA APOSTA</div>
              <div class="summary-content">
                <div class="summary-value">${formatCurrency(valorTotalApostas.value)}</div>
              </div>
            </div>
            
            <div class="boloes-section">
              <div class="boloes-header">BOLÕES DE CHAVE</div>
              <div class="boloes-subheader">VALOR</div>
              <div class="boloes-content">
                <div class="boloes-item">${chaveUnica.value}</div>
                <div class="boloes-item">${formatCurrency(valorTotalPremios.value)}</div>
              </div>
            </div>
          </div>
        </div>
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
