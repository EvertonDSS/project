<template>
  <div class="min-h-screen bg-neutral-50">
    <main class="container mx-auto px-4 py-8">
      <!-- Header -->
      <div class="text-center mb-8">
        <h1 class="text-4xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent mb-2">
          Gerenciar Exceções
        </h1>
        <p class="text-neutral-600">Adicione ou remova exceções de cavalos por campeonato</p>
      </div>

      <!-- Formulário de Adição -->
      <div class="card p-8 max-w-4xl mx-auto mb-8">
        <h2 class="text-2xl font-bold text-neutral-800 mb-6">Adicionar Nova Exceção</h2>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
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

          <!-- Seleção de Grupo -->
          <div>
            <label class="block text-sm font-medium text-neutral-700 mb-2">
              <UsersIcon class="w-4 h-4 inline mr-1" />
              Grupo
              <span class="text-red-500">*</span>
            </label>
            <FormSelectSearchable
              v-model="grupoSelecionado"
              :options="grupoOptions"
              :disabled="loading || !campeonatoSelecionado"
              placeholder="Selecione um grupo..."
              @update:modelValue="onGrupoChange"
            />
          </div>

          <!-- Seleção de Cavalo -->
          <div>
            <label class="block text-sm font-medium text-neutral-700 mb-2">
              <svg class="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
              </svg>
              Cavalo
              <span class="text-red-500">*</span>
            </label>
            <FormSelectSearchable
              v-model="cavaloSelecionado"
              :options="cavaloOptions"
              :disabled="loading || !grupoSelecionado || erroGrupo"
              placeholder="Selecione um cavalo..."
            />
            <!-- Mensagem de aviso se o grupo não tiver cavalos -->
            <p v-if="erroGrupo" class="mt-2 text-sm text-amber-600">
              {{ mensagemErroGrupo }}
            </p>
          </div>
        </div>

        <!-- Botão de Adicionar -->
        <div class="text-center">
          <button
            @click="adicionarExcecao"
            :disabled="!campeonatoSelecionado || !grupoSelecionado || !cavaloSelecionado || adicionando"
            class="btn-primary flex items-center space-x-2 mx-auto"
          >
            <PlusIcon class="w-5 h-5" />
            <span>{{ adicionando ? 'Adicionando...' : 'Adicionar Exceção' }}</span>
          </button>
        </div>

        <!-- Mensagem de Sucesso -->
        <div v-if="mensagemSucesso" class="mt-4 bg-green-50 border border-green-200 rounded-lg p-4">
          <p class="text-green-700 text-center">{{ mensagemSucesso }}</p>
        </div>

        <!-- Mensagem de Erro -->
        <div v-if="mensagemErro" class="mt-4 bg-red-50 border border-red-200 rounded-lg p-4">
          <p class="text-red-700 text-center">{{ mensagemErro }}</p>
        </div>
      </div>

      <!-- Listagem de Exceções -->
      <div v-if="campeonatoSelecionado" class="card p-8 max-w-6xl mx-auto">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-bold text-neutral-800">
            Exceções do Campeonato
          </h2>
          <button
            @click="carregarExcecoes"
            :disabled="loadingExcecoes"
            class="px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700 transition-colors flex items-center space-x-2"
          >
            <ArrowPathIcon class="w-4 h-4" :class="{ 'animate-spin': loadingExcecoes }" />
            <span>Atualizar</span>
          </button>
        </div>

        <!-- Loading -->
        <div v-if="loadingExcecoes" class="text-center py-8">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p class="text-neutral-600">Carregando exceções...</p>
        </div>

        <!-- Lista Vazia -->
        <div v-else-if="excecoes.length === 0" class="text-center py-8">
          <svg class="w-16 h-16 mx-auto text-neutral-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"/>
          </svg>
          <p class="text-neutral-600">Nenhuma exceção cadastrada para este campeonato</p>
        </div>

        <!-- Tabela de Exceções -->
        <div v-else class="overflow-x-auto">
          <table class="w-full border-collapse">
            <thead>
              <tr class="text-white" style="background-color: #D3AF37;">
                <th class="border border-neutral-300 px-4 py-3 text-left font-semibold">ID</th>
                <th class="border border-neutral-300 px-4 py-3 text-left font-semibold">Grupo</th>
                <th class="border border-neutral-300 px-4 py-3 text-left font-semibold">Pareo</th>
                <th class="border border-neutral-300 px-4 py-3 text-left font-semibold">Cavalos</th>
                <th class="border border-neutral-300 px-4 py-3 text-left font-semibold">Cavalo Exceção</th>
                <th class="border border-neutral-300 px-4 py-3 text-center font-semibold">Ações</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="excecao in excecoes" :key="excecao.id" class="hover:bg-neutral-50">
                <td class="border border-neutral-300 px-4 py-3 bg-white">{{ excecao.id }}</td>
                <td class="border border-neutral-300 px-4 py-3 bg-white">{{ excecao.grupoId }}</td>
                <td class="border border-neutral-300 px-4 py-3 bg-white">{{ excecao.grupo?.pareo || 'N/A' }}</td>
                <td class="border border-neutral-300 px-4 py-3 bg-white">{{ excecao.grupo?.cavalos || 'N/A' }}</td>
                <td class="border border-neutral-300 px-4 py-3 bg-white font-semibold">{{ excecao.cavalo?.nome || `Cavalo ${excecao.cavaloId}` }}</td>
                <td class="border border-neutral-300 px-4 py-3 bg-white text-center">
                  <button
                    @click="confirmarExclusao(excecao)"
                    :disabled="excluindo === excecao.id"
                    class="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors text-sm flex items-center space-x-1 mx-auto"
                  >
                    <TrashIcon class="w-4 h-4" />
                    <span>{{ excluindo === excecao.id ? 'Excluindo...' : 'Excluir' }}</span>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Total de Exceções -->
        <div class="mt-6 text-center">
          <p class="text-neutral-600">
            Total de exceções: <span class="font-bold text-neutral-800">{{ excecoes.length }}</span>
          </p>
        </div>
      </div>

      <!-- Modal de Confirmação -->
      <div v-if="mostrarModalConfirmacao" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white rounded-lg p-6 max-w-md mx-4">
          <h3 class="text-xl font-bold text-neutral-800 mb-4">Confirmar Exclusão</h3>
          <p class="text-neutral-600 mb-6">
            Tem certeza que deseja excluir esta exceção?
          </p>
          <div class="flex justify-end space-x-3">
            <button
              @click="cancelarExclusao"
              class="px-4 py-2 text-neutral-600 hover:text-neutral-800 transition-colors"
            >
              Cancelar
            </button>
            <button
              @click="excluirExcecao"
              class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
            >
              Excluir
            </button>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { 
  TrophyIcon, 
  PlusIcon, 
  TrashIcon, 
  ArrowPathIcon,
  UsersIcon
} from '@heroicons/vue/24/outline'

const { 
  getCampeonatos, 
  getCavalosPorCampeonato, 
  getGrupoPorCampeonato,
  postExcecao, 
  deleteExcecao,
  getExcecoesPorCampeonato
} = useApi()

// Estados reativos
const campeonatoSelecionado = ref('')
const grupoSelecionado = ref('')
const cavaloSelecionado = ref('')
const campeonatoOptions = ref([])
const grupoOptions = ref([])
const cavaloOptions = ref([])
const excecoes = ref([])
const cavalosCache = ref([]) // Cache dos cavalos do campeonato
const loading = ref(false)
const loadingExcecoes = ref(false)
const adicionando = ref(false)
const excluindo = ref(null)
const mensagemSucesso = ref('')
const mensagemErro = ref('')
const erroGrupo = ref(false)
const mensagemErroGrupo = ref('')
const mostrarModalConfirmacao = ref(false)
const excecaoParaExcluir = ref(null)

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
    mensagemErro.value = 'Erro ao carregar campeonatos'
  } finally {
    loading.value = false
  }
}

const onCampeonatoChange = async (campeonatoId) => {
  grupoSelecionado.value = ''
  cavaloSelecionado.value = ''
  grupoOptions.value = []
  cavaloOptions.value = []
  excecoes.value = []
  cavalosCache.value = []
  erroGrupo.value = false
  mensagemErroGrupo.value = ''
  
  if (!campeonatoId) return

  try {
    loading.value = true
    const cavalos = await getCavalosPorCampeonato(campeonatoId)
    
    // Armazenar cavalos em cache
    cavalosCache.value = cavalos
    
    // Agrupar por grupoId
    const grupos = {}
    cavalos.forEach(cavalo => {
      if (!grupos[cavalo.grupoId]) {
        grupos[cavalo.grupoId] = {
          grupoId: cavalo.grupoId,
          pareo: cavalo.pareo,
          cavalos: cavalo.cavalos,
          cavalosLista: []
        }
      }
      grupos[cavalo.grupoId].cavalosLista.push(cavalo)
    })
    
    grupoOptions.value = Object.values(grupos).map(grupo => ({
      value: grupo.grupoId,
      label: `Grupo ${grupo.grupoId} - ${grupo.pareo} (${grupo.cavalos})`
    }))

    // Carregar exceções do campeonato
    await carregarExcecoes()
  } catch (error) {
    console.error('Erro ao carregar grupos:', error)
    mensagemErro.value = 'Erro ao carregar grupos do campeonato'
  } finally {
    loading.value = false
  }
}

const onGrupoChange = async (grupoId) => {
  cavaloSelecionado.value = ''
  cavaloOptions.value = []
  erroGrupo.value = false
  mensagemErroGrupo.value = ''
  
  if (!grupoId) return

  // Usar o cache de cavalos ao invés de fazer nova requisição
  const grupoSelecionadoObj = cavalosCache.value.find(cavalo => {
    return cavalo.grupoId === parseInt(grupoId)
  })
  
  if (!grupoSelecionadoObj) {
    erroGrupo.value = true
    mensagemErroGrupo.value = 'Grupo não encontrado'
    return
  }

  loading.value = true

  try {
    // Buscar os cavalos individuais do grupo usando a API
    const dados = await getGrupoPorCampeonato(
      parseInt(campeonatoSelecionado.value), 
      parseInt(grupoId)
    )
    
    // Usar o array cavalosDetalhados que vem da API
    const cavalosDetalhados = dados.cavalosDetalhados || []
    
    if (cavalosDetalhados.length === 0) {
      erroGrupo.value = true
      mensagemErroGrupo.value = 'Nenhum cavalo encontrado para este grupo'
      loading.value = false
      return
    }
    
    // Criar opções para cada cavalo usando o id e nome do cavalosDetalhados
    cavaloOptions.value = cavalosDetalhados.map(cavalo => ({
      value: cavalo.id,           // ID do cavalo para usar no select
      label: cavalo.nome,          // Nome do cavalo para exibir
      cavaloId: cavalo.id,         // ID real para enviar no POST
      grupoId: cavalo.grupoId      // Grupo do cavalo
    }))
    
    // Se houver apenas um cavalo, selecionar automaticamente
    if (cavaloOptions.value.length === 1) {
      cavaloSelecionado.value = cavaloOptions.value[0].value
    }
    
    // Limpar erro se deu certo
    erroGrupo.value = false
    mensagemErroGrupo.value = ''
  } catch (error) {
    console.error('Erro ao buscar cavalos do grupo:', error)
    
    // Verificar se é erro 404 com mensagem específica
    if (error?.data?.statusCode === 404 || error?.statusCode === 404) {
      erroGrupo.value = true
      mensagemErroGrupo.value = error?.data?.message || error?.message || 'Grupo não possui cavalos disponíveis'
    } else {
      erroGrupo.value = true
      mensagemErroGrupo.value = 'Erro ao buscar cavalos do grupo'
    }
  } finally {
    loading.value = false
  }
}

const adicionarExcecao = async () => {
  if (!campeonatoSelecionado.value || !grupoSelecionado.value || !cavaloSelecionado.value) {
    mensagemErro.value = 'Por favor, preencha todos os campos'
    setTimeout(() => mensagemErro.value = '', 3000)
    return
  }

  adicionando.value = true
  mensagemErro.value = ''
  mensagemSucesso.value = ''

  try {
    const novaExcecao = {
      campeonatoId: parseInt(campeonatoSelecionado.value),
      grupoId: parseInt(grupoSelecionado.value),
      cavaloId: parseInt(cavaloSelecionado.value) // Value já é o ID do cavalo
    }

    await postExcecao(novaExcecao)
    
    mensagemSucesso.value = 'Exceção adicionada com sucesso!'
    setTimeout(() => mensagemSucesso.value = '', 3000)
    
    // Limpar seleção de cavalo
    cavaloSelecionado.value = ''
    
    // Recarregar exceções
    await carregarExcecoes()
  } catch (error) {
    console.error('Erro ao adicionar exceção:', error)
    mensagemErro.value = 'Erro ao adicionar exceção. Verifique se já não existe.'
    setTimeout(() => mensagemErro.value = '', 5000)
  } finally {
    adicionando.value = false
  }
}

const carregarExcecoes = async () => {
  if (!campeonatoSelecionado.value) return

  loadingExcecoes.value = true
  try {
    const resultado = await getExcecoesPorCampeonato(parseInt(campeonatoSelecionado.value))
    excecoes.value = resultado
  } catch (error) {
    console.error('Erro ao carregar exceções:', error)
    excecoes.value = []
  } finally {
    loadingExcecoes.value = false
  }
}

const confirmarExclusao = (excecao) => {
  excecaoParaExcluir.value = excecao
  mostrarModalConfirmacao.value = true
}

const cancelarExclusao = () => {
  excecaoParaExcluir.value = null
  mostrarModalConfirmacao.value = false
}

const excluirExcecao = async () => {
  if (!excecaoParaExcluir.value) return

  excluindo.value = excecaoParaExcluir.value.id
  mostrarModalConfirmacao.value = false

  try {
    await deleteExcecao(excecaoParaExcluir.value.id)
    mensagemSucesso.value = 'Exceção excluída com sucesso!'
    setTimeout(() => mensagemSucesso.value = '', 3000)
    
    // Recarregar exceções
    await carregarExcecoes()
  } catch (error) {
    console.error('Erro ao excluir exceção:', error)
    mensagemErro.value = 'Erro ao excluir exceção'
    setTimeout(() => mensagemErro.value = '', 3000)
  } finally {
    excluindo.value = null
    excecaoParaExcluir.value = null
  }
}
</script>

