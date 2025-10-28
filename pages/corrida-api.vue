<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
    <main class="container mx-auto px-4 py-8">
      <!-- Header -->
      <div class="mb-8 text-center">
        <h1 class="text-4xl font-bold text-gray-800 mb-2">
          🏇 API Corrida App
        </h1>
        <p class="text-gray-600">
          Consumindo dados de: https://corrida-app11.onrender.com/
        </p>
      </div>

      <!-- Formulário e Lista de Campeonatos -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8 max-w-6xl mx-auto">
        <!-- Formulário de Criação -->
        <div class="bg-white rounded-lg shadow-lg p-6">
          <h2 class="text-2xl font-semibold text-gray-800 mb-4">➕ Criar Campeonato</h2>
          
          <form @submit.prevent="criarCampeonato">
            <div class="mb-4">
              <label for="nome" class="block text-sm font-medium text-gray-700 mb-2">
                Nome do Campeonato
              </label>
              <input
                id="nome"
                v-model="novoCampeonato.nome"
                type="text"
                required
                placeholder="Digite o nome do campeonato"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            <button
              type="submit"
              :disabled="criando"
              class="w-full px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              <svg v-if="criando" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>{{ criando ? 'Criando...' : 'Criar Campeonato' }}</span>
            </button>

            <div v-if="mensagem" :class="mensagemTipo === 'sucesso' ? 'text-green-600' : 'text-red-600'" class="mt-3 text-sm">
              {{ mensagem }}
            </div>
          </form>
        </div>

        <!-- Lista de Campeonatos -->
        <div class="bg-white rounded-lg shadow-lg p-6">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-2xl font-semibold text-gray-800">🏆 Campeonatos</h2>
            <button
              @click="loadCampeonatos"
              :disabled="carregando"
              class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:bg-gray-400 flex items-center space-x-2"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
              </svg>
              <span>{{ carregando ? 'Carregando...' : 'Atualizar' }}</span>
            </button>
          </div>

          <!-- Loading -->
          <div v-if="carregando" class="text-center py-8">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
          </div>

          <!-- Lista -->
          <div v-else-if="campeonatos.length > 0" class="space-y-2 max-h-96 overflow-y-auto">
            <div
              v-for="campeonato in campeonatos"
              :key="campeonato.id"
              class="p-4 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg border border-indigo-100 hover:shadow-md transition-shadow"
            >
              <div class="flex items-center justify-between">
                <div>
                  <h3 class="font-semibold text-gray-800">{{ campeonato.nome }}</h3>
                  <p class="text-sm text-gray-600">ID: {{ campeonato.id }}</p>
                </div>
                <button
                  @click="deletarCampeonato(campeonato.id)"
                  class="text-red-600 hover:text-red-800 transition-colors"
                  title="Excluir"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <!-- Empty State -->
          <div v-else class="text-center py-8">
            <div class="text-gray-400 mb-4">
              <svg class="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
            </div>
            <p class="text-gray-600">Nenhum campeonato encontrado</p>
          </div>
        </div>
      </div>

      <!-- Formulário e Lista de Tipos de Rodadas -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8 max-w-6xl mx-auto">
        <!-- Formulário de Criação -->
        <div class="bg-white rounded-lg shadow-lg p-6">
          <h2 class="text-2xl font-semibold text-gray-800 mb-4">🎯 Criar Tipo de Rodada</h2>
          
          <form @submit.prevent="criarTipoRodada">
            <div class="mb-4">
              <label for="nomeTipoRodada" class="block text-sm font-medium text-gray-700 mb-2">
                Nome do Tipo de Rodada
              </label>
              <input
                id="nomeTipoRodada"
                v-model="novoTipoRodada.nome"
                type="text"
                required
                placeholder="Ex: Eliminatória, Classificatória..."
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            <button
              type="submit"
              :disabled="criandoTipoRodada"
              class="w-full px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              <svg v-if="criandoTipoRodada" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>{{ criandoTipoRodada ? 'Criando...' : 'Criar Tipo de Rodada' }}</span>
            </button>

            <div v-if="mensagemTipoRodada" :class="mensagemTipoRodadaTipo === 'sucesso' ? 'text-green-600' : 'text-red-600'" class="mt-3 text-sm">
              {{ mensagemTipoRodada }}
            </div>
          </form>
        </div>

        <!-- Lista de Tipos de Rodadas -->
        <div class="bg-white rounded-lg shadow-lg p-6">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-2xl font-semibold text-gray-800">🎯 Tipos de Rodadas</h2>
            <button
              @click="loadTiposRodadas"
              :disabled="carregandoTipos"
              class="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:bg-gray-400 flex items-center space-x-2"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
              </svg>
              <span>{{ carregandoTipos ? 'Carregando...' : 'Atualizar' }}</span>
            </button>
          </div>

          <!-- Loading -->
          <div v-if="carregandoTipos" class="text-center py-8">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
          </div>

          <!-- Lista -->
          <div v-else-if="tiposRodadas.length > 0" class="space-y-2 max-h-96 overflow-y-auto">
            <div
              v-for="tipoRodada in tiposRodadas"
              :key="tipoRodada.id"
              class="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-100 hover:shadow-md transition-shadow"
            >
              <div class="flex items-center justify-between">
                <div>
                  <h3 class="font-semibold text-gray-800">{{ tipoRodada.nome }}</h3>
                  <p class="text-sm text-gray-600">ID: {{ tipoRodada.id }}</p>
                </div>
                <button
                  @click="deletarTipoRodada(tipoRodada.id)"
                  class="text-red-600 hover:text-red-800 transition-colors"
                  title="Excluir"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <!-- Empty State -->
          <div v-else class="text-center py-8">
            <div class="text-gray-400 mb-4">
              <svg class="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
            </div>
            <p class="text-gray-600">Nenhum tipo de rodada encontrado</p>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-7xl mx-auto mb-8">
        <!-- Formulário de Criação -->
        <div class="bg-white rounded-lg shadow-lg p-6">
          <h2 class="text-2xl font-semibold text-gray-800 mb-4">🔥 Criar Pareo</h2>
          
          <form @submit.prevent="enviarPareo">
            <!-- Seleção de Campeonato -->
            <div class="mb-4">
              <label for="campeonatoCriar" class="block text-sm font-medium text-gray-700 mb-2">
                Campeonato
              </label>
              <select
                id="campeonatoCriar"
                v-model="pareoFormCriar.campeonatoId"
                required
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="">Selecione um campeonato</option>
                <option v-for="campeonato in campeonatos" :key="campeonato.id" :value="campeonato.id">
                  {{ campeonato.nome }}
                </option>
              </select>
            </div>

            <!-- Seleção de Tipo de Rodada -->
            <div class="mb-4">
              <label for="tipoRodadaCriar" class="block text-sm font-medium text-gray-700 mb-2">
                Tipo de Rodada
              </label>
              <select
                id="tipoRodadaCriar"
                v-model="pareoFormCriar.tipoRodadaId"
                required
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="">Selecione um tipo de rodada</option>
                <option v-for="tipoRodada in tiposRodadas" :key="tipoRodada.id" :value="tipoRodada.id">
                  {{ tipoRodada.nome }}
                </option>
              </select>
            </div>

            <!-- Textarea para colar o texto -->
            <div class="mb-4">
              <label for="textoPareo" class="block text-sm font-medium text-gray-700 mb-2">
                Cole o texto aqui (text/plain)
              </label>
              <textarea
                id="textoPareo"
                v-model="pareoFormCriar.texto"
                rows="10"
                required
                placeholder="Cole o texto que deseja enviar..."
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent font-mono text-sm"
              ></textarea>
            </div>

            <button
              type="submit"
              :disabled="enviandoPareo || !pareoFormCriar.campeonatoId || !pareoFormCriar.tipoRodadaId || !pareoFormCriar.texto"
              class="w-full px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              <svg v-if="enviandoPareo" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>{{ enviandoPareo ? 'Enviando...' : 'Enviar Pareo' }}</span>
            </button>

            <div v-if="mensagemPareo" :class="mensagemPareoTipo === 'sucesso' ? 'text-green-600' : 'text-red-600'" class="mt-3 text-sm">
              {{ mensagemPareo }}
            </div>
          </form>
        </div>

        <!-- Buscar e Visualizar Pareos -->
        <div class="bg-white rounded-lg shadow-lg p-6">
          <h2 class="text-2xl font-semibold text-gray-800 mb-4">🔍 Buscar Pareos</h2>
          
          <!-- Seleção de Campeonato -->
          <div class="mb-4">
            <label for="campeonatoBuscar" class="block text-sm font-medium text-gray-700 mb-2">
              Campeonato
            </label>
            <select
              id="campeonatoBuscar"
              v-model="pareoFormBuscar.campeonatoId"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="">Selecione um campeonato</option>
              <option v-for="campeonato in campeonatos" :key="campeonato.id" :value="campeonato.id">
                {{ campeonato.nome }}
              </option>
            </select>
          </div>

          <!-- Seleção de Tipo de Rodada -->
          <div class="mb-4">
            <label for="tipoRodadaBuscar" class="block text-sm font-medium text-gray-700 mb-2">
              Tipo de Rodada
            </label>
            <select
              id="tipoRodadaBuscar"
              v-model="pareoFormBuscar.tipoRodadaId"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="">Selecione um tipo de rodada</option>
              <option v-for="tipoRodada in tiposRodadas" :key="tipoRodada.id" :value="tipoRodada.id">
                {{ tipoRodada.nome }}
              </option>
            </select>
          </div>

          <button
            @click="carregarPareos"
            :disabled="carregandoPareos || !pareoFormBuscar.campeonatoId || !pareoFormBuscar.tipoRodadaId"
            class="w-full px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center space-x-2 mb-4"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
            <span>{{ carregandoPareos ? 'Buscando...' : 'Buscar Pareos' }}</span>
          </button>

          <!-- Loading -->
          <div v-if="carregandoPareos" class="text-center py-12">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
            <p class="text-gray-600">Buscando pareos...</p>
          </div>

          <!-- Empty State -->
          <div v-else class="text-center py-12">
            <div class="text-gray-400 mb-4">
              <svg class="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </div>
            <p class="text-gray-600">Selecione o campeonato e o tipo de rodada para buscar pareos</p>
          </div>
        </div>
      </div>

      <!-- Formulário Criar Apostas -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-7xl mx-auto mb-8">
        <!-- Formulário de Criação -->
        <div class="bg-white rounded-lg shadow-lg p-6">
          <h2 class="text-2xl font-semibold text-gray-800 mb-4">💰 Criar Apostas</h2>
          
          <form @submit.prevent="enviarApostas">
            <!-- Seleção de Campeonato -->
            <div class="mb-4">
              <label for="campeonatoAposta" class="block text-sm font-medium text-gray-700 mb-2">
                Campeonato
              </label>
              <select
                id="campeonatoAposta"
                v-model="apostaForm.campeonatoId"
                required
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="">Selecione um campeonato</option>
                <option v-for="campeonato in campeonatos" :key="campeonato.id" :value="campeonato.id">
                  {{ campeonato.nome }}
                </option>
              </select>
            </div>

            <!-- Seleção de Tipo de Rodada -->
            <div class="mb-4">
              <label for="tipoRodadaAposta" class="block text-sm font-medium text-gray-700 mb-2">
                Tipo de Rodada
              </label>
              <select
                id="tipoRodadaAposta"
                v-model="apostaForm.tipoRodadaId"
                required
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="">Selecione um tipo de rodada</option>
                <option v-for="tipoRodada in tiposRodadas" :key="tipoRodada.id" :value="tipoRodada.id">
                  {{ tipoRodada.nome }}
                </option>
              </select>
            </div>

            <!-- Textarea para colar o texto -->
            <div class="mb-4">
              <label for="textoApostas" class="block text-sm font-medium text-gray-700 mb-2">
                Cole o texto das apostas aqui (text/plain)
              </label>
              <textarea
                id="textoApostas"
                v-model="apostaForm.texto"
                rows="10"
                required
                placeholder="Cole o texto das apostas que deseja enviar..."
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent font-mono text-sm"
              ></textarea>
            </div>

            <button
              type="submit"
              :disabled="enviandoApostas || !apostaForm.campeonatoId || !apostaForm.tipoRodadaId || !apostaForm.texto"
              class="w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              <svg v-if="enviandoApostas" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>{{ enviandoApostas ? 'Enviando...' : 'Enviar Apostas' }}</span>
            </button>

            <div v-if="mensagemApostas" :class="mensagemApostasTipo === 'sucesso' ? 'text-green-600' : 'text-red-600'" class="mt-3 text-sm">
              {{ mensagemApostas }}
            </div>
          </form>
        </div>

        <!-- Card informativo -->
        <div class="bg-white rounded-lg shadow-lg p-6">
          <h2 class="text-2xl font-semibold text-gray-800 mb-4">ℹ️ Informações</h2>
          
          <!-- Seleção de Campeonato -->
          <div class="mb-4">
            <label for="campeonatoInfo" class="block text-sm font-medium text-gray-700 mb-2">
              Selecionar Campeonato
            </label>
            <select
              id="campeonatoInfo"
              v-model="campeonatoSelecionado"
              @change="carregarApostadores"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="">Selecione um campeonato</option>
              <option v-for="campeonato in campeonatos" :key="campeonato.id" :value="campeonato.id">
                {{ campeonato.nome }}
              </option>
            </select>
          </div>

          <!-- Lista de Apostadores -->
          <div v-if="apostadores.length > 0" class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Apostadores
            </label>
            <div class="max-h-40 overflow-y-auto border border-gray-200 rounded-lg">
              <div
                v-for="apostador in apostadores"
                :key="apostador.id"
                @click="carregarDadosPdf(apostador)"
                class="p-2 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
              >
                <div class="flex justify-between items-center">
                  <span class="text-sm font-medium text-gray-800">{{ apostador.nome }}</span>
                  <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <!-- Dados do PDF -->
          <div v-if="dadosPdf" class="mb-4">
            <div class="flex justify-between items-center mb-2">
              <h3 class="text-lg font-semibold text-gray-800">Dados do PDF</h3>
              <div class="flex gap-2">
                <button
                  @click="mostrarJsonDados = !mostrarJsonDados"
                  class="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                  </svg>
                  <span>{{ mostrarJsonDados ? 'Ocultar JSON' : 'Exibir JSON' }}</span>
                </button>
                <button
                  @click="gerarPDF"
                  :disabled="gerandoPDF"
                  class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  <svg v-if="gerandoPDF" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                  </svg>
                  <span>{{ gerandoPDF ? 'Gerando...' : 'Gerar PDF' }}</span>
                </button>
              </div>
            </div>
            <div v-if="mostrarJsonDados" class="bg-gray-50 p-3 rounded-lg max-h-40 overflow-y-auto">
              <pre class="text-xs text-gray-700 whitespace-pre-wrap">{{ JSON.stringify(dadosPdf, null, 2) }}</pre>
            </div>
          </div>

          <div class="space-y-3 text-sm text-gray-600">
            <div class="flex items-start space-x-2">
              <svg class="w-5 h-5 text-green-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <p>Envie o texto das apostas no formato text/plain</p>
            </div>
            <div class="flex items-start space-x-2">
              <svg class="w-5 h-5 text-green-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
              <p>Cole o texto que deseja cadastrar como apostas</p>
            </div>
            <div class="flex items-start space-x-2">
              <svg class="w-5 h-5 text-green-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h10m-7 4h7"></path>
              </svg>
              <p>O sistema processará as apostas automaticamente</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="text-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
        <p class="text-gray-600">Carregando dados da API...</p>
      </div>

      <!-- Error State -->
      <div v-if="error" class="max-w-2xl mx-auto">
        <div class="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <svg class="w-16 h-16 text-red-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <h3 class="text-xl font-semibold text-red-800 mb-2">Erro ao carregar dados</h3>
          <p class="text-red-700 mb-4">{{ error }}</p>
          <button 
            @click="loadData"
            class="px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            Tentar novamente
          </button>
        </div>
      </div>

      <!-- Success State -->
      <div v-if="!loading && !error && data" class="max-w-4xl mx-auto">
        <!-- Card de Resumo -->
        <div class="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 class="text-2xl font-semibold text-gray-800 mb-4">📊 Informações da API</h2>
          
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="bg-blue-50 p-4 rounded-lg">
              <div class="text-blue-600 text-sm font-semibold mb-1">Status</div>
              <div class="text-2xl font-bold text-blue-800">
                <span class="inline-flex items-center">
                  <span class="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  Online
                </span>
              </div>
            </div>
            
            <div class="bg-indigo-50 p-4 rounded-lg">
              <div class="text-indigo-600 text-sm font-semibold mb-1">Endpoint</div>
              <div class="text-sm text-indigo-800 truncate">
                corrida-app11.onrender.com
              </div>
            </div>
            
            <div class="bg-green-50 p-4 rounded-lg">
              <div class="text-green-600 text-sm font-semibold mb-1">Última Atualização</div>
              <div class="text-sm text-green-800">
                {{ new Date().toLocaleString('pt-BR') }}
              </div>
            </div>
          </div>
        </div>

        <!-- Card de Dados -->
        <div class="bg-white rounded-lg shadow-lg p-6">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-2xl font-semibold text-gray-800">📄 Dados Recebidos</h2>
            <button 
              @click="loadData"
              class="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors flex items-center space-x-2"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
              </svg>
              <span>Atualizar</span>
            </button>
          </div>

          <!-- Preview do Response -->
          <div class="bg-gray-50 rounded-lg p-4 overflow-x-auto">
            <pre class="text-sm text-gray-700">{{ formattedData }}</pre>
          </div>
        </div>

        <!-- Card de JSON Completo -->
        <div class="bg-white rounded-lg shadow-lg p-6 mt-6">
          <h3 class="text-xl font-semibold text-gray-800 mb-4">📦 JSON Completo</h3>
          
          <div class="bg-gray-900 rounded-lg p-4 overflow-x-auto max-h-96">
            <pre class="text-xs text-green-400">{{ JSON.stringify(data, null, 2) }}</pre>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="!loading && !error && !data" class="text-center py-12">
        <div class="text-gray-400 mb-4">
          <svg class="w-20 h-20 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
          </svg>
        </div>
        <h3 class="text-xl font-semibold text-gray-600 mb-2">Nenhum dado encontrado</h3>
        <p class="text-gray-500 mb-6">A API não retornou nenhum dado.</p>
        <button 
          @click="loadData"
          class="px-6 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors"
        >
          Carregar Dados
        </button>
      </div>
    </main>

    <!-- Modal de Pareo -->
    <div v-if="modalPareoOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" @click.self="fecharModalPareo">
      <div class="bg-white rounded-lg shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden">
        <!-- Header -->
        <div class="bg-gradient-to-r from-orange-600 to-amber-600 text-white p-6">
          <div class="flex justify-between items-center">
            <div>
              <h2 class="text-2xl font-bold">Pareo #{{ pareoSelecionado?.numero }}</h2>
            </div>
            <button 
              @click="fecharModalPareo"
              class="text-white hover:text-gray-200 transition-colors"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
        </div>

        <!-- Content -->
        <div class="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <div class="mb-6">
            <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <svg class="w-5 h-5 mr-2 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
              </svg>
              Cavalos ({{ pareoSelecionado?.cavalos?.length || 0 }})
            </h3>
            <div class="bg-gradient-to-r from-orange-50 to-amber-50 rounded-lg p-4 space-y-3">
              <div 
                v-for="cavalo in pareoSelecionado?.cavalos" 
                :key="cavalo.id"
                class="flex items-center justify-between p-3 bg-white rounded-lg border border-orange-200"
              >
                <div class="flex-1">
                  <div class="font-semibold text-gray-800">{{ cavalo.nome }}</div>
                  <div v-if="cavalo.identificador" class="text-sm text-gray-600">Identificador: {{ cavalo.identificador }}</div>
                </div>
                <div class="text-xs text-gray-500">
                  ID: {{ cavalo.id }}
                </div>
              </div>
            </div>
          </div>

          <!-- Informações do Pareo -->
          <div class="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <h3 class="text-lg font-semibold text-gray-800 mb-3">Informações</h3>
            <div class="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span class="text-gray-600">Campeonato ID:</span>
                <span class="font-semibold ml-2">{{ pareoSelecionado?.campeonatoId }}</span>
              </div>
              <div>
                <span class="text-gray-600">Tipo Rodada ID:</span>
                <span class="font-semibold ml-2">{{ pareoSelecionado?.tipoRodadaId }}</span>
              </div>
              <div>
                <span class="text-gray-600">Criado em:</span>
                <span class="font-semibold ml-2">{{ formatarData(pareoSelecionado?.createdAt) }}</span>
              </div>
              <div>
                <span class="text-gray-600">Atualizado em:</span>
                <span class="font-semibold ml-2">{{ formatarData(pareoSelecionado?.updatedAt) }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="bg-neutral-100 px-6 py-4 flex justify-end">
          <button 
            @click="fecharModalPareo"
            class="px-6 py-2 bg-orange-600 text-white rounded hover:bg-orange-700 transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>

    <!-- Modal de Lista de Pareos -->
    <div v-if="modalPareosOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" @click.self="fecharModalPareos">
      <div class="bg-white rounded-lg shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden">
        <!-- Header -->
        <div class="bg-gradient-to-r from-orange-600 to-amber-600 text-white p-6">
          <div class="flex justify-between items-center">
            <div>
              <h2 class="text-2xl font-bold">Lista de Pareos</h2>
              <p class="text-orange-100 text-sm">{{ pareosListadosUnicos.length }} pareo{{ pareosListadosUnicos.length !== 1 ? 's' : '' }} encontrado{{ pareosListadosUnicos.length !== 1 ? 's' : '' }}</p>
            </div>
            <button 
              @click="fecharModalPareos"
              class="text-white hover:text-gray-200 transition-colors"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
        </div>

        <!-- Content -->
        <div class="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
          <div v-if="pareosListados.length === 0" class="text-center py-12">
            <div class="text-gray-400 mb-4">
              <svg class="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
            </div>
            <p class="text-gray-600">Nenhum pareo encontrado</p>
          </div>

          <div v-else class="space-y-3">
            <div
              v-for="pareo in pareosListadosUnicos" 
              :key="pareo.id"
              :class="[
                'w-full border rounded-lg p-4',
                isPareoExcluido(pareo) 
                  ? 'bg-gradient-to-r from-red-50 to-red-100 border-red-300' 
                  : 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200'
              ]"
            >
              <div class="flex items-center justify-between mb-2">
                <h3 :class="[
                  'font-bold text-lg',
                  isPareoExcluido(pareo) ? 'text-red-800' : 'text-blue-800'
                ]">Pareo #{{ pareo.numero }}</h3>
                <button
                  v-if="!isPareoExcluido(pareo)"
                  @click="excluirPareo(pareo)"
                  class="text-red-600 hover:text-red-800 transition-colors p-1"
                  title="Excluir pareo"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                  </svg>
                </button>
              </div>
              
              <div v-for="cavalo in pareo.cavalos" :key="cavalo.id" class="ml-4 mt-2">
                <div class="flex items-center space-x-2">
                  <span :class="[
                    'font-semibold',
                    isPareoExcluido(pareo) ? 'text-red-700' : 'text-blue-700'
                  ]">{{ cavalo.nome }}</span>
                  <span v-if="cavalo.identificador" class="text-xs text-gray-600">({{ cavalo.identificador }})</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="bg-neutral-100 px-6 py-4 flex justify-end">
          <button 
            @click="fecharModalPareos"
            class="px-6 py-2 bg-orange-600 text-white rounded hover:bg-orange-700 transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- Componente PDF -->
  <RelatorioApostasSimplesPDF 
    v-if="dadosPdf" 
    ref="componentePDF" 
    :dados="dadosPdf" 
  />
</template>

<script setup>
import { useCorridaApi } from '~/composables/useCorridaApi'

const corridaApi = useCorridaApi()
const loading = ref(false)
const error = ref('')
const data = ref(null)

// Estados para campeonatos
const campeonatos = ref([])
const carregando = ref(false)
const criando = ref(false)
const novoCampeonato = ref({ nome: '' })
const mensagem = ref('')
const mensagemTipo = ref('')

// Estados para tipos de rodadas
const tiposRodadas = ref([])
const carregandoTipos = ref(false)
const criandoTipoRodada = ref(false)
const novoTipoRodada = ref({ nome: '' })
const mensagemTipoRodada = ref('')
const mensagemTipoRodadaTipo = ref('')

// Estados para criar pareo
const pareoFormCriar = ref({ campeonatoId: '', tipoRodadaId: '', texto: '' })
const enviandoPareo = ref(false)
const mensagemPareo = ref('')
const mensagemPareoTipo = ref('')

// Estados para buscar pareos
const pareoFormBuscar = ref({ campeonatoId: '', tipoRodadaId: '' })
const pareosListados = ref([])
const pareosExcluidos = ref([])
const carregandoPareos = ref(false)

// Estados para criar apostas
const apostaForm = ref({ campeonatoId: '', tipoRodadaId: '', texto: '' })
const enviandoApostas = ref(false)
const mensagemApostas = ref('')
const mensagemApostasTipo = ref('')

// Estados para apostadores e PDF
const campeonatoSelecionado = ref('')
const apostadores = ref([])
const dadosPdf = ref(null)
const mostrarJsonDados = ref(false)
const carregandoApostadores = ref(false)
const carregandoPdf = ref(false)
const gerandoPDF = ref(false)
const componentePDF = ref(null)

// Estados para modal de pareo
const modalPareoOpen = ref(false)
const pareoSelecionado = ref(null)

// Estados para modal de lista de pareos
const modalPareosOpen = ref(false)

// Função para carregar campeonatos
const loadCampeonatos = async () => {
  carregando.value = true
  
  try {
    const response = await corridaApi.getAll()
    campeonatos.value = Array.isArray(response) ? response : []
    console.log('Campeonatos carregados:', response)
  } catch (err) {
    console.error('Erro ao carregar campeonatos:', err)
    campeonatos.value = []
  } finally {
    carregando.value = false
  }
}

// Função para criar campeonato
const criarCampeonato = async () => {
  if (!novoCampeonato.value.nome.trim()) {
    mensagem.value = 'Por favor, digite um nome válido'
    mensagemTipo.value = 'erro'
    return
  }

  criando.value = true
  mensagem.value = ''
  
  try {
    const response = await corridaApi.postCampeonato({ nome: novoCampeonato.value.nome })
    
    mensagem.value = 'Campeonato criado com sucesso!'
    mensagemTipo.value = 'sucesso'
    
    // Limpar formulário
    novoCampeonato.value.nome = ''
    
    // Recarregar lista
    await loadCampeonatos()
    
    // Limpar mensagem após 3 segundos
    setTimeout(() => {
      mensagem.value = ''
    }, 3000)
    
    console.log('Campeonato criado:', response)
  } catch (err) {
    mensagem.value = 'Erro ao criar campeonato. Verifique se a API está online.'
    mensagemTipo.value = 'erro'
    console.error('Erro ao criar campeonato:', err)
  } finally {
    criando.value = false
  }
}

// Função para deletar campeonato
const deletarCampeonato = async (id) => {
  if (!confirm(`Tem certeza que deseja excluir o campeonato?`)) {
    return
  }
  
  try {
    await corridaApi.delete(id)
    
    mensagem.value = 'Campeonato excluído com sucesso!'
    mensagemTipo.value = 'sucesso'
    
    // Recarregar lista
    await loadCampeonatos()
    
    // Limpar mensagem após 3 segundos
    setTimeout(() => {
      mensagem.value = ''
    }, 3000)
  } catch (err) {
    mensagem.value = 'Erro ao excluir campeonato.'
    mensagemTipo.value = 'erro'
    console.error('Erro ao excluir campeonato:', err)
  }
}

// Função para carregar dados
const loadData = async () => {
  loading.value = true
  error.value = ''
  
  try {
    const response = await corridaApi.getAll()
    data.value = response
    console.log('Dados recebidos:', response)
  } catch (err) {
    error.value = 'Não foi possível conectar à API. Verifique sua conexão ou se a API está online.'
    console.error('Erro ao carregar dados:', err)
    data.value = null
  } finally {
    loading.value = false
  }
}

// Computed para formatar dados
const formattedData = computed(() => {
  if (!data.value) return 'Nenhum dado disponível'
  
  if (typeof data.value === 'object') {
    return JSON.stringify(data.value, null, 2)
  }
  
  return String(data.value)
})

// Funções para tipos de rodadas
const loadTiposRodadas = async () => {
  carregandoTipos.value = true
  
  try {
    const response = await corridaApi.getTiposRodadas()
    tiposRodadas.value = Array.isArray(response) ? response : []
    console.log('Tipos de rodadas carregados:', response)
  } catch (err) {
    console.error('Erro ao carregar tipos de rodadas:', err)
    tiposRodadas.value = []
  } finally {
    carregandoTipos.value = false
  }
}

const criarTipoRodada = async () => {
  if (!novoTipoRodada.value.nome.trim()) {
    mensagemTipoRodada.value = 'Por favor, digite um nome válido'
    mensagemTipoRodadaTipo.value = 'erro'
    return
  }

  criandoTipoRodada.value = true
  mensagemTipoRodada.value = ''
  
  try {
    const response = await corridaApi.postTipoRodada({ nome: novoTipoRodada.value.nome })
    
    mensagemTipoRodada.value = 'Tipo de rodada criado com sucesso!'
    mensagemTipoRodadaTipo.value = 'sucesso'
    
    // Limpar formulário
    novoTipoRodada.value.nome = ''
    
    // Recarregar lista
    await loadTiposRodadas()
    
    // Limpar mensagem após 3 segundos
    setTimeout(() => {
      mensagemTipoRodada.value = ''
    }, 3000)
    
    console.log('Tipo de rodada criado:', response)
  } catch (err) {
    mensagemTipoRodada.value = 'Erro ao criar tipo de rodada. Verifique se a API está online.'
    mensagemTipoRodadaTipo.value = 'erro'
    console.error('Erro ao criar tipo de rodada:', err)
  } finally {
    criandoTipoRodada.value = false
  }
}

const deletarTipoRodada = async (id) => {
  if (!confirm(`Tem certeza que deseja excluir este tipo de rodada?`)) {
    return
  }
  
  try {
    await corridaApi.deleteTipoRodada(id)
    
    mensagemTipoRodada.value = 'Tipo de rodada excluído com sucesso!'
    mensagemTipoRodadaTipo.value = 'sucesso'
    
    // Recarregar lista
    await loadTiposRodadas()
    
    // Limpar mensagem após 3 segundos
    setTimeout(() => {
      mensagemTipoRodada.value = ''
    }, 3000)
  } catch (err) {
    mensagemTipoRodada.value = 'Erro ao excluir tipo de rodada.'
    mensagemTipoRodadaTipo.value = 'erro'
    console.error('Erro ao excluir tipo de rodada:', err)
  }
}

// Função para enviar pareo
const enviarPareo = async () => {
  if (!pareoFormCriar.value.campeonatoId || !pareoFormCriar.value.tipoRodadaId || !pareoFormCriar.value.texto) {
    mensagemPareo.value = 'Por favor, preencha todos os campos'
    mensagemPareoTipo.value = 'erro'
    return
  }

  enviandoPareo.value = true
  mensagemPareo.value = ''
  
  try {
    const response = await corridaApi.criarPareo(
      pareoFormCriar.value.campeonatoId,
      pareoFormCriar.value.tipoRodadaId,
      pareoFormCriar.value.texto
    )
    
    mensagemPareo.value = 'Pareo criado com sucesso!'
    mensagemPareoTipo.value = 'sucesso'
    
    // Limpar formulário
    pareoFormCriar.value = { campeonatoId: '', tipoRodadaId: '', texto: '' }
    
    // Limpar mensagem após 3 segundos
    setTimeout(() => {
      mensagemPareo.value = ''
    }, 3000)
    
    console.log('Pareos criados:', response)
  } catch (err) {
    mensagemPareo.value = 'Erro ao criar pareos. Verifique se a API está online.'
    mensagemPareoTipo.value = 'erro'
    console.error('Erro ao criar pareos:', err)
  } finally {
    enviandoPareo.value = false
  }
}

// Função para carregar pareos
const carregarPareos = async () => {
  if (!pareoFormBuscar.value.campeonatoId || !pareoFormBuscar.value.tipoRodadaId) {
    return
  }

  carregandoPareos.value = true
  
  try {
    const [pareosResponse, pareosExcluidosResponse] = await Promise.all([
      corridaApi.getPareos(pareoFormBuscar.value.campeonatoId, pareoFormBuscar.value.tipoRodadaId),
      corridaApi.getPareosExcluidos(pareoFormBuscar.value.campeonatoId, pareoFormBuscar.value.tipoRodadaId)
    ])
    
    pareosListados.value = Array.isArray(pareosResponse) ? pareosResponse : []
    pareosExcluidos.value = Array.isArray(pareosExcluidosResponse) ? pareosExcluidosResponse : []
    
    console.log('Pareos carregados:', pareosResponse)
    console.log('Pareos excluídos:', pareosExcluidosResponse)
    
    // Abrir modal com todos os pareos
    modalPareosOpen.value = true
  } catch (err) {
    console.error('Erro ao carregar pareos:', err)
    pareosListados.value = []
    pareosExcluidos.value = []
  } finally {
    carregandoPareos.value = false
  }
}

// Funções para modal de pareo
const abrirModalPareo = (pareo) => {
  pareoSelecionado.value = pareo
  modalPareoOpen.value = true
}

const fecharModalPareo = () => {
  modalPareoOpen.value = false
  pareoSelecionado.value = null
}

// Função para excluir pareo
const excluirPareo = async (pareo) => {
  if (!confirm(`Tem certeza que deseja excluir o pareo #${pareo.numero}?`)) {
    return
  }

  try {
    const pareoNumero = pareo.numero // Envia apenas o número, ex: "04"
    const response = await corridaApi.excluirPareo(
      pareoFormBuscar.value.campeonatoId,
      pareoFormBuscar.value.tipoRodadaId,
      pareoNumero
    )
    
    alert('Pareo excluído com sucesso!')
    
    // Recarregar lista de pareos
    await carregarPareos()
    
    console.log('Pareo excluído:', response)
  } catch (err) {
    alert('Erro ao excluir pareo. Verifique se a API está online.')
    console.error('Erro ao excluir pareo:', err)
  }
}

// Função para enviar apostas
const enviarApostas = async () => {
  if (!apostaForm.value.campeonatoId || !apostaForm.value.tipoRodadaId || !apostaForm.value.texto) {
    mensagemApostas.value = 'Por favor, preencha todos os campos'
    mensagemApostasTipo.value = 'erro'
    return
  }

  enviandoApostas.value = true
  mensagemApostas.value = ''
  
  try {
    const response = await corridaApi.criarApostas(
      apostaForm.value.campeonatoId,
      apostaForm.value.tipoRodadaId,
      apostaForm.value.texto
    )
    
    mensagemApostas.value = 'Apostas criadas com sucesso!'
    mensagemApostasTipo.value = 'sucesso'
    
    // Limpar formulário
    apostaForm.value = { campeonatoId: '', tipoRodadaId: '', texto: '' }
    
    // Limpar mensagem após 3 segundos
    setTimeout(() => {
      mensagemApostas.value = ''
    }, 3000)
    
    console.log('Apostas criadas:', response)
  } catch (err) {
    mensagemApostas.value = 'Erro ao criar apostas. Verifique se a API está online.'
    mensagemApostasTipo.value = 'erro'
    console.error('Erro ao criar apostas:', err)
  } finally {
    enviandoApostas.value = false
  }
}

// Função para carregar apostadores
const carregarApostadores = async () => {
  if (!campeonatoSelecionado.value) {
    apostadores.value = []
    dadosPdf.value = null
    return
  }

  carregandoApostadores.value = true
  
  try {
    const response = await corridaApi.getApostadores(campeonatoSelecionado.value)
    apostadores.value = Array.isArray(response) ? response : []
    dadosPdf.value = null // Limpar dados do PDF anterior
    console.log('Apostadores carregados:', response)
  } catch (err) {
    console.error('Erro ao carregar apostadores:', err)
    apostadores.value = []
  } finally {
    carregandoApostadores.value = false
  }
}

// Função para carregar dados do PDF
const carregarDadosPdf = async (apostador) => {
  if (!campeonatoSelecionado.value || !apostador.id) {
    return
  }

  carregandoPdf.value = true
  
  try {
    const response = await corridaApi.getPdfDados(campeonatoSelecionado.value, apostador.id)
    dadosPdf.value = response
    console.log('Dados do PDF carregados:', response)
  } catch (err) {
    console.error('Erro ao carregar dados do PDF:', err)
    dadosPdf.value = null
  } finally {
    carregandoPdf.value = false
  }
}

// Função para gerar PDF
const gerarPDF = async () => {
  if (!dadosPdf.value) {
    alert('Nenhum dado disponível para gerar PDF')
    return
  }

  gerandoPDF.value = true
  
  try {
    // Aguardar o próximo tick para garantir que o componente está montado
    await nextTick()
    
    if (componentePDF.value) {
      componentePDF.value.gerarPDF()
    }
  } catch (err) {
    console.error('Erro ao gerar PDF:', err)
    alert('Erro ao gerar PDF')
  } finally {
    gerandoPDF.value = false
  }
}

// Funções para modal de lista de pareos
const fecharModalPareos = () => {
  modalPareosOpen.value = false
}

// Função para verificar se o pareo está excluído
const isPareoExcluido = (pareo) => {
  return pareosExcluidos.value.some(excluido => 
    excluido.numeroPareo === pareo.numero && 
    excluido.campeonatoId === pareo.campeonatoId &&
    excluido.tipoRodadaId === pareo.tipoRodadaId
  )
}

// Função para verificar se tem pareos duplicados com excluídos
const temPareoExcluidoDuplicado = (pareo) => {
  const pareosComMesmoNumero = pareosListados.value.filter(p => 
    p.numero === pareo.numero && 
    p.campeonatoId === pareo.campeonatoId &&
    p.tipoRodadaId === pareo.tipoRodadaId
  )
  return pareosComMesmoNumero.length > 1 && isPareoExcluido(pareo)
}

// Computed para filtrar pareos únicos
const pareosListadosUnicos = computed(() => {
  const uniqueMap = new Map()
  
  pareosListados.value.forEach(pareo => {
    const key = `${pareo.campeonatoId}-${pareo.tipoRodadaId}-${pareo.numero}-${pareo.cavalos.map(c => c.nome).join(',')}`
    
    if (!uniqueMap.has(key)) {
      uniqueMap.set(key, pareo)
    }
  })
  
  return Array.from(uniqueMap.values())
})

// Função para formatar data
const formatarData = (data) => {
  if (!data) return 'N/A'
  return new Date(data).toLocaleString('pt-BR')
}

// Carregar dados quando o componente for montado
onMounted(() => {
  loadData()
  loadCampeonatos()
  loadTiposRodadas()
})
</script>

<style scoped>
pre {
  white-space: pre-wrap;
  word-wrap: break-word;
}
</style>

