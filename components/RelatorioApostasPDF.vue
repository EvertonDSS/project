<template>
  <div class="hidden">
    <canvas ref="canvas" width="800" height="1000"></canvas>
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

const gerarPDF = async () => {
  // Importação dinâmica do jsPDF
  const { default: jsPDF } = await import('jspdf')
  
  const doc = new jsPDF()
  
  // Configurações de fonte e cores
  const corDourada = '#D4AF37'
  const corVerde = '#2E7D32'
  const corAzul = '#1976D2'
  const corCinzaEscuro = '#333333'
  const corCinzaClaro = '#f9f9f9'
  
  // Header - Logo e nome do apostador
  let currentY = 20
  
  // Logo (círculo com cavalo)
  doc.setFillColor(corDourada)
  doc.circle(30, currentY + 10, 8, 'F')
  
  // Texto "JOGOS ONLINE"
  doc.setTextColor(corDourada)
  doc.setFontSize(18)
  doc.setFont(undefined, 'bold')
  doc.text('JOGOS ONLINE', 50, currentY + 15)
  
  // Nome do apostador (canto direito)
  doc.setFillColor(corDourada)
  doc.rect(140, currentY, 40, 20, 'F')
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(14)
  doc.setFont(undefined, 'bold')
  doc.text(props.dados.apostador.nome, 150, currentY + 13)
  
  // Linha separadora
  doc.setDrawColor(corDourada)
  doc.setLineWidth(2)
  doc.line(20, currentY + 30, 180, currentY + 30)
  
  // Título principal
  currentY += 50
  doc.setTextColor(corDourada)
  doc.setFontSize(20)
  doc.setFont(undefined, 'bold')
  doc.text('RELATÓRIO DE APOSTAS', 100, currentY, { align: 'center' })
  
  // Cabeçalho da tabela
  currentY += 20
  const colWidths = [20, 50, 35, 15, 35, 35]
  const headers = ['RODADA', 'CHAVE', 'VALOR DA APOSTA', '%', 'PRÊMIO INDIVIDUAL', 'TOTAL DA RODADA']
  
  // Fundo dourado do cabeçalho
  doc.setFillColor(corDourada)
  doc.rect(20, currentY, 160, 12, 'F')
  
  // Texto do cabeçalho
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(12)
  doc.setFont(undefined, 'bold')
  
  let currentX = 20
  headers.forEach((header, index) => {
    doc.text(header, currentX + 2, currentY + 8)
    currentX += colWidths[index]
  })
  
  // Dados das apostas
  currentY += 12
  let totalApostado = 0
  let apostasPorTipo = new Map()
  
  props.dados.apostasPorRodada.forEach(rodada => {
    rodada.apostas.forEach((aposta, index) => {
      const isUltimaLinha = index === rodada.apostas.length - 1
      
      // Fundo da linha (alternado)
      const isEven = Math.floor((currentY - 52) / 12) % 2 === 0
      doc.setFillColor(isEven ? 255 : 249, isEven ? 255 : 249, isEven ? 255 : 249)
      doc.rect(20, currentY, 160, 12, 'F')
      
      // Bordas
      doc.setDrawColor('#ddd')
      doc.setLineWidth(0.1)
      doc.line(20, currentY, 180, currentY)
      
      currentX = 20
      
      // RODADA (só na última linha da rodada)
      doc.setTextColor(corCinzaEscuro)
      doc.setFontSize(12)
      if (isUltimaLinha) {
        doc.text(rodada.nomeRodada, currentX + 2, currentY + 8)
      }
      currentX += colWidths[0]
      
      // CHAVE
      const cavalos = aposta.pareo.cavalos.map(cavalo => cavalo.nome).join(' / ')
      const chave = `${aposta.pareo.numero}- ${cavalos}`
      doc.text(chave, currentX + 2, currentY + 8)
      currentX += colWidths[1]
      
      // VALOR DA APOSTA
      doc.setTextColor(corVerde)
      doc.setFont(undefined, 'bold')
      doc.text(`R$ ${aposta.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, currentX + 2, currentY + 8)
      currentX += colWidths[2]
      
      // %
      doc.setTextColor(corAzul)
      doc.setFont(undefined, 'bold')
      doc.text(`${aposta.porcentagemAposta}%`, currentX + 2, currentY + 8)
      currentX += colWidths[3]
      
      // PRÊMIO INDIVIDUAL
      doc.setTextColor(corDourada)
      doc.setFont(undefined, 'bold')
      doc.text(`R$ ${aposta.valorPremio.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, currentX + 2, currentY + 8)
      currentX += colWidths[4]
      
      // TOTAL DA RODADA (só na última linha da rodada)
      if (isUltimaLinha) {
        doc.setFillColor('#E8F5E8')
        doc.rect(currentX, currentY, colWidths[5], 12, 'F')
        doc.setTextColor(corVerde)
        doc.setFont(undefined, 'bold')
        doc.text(`R$ ${aposta.valorOriginalPremio.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, currentX + 2, currentY + 8)
      }
      
      totalApostado += aposta.valor
      
      // Agrupar por tipo de rodada
      const tipoRodada = rodada.tipoRodada.nome
      if (!apostasPorTipo.has(tipoRodada)) {
        apostasPorTipo.set(tipoRodada, [])
      }
      apostasPorTipo.get(tipoRodada).push({
        chave: chave,
        valor: aposta.valorPremio
      })
      
      currentY += 12
    })
  })
  
  // Seção VALOR TOTAL DA APOSTA
  currentY += 20
  
  doc.setFillColor(corDourada)
  doc.rect(20, currentY, 160, 12, 'F')
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(12)
  doc.setFont(undefined, 'bold')
  doc.text('VALOR TOTAL DA APOSTA:', 25, currentY + 8)
  
  // Valor total
  doc.setFillColor(corDourada)
  doc.rect(20, currentY + 12, 160, 12, 'F')
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(16)
  doc.setFont(undefined, 'bold')
  doc.text(`R$ ${totalApostado.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, 25, currentY + 20)
  
  // Seções de resumo por tipo de rodada
  currentY += 35
  
  apostasPorTipo.forEach((apostas, tipoRodada) => {
    if (apostas.length > 0) {
      // Título da seção
      doc.setFillColor(corDourada)
      doc.rect(20, currentY, 160, 12, 'F')
      doc.setTextColor(255, 255, 255)
      doc.setFontSize(12)
      doc.setFont(undefined, 'bold')
      doc.text(tipoRodada.toUpperCase(), 25, currentY + 8)
      
      currentY += 12
      
      // Tabela de resumo
      doc.setFillColor(corDourada)
      doc.rect(20, currentY, 160, 12, 'F')
      doc.setTextColor(255, 255, 255)
      doc.setFontSize(12)
      doc.setFont(undefined, 'bold')
      doc.text('CHAVE', 25, currentY + 8)
      doc.text('VALOR', 150, currentY + 8)
      
      currentY += 12
      
      apostas.forEach(aposta => {
        doc.setFillColor(255, 255, 255)
        doc.rect(20, currentY, 160, 12, 'F')
        doc.setDrawColor('#ddd')
        doc.setLineWidth(0.1)
        doc.line(20, currentY, 180, currentY)
        
        doc.setTextColor(corCinzaEscuro)
        doc.setFontSize(12)
        doc.text(aposta.chave, 25, currentY + 8)
        doc.text(`R$ ${aposta.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, 150, currentY + 8)
        
        currentY += 12
      })
      
      currentY += 10
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