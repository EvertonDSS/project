import { useRuntimeConfig } from "nuxt/app"

export const useApi = () => {
  const config = useRuntimeConfig()
  
  // URL base da API - você pode configurar isso no nuxt.config.ts
  const baseURL = (config.public.apiBase as string) || 'https://corrida-nest.onrender.com/'
  
  const api = $fetch.create({
    baseURL,
    headers: {
      'Content-Type': 'application/json',
    },
  })

  return {
    api,
    // Métodos específicos para apostadores
    async getApostadores() {
      try {
        const response = await api('/apostador')
        return response
      } catch (error) {
        console.error('Erro ao buscar apostadores:', error)
        throw error
      }
    },

    async postApostador(apostador: any) {
      try {
        const response = await api('/apostador', { method: 'POST', body: apostador })
        return response
      } catch (error) {
        console.error('Erro ao postar apostador:', error)
        throw error
      }
    },

    // Métodos para outros recursos (cavalos, campeonatos)
    async getCavalos() {
      try {
        const response = await api('/cavalo')
        return response
      } catch (error) {
        console.error('Erro ao buscar cavalos:', error)
        throw error
      }
    },

    async getCampeonatos() {
      try {
        const response = await api('/campeonato')
        return response
      } catch (error) {
        console.error('Erro ao buscar campeonatos:', error)
        throw error
      }
    },

    async getApostas() {
      try {
        const response = await api('/aposta')
        return response
      } catch (error) {
        console.error('Erro ao buscar apostas:', error)
        throw error
      }
    },

    async postCavalo(cavalo: any) {
      try {
        const response = await api('/cavalo', { method: 'POST', body: cavalo })
        return response
      } catch (error) {
        console.error('Erro ao postar cavalo:', error)
        throw error
      }
    },

    async postCampeonato(campeonato: any) {
      try {
        const response = await api('/campeonato', { method: 'POST', body: campeonato })
        return response
      } catch (error) {
        console.error('Erro ao postar campeonato:', error)
        throw error
      }
    },

    async getRodadas() {
      try {
        const response = await api('/rodada')
        return response
      } catch (error) {
        console.error('Erro ao buscar rodadas:', error)
        throw error
      }
    },

    async postRodada(rodada: any) {
      try {
        const response = await api('/rodada', { method: 'POST', body: rodada })
        return response
      } catch (error) {
        console.error('Erro ao postar rodada:', error)
        throw error
      }
    },

    async getRodadasCampeonato(valorPremio?: number) {
      try {
        const params = valorPremio ? { valorPremio } : {}
        const response = await api('/rodada/campeonato', { params })
        return response
      } catch (error) {
        console.error('Erro ao buscar rodadas de campeonato:', error)
        throw error
      }
    },

    async getRodadasPorCampeonato(campeonatoId: number) {
      try {
        const response = await api(`/rodada/campeonato/${campeonatoId}`)
        return response
      } catch (error) {
        console.error('Erro ao buscar rodadas por campeonato:', error)
        throw error
      }
    },

    async getRodadasCampeonatoDetalhadas(campeonatoId: number) {
      try {
        const response = await api(`/rodada/campeonato/${campeonatoId}/rodadas`)
        return response
      } catch (error) {
        console.error('Erro ao buscar rodadas detalhadas do campeonato:', error)
        throw error
      }
    },

    async postRodadaCampeonato(rodadaCampeonato: any) {
      try {
        const response = await api('/rodada/campeonato', { method: 'POST', body: rodadaCampeonato })
        return response
      } catch (error) {
        console.error('Erro ao postar rodada de campeonato:', error)
        throw error
      }
    },

    async postAposta(aposta: any) {
      try {
        const response = await api('/aposta', { method: 'POST', body: aposta })
        return response
      } catch (error) {
        console.error('Erro ao postar aposta:', error)
        throw error
      }
    },

    async getApostadoresPorCampeonato(campeonatoId: number) {
      try {
        const response = await api(`/campeonato/${campeonatoId}/apostadores`)
        return response
      } catch (error) {
        console.error('Erro ao buscar apostadores por campeonato:', error)
        throw error
      }
    },

    async getApostasPorApostador(campeonatoId: number, apostadorId: number) {
      try {
        const response = await api(`/campeonato/${campeonatoId}/apostador/${apostadorId}/apostas`)
        return response
      } catch (error) {
        console.error('Erro ao buscar apostas por apostador:', error)
        throw error
      }
    },

    // Métodos para tipos de rodada
    async getTiposRodada() {
      try {
        const response = await api('/tipo')
        return response
      } catch (error) {
        console.error('Erro ao buscar tipos de rodada:', error)
        throw error
      }
    },

    async getTipoPorId(tipoId: number) {
      try {
        const response = await api(`/tipo/${tipoId}`)
        return response
      } catch (error) {
        console.error('Erro ao buscar tipo por ID:', error)
        throw error
      }
    },

    async postTipoRodada(tipoRodada: any) {
      try {
        const response = await api('/tipo', { method: 'POST', body: tipoRodada })
        return response
      } catch (error) {
        console.error('Erro ao postar tipo de rodada:', error)
        throw error
      }
    },

    // Métodos para cavalos por campeonato
    async getCavalosPorCampeonato(campeonatoId: number) {
      try {
        const response = await api(`/cavalo-campeonato/campeonato/${campeonatoId}`)
        return response
      } catch (error) {
        console.error('Erro ao buscar cavalos por campeonato:', error)
        throw error
      }
    },

    async postCavalosCampeonato(dados: any) {
      try {
        const response = await api('/cavalo-campeonato', { method: 'POST', body: dados })
        return response
      } catch (error) {
        console.error('Erro ao adicionar cavalos ao campeonato:', error)
        throw error
      }
    }
  }
}
