import { useRuntimeConfig } from "nuxt/app"

export const useCorridaApi = () => {
  const config = useRuntimeConfig()
  
  // URL base da API Corrida App
  const baseURL = 'https://corrida-app11-s9fe.onrender.com/'
  //const baseURL = 'http://localhost:3002/'

  const api = $fetch.create({
    baseURL,
    headers: {
      'Content-Type': 'application/json',
    },
  })

  return {
    api,
    
    // Obter todos os registros
    async getAll() {
      try {
        const response = await api('/campeonatos')
        return response
      } catch (error) {
        console.error('Erro ao buscar dados:', error)
        throw error
      }
    },
    async postCampeonato(campeonato: any) {
      try {
        const response = await api('/campeonatos', { method: 'POST', body: campeonato })
        return response
      } catch (error) {
        console.error('Erro ao criar campeonato:', error)
        throw error
      }
    },

    // Obter registro por ID
    async getById(id: string | number) {
      try {
        const response = await api(`/${id}`)
        return response
      } catch (error) {
        console.error('Erro ao buscar registro:', error)
        throw error
      }
    },

    // Criar novo registro
    async create(data: any) {
      try {
        const response = await api('/', { 
          method: 'POST', 
          body: data 
        })
        return response
      } catch (error) {
        console.error('Erro ao criar registro:', error)
        throw error
      }
    },

    // Atualizar registro
    async update(id: string | number, data: any) {
      try {
        const response = await api(`/${id}`, { 
          method: 'PUT', 
          body: data 
        })
        return response
      } catch (error) {
        console.error('Erro ao atualizar registro:', error)
        throw error
      }
    },

    // Deletar registro
    async delete(id: string | number) {
      try {
        const response = await api(`/campeonatos/${id}`, { 
          method: 'DELETE' 
        })
        return response
      } catch (error) {
        console.error('Erro ao deletar registro:', error)
        throw error
      }
    },

    // Tipos de Rodadas
    async getTiposRodadas() {
      try {
        const response = await api('/tipos-rodada')
        return response
      } catch (error) {
        console.error('Erro ao buscar tipos de rodadas:', error)
        throw error
      }
    },

    async postTipoRodada(tipoRodada: any) {
      try {
        const response = await api('/tipos-rodada', { method: 'POST', body: tipoRodada })
        return response
      } catch (error) {
        console.error('Erro ao criar tipo de rodada:', error)
        throw error
      }
    },

    async updateTipoRodada(id: string | number, payload: { nome: string }) {
      try {
        const response = await api(`/tipos-rodada/${id}`, { method: 'PATCH', body: payload })
        return response
      } catch (error) {
        console.error('Erro ao atualizar tipo de rodada:', error)
        throw error
      }
    },

    async postVencedorRodada(
      campeonatoId: string | number,
      payload: { nomeRodada: string; cavaloId: number | string }
    ) {
      try {
        const response = await api(`/vencedores-rodada/${campeonatoId}`, {
          method: 'POST',
          body: payload
        })
        return response
      } catch (error) {
        console.error('Erro ao salvar campeão da rodada:', error)
        throw error
      }
    },

    async deleteTipoRodada(id: string | number) {
      try {
        const response = await api(`/tipos-rodada/${id}`, { method: 'DELETE' })
        return response
      } catch (error) {
        console.error('Erro ao deletar tipo de rodada:', error)
        throw error
      }
    },

    async criarPareo(campeonatoId: string | number, tipoRodadaId: string | number, texto: string) {
      try {
        const response = await api(`/pareos/${campeonatoId}/${tipoRodadaId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'text/plain',
          },
          body: texto
        })
        return response
      } catch (error) {
        console.error('Erro ao criar pareo:', error)
        throw error
      }
    },

    async getPareos(campeonatoId: string | number, tipoRodadaId: string | number) {
      try {
        const response = await api(`/pareos/${campeonatoId}/${tipoRodadaId}`)
        return response
      } catch (error) {
        console.error('Erro ao buscar pareos:', error)
        throw error
      }
    },

    async getPareosCavalos(campeonatoId: string | number, tipoRodadaId: string | number) {
      try {
        const response = await api(`/pareos-cavalos/${campeonatoId}/${tipoRodadaId}`)
        return response
      } catch (error) {
        console.error('Erro ao buscar pareos com cavalos:', error)
        throw error
      }
    },

    async excluirPareo(campeonatoId: string | number, tipoRodadaId: string | number, pareo: string) {
      try {
        const response = await api(`/pareos-excluidos/${campeonatoId}/${tipoRodadaId}`, {
          method: 'POST',
          body: { pareo: pareo }
        })
        return response
      } catch (error) {
        console.error('Erro ao excluir pareo:', error)
        throw error
      }
    },

    async atualizarPareo(
      campeonatoId: string | number,
      tipoRodadaId: string | number,
      cavalos: Array<{ pareoId: number; id: number; nome: string }>
    ) {
      try {
        const response = await api(`/pareos/${campeonatoId}/${tipoRodadaId}/cavalos`, {
          method: 'PUT',
          body: {
            cavalos
          }
        })
        return response
      } catch (error) {
        console.error('Erro ao atualizar pareo:', error)
        throw error
      }
    },

    async getPareosExcluidos(campeonatoId: string | number, tipoRodadaId: string | number) {
      try {
        const response = await api(`/pareos-excluidos/${campeonatoId}/${tipoRodadaId}`)
        return response
      } catch (error) {
        console.error('Erro ao buscar pareos excluídos:', error)
        throw error
      }
    },

    async criarApostas(campeonatoId: string | number, tipoRodadaId: string | number, texto: string) {
      try {
        const response = await api(`/apostas/${campeonatoId}/${tipoRodadaId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'text/plain',
          },
          body: texto
        })
        return response
      } catch (error) {
        console.error('Erro ao criar apostas:', error)
        throw error
      }
    },

    async getApostadores(campeonatoId: string | number) {
      try {
        const response = await api(`/apostadores/campeonato/${campeonatoId}`)
        return response
      } catch (error) {
        console.error('Erro ao buscar apostadores:', error)
        throw error
      }
    },

    async postApostadoresCombinados(
      campeonatoId: string | number,
      nomesApostadores: string[]
    ) {
      try {
        const response = await api(`/apostadores-combinados/${campeonatoId}`, {
          method: 'POST',
          body: {
            nomesApostadores
          }
        })
        return response
      } catch (error) {
        console.error('Erro ao enviar apostadores combinados:', error)
        throw error
      }
    },

    async getApostadoresCombinados(campeonatoId: string | number) {
      try {
        const response = await api(`/apostadores-combinados/${campeonatoId}`)
        return response
      } catch (error) {
        console.error('Erro ao buscar apostadores combinados:', error)
        throw error
      }
    },

    async getApostadoresCombinadosApostas(campeonatoId: string | number) {
      try {
        const response = await api(`/apostadores-combinados/${campeonatoId}/apostas`)
        return response
      } catch (error) {
        console.error('Erro ao buscar apostas de apostadores combinados:', error)
        throw error
      }
    },

    async getPdfDados(campeonatoId: string | number, apostadorId: string | number) {
      try {
        const response = await api(`/pdf/dados/${campeonatoId}/${apostadorId}`)
        return response
      } catch (error) {
        console.error('Erro ao buscar dados do PDF:', error)
        throw error
      }
    },

    async getTiposRodadasCampeonato(campeonatoId: string | number) {
      try {
        const response = await api(`/tipos-rodadas/campeonato/${campeonatoId}`)
        return response
      } catch (error) {
        console.error('Erro ao buscar tipos de rodadas do campeonato:', error)
        throw error
      }
    },

    async removerCavaloPareo(campeonatoId: string | number, tipoRodadaId: string | number, numeroPareo: string, nomeCavalo: string) {
      try {
        const response = await api(`/pareos/remover-cavalo/${campeonatoId}/${tipoRodadaId}/${numeroPareo}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: { nomeCavalo: nomeCavalo }
        })
        return response
      } catch (error) {
        console.error('Erro ao remover cavalo do pareo:', error)
        throw error
      }
    },

    async getApostas(campeonatoId: string | number, tipoRodadaId: string | number) {
      try {
        const response = await api(`/apostas/${campeonatoId}/${tipoRodadaId}`)
        return response
      } catch (error) {
        console.error('Erro ao buscar apostas:', error)
        throw error
      }
    },

    async renomearApostador(campeonatoId: string | number, nomeOriginal: string, novoNome: string) {
      try {
        const response = await api(`/apostadores/renomear/${campeonatoId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: { 
            nomeOriginal: nomeOriginal,
            novoNome: novoNome
          }
        })
        return response
      } catch (error) {
        console.error('Erro ao renomear apostador:', error)
        throw error
      }
    },

    async getRodadasCavalos(campeonatoId: string | number) {
      try {
        const response = await api(`/rodadas-cavalos/${campeonatoId}`)
        return response
      } catch (error) {
        console.error('Erro ao buscar cavalos da rodada:', error)
        throw error
      }
    },

    async getGanhadoresPossiveis(campeonatoId: string | number, agrupado?: boolean) {
      try {
        const params = new URLSearchParams()
        if (agrupado !== undefined) {
          params.append('agrupado', agrupado.toString())
        }
        const queryString = params.toString()
        const url = queryString 
          ? `/ganhadores-possiveis/${campeonatoId}?${queryString}`
          : `/ganhadores-possiveis/${campeonatoId}`
        const response = await api(url)
        return response
      } catch (error) {
        console.error('Erro ao buscar ganhadores possíveis:', error)
        throw error
      }
    },

    async postGanhadoresPossiveis(campeonatoId: string | number, cavalosIds: number[]) {
      try {
        const response = await api(`/ganhadores-possiveis/${campeonatoId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: {
            cavalosIds: cavalosIds
          }
        })
        return response
      } catch (error) {
        console.error('Erro ao salvar ganhadores possíveis:', error)
        throw error
      }
    },

    async getSaldosCampeonato(campeonatoId: string | number) {
      try {
        const response = await api(`/saldos/campeonato/${campeonatoId}`)
        return response
      } catch (error) {
        console.error('Erro ao buscar saldos do campeonato:', error)
        throw error
      }
    },

    async getSaldosCampeonatoNegativados(campeonatoId: string | number) {
      try {
        const response = await api(`/saldos/campeonato/${campeonatoId}/negativados`)
        return response
      } catch (error) {
        console.error('Erro ao buscar saldos negativados do campeonato:', error)
        throw error
      }
    },

    async getSaldosCampeonatoPositivados(campeonatoId: string | number) {
      try {
        const response = await api(`/saldos/campeonato/${campeonatoId}/positivados`)
        return response
      } catch (error) {
        console.error('Erro ao buscar saldos positivados do campeonato:', error)
        throw error
      }
    },

    async postSaldosCampeonatos(payload: { campeonatosIds: Array<number | string> }) {
      try {
        const response = await api(`/saldos/campeonatos`, {
          method: 'POST',
          body: payload
        })
        return response
      } catch (error) {
        console.error('Erro ao buscar saldos de múltiplos campeonatos:', error)
        throw error
      }
    },

    async postVencedor(
      campeonatoId: string | number,
      cavalosIds: Array<number | string>
    ) {
      try {
        const response = await api(`/vencedores/${campeonatoId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: {
            cavalosIds
          }
        })
        return response
      } catch (error) {
        console.error('Erro ao salvar vencedor:', error)
        throw error
      }
    },

    async getRodadasCampeonato(campeonatoId: string | number) {
      try {
        const response = await api(`/rodadas/campeonato/${campeonatoId}`)
        return response
      } catch (error) {
        console.error('Erro ao buscar rodadas do campeonato:', error)
        throw error
      }
    },

    async postRodadaCasa(campeonatoId: string | number, rodada: string, valorCasa: number) {
      try {
        const response = await api(`/rodadas-casa/${campeonatoId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: {
            Rodada: rodada,
            ValorCasa: valorCasa
          }
        })
        return response
      } catch (error) {
        console.error('Erro ao salvar rodada-casa:', error)
        throw error
      }
    },

    async postRodadaAposta(
      campeonatoId: string | number,
      tipoRodadaId: string | number,
      nomeRodada: string
    ) {
      try {
        const response = await api(`/apostas/rodadas/${campeonatoId}/${tipoRodadaId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: {
            nomeRodada
          }
        })
        return response
      } catch (error) {
        console.error('Erro ao enviar rodada para apostas:', error)
        throw error
      }
    },

    async updateApostasRodada(
      campeonatoId: string | number,
      tipoRodadaId: string | number,
      payload: {
        nomeRodada: string
        apostas: Array<any>
      }
    ) {
      try {
        const response = await api(`/apostas/rodadas/${campeonatoId}/${tipoRodadaId}`, {
          method: 'PUT',
          body: payload
        })
        return response
      } catch (error) {
        console.error('Erro ao atualizar apostas da rodada:', error)
        throw error
      }
    },

    async getVencedoresCampeonato(campeonatoId: string | number) {
      try {
        const response = await api(`/vencedores/${campeonatoId}`)
        return response
      } catch (error) {
        console.error('Erro ao buscar vencedores do campeonato:', error)
        throw error
      }
    }
  }
}

