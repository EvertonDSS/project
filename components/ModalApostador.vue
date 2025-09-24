<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div class="bg-white rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
      <!-- Header -->
      <div class="bg-gradient-to-r from-primary-600 to-secondary-600 text-white p-6">
        <div class="flex justify-between items-center">
          <div>
            <h2 class="text-2xl font-bold">{{ apostador.nome }}</h2>
            <p class="text-primary-100">{{ campeonato.nome }} - {{ campeonato.ano }}</p>
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
                </tr>
              </thead>
              <tbody>
                <tr v-for="(aposta, index) in apostas" :key="index" class="hover:bg-neutral-50">
                  <td class="border border-neutral-300 px-4 py-2">{{ aposta.rodada }}</td>
                  <td class="border border-neutral-300 px-4 py-2">{{ aposta.cavalo }}</td>
                  <td class="border border-neutral-300 px-4 py-2">{{ formatCurrency(aposta.valorAposta) }}</td>
                  <td class="border border-neutral-300 px-4 py-2">{{ aposta.porcentagem }}%</td>
                  <td class="border border-neutral-300 px-4 py-2">{{ formatCurrency(aposta.premioIndividual) }}</td>
                  <td class="border border-neutral-300 px-4 py-2">{{ formatCurrency(aposta.totalRodada) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Total da aposta -->
        <div class="bg-gradient-to-r from-primary-50 to-secondary-50 p-4 rounded-lg">
          <div class="flex justify-between items-center">
            <span class="text-lg font-semibold text-neutral-800">Valor Total da Aposta:</span>
            <span class="text-2xl font-bold text-primary-600">{{ formatCurrency(valorTotalAposta) }}</span>
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
</template>

<script setup>
import { XMarkIcon, DocumentArrowDownIcon } from '@heroicons/vue/24/outline'

const props = defineProps({
  isOpen: Boolean,
  apostador: Object,
  campeonato: Object,
  apostas: Array
})

const emit = defineEmits(['close'])

const closeModal = () => {
  emit('close')
}

const formatCurrency = (value) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value)
}

const valorTotalAposta = computed(() => {
  return props.apostas.reduce((total, aposta) => total + aposta.valorAposta, 0)
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
                <td>${aposta.rodada}</td>
                <td>${aposta.cavalo}</td>
                <td>${formatCurrency(aposta.valorAposta)}</td>
                <td>${aposta.porcentagem}%</td>
                <td>${formatCurrency(aposta.premioIndividual)}</td>
                <td>${formatCurrency(aposta.totalRodada)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        
        <div class="total">
          Valor Total da Aposta: ${formatCurrency(valorTotalAposta.value)}
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
