<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div class="bg-white rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
      <!-- Header -->
      <div class="bg-gradient-to-r from-primary-600 to-secondary-600 text-white p-6">
        <div class="flex justify-between items-center">
          <div>
            <h2 class="text-2xl font-bold">{{ apostador.nome }}</h2>
            <p class="text-primary-100">{{ campeonato.nome }} - {{ campeonato.ano }}</p>
            <p class="text-primary-200 text-sm">ID Apostador: {{ apostador.id }} | ID Campeonato: {{ campeonato.id }}</p>
          </div>
          <button 
            @click="closeModal"
            class="text-white hover:text-gray-200 transition-colors"
          >
            <XMarkIcon class="w-6 h-6" />
          </button>
        </div>
      </div>

      <!-- Content -->
      <div class="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
        <!-- Tabela de apostas -->
        <div class="mb-6">
          <h3 class="text-lg font-semibold text-neutral-800 mb-4">Detalhes das Apostas</h3>
          <div class="overflow-x-auto">
            <table class="w-full border-collapse border border-neutral-300">
              <thead>
                <tr class="bg-neutral-100">
                  <th class="border border-neutral-300 px-4 py-2 text-left font-semibold">Rodada</th>
                  <th class="border border-neutral-300 px-4 py-2 text-left font-semibold">Chave (Cavalo)</th>
                  <th class="border border-neutral-300 px-4 py-2 text-left font-semibold">Valor da Aposta</th>
                  <th class="border border-neutral-300 px-4 py-2 text-left font-semibold">Porcentagem</th>
                  <th class="border border-neutral-300 px-4 py-2 text-left font-semibold">Prêmio Individual</th>
                  <th class="border border-neutral-300 px-4 py-2 text-left font-semibold">Total da Rodada</th>
                  <th class="border border-neutral-300 px-4 py-2 text-center font-semibold">Ações</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="aposta in apostas" :key="aposta.id" class="hover:bg-neutral-50">
                  <td class="border border-neutral-300 px-4 py-2">{{ aposta.rodadas?.rodada?.nomeRodada || 'N/A' }}</td>
                  <td class="border border-neutral-300 px-4 py-2">{{ aposta.cavalo }}</td>
                  <td class="border border-neutral-300 px-4 py-2">{{ formatCurrency(aposta.valorUnitario) }}</td>
                  <td class="border border-neutral-300 px-4 py-2">{{ aposta.porcentagem }}%</td>
                  <td class="border border-neutral-300 px-4 py-2">{{ formatCurrency(aposta.premioIndividual) }}</td>
                  <td class="border border-neutral-300 px-4 py-2">{{ formatCurrency(aposta.total) }}</td>
                  <td class="border border-neutral-300 px-4 py-2 text-center">
                    <button 
                      @click="confirmarExclusao(aposta)"
                      class="text-red-600 hover:text-red-800 transition-colors p-1 rounded hover:bg-red-50"
                      title="Excluir aposta"
                    >
                      <TrashIcon class="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Resumo das apostas -->
        <div class="bg-gradient-to-r from-primary-50 to-secondary-50 p-4 rounded-lg space-y-3">
          <div class="flex justify-between items-center">
            <span class="text-lg font-semibold text-neutral-800">Valor Total das Apostas:</span>
            <span class="text-2xl font-bold text-primary-600">{{ formatCurrency(valorTotalAposta) }}</span>
          </div>
          
          <div class="grid grid-cols-2 gap-4 text-sm">
            <div class="flex justify-between">
              <span class="text-neutral-600">Total de Apostas:</span>
              <span class="font-semibold">{{ apostas.length }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-neutral-600">Cavalos Únicos:</span>
              <span class="font-semibold">{{ cavalosUnicos }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="bg-neutral-100 px-6 py-4 flex justify-end space-x-3">
        <button 
          @click="closeModal"
          class="px-4 py-2 text-neutral-600 hover:text-neutral-800 transition-colors"
        >
          Fechar
        </button>
        <button 
          @click="generatePDF"
          class="px-6 py-2 bg-primary-600 text-white rounded hover:bg-primary-700 transition-colors flex items-center space-x-2"
        >
          <DocumentArrowDownIcon class="w-4 h-4" />
          <span>Gerar PDF</span>
        </button>
      </div>
    </div>
  </div>

  <!-- Modal de Confirmação de Exclusão -->
  <div v-if="showModalConfirmacao" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4">
    <div class="bg-white rounded-lg shadow-2xl max-w-md w-full">
      <!-- Header -->
      <div class="bg-red-50 border-b border-red-200 p-6">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <svg class="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 19.5c-.77.833.192 2.5 1.732 2.5z"></path>
            </svg>
          </div>
          <div class="ml-3">
            <h3 class="text-lg font-semibold text-red-800">Confirmar Exclusão</h3>
            <p class="text-sm text-red-600">Esta ação não pode ser desfeita</p>
          </div>
        </div>
      </div>

      <!-- Content -->
      <div class="p-6">
        <div class="mb-4">
          <p class="text-gray-700 mb-2">
            Tem certeza que deseja excluir a aposta do cavalo:
          </p>
          <div class="bg-gray-50 p-3 rounded-lg border">
            <p class="font-semibold text-gray-900">{{ apostaParaExcluir?.cavalo }}</p>
            <p class="text-sm text-gray-600">
              Rodada: {{ apostaParaExcluir?.rodadas?.rodada?.nomeRodada || 'N/A' }}
            </p>
            <p class="text-sm text-gray-600">
              Valor: {{ formatCurrency(apostaParaExcluir?.valorUnitario || 0) }}
            </p>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="bg-gray-50 px-6 py-4 flex justify-end space-x-3">
        <button 
          @click="fecharModalConfirmacao"
          class="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
        >
          Cancelar
        </button>
        <button 
          @click="confirmarExclusaoAposta"
          class="px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors flex items-center space-x-2"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
          </svg>
          <span>Excluir Aposta</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { XMarkIcon, DocumentArrowDownIcon, TrashIcon } from '@heroicons/vue/24/outline'

const props = defineProps({
  isOpen: Boolean,
  apostador: Object,
  campeonato: Object,
  apostas: Array
})

const emit = defineEmits(['close', 'aposta-excluida'])

// Estados para modal de confirmação
const showModalConfirmacao = ref(false)
const apostaParaExcluir = ref(null)

const closeModal = () => {
  emit('close')
}

const confirmarExclusao = (aposta) => {
  apostaParaExcluir.value = aposta
  showModalConfirmacao.value = true
}

const confirmarExclusaoAposta = () => {
  emit('aposta-excluida', apostaParaExcluir.value)
  fecharModalConfirmacao()
}

const fecharModalConfirmacao = () => {
  showModalConfirmacao.value = false
  apostaParaExcluir.value = null
}

const formatCurrency = (value) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value)
}

const valorTotalAposta = computed(() => {
  return props.apostas.reduce((total, aposta) => total + aposta.valorUnitario, 0)
})

const cavalosUnicos = computed(() => {
  const cavalos = new Set(props.apostas.map(aposta => aposta.cavalo))
  return cavalos.size
})

const generatePDF = () => {
  // Criar conteúdo HTML para o PDF
  const content = `
    <html>
      <head>
        <title>Relatório de Apostas - ${props.apostador.nome}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          .header { text-align: center; margin-bottom: 30px; }
          .title { font-size: 24px; font-weight: bold; color: #333; }
          .subtitle { font-size: 16px; color: #666; margin-top: 5px; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #f5f5f5; font-weight: bold; }
          .total { background-color: #f0f8ff; padding: 15px; text-align: center; font-size: 18px; font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="title">Relatório de Apostas</div>
          <div class="subtitle">${props.apostador.nome} - ${props.campeonato.nome} (${props.campeonato.ano})</div>
          <div style="font-size: 12px; color: #666; margin-top: 5px;">
            ID Apostador: ${props.apostador.id} | ID Campeonato: ${props.campeonato.id}
          </div>
        </div>
        
        <table>
          <thead>
            <tr>
              <th>Rodada</th>
              <th>Chave (Cavalo)</th>
              <th>Valor da Aposta</th>
              <th>Porcentagem</th>
              <th>Prêmio Individual</th>
              <th>Total da Rodada</th>
            </tr>
          </thead>
          <tbody>
            ${props.apostas.map(aposta => `
              <tr>
                <td>${aposta.rodadas?.rodada?.nomeRodada || 'N/A'}</td>
                <td>${aposta.cavalo}</td>
                <td>${formatCurrency(aposta.valorUnitario)}</td>
                <td>${aposta.porcentagem}%</td>
                <td>${formatCurrency(aposta.premioIndividual)}</td>
                <td>${formatCurrency(aposta.total)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        
        <div class="total">
          <div style="margin-bottom: 10px;">
            <strong>Valor Total das Apostas: ${formatCurrency(valorTotalAposta.value)}</strong>
          </div>
          <div style="display: flex; justify-content: space-between; font-size: 14px;">
            <span>Total de Apostas: ${props.apostas.length}</span>
            <span>Cavalos Únicos: ${cavalosUnicos.value}</span>
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
