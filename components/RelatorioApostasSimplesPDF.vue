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
  // Gerar HTML
  const html = gerarHTML()
  
  // Abrir HTML em nova aba
  const novaAba = window.open('', '_blank')
  novaAba.document.write(html)
  novaAba.document.close()
  
  // Aguardar um pouco para a aba carregar
  setTimeout(async () => {
    // Fazer download do PDF
    await gerarPDFDownload()
  }, 1000)
}

const gerarHTML = () => {
  let totalApostado = 0
  let apostasPorTipo = new Map()
  
  // Processar dados
  props.dados.apostasPorRodada.forEach(rodada => {
    rodada.apostas.forEach((aposta, index) => {
      const isUltimaLinha = index === rodada.apostas.length - 1
      const cavalos = aposta.pareo.cavalos.map(cavalo => cavalo.nome).join(' / ')
      const chave = `${aposta.pareo.numero}- ${cavalos}`
      
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
  
  // Gerar linhas da tabela
  const linhasTabela = props.dados.apostasPorRodada.map(rodada => 
    rodada.apostas.map((aposta, index) => {
      const isUltimaLinha = index === rodada.apostas.length - 1
      const cavalos = aposta.pareo.cavalos.map(cavalo => cavalo.nome).join(' / ')
      
      return `
        <tr>
          <td>${isUltimaLinha ? rodada.nomeRodada : ''}</td>
          <td>${aposta.pareo.numero}- ${cavalos}</td>
          <td class="valor">R$ ${aposta.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
          <td class="porcentagem">${aposta.porcentagemAposta}%</td>
          <td class="premio">R$ ${aposta.valorPremio.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
          <td class="total-rodada">${isUltimaLinha ? `R$ ${aposta.valorOriginalPremio.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : ''}</td>
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
              <td>${chave}</td>
              <td>R$ ${valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `).join('')
  
  return `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Relatório de Apostas - ${props.dados.apostador.nome}</title>
        <style>
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }

            body {
                font-family: 'Arial', sans-serif;
                font-size: 12px;
                line-height: 1.4;
                color: #333;
                background: white;
                padding: 20px;
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
    </head>
    <body>
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
    </body>
    </html>
  `
}

const gerarPDFDownload = async () => {
  // Importação dinâmica do jsPDF
  const { default: jsPDF } = await import('jspdf')
  
  const doc = new jsPDF()
  
  // Configurações de fonte e cores
  const corDourada = '#D4AF37'
  const corVerde = '#2E7D32'
  const corAzul = '#1976D2'
  const corCinzaEscuro = '#333333'
  
  // Header - Logo e nome do apostador
  let currentY = 20
  
  // Logo (círculo dourado)
  doc.setFillColor(corDourada)
  doc.circle(30, currentY + 10, 10, 'F')
  
  // Texto "JOGOS ONLINE"
  doc.setTextColor(corDourada)
  doc.setFontSize(16)
  doc.setFont(undefined, 'bold')
  doc.text('JOGOS ONLINE', 50, currentY + 15)
  
  // Nome do apostador (canto direito)
  doc.setFillColor(corDourada)
  doc.rect(140, currentY, 50, 20, 'F')
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(12)
  doc.setFont(undefined, 'bold')
  doc.text(props.dados.apostador.nome, 150, currentY + 13)
  
  // Linha separadora dourada
  doc.setDrawColor(corDourada)
  doc.setLineWidth(1)
  doc.line(20, currentY + 30, 190, currentY + 30)
  
  // Título principal
  currentY += 50
  doc.setTextColor(corDourada)
  doc.setFontSize(20)
  doc.setFont(undefined, 'bold')
  doc.text('RELATÓRIO DE APOSTAS', 100, currentY, { align: 'center' })
  
  // Cabeçalho da tabela
  currentY += 30
  const colWidths = [20, 50, 30, 15, 35, 35]
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
      
      // VALOR DA APOSTA (verde e negrito)
      doc.setTextColor(corVerde)
      doc.setFont(undefined, 'bold')
      doc.text(`R$ ${aposta.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, currentX + 2, currentY + 8)
      currentX += colWidths[2]
      
      // % (azul e negrito)
      doc.setTextColor(corAzul)
      doc.setFont(undefined, 'bold')
      doc.text(`${aposta.porcentagemAposta}%`, currentX + 2, currentY + 8)
      currentX += colWidths[3]
      
      // PRÊMIO INDIVIDUAL (dourado e negrito)
      doc.setTextColor(corDourada)
      doc.setFont(undefined, 'bold')
      doc.text(`R$ ${aposta.valorPremio.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, currentX + 2, currentY + 8)
      currentX += colWidths[4]
      
      // TOTAL DA RODADA (só na última linha da rodada, com fundo verde)
      if (isUltimaLinha) {
        doc.setFillColor('#E8F5E8')
        doc.rect(currentX, currentY, colWidths[5], 12, 'F')
        doc.setTextColor(corVerde)
        doc.setFont(undefined, 'bold')
        doc.text(`R$ ${aposta.valorOriginalPremio.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, currentX + 2, currentY + 8)
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
      
      currentY += 12
    })
  })
  
  // Seção VALOR TOTAL DA APOSTA
  currentY += 30
  
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
  
  apostasPorTipo.forEach((apostasMap, tipoRodada) => {
    if (apostasMap.size > 0) {
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
      
      Array.from(apostasMap.entries()).forEach(([chave, valor]) => {
        doc.setFillColor(255, 255, 255)
        doc.rect(20, currentY, 160, 12, 'F')
        doc.setDrawColor('#ddd')
        doc.setLineWidth(0.1)
        doc.line(20, currentY, 180, currentY)
        
        doc.setTextColor(corCinzaEscuro)
        doc.setFontSize(12)
        doc.text(chave, 25, currentY + 8)
        doc.text(`R$ ${valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, 150, currentY + 8)
        
        currentY += 12
      })
      
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
