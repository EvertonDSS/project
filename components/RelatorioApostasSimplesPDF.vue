<template>
  <div>
    <!-- Modal do Relatório -->
    <div v-if="modalAberto" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-xl max-w-6xl w-full mx-4 max-h-[90vh] overflow-hidden">
        <!-- Header da Modal -->
        <div class="flex justify-between items-center p-4 border-b">
          <h2 class="text-xl font-bold text-gray-800">Relatório de Apostas - {{ dados.apostador.nome }}</h2>
          <div class="flex gap-2">
            <button 
              @click="imprimirModal"
              class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path>
              </svg>
              Download PDF
            </button>
            <!-- <button 
              @click="fazerDownloadPDF"
              class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
              Download PDF
              </button> -->
              <button 
                @click="fecharModal"
                class="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg"
              >
                Fechar
              </button>
          </div>
        </div>
        
        <!-- Conteúdo da Modal -->
        <div class="overflow-auto max-h-[calc(90vh-80px)]">
          <div v-html="htmlRelatorio" class="p-6"></div>
        </div>
      </div>
    </div>
    
    <div class="hidden">
      <canvas ref="canvas" width="800" height="1000"></canvas>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  dados: {
    type: Object,
    required: true
  }
})

const canvas = ref(null)
const modalAberto = ref(false)
const htmlRelatorio = ref('')

const gerarPDF = async () => {
  // Gerar HTML e armazenar
  htmlRelatorio.value = gerarHTML()
  
  // Abrir modal
  modalAberto.value = true
}

const fecharModal = () => {
  modalAberto.value = false
}

const fazerDownloadPDF = async () => {
  await gerarPDFDownload()
}

const imprimirModal = () => {
  // Criar uma nova janela para impressão
  const janelaImpressao = window.open('', '_blank')
  
  // HTML completo para impressão
  const htmlImpressao = `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Relatório de Apostas - ${props.dados.apostador.nome}</title>
        <style>
            @media print {
                body { margin: 0; }
                .no-print { display: none !important; }
            }
            body {
                font-family: Arial, sans-serif;
                margin: 0;
                padding: 20px;
                background: white;
            }
        </style>
    </head>
    <body>
        ${htmlRelatorio.value}
    </body>
    </html>
  `
  
  // Escrever o HTML na nova janela
  janelaImpressao.document.write(htmlImpressao)
  janelaImpressao.document.close()
  
  // Aguardar o carregamento e imprimir
  janelaImpressao.onload = () => {
    janelaImpressao.print()
    janelaImpressao.close()
  }
}

const gerarHTML = () => {
  let totalApostado = 0
  let apostasPorTipo = new Map()
  
  // Função para formatar números no padrão brasileiro
  const formatarNumeroBrasileiro = (numero) => {
    // Converter string para número se necessário
    const valorNumerico = typeof numero === 'string' ? parseFloat(numero) : numero
    return valorNumerico.toLocaleString('pt-BR', { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    })
  }
  
  // Processar dados
  props.dados.apostasPorRodada.forEach(rodada => {
    rodada.apostas.forEach((aposta, index) => {
      const cavalosNomes = aposta.pareo.cavalos.map(cavalo => cavalo.nome)
      const chave = cavalosNomes.length > 1
        ? `${aposta.pareo.numero} - ${cavalosNomes[0]}\n${cavalosNomes.slice(1).join('\n')}`
        : `${aposta.pareo.numero} - ${cavalosNomes[0] || ''}`
      
      totalApostado += aposta.valor
      
      // Agrupar por tipo de rodada
      const tipoRodada = rodada.tipoRodada.nome
      if (!apostasPorTipo.has(tipoRodada)) {
        apostasPorTipo.set(tipoRodada, new Map())
      }
      
      // Se já existe essa chave no tipo, somar os valores
      if (apostasPorTipo.get(tipoRodada).has(chave)) {
        const valorAtual = apostasPorTipo.get(tipoRodada).get(chave)
        apostasPorTipo.get(tipoRodada).set(chave, valorAtual + aposta.valorPremio)
      } else {
        apostasPorTipo.get(tipoRodada).set(chave, aposta.valorPremio)
      }
    })
  })
  
  // Função para ordenar rodadas: Rodada 01, Rodada 01 B, Rodada 02, Rodada 02 B, etc.
  const ordenarRodadas = (rodadas) => {
    if (!rodadas || !Array.isArray(rodadas)) return rodadas
    
    return [...rodadas].sort((a, b) => {
      const nomeA = (a.nomeRodada || '').trim()
      const nomeB = (b.nomeRodada || '').trim()
      
      // Extrair número da rodada (ex: "Rodada 01" -> 01, "Rodada 01 B" -> 01)
      const regexNumero = /(\d+)/i
      const matchA = nomeA.match(regexNumero)
      const matchB = nomeB.match(regexNumero)
      
      const numeroA = matchA ? parseInt(matchA[1], 10) : 0
      const numeroB = matchB ? parseInt(matchB[1], 10) : 0
      
      // Comparar números primeiro
      if (numeroA !== numeroB) {
        return numeroA - numeroB
      }
      
      // Se números são iguais, verificar se tem "B" (com "B" vem depois)
      const temBA = /\bB\b/i.test(nomeA)
      const temBB = /\bB\b/i.test(nomeB)
      
      if (temBA && !temBB) return 1  // A tem "B", B não tem -> B vem primeiro
      if (!temBA && temBB) return -1 // A não tem "B", B tem -> A vem primeiro
      
      // Ambos têm ou não têm "B", manter ordem original
      return 0
    })
  }
  
  // Ordenar rodadas antes de gerar linhas
  const rodadasOrdenadas = ordenarRodadas(props.dados.apostasPorRodada)
  
  // Gerar linhas da tabela
  const linhasTabela = rodadasOrdenadas.map(rodada => 
    rodada.apostas.map((aposta, index) => {
      const isUltimaLinha = index === rodada.apostas.length - 1
      const cavalosNomes = aposta.pareo.cavalos.map(cavalo => cavalo.nome)
      const chave = cavalosNomes.length > 1
        ? `${aposta.pareo.numero} - ${cavalosNomes[0]}\n${cavalosNomes.slice(1).join('\n')}`
        : `${aposta.pareo.numero} - ${cavalosNomes[0] || ''}`
      
      return `
        <tr>
          <td>${rodada.nomeRodada}</td>
          <td style="white-space: pre-line; line-height: 1.4;">${chave}</td>
          <td class="valor">R$ ${aposta.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
          <td class="porcentagem">${aposta.porcentagemAposta}%</td>
          <td class="premio">R$ ${aposta.valorPremio.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
          <td class="total-rodada">R$ ${formatarNumeroBrasileiro(aposta.valorOriginalPremio)}</td>
        </tr>
      `
    }).join('')
  ).join('')
  
  // Gerar seções de resumo
  const secoesResumo = Array.from(apostasPorTipo.entries()).map(([tipoRodada, apostasMap]) => `
    <div class="summary-section">
      <div class="summary-title">${tipoRodada.toUpperCase()}</div>
      <table class="summary-table">
        <tbody>
          ${Array.from(apostasMap.entries()).map(([chave, valor]) => `
            <tr>
              <td style="white-space: pre-line; line-height: 1.4;">${chave}</td>
              <td>R$ ${valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `).join('')
  
  return `
    <style>
      .relatorio-container {
        font-family: 'Arial', sans-serif;
        font-size: 12px;
        line-height: 1.4;
        color: #333;
        background: white;
      }

      .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 30px;
        padding-bottom: 20px;
        border-bottom: 2px solid #D4AF37;
      }

      .logo {
        display: flex;
        align-items: center;
        gap: 10px;
      }

      .logo-icon {
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

      .logo-text {
        font-size: 18px;
        font-weight: bold;
        color: #D4AF37;
      }

      .apostador-name {
        background: #D4AF37;
        color: white;
        padding: 8px 16px;
        border-radius: 4px;
        font-weight: bold;
        font-size: 14px;
      }

      .title {
        text-align: center;
        font-size: 20px;
        font-weight: bold;
        color: #D4AF37;
        margin-bottom: 30px;
      }

      .table {
        width: 100%;
        border-collapse: collapse;
        margin-bottom: 30px;
      }

      .table th {
        background: #D4AF37;
        color: white;
        padding: 12px 8px;
        text-align: center;
        font-weight: bold;
        border: 1px solid #B8941F;
      }

      .table td {
        padding: 10px 8px;
        text-align: center;
        border: 1px solid #ddd;
        background: white;
      }

      .table tr:nth-child(even) td {
        background: #f9f9f9;
      }

      .valor {
        font-weight: bold;
        color: #2E7D32;
      }

      .porcentagem {
        color: #1976D2;
        font-weight: bold;
      }

      .premio {
        color: #D4AF37;
        font-weight: bold;
      }

      .total-rodada {
        background: #E8F5E8 !important;
        font-weight: bold;
        color: #2E7D32;
      }

      .summary {
        margin-top: 30px;
      }

      .summary-section {
        margin-bottom: 20px;
      }

      .summary-title {
        background: #D4AF37;
        color: white;
        padding: 8px 12px;
        font-weight: bold;
        margin-bottom: 10px;
      }

      .summary-value {
        background: #D4AF37;
        color: white;
        padding: 8px 12px;
        font-weight: bold;
        font-size: 16px;
      }

      .summary-table {
        width: 100%;
        border-collapse: collapse;
        margin-top: 10px;
      }

      .summary-table th {
        background: #D4AF37;
        color: white;
        padding: 8px 12px;
        text-align: left;
        font-weight: bold;
      }

      .summary-table td {
        padding: 8px 12px;
        border: 1px solid #ddd;
        background: white;
      }
    </style>
    
    <div class="relatorio-container">
      <div class="header">
        <div class="logo">
          <div class="logo-icon">🐎</div>
          <div class="logo-text">JOGOS ONLINE</div>
        </div>
        <div class="apostador-name">${props.dados.apostador.nome}</div>
      </div>

      <div class="title">RELATÓRIO DE APOSTAS</div>

      <table class="table">
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
          ${linhasTabela}
        </tbody>
      </table>

      <div class="summary">
        <div class="summary-section">
          <div class="summary-title">VALOR TOTAL DA APOSTA:</div>
          <div class="summary-value">R$ ${totalApostado.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
        </div>

        ${secoesResumo}
      </div>
    </div>
  `
}

const gerarPDFDownload = async () => {
  // Importação dinâmica do jsPDF
  const { default: jsPDF } = await import('jspdf')
  
  // Função para formatar números no padrão brasileiro
  const formatarNumeroBrasileiro = (numero) => {
    // Converter string para número se necessário
    const valorNumerico = typeof numero === 'string' ? parseFloat(numero) : numero
    return valorNumerico.toLocaleString('pt-BR', { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    })
  }
  
  const doc = new jsPDF('p', 'mm', 'a4')
  
  // Configurações de fonte e cores
  const corDourada = '#D4AF37'
  const corVerde = '#2E7D32'
  const corAzul = '#1976D2'
  const corCinzaEscuro = '#333333'
  
  // Converter cores hex para RGB
  const hexToRgb = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null
  }
  
  const douradaRgb = hexToRgb(corDourada)
  const verdeRgb = hexToRgb(corVerde)
  const azulRgb = hexToRgb(corAzul)
  
  // Header - Logo e nome do apostador
  let currentY = 20
  
  // Logo (círculo dourado)
  doc.setFillColor(douradaRgb.r, douradaRgb.g, douradaRgb.b)
  doc.circle(30, currentY + 10, 10, 'F')
  
  // Texto "JOGOS ONLINE"
  doc.setTextColor(douradaRgb.r, douradaRgb.g, douradaRgb.b)
  doc.setFontSize(18)
  doc.setFont(undefined, 'bold')
  doc.text('JOGOS ONLINE', 50, currentY + 15)
  
  // Nome do apostador (canto direito)
  doc.setFillColor(douradaRgb.r, douradaRgb.g, douradaRgb.b)
  doc.rect(140, currentY, 50, 20, 'F')
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(14)
  doc.setFont(undefined, 'bold')
  doc.text(props.dados.apostador.nome, 150, currentY + 13)
  
  // Linha separadora dourada
  doc.setDrawColor(douradaRgb.r, douradaRgb.g, douradaRgb.b)
  doc.setLineWidth(2)
  doc.line(20, currentY + 30, 190, currentY + 30)
  
  // Avançar Y após o header completo
  currentY += 50
  
  // Título principal
  doc.setTextColor(douradaRgb.r, douradaRgb.g, douradaRgb.b)
  doc.setFontSize(20)
  doc.setFont(undefined, 'bold')
  doc.text('RELATÓRIO DE APOSTAS', 105, currentY, { align: 'center' })
  
  // Avançar Y após o título
  currentY += 30
  
  // Cabeçalho da tabela
  const colWidths = [20, 45, 30, 15, 35, 35] // Ajustadas para caber na página A4
  const headers = ['RODADA', 'CHAVE', 'VALOR', '%', 'PRÊMIO', 'TOTAL']
  const totalWidth = colWidths.reduce((sum, width) => sum + width, 0) // 180mm total (cabe na página A4)
  
  // Fundo dourado do cabeçalho
  doc.setFillColor(douradaRgb.r, douradaRgb.g, douradaRgb.b)
  doc.rect(20, currentY, totalWidth, 12, 'F')
  
  // Texto do cabeçalho
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(9) // Fonte ainda menor para garantir que caiba
  doc.setFont(undefined, 'bold')
  
  let currentX = 20
  headers.forEach((header, index) => {
    // Centralizar texto em cada coluna
    const textWidth = doc.getTextWidth(header)
    const centerX = currentX + (colWidths[index] / 2) - (textWidth / 2)
    doc.text(header, centerX, currentY + 8)
    currentX += colWidths[index]
  })
  
  // Avançar Y após o cabeçalho da tabela
  currentY += 12
  
  // Função para ordenar rodadas: Rodada 01, Rodada 01 B, Rodada 02, Rodada 02 B, etc.
  const ordenarRodadas = (rodadas) => {
    if (!rodadas || !Array.isArray(rodadas)) return rodadas
    
    return [...rodadas].sort((a, b) => {
      const nomeA = (a.nomeRodada || '').trim()
      const nomeB = (b.nomeRodada || '').trim()
      
      // Extrair número da rodada (ex: "Rodada 01" -> 01, "Rodada 01 B" -> 01)
      const regexNumero = /(\d+)/i
      const matchA = nomeA.match(regexNumero)
      const matchB = nomeB.match(regexNumero)
      
      const numeroA = matchA ? parseInt(matchA[1], 10) : 0
      const numeroB = matchB ? parseInt(matchB[1], 10) : 0
      
      // Comparar números primeiro
      if (numeroA !== numeroB) {
        return numeroA - numeroB
      }
      
      // Se números são iguais, verificar se tem "B" (com "B" vem depois)
      const temBA = /\bB\b/i.test(nomeA)
      const temBB = /\bB\b/i.test(nomeB)
      
      if (temBA && !temBB) return 1  // A tem "B", B não tem -> B vem primeiro
      if (!temBA && temBB) return -1 // A não tem "B", B tem -> A vem primeiro
      
      // Ambos têm ou não têm "B", manter ordem original
      return 0
    })
  }
  
  // Ordenar rodadas para processamento do PDF
  const rodadasOrdenadas = ordenarRodadas(props.dados.apostasPorRodada)
  
  // Dados das apostas
  let totalApostado = 0
  let apostasPorTipo = new Map()
  let apostasProcessadas = new Map() // Para evitar duplicação na tabela principal
  
  rodadasOrdenadas.forEach(rodada => {
    rodada.apostas.forEach((aposta, index) => {
      const cavalosNomes = aposta.pareo.cavalos.map(cavalo => cavalo.nome)
      const chave = cavalosNomes.length > 1
        ? `${aposta.pareo.numero} - ${cavalosNomes[0]}\n${cavalosNomes.slice(1).join('\n')}`
        : `${aposta.pareo.numero} - ${cavalosNomes[0] || ''}`
      const chaveUnica = `${rodada.nomeRodada}-${chave}`
      
      // Se já processamos esta chave única, pular
      if (apostasProcessadas.has(chaveUnica)) {
        return
      }
      
      // Marcar como processada
      apostasProcessadas.set(chaveUnica, true)
      
      const isUltimaLinha = index === rodada.apostas.length - 1
      const numLinhasChave = chave.split('\n').length
      const alturaLinha = Math.max(12, numLinhasChave * 6 + 6)
      
      // Fundo da linha (alternado)
      const isEven = Math.floor((currentY - 52) / 12) % 2 === 0
      if (isEven) {
        doc.setFillColor(255, 255, 255)
      } else {
        doc.setFillColor(249, 249, 249)
      }
      doc.rect(20, currentY, totalWidth, alturaLinha, 'F')
      
      // Bordas
      doc.setDrawColor('#ddd')
      doc.setLineWidth(0.1)
      doc.line(20, currentY, 20 + totalWidth, currentY)
      
      currentX = 20
      
      // RODADA (só na última linha da rodada)
      doc.setTextColor(corCinzaEscuro)
      doc.setFontSize(9)
      doc.setFont(undefined, 'normal')
      if (isUltimaLinha) {
        doc.text(rodada.nomeRodada, currentX + 2, currentY + alturaLinha / 2)
      }
      currentX += colWidths[0]
      
      // CHAVE (com quebra de linha quando vários cavalos)
      doc.text(chave, currentX + 2, currentY + 6, { maxWidth: colWidths[1] - 4 })
      currentX += colWidths[1]
      
      // VALOR DA APOSTA (verde e negrito)
      doc.setTextColor(verdeRgb.r, verdeRgb.g, verdeRgb.b)
      doc.setFont(undefined, 'bold')
      doc.text(`R$ ${aposta.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, currentX + 2, currentY + alturaLinha / 2)
      currentX += colWidths[2]
      
      // % (azul e negrito)
      doc.setTextColor(azulRgb.r, azulRgb.g, azulRgb.b)
      doc.setFont(undefined, 'bold')
      doc.text(`${aposta.porcentagemAposta}%`, currentX + 2, currentY + alturaLinha / 2)
      currentX += colWidths[3]
      
      // PRÊMIO INDIVIDUAL (dourado e negrito)
      doc.setTextColor(douradaRgb.r, douradaRgb.g, douradaRgb.b)
      doc.setFont(undefined, 'bold')
      doc.text(`R$ ${aposta.valorPremio.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, currentX + 2, currentY + alturaLinha / 2)
      currentX += colWidths[4]
      
      // TOTAL DA RODADA (só na última linha da rodada, com fundo verde)
      if (isUltimaLinha) {
        doc.setFillColor('#E8F5E8')
        doc.rect(currentX, currentY, colWidths[5], alturaLinha, 'F')
        doc.setTextColor(verdeRgb.r, verdeRgb.g, verdeRgb.b)
        doc.setFont(undefined, 'bold')
        doc.text(`R$ ${formatarNumeroBrasileiro(aposta.valorOriginalPremio)}`, currentX + 2, currentY + alturaLinha / 2)
      }
      
      totalApostado += aposta.valor
      
      // Agrupar por tipo de rodada para resumo
      const tipoRodada = rodada.tipoRodada.nome
      if (!apostasPorTipo.has(tipoRodada)) {
        apostasPorTipo.set(tipoRodada, new Map())
      }
      
      // Se já existe essa chave no tipo, somar os valores
      if (apostasPorTipo.get(tipoRodada).has(chave)) {
        const valorAtual = apostasPorTipo.get(tipoRodada).get(chave)
        apostasPorTipo.get(tipoRodada).set(chave, valorAtual + aposta.valorPremio)
      } else {
        apostasPorTipo.get(tipoRodada).set(chave, aposta.valorPremio)
      }
      
      // Avançar Y após cada linha da tabela
      currentY += alturaLinha
    })
  })
  
  // Seção VALOR TOTAL DA APOSTA
  currentY += 30
  
  // Título da seção
  doc.setFillColor(douradaRgb.r, douradaRgb.g, douradaRgb.b)
  doc.rect(20, currentY, totalWidth, 12, 'F')
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(12)
  doc.setFont(undefined, 'bold')
  doc.text('VALOR TOTAL DA APOSTA:', 25, currentY + 8)
  
  // Avançar Y após o título
  currentY += 12
  
  // Valor total
  doc.setFillColor(douradaRgb.r, douradaRgb.g, douradaRgb.b)
  doc.rect(20, currentY, totalWidth, 12, 'F')
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(16)
  doc.setFont(undefined, 'bold')
  doc.text(`R$ ${totalApostado.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, 25, currentY + 8)
  
  // Avançar Y após o valor total
  currentY += 12
  
  // Seções de resumo por tipo de rodada
  currentY += 20
  
  apostasPorTipo.forEach((apostasMap, tipoRodada) => {
    if (apostasMap.size > 0) {
      // Título da seção
      doc.setFillColor(douradaRgb.r, douradaRgb.g, douradaRgb.b)
      doc.rect(20, currentY, totalWidth, 12, 'F')
      doc.setTextColor(255, 255, 255)
      doc.setFontSize(12)
      doc.setFont(undefined, 'bold')
      doc.text(tipoRodada.toUpperCase(), 25, currentY + 8)
      
      // Avançar Y após o título da seção
      currentY += 12
      
      // Tabela de resumo
      doc.setFillColor(douradaRgb.r, douradaRgb.g, douradaRgb.b)
      doc.rect(20, currentY, totalWidth, 12, 'F')
      doc.setTextColor(255, 255, 255)
      doc.setFontSize(12)
      doc.setFont(undefined, 'bold')
      doc.text('CHAVE', 25, currentY + 8)
      doc.text('VALOR', 20 + totalWidth - 30, currentY + 8) // Alinhar à direita
      
      // Avançar Y após o cabeçalho da tabela de resumo
      currentY += 12
      
      Array.from(apostasMap.entries()).forEach(([chave, valor]) => {
        const numLinhasChaveResumo = chave.split('\n').length
        const alturaLinhaResumo = Math.max(12, numLinhasChaveResumo * 6 + 6)
        doc.setFillColor(255, 255, 255)
        doc.rect(20, currentY, totalWidth, alturaLinhaResumo, 'F')
        doc.setDrawColor('#ddd')
        doc.setLineWidth(0.1)
        doc.line(20, currentY, 20 + totalWidth, currentY)
        
        doc.setTextColor(corCinzaEscuro)
        doc.setFontSize(9)
        doc.setFont(undefined, 'normal')
        doc.text(chave, 25, currentY + 6, { maxWidth: totalWidth - 50 })
        doc.text(`R$ ${valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, 20 + totalWidth - 30, currentY + alturaLinhaResumo / 2)
        
        // Avançar Y após cada linha da tabela de resumo
        currentY += alturaLinhaResumo
      })
      
      // Espaçamento entre seções de resumo
      currentY += 20
    }
  })
  
  // Download do PDF
  doc.save(`relatorio-apostas-${props.dados.apostador.nome}.pdf`)
}

// Expor função para uso externo
defineExpose({
  gerarPDF
})
</script>

<style scoped>
.hidden {
  display: none;
}
</style>
