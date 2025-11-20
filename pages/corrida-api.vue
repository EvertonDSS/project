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

      <!-- Dropdown de Campeonatos -->
      <div class="max-w-7xl mx-auto mb-6">
        <div class="bg-white rounded-lg shadow-lg overflow-hidden">
          <!-- Header do Dropdown -->
          <button
            @click="toggleDropdown('campeonatos')"
            class="w-full px-6 py-4 bg-gradient-to-r from-indigo-600 to-blue-600 text-white text-left flex items-center justify-between hover:from-indigo-700 hover:to-blue-700 transition-colors"
          >
            <div class="flex items-center space-x-3">
              <span class="text-2xl">🏆</span>
              <h2 class="text-xl font-semibold">Campeonatos</h2>
            </div>
            <svg 
              :class="['w-6 h-6 transition-transform duration-200', dropdownsAbertos.campeonatos ? 'rotate-180' : '']"
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </button>

          <!-- Conteúdo do Dropdown -->
          <div v-if="dropdownsAbertos.campeonatos" class="p-6">
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <!-- Formulário de Criação -->
              <div class="bg-gray-50 rounded-lg p-6">
                <h3 class="text-lg font-semibold text-gray-800 mb-4">➕ Criar Campeonato</h3>
                
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
              <div class="bg-gray-50 rounded-lg p-6">
                <div class="flex justify-between items-center mb-4">
                  <h3 class="text-lg font-semibold text-gray-800">📋 Lista de Campeonatos</h3>
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
                    class="p-4 bg-white rounded-lg border border-indigo-100 hover:shadow-md transition-shadow"
                  >
                    <div class="flex items-center justify-between">
                      <div>
                        <h4 class="font-semibold text-gray-800">{{ campeonato.nome }}</h4>
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
          </div>
        </div>
      </div>

      <!-- Dropdown de Tipos de Rodadas -->
      <div class="max-w-7xl mx-auto mb-6">
        <div class="bg-white rounded-lg shadow-lg overflow-hidden">
          <!-- Header do Dropdown -->
          <button
            @click="toggleDropdown('tiposRodadas')"
            class="w-full px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-left flex items-center justify-between hover:from-purple-700 hover:to-pink-700 transition-colors"
          >
            <div class="flex items-center space-x-3">
              <span class="text-2xl">🎯</span>
              <h2 class="text-xl font-semibold">Tipos de Rodadas</h2>
            </div>
            <svg 
              :class="['w-6 h-6 transition-transform duration-200', dropdownsAbertos.tiposRodadas ? 'rotate-180' : '']"
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </button>

          <!-- Conteúdo do Dropdown -->
          <div v-if="dropdownsAbertos.tiposRodadas" class="p-6">
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <!-- Formulário de Criação -->
              <div class="bg-gray-50 rounded-lg p-6">
                <h3 class="text-lg font-semibold text-gray-800 mb-4">➕ Criar Tipo de Rodada</h3>
                
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
                      class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
              <div class="bg-gray-50 rounded-lg p-6">
                <div class="flex justify-between items-center mb-4">
                  <h3 class="text-lg font-semibold text-gray-800">📋 Lista de Tipos de Rodadas</h3>
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
                    class="p-4 bg-white rounded-lg border border-purple-100 hover:shadow-md transition-shadow"
                  >
                    <div class="flex items-center justify-between">
                      <div class="flex-1">
                        <div v-if="tipoRodadaEditandoId === tipoRodada.id" class="space-y-2">
                          <input
                            v-model="tipoRodadaNomeEdicao"
                            type="text"
                            class="w-full px-3 py-2 border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            placeholder="Novo nome do tipo de rodada"
                          />
                          <p class="text-xs text-gray-500">ID: {{ tipoRodada.id }}</p>
                        </div>
                        <div v-else>
                        <h4 class="font-semibold text-gray-800">{{ tipoRodada.nome }}</h4>
                        <p class="text-sm text-gray-600">ID: {{ tipoRodada.id }}</p>
                      </div>
                      </div>
                      <div class="flex items-center space-x-3">
                        <template v-if="tipoRodadaEditandoId === tipoRodada.id">
                      <button
                            type="button"
                            @click="salvarEdicaoTipoRodada()"
                            :disabled="atualizandoTipoRodadaId === tipoRodada.id || !tipoRodadaNomeEdicao.trim()"
                            class="px-3 py-1 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
                            title="Salvar alterações"
                          >
                            {{ atualizandoTipoRodadaId === tipoRodada.id ? 'Salvando...' : 'Salvar' }}
                          </button>
                          <button
                            type="button"
                            @click="cancelarEdicaoTipoRodada"
                            :disabled="atualizandoTipoRodadaId === tipoRodada.id"
                            class="px-3 py-1 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm font-medium disabled:bg-gray-200 disabled:text-gray-400"
                            title="Cancelar edição"
                          >
                            Cancelar
                          </button>
                        </template>
                        <template v-else>
                          <button
                            type="button"
                            @click="iniciarEdicaoTipoRodada(tipoRodada)"
                            class="text-purple-600 hover:text-purple-800 transition-colors text-sm font-medium"
                            title="Editar"
                          >
                            Editar
                          </button>
                          <button
                            type="button"
                        @click="deletarTipoRodada(tipoRodada.id)"
                        class="text-red-600 hover:text-red-800 transition-colors"
                        title="Excluir"
                      >
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                        </svg>
                      </button>
                        </template>
                      </div>
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
          </div>
        </div>
      </div>

      <!-- Dropdown de Pareos -->
      <div class="max-w-7xl mx-auto mb-6">
        <div class="bg-white rounded-lg shadow-lg overflow-hidden">
          <!-- Header do Dropdown -->
          <button
            @click="toggleDropdown('pareos')"
            class="w-full px-6 py-4 bg-gradient-to-r from-orange-600 to-amber-600 text-white text-left flex items-center justify-between hover:from-orange-700 hover:to-amber-700 transition-colors"
          >
            <div class="flex items-center space-x-3">
              <span class="text-2xl">🔥</span>
              <h2 class="text-xl font-semibold">Pareos</h2>
            </div>
            <svg 
              :class="['w-6 h-6 transition-transform duration-200', dropdownsAbertos.pareos ? 'rotate-180' : '']"
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </button>

          <!-- Conteúdo do Dropdown -->
          <div v-if="dropdownsAbertos.pareos" class="p-6">
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <!-- Formulário de Criação -->
              <div class="bg-gray-50 rounded-lg p-6">
                <h3 class="text-lg font-semibold text-gray-800 mb-4">➕ Criar Pareo</h3>
          
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
              <div class="bg-gray-50 rounded-lg p-6">
                <h3 class="text-lg font-semibold text-gray-800 mb-4">🔍 Buscar Pareos</h3>
          
          <!-- Seleção de Campeonato -->
          <div class="mb-4">
            <label for="campeonatoBuscar" class="block text-sm font-medium text-gray-700 mb-2">
              Campeonato
            </label>
            <select
              id="campeonatoBuscar"
              v-model="pareoFormBuscar.campeonatoId"
              @change="carregarTiposRodadasCampeonato"
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
              :disabled="carregandoTiposCampeonato || tiposRodadasCampeonato.length === 0"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
              <option value="">
                {{ carregandoTiposCampeonato ? 'Carregando tipos...' : tiposRodadasCampeonato.length === 0 ? 'Selecione um campeonato primeiro' : 'Selecione um tipo de rodada' }}
              </option>
              <option v-for="tipoRodada in tiposRodadasCampeonato" :key="tipoRodada.id" :value="tipoRodada.id">
                {{ tipoRodada.nome }}
              </option>
            </select>
            
            <!-- Loading dos tipos de rodadas -->
            <div v-if="carregandoTiposCampeonato" class="mt-2 flex items-center space-x-2 text-sm text-gray-600">
              <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-orange-600"></div>
              <span>Carregando tipos de rodadas...</span>
            </div>
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
        </div>
      </div>

      <!-- Dropdown de Apostas -->
      <div class="max-w-7xl mx-auto mb-6 mt-8">
        <div class="bg-white rounded-lg shadow-lg overflow-hidden">
          <!-- Header do Dropdown -->
          <button
            @click="toggleDropdown('apostas')"
            class="w-full px-6 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white text-left flex items-center justify-between hover:from-green-700 hover:to-emerald-700 transition-colors"
          >
            <div class="flex items-center space-x-3">
              <span class="text-2xl">💰</span>
              <h2 class="text-xl font-semibold">Apostas</h2>
            </div>
            <svg 
              :class="['w-6 h-6 transition-transform duration-200', dropdownsAbertos.apostas ? 'rotate-180' : '']"
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </button>

          <!-- Conteúdo do Dropdown -->
          <div v-if="dropdownsAbertos.apostas" class="p-6">
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <!-- Formulário de Criação -->
              <div class="bg-gray-50 rounded-lg p-6">
                <h3 class="text-lg font-semibold text-gray-800 mb-4">➕ Criar Apostas</h3>
          
          <form @submit.prevent="enviarApostas">
            <!-- Seleção de Campeonato -->
            <div class="mb-4">
              <label for="campeonatoAposta" class="block text-sm font-medium text-gray-700 mb-2">
                Campeonato
              </label>
              <select
                id="campeonatoAposta"
                v-model="apostaForm.campeonatoId"
                @change="carregarRodadasCadastradas"
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
              <div class="bg-gray-50 rounded-lg p-6">
                <h3 class="text-lg font-semibold text-gray-800 mb-4">📊 Dados do Sistema</h3>
                
                <!-- Seleção de Campeonato -->
                <div class="mb-4">
                  <label for="campeonatoInfo" class="block text-sm font-medium text-gray-700 mb-2">
                    Selecionar Campeonatos
                  </label>
                  <select
                    id="campeonatoInfo"
                    v-model="campeonatosSelecionados"
                    multiple
                    size="5"
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option v-for="campeonato in campeonatos" :key="campeonato.id" :value="campeonato.id">
                      {{ campeonato.nome }}
                    </option>
                  </select>
                  <p class="text-xs text-gray-500 mt-2">
                    Selecione um ou mais campeonatos (Ctrl/Cmd + clique) para agregar os apostadores.
                  </p>
                </div>

                <!-- Botão de Busca -->
                <div class="mb-4">
                  <button
                    @click="carregarApostadores"
                    :disabled="carregandoApostadores || campeonatosSelecionados.length === 0"
                    class="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                  >
                    <svg v-if="carregandoApostadores" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                    </svg>
                    <span>{{ carregandoApostadores ? 'Buscando...' : 'Buscar Apostadores' }}</span>
                  </button>
                </div>

          <!-- Lista de Apostadores -->
          <div v-if="apostadores.length > 0" class="mb-4">
            <div class="flex justify-between items-center mb-2">
              <label class="block text-sm font-medium text-gray-700">
                Apostadores
              </label>
              <span class="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                Total: {{ totalApostadores }} | Mostrando: {{ apostadoresFiltrados.length }}
              </span>
            </div>
            
            <!-- Botão para gerar PDF de todos os apostadores -->
            <div class="mb-3">
              <button
                @click="gerarPDFTodosApostadores"
                :disabled="gerandoPDFTodos || apostadoresFiltrados.length === 0"
                class="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center space-x-2 text-sm"
              >
                <svg v-if="gerandoPDFTodos" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
                <span>{{ gerandoPDFTodos ? 'Gerando PDF...' : 'Gerar PDF de Todos os Apostadores' }}</span>
              </button>
            </div>
            
            <!-- Campo de Filtro -->
            <div class="mb-3">
              <input
                v-model="filtroApostador"
                type="text"
                placeholder="Filtrar por nome do apostador..."
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
            </div>
            
            <div class="max-h-40 overflow-y-auto border border-gray-200 rounded-lg">
              <div v-if="apostadoresFiltrados.length === 0" class="text-center py-4 text-gray-500 text-sm">
                Nenhum apostador encontrado com o filtro aplicado
              </div>
              <div
                v-for="apostador in apostadoresFiltrados"
                :key="obterChaveApostador(apostador)"
                @click="carregarDadosPdf(apostador)"
                :class="[
                  'p-2 cursor-pointer border-b border-gray-100 last:border-b-0 transition-all duration-200',
                  isApostadorSelecionado(apostador) 
                    ? 'bg-green-100 border-green-300 shadow-sm' 
                    : 'hover:bg-gray-50'
                ]"
              >
                <div class="flex justify-between items-center gap-3">
                  <div class="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      :value="obterChaveApostador(apostador)"
                      v-model="apostadoresSelecionados"
                      class="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                      @click.stop
                    />
                    <div>
                      <div class="flex items-center space-x-2">
                        <span 
                          :class="[
                            'text-sm font-medium',
                            isApostadorSelecionado(apostador)
                              ? 'text-green-800' 
                              : 'text-gray-800'
                          ]"
                        >
                          {{ apostador.nome }}
                        </span>
                        <span class="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                          {{ apostador.campeonatoNome }}
                        </span>
                        <div 
                          v-if="isApostadorSelecionado(apostador)"
                          class="w-2 h-2 bg-green-500 rounded-full animate-pulse"
                        ></div>
                      </div>
                      <div class="text-xs text-gray-500">
                        R$ {{ apostador.totalApostado?.toFixed(2) || '0.00' }} · Prêmio: R$ {{ apostador.totalPremio?.toFixed(2) || '0.00' }} · {{ apostador.totalApostas || 0 }} apostas
                      </div>
                    </div>
                  </div>
                  <svg 
                    :class="[
                      'w-4 h-4 transition-colors flex-shrink-0',
                      isApostadorSelecionado(apostador)
                        ? 'text-green-600' 
                        : 'text-gray-400'
                    ]" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                  </svg>
                </div>
              </div>
            </div>

            <div class="mt-3 flex items-center justify-between text-xs text-gray-500">
              <span>Selecionados: {{ apostadoresSelecionadosDetalhes.length }}</span>
              <span v-if="apostadoresSelecionadosDetalhes.length > 0">
                <span class="font-medium">Apostadores:</span>
                {{ apostadoresSelecionadosDetalhes.map(a => a.nome).join(', ') }}
              </span>
            </div>

            <div class="mt-3">
              <div class="flex gap-2">
                <button
                  @click="enviarApostadoresCombinados"
                  :disabled="enviandoApostadoresCombinados || apostadoresSelecionadosDetalhes.length < 2"
                  class="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center space-x-2 text-sm"
                >
                  <svg v-if="enviandoApostadoresCombinados" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>{{ enviandoApostadoresCombinados ? 'Enviando...' : 'Combinar apostadores' }}</span>
                </button>
                <button
                  @click="deletarApostadoresCombinados"
                  :disabled="deletandoApostadoresCombinados || !grupoIdentificadorParaDeletar || campeonatosSelecionados.length === 0"
                  class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center space-x-2 text-sm"
                  title="Deletar Apostadores Combinados"
                >
                  <svg v-if="deletandoApostadoresCombinados" class="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                  </svg>
                  <span>{{ deletandoApostadoresCombinados ? 'Deletando...' : 'Deletar' }}</span>
                </button>
              </div>
              <div class="mt-2">
                <input
                  v-model="grupoIdentificadorParaDeletar"
                  type="text"
                  placeholder="Grupo Identificador para deletar"
                  disabled
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
                />
              </div>
              <p class="text-xs text-gray-500 mt-2">
                Seleciona dois ou mais apostadores para enviá-los ao endpoint de combinações.
              </p>
            </div>

            <div
              v-if="mensagemApostadoresCombinados"
              :class="[
                'mt-2 text-xs font-medium',
                mensagemApostadoresCombinadosTipo === 'sucesso' ? 'text-green-600' : 'text-red-600'
              ]"
            >
              {{ mensagemApostadoresCombinados }}
            </div>
          </div>

          <!-- Dados do PDF -->
          <div v-if="dadosPdf" class="mb-4">
            <div class="flex justify-between items-center mb-2">
              <h3 class="text-lg font-semibold text-gray-800">Dados do PDF</h3>
              <div class="flex gap-2">
                <button
                  @click="abrirModalEditar"
                  class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                  </svg>
                  <span>Editar Nome</span>
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

          <!-- Card de Rodadas Cadastradas -->
          <div class="mt-6 bg-gray-50 rounded-lg p-6">
            <h3 class="text-lg font-semibold text-gray-800 mb-4">📋 Rodadas Cadastradas</h3>

            <div class="flex justify-end mb-4">
              <button
                @click="carregarTextoRodadaSelecionada(apostaForm.campeonatoId, rodadaCasaForm.tipoRodadaId, rodadaCasaForm.rodada)"
                :disabled="!apostaForm.campeonatoId || !rodadaCasaForm.rodada || !rodadaCasaForm.tipoRodadaId"
                class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                </svg>
                <span>Preencher texto da rodada selecionada</span>
              </button>
            </div>

            <!-- Loading -->
            <div v-if="carregandoRodadas" class="text-center py-8">
              <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-green-600 mx-auto mb-3"></div>
              <p class="text-gray-600 text-sm">Carregando rodadas...</p>
            </div>

            <!-- Empty State -->
            <div v-else-if="!apostaForm.campeonatoId || Object.keys(rodadasCadastradas).length === 0" class="text-center py-8">
              <div class="text-gray-400 mb-3">
                <svg class="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
              </div>
              <p class="text-gray-600 text-sm">
                {{ !apostaForm.campeonatoId ? 'Selecione um campeonato para visualizar as rodadas cadastradas' : 'Nenhuma rodada cadastrada para este campeonato' }}
              </p>
            </div>

            <!-- Lista de Rodadas -->
            <div v-else class="space-y-4">
              <!-- Lista de Rodadas por Tipo (Exibição) -->
              <div
                v-for="(dados, tipoRodadaId) in rodadasCadastradas"
                :key="tipoRodadaId"
                class="bg-white rounded-lg p-4 border border-gray-200"
              >
                <h4 class="text-md font-semibold text-gray-800 mb-3">
                  {{ dados.nometiporodada }}
                </h4>
                <div class="flex flex-wrap gap-2">
                  <div
                    v-for="rodada in dados.rodadas"
                    :key="`${tipoRodadaId}-${rodada}`"
                    class="flex items-center gap-1"
                  >
                    <span
                      :class="[
                        'px-3 py-1 rounded-full text-sm font-medium cursor-pointer transition-colors',
                        rodadaCasaForm.tipoRodadaId === tipoRodadaId && rodadaCasaForm.rodada === rodada 
                          ? 'bg-green-600 text-white' 
                          : 'bg-green-100 text-green-800 hover:bg-green-200'
                      ]"
                      @click="selecionarRodada(tipoRodadaId, rodada)"
                      @dblclick="handleRodadaDblClick(tipoRodadaId, rodada)"
                    >
                      {{ rodada }}
                    </span>
                    <button
                      @click="excluirRodadaCadastrada(apostaForm.campeonatoId, tipoRodadaId, rodada)"
                      :disabled="excluindoRodada === `${tipoRodadaId}-${rodada}`"
                      class="p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Excluir rodada"
                    >
                      <svg v-if="excluindoRodada === `${tipoRodadaId}-${rodada}`" class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              <div
                v-if="mensagemRodadaAposta"
                :class="[
                  'bg-white rounded-lg p-4 border border-gray-200 text-sm',
                  mensagemRodadaApostaTipo === 'sucesso' ? 'text-green-600' : 'text-red-600'
                ]"
              >
                {{ mensagemRodadaAposta }}
              </div>

              <!-- Formulário para enviar rodada-casa (Preenchimento) -->
              <div class="bg-white rounded-lg p-4 border border-gray-200 mt-4">
                <h4 class="text-md font-semibold text-gray-800 mb-4">💰 Configurar Rodada-Casa</h4>
                
                <form @submit.prevent="enviarRodadaCasa" class="space-y-4">
                  <!-- Seleção de Rodada -->
                  <div>
                    <label for="rodadaSelecionada" class="block text-sm font-medium text-gray-700 mb-2">
                      Selecionar Rodada
                    </label>
                    <select
                      id="rodadaSelecionada"
                      v-model="rodadaSelecionadaKey"
                      required
                      class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="">Selecione uma rodada</option>
                      <template v-for="(dados, tipoRodadaId) in rodadasCadastradas" :key="tipoRodadaId">
                        <option
                          v-for="rodada in dados.rodadas"
                          :key="`${tipoRodadaId}-${rodada}`"
                          :value="`${tipoRodadaId}||${rodada}`"
                        >
                          {{ rodada }} - {{ dados.nometiporodada }}
                        </option>
                      </template>
                    </select>
                  </div>

                  <!-- Valor da Casa -->
                  <div>
                    <label for="valorCasa" class="block text-sm font-medium text-gray-700 mb-2">
                      Valor da Casa
                    </label>
                    <input
                      id="valorCasa"
                      v-model="rodadaCasaForm.valorCasa"
                      type="number"
                      step="0.01"
                      min="0"
                      required
                      placeholder="Digite o valor da casa"
                      class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>

                  <!-- Botão de Envio -->
                  <button
                    type="submit"
                    :disabled="enviandoRodadaCasa || !rodadaCasaForm.rodada || !rodadaCasaForm.valorCasa || !apostaForm.campeonatoId"
                    class="w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                  >
                    <svg v-if="enviandoRodadaCasa" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>{{ enviandoRodadaCasa ? 'Enviando...' : 'Enviar Rodada-Casa' }}</span>
                  </button>

                  <!-- Mensagem de feedback -->
                  <div v-if="mensagemRodadaCasa" :class="mensagemRodadaCasaTipo === 'sucesso' ? 'text-green-600' : 'text-red-600'" class="text-sm mt-2">
                    {{ mensagemRodadaCasa }}
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
        </div>
      </div>

      <!-- Modal Apostas por Rodada -->
      <transition name="fade">
        <div
          v-if="modalApostasRodadaOpen"
          class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
        >
          <div class="bg-white rounded-lg shadow-xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
            <div class="flex items-center justify-between px-6 py-4 border-b flex-shrink-0">
              <div>
                <h3 class="text-xl font-semibold text-gray-800">Apostas da Rodada</h3>
                <p class="text-sm text-gray-500">
                  {{ rodadaCasaForm.rodada }} - {{ rodadasCadastradas[rodadaCasaForm.tipoRodadaId]?.nometiporodada || '' }}
                </p>
              </div>
              <button
                type="button"
                @click="fecharModalApostasRodada"
                class="text-gray-500 hover:text-gray-700"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>

            <div v-if="editandoApostasRodada" class="px-6 py-4 border-t border-b bg-indigo-50 flex flex-wrap gap-4">
              <div class="flex flex-col space-y-1">
                <span class="text-sm font-semibold text-indigo-800">Valor Original do Prêmio (global)</span>
                <input
                  v-model="valorOriginalPremioGlobal"
                  type="text"
                  class="w-40 px-3 py-2 border border-indigo-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                  placeholder="Ex: 10000.00"
                />
              </div>
              <div class="flex flex-col space-y-1">
                <span class="text-sm font-semibold text-indigo-800">Valor Prêmio (global)</span>
                <input
                  :value="valorPremioGlobal"
                  type="text"
                  class="w-40 px-3 py-2 border border-indigo-200 rounded-lg bg-gray-100 text-gray-700 text-sm cursor-not-allowed"
                  readonly
                />
              </div>
              <div class="flex flex-col space-y-1">
                <span class="text-sm font-semibold text-indigo-800">% Retirada (global)</span>
                <input
                  v-model="porcentagemRetiradaGlobal"
                  type="text"
                  class="w-32 px-3 py-2 border border-indigo-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                  placeholder="Ex: 10.00"
                />
              </div>
              <div class="flex-1 min-w-[200px] bg-white border border-indigo-200 rounded-lg p-3 text-sm text-indigo-700">
                Os campos <strong>Valor Original Prêmio</strong> e <strong>% Retirada</strong> serão aplicados a todas as apostas desta rodada.
              </div>
            </div>

            <div class="flex-1 overflow-auto">
              <table class="min-w-full divide-y divide-gray-200 text-sm text-left">
                <thead class="bg-gray-50">
                  <tr>
                    <th scope="col" class="px-6 py-3 font-semibold text-gray-700">Páreo</th>
                    <th scope="col" class="px-6 py-3 font-semibold text-gray-700">Apostador</th>
                    <th scope="col" class="px-6 py-3 font-semibold text-gray-700">Valor</th>
                    <th scope="col" class="px-6 py-3 font-semibold text-gray-700">Valor Original</th>
                    <th scope="col" class="px-6 py-3 font-semibold text-gray-700">% Aposta</th>
                    <th scope="col" class="px-6 py-3 font-semibold text-gray-700">% Prêmio</th>
                    <th scope="col" class="px-6 py-3 font-semibold text-gray-700">Valor Prêmio</th>
                    <th scope="col" class="px-6 py-3 font-semibold text-gray-700">Valor Original Prêmio</th>
                    <th scope="col" class="px-6 py-3 font-semibold text-gray-700">% Retirada</th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-100">
                  <tr v-if="!apostasRodadaSelecionada.length">
                    <td colspan="9" class="px-6 py-6 text-center text-gray-500">
                      Nenhuma aposta encontrada para esta rodada.
                    </td>
                  </tr>
                  <tr v-for="(aposta, index) in apostasRodadaParaExibicao" :key="aposta.id || index">
                    <td class="px-6 py-3 text-gray-700">
                      <template v-if="editandoApostasRodada">
                        <input
                          v-model="aposta.numeroPareo"
                          type="text"
                          class="w-20 px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                        />
                      </template>
                      <template v-else>
                        {{ aposta.numeroPareo }}
                      </template>
                    </td>
                    <td class="px-6 py-3 text-gray-700">
                      <template v-if="editandoApostasRodada">
                        <div class="space-y-2">
                          <input
                            v-model="aposta.apostador.nome"
                            type="text"
                            placeholder="Nome do apostador"
                            class="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                          />
                          <input
                            v-model="aposta.apostador.id"
                            type="text"
                            placeholder="ID do apostador"
                            class="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                          />
                        </div>
                      </template>
                      <template v-else>
                        <div class="flex flex-col">
                          <span>{{ aposta.apostador?.nome || '-' }}</span>
                          <span v-if="aposta.apostador?.id" class="text-xs text-gray-500">
                            ID: {{ aposta.apostador.id }}
                          </span>
                        </div>
                      </template>
                    </td>
                    <td class="px-6 py-3 text-gray-700">
                      <template v-if="editandoApostasRodada">
                        <input
                          v-model="aposta.valor"
                          type="text"
                          class="w-32 px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                        />
                      </template>
                      <template v-else>
                        {{ formatCurrency(aposta.valor) }}
                      </template>
                    </td>
                    <td class="px-6 py-3 text-gray-700">
                      <template v-if="editandoApostasRodada">
                        <input
                          v-model="aposta.valorOriginal"
                          type="text"
                          class="w-32 px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                        />
                      </template>
                      <template v-else>
                        {{ formatCurrency(aposta.valorOriginal) }}
                      </template>
                    </td>
                    <td class="px-6 py-3 text-gray-700">
                      <template v-if="editandoApostasRodada">
                        <div class="flex items-center space-x-2">
                          <input
                            v-model="aposta.porcentagemAposta"
                            type="text"
                            class="w-20 px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                          />
                          <span class="text-sm text-gray-500">%</span>
                        </div>
                      </template>
                      <template v-else>
                        {{ formatPercent(aposta.porcentagemAposta) }}
                      </template>
                    </td>
                    <td class="px-6 py-3 text-gray-700">
                      <template v-if="editandoApostasRodada">
                        <div class="flex items-center space-x-2">
                          <input
                            v-model="aposta.porcentagemPremio"
                            type="text"
                            class="w-20 px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                          />
                          <span class="text-sm text-gray-500">%</span>
                        </div>
                      </template>
                      <template v-else>
                        {{ formatPercent(aposta.porcentagemPremio) }}
                      </template>
                    </td>
                    <td class="px-6 py-3 text-gray-700">
                      <template v-if="editandoApostasRodada">
                        <input
                          v-model="aposta.valorPremio"
                          type="text"
                          class="w-32 px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                        />
                      </template>
                      <template v-else>
                        {{ formatCurrency(aposta.valorPremio) }}
                      </template>
                    </td>
                    <td class="px-6 py-3 text-gray-700">
                      <template v-if="editandoApostasRodada">
                        {{ formatCurrency(valorOriginalPremioGlobal || aposta.valorOriginalPremio) }}
                      </template>
                      <template v-else>
                        {{ formatCurrency(aposta.valorOriginalPremio) }}
                      </template>
                    </td>
                    <td class="px-6 py-3 text-gray-700">
                      <template v-if="editandoApostasRodada">
                        {{ formatPercent(porcentagemRetiradaGlobal || aposta.porcentagemRetirada) }}
                      </template>
                      <template v-else>
                        {{ formatPercent(aposta.porcentagemRetirada) }}
                      </template>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div class="px-6 py-4 border-t bg-gray-50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 flex-shrink-0">
              <div
                v-if="mensagemEdicaoApostasRodada"
                :class="[
                  'text-sm font-medium',
                  mensagemEdicaoApostasRodadaTipo === 'sucesso' ? 'text-green-600' : 'text-red-600'
                ]"
              >
                {{ mensagemEdicaoApostasRodada }}
              </div>
              <div class="flex flex-wrap items-center justify-end gap-3">
                <button
                  v-if="!editandoApostasRodada"
                  type="button"
                  @click="habilitarEdicaoApostasRodada"
                  :disabled="!apostasRodadaSelecionada.length"
                  class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:bg-gray-300 disabled:text-gray-500"
                >
                  Editar Apostas
                </button>
                <template v-else>
                  <button
                    type="button"
                    @click="cancelarEdicaoApostasRodada"
                    class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                    :disabled="salvandoApostasRodada"
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    @click="salvarEdicaoApostasRodada"
                    :disabled="salvandoApostasRodada"
                    class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center space-x-2"
                  >
                    <svg
                      v-if="salvandoApostasRodada"
                      class="animate-spin h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>{{ salvandoApostasRodada ? 'Salvando...' : 'Salvar Alterações' }}</span>
                  </button>
                </template>
              <button
                type="button"
                @click="fecharModalApostasRodada"
                class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                  :disabled="salvandoApostasRodada"
              >
                Fechar
              </button>
              </div>
            </div>
          </div>
        </div>
      </transition>

      <!-- Dropdown de Possíveis Ganhadores -->
      <div class="max-w-7xl mx-auto mb-6">
        <div class="bg-white rounded-lg shadow-lg overflow-hidden">
          <!-- Header do Dropdown -->
          <button
            @click="toggleDropdown('possiveisGanhadores')"
            class="w-full px-6 py-4 bg-gradient-to-r from-yellow-600 to-amber-600 text-white text-left flex items-center justify-between hover:from-yellow-700 hover:to-amber-700 transition-colors"
          >
            <div class="flex items-center space-x-3">
              <span class="text-2xl">🎯</span>
              <h2 class="text-xl font-semibold">Possíveis Ganhadores</h2>
            </div>
            <svg 
              :class="['w-6 h-6 transition-transform duration-200', dropdownsAbertos.possiveisGanhadores ? 'rotate-180' : '']"
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </button>

          <!-- Conteúdo do Dropdown -->
          <div v-if="dropdownsAbertos.possiveisGanhadores" class="p-6">
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <!-- Seleção de Campeonato -->
              <div class="bg-gray-50 rounded-lg p-6">
                <h3 class="text-lg font-semibold text-gray-800 mb-4">🎯 Selecionar Campeonato</h3>
                <div class="mb-4">
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Campeonato
                  </label>
                  <select
                    v-model="campeonatoPossiveisGanhadores"
                    @change="onCampeonatoPossiveisGanhadoresChange"
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  >
                    <option value="">Selecione um campeonato</option>
                    <option v-for="campeonato in campeonatos" :key="campeonato.id" :value="campeonato.id">
                      {{ campeonato.nome }}
                    </option>
                  </select>
                </div>

                <!-- Botão para buscar cavalos -->
                <button 
                  @click="buscarCavalosPossiveisGanhadores"
                  :disabled="carregandoCavalosPossiveisGanhadores || !campeonatoPossiveisGanhadores"
                  class="w-full px-6 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  <svg v-if="carregandoCavalosPossiveisGanhadores" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>{{ carregandoCavalosPossiveisGanhadores ? 'Buscando...' : 'Selecionar Possíveis Ganhadores' }}</span>
                </button>
              </div>

              <!-- Visualizar Possíveis Ganhadores por Campeonato -->
              <div class="bg-gray-50 rounded-lg p-6">
                <h3 class="text-lg font-semibold text-gray-800 mb-4">📊 Visualizar Possíveis Ganhadores</h3>
                <div class="mb-4">
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Campeonato
                  </label>
                  <select
                    v-model="campeonatoVisualizarGanhadores"
                    :disabled="carregandoGanhadoresVisualizacao"
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                  >
                    <option value="">Selecione um campeonato</option>
                    <option v-for="campeonato in campeonatos" :key="campeonato.id" :value="campeonato.id">
                      {{ campeonato.nome }}
                    </option>
                  </select>
                </div>
                
                <!-- Checkbox para agrupado -->
                <div class="mb-4">
                  <label class="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      v-model="ganhadoresAgrupados"
                      class="w-4 h-4 text-yellow-600 border-gray-300 rounded focus:ring-yellow-500"
                    />
                    <span class="text-sm font-medium text-gray-700">Agrupar por tipo de rodada</span>
                  </label>
                  <p class="text-xs text-gray-500 mt-1 ml-6">
                    {{ ganhadoresAgrupados ? 'Mostrar separado por tipo de rodada' : 'Mostrar tudo junto' }}
                  </p>
                </div>
                
                <button
                  @click="visualizarGanhadoresPossiveis"
                  :disabled="carregandoGanhadoresVisualizacao || !campeonatoVisualizarGanhadores"
                  class="w-full px-6 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  <svg v-if="carregandoGanhadoresVisualizacao" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>{{ carregandoGanhadoresVisualizacao ? 'Buscando...' : 'Buscar Possíveis Ganhadores' }}</span>
                </button>
                
                <div v-if="carregandoGanhadoresVisualizacao" class="mt-2 flex items-center justify-center space-x-2 text-sm text-gray-600">
                  <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-yellow-600"></div>
                  <span>Carregando ganhadores possíveis...</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Modal de Visualização de Possíveis Ganhadores -->
      <div v-if="modalVisualizacaoGanhadoresOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" @click.self="fecharModalVisualizacaoGanhadores">
        <div class="bg-white rounded-lg shadow-xl max-w-6xl w-full mx-4 max-h-[90vh] overflow-hidden">
          <!-- Header -->
          <div class="bg-gradient-to-r from-yellow-600 to-amber-600 text-white p-6">
            <div class="flex justify-between items-center">
              <div class="flex items-center space-x-4">
                <div class="bg-white/20 rounded-lg p-2">
                  <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <div>
                  <h2 class="text-2xl font-bold">POSSÍVEIS GANHADORES</h2>
                  <p class="text-yellow-100 text-sm">{{ campeonatoVisualizacaoNome }}</p>
                
                </div>
                
              </div>
              <div class="flex items-center space-x-2">
                <button 
                  @click="gerarPDFGanhadoresVisualizacao"
                  :disabled="!dadosGanhadoresVisualizacao || dadosGanhadoresVisualizacao.length === 0"
                  class="bg-white text-yellow-600 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                  </svg>
                  <span>Download PDF</span>
                </button>
                <button 
                  @click="fecharModalVisualizacaoGanhadores"
                  class="text-white hover:text-gray-200 transition-colors"
                >
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <!-- Content -->
          <div class="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
            <div v-if="dadosGanhadoresVisualizacao.length === 0" class="text-center py-12">
              <p class="text-gray-600">Nenhum ganhador possível encontrado.</p>
            </div>

            <div v-else class="space-y-6">
              <!-- Para cada tipo de rodada (quando agrupado) ou objeto direto (quando não agrupado) -->
              <div 
                v-for="(tipoRodada, index) in dadosGanhadoresVisualizacao" 
                :key="ganhadoresAgrupados && tipoRodada.tiporodada ? tipoRodada.tiporodada : index" 
                v-show="obterCavalosDoTipo(tipoRodada).length > 0"
                class="mb-8"
              >
                <!-- Título do tipo de rodada (apenas quando agrupado) -->
                <h3 v-if="ganhadoresAgrupados && tipoRodada.nometiporodada" class="text-xl font-bold text-gray-800 mb-4 bg-yellow-100 px-4 py-2 rounded-lg">
                  {{ tipoRodada.nometiporodada || `Tipo ${tipoRodada.tiporodada || ''}` }}
                </h3>

                <!-- Grid de tabelas por cavalo -->
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div 
                    v-for="cavalo in obterCavalosDoTipo(tipoRodada)" 
                    :key="cavalo.id"
                    class="bg-white border-2 border-yellow-300 rounded-lg overflow-hidden shadow-md"
                  >
                    <!-- Header da tabela do cavalo -->
                    <div class="bg-gradient-to-r from-yellow-400 to-amber-400 text-gray-900 px-4 py-2 font-semibold">
                      {{ cavalo.nome }}
                    </div>
                    
                    <!-- Tabela de apostadores -->
                    <div class="bg-black text-white px-4 py-1 text-sm font-semibold">
                      PRÊMIO
                    </div>
                    
                    <div class="divide-y divide-gray-200">
                      <div 
                        v-for="(apostador, index) in cavalo.apostadores" 
                        :key="index"
                        class="px-4 py-2 hover:bg-gray-50 transition-colors"
                      >
                        <div class="flex justify-between items-center">
                          <span class="text-sm text-gray-800 font-medium">{{ apostador.nomeapostador }}</span>
                          <span class="text-sm text-gray-900 font-semibold">{{ formatCurrency(apostador.valorpremio) }}</span>
                        </div>
                      </div>
                    </div>

                    <!-- Total do cavalo (opcional) -->
                    <div v-if="cavalo.apostadores.length > 0" class="bg-gray-100 px-4 py-2 border-t">
                      <div class="flex justify-between items-center text-sm font-semibold">
                        <span class="text-gray-700">Total:</span>
                        <span class="text-gray-900">{{ formatCurrency(cavalo.apostadores.reduce((sum, a) => sum + (a.valorpremio || 0), 0)) }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Modal de Relatório de Pagamentos -->
      <div v-if="modalRelatorioPagamentosOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" @click.self="fecharModalRelatorioPagamentos">
        <div class="bg-white rounded-lg shadow-xl max-w-5xl w-full mx-4 max-h-[90vh] overflow-hidden">
          <!-- Header -->
          <div class="bg-gradient-to-r from-red-600 to-rose-600 text-white p-6">
            <div class="flex justify-between items-center">
              <div>
                <h2 class="text-2xl font-bold">Relatório de Pagamentos</h2>
                <p class="text-red-100 text-sm mt-1">{{ descricaoRelatorioPagamentos }}</p>
              </div>
              <div class="flex items-center space-x-3">
                <button 
                  @click="gerarPDFRelatorioPagamentos"
                  :disabled="!dadosRelatorioPagamentos || !dadosRelatorioPagamentos.apostadores || dadosRelatorioPagamentos.apostadores.length === 0"
                  class="bg-white text-red-600 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                  </svg>
                  <span>Download PDF</span>
                </button>
                <button 
                  @click="fecharModalRelatorioPagamentos"
                  class="text-white hover:text-gray-200 transition-colors"
                >
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <!-- Content -->
          <div class="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
            <div v-if="!dadosRelatorioPagamentos" class="text-center py-12">
              <p class="text-gray-600">Carregando dados...</p>
            </div>

            <div v-else>
              <!-- Informações do Campeonato -->
              <div class="mb-6 p-4 bg-gray-50 rounded-lg">
                <div class="flex items-center space-x-2">
                  <span class="text-lg font-semibold text-gray-800">{{ tituloResumoRelatorioPagamentos }}</span>
                  <span class="text-lg text-gray-700">{{ descricaoRelatorioPagamentos || 'N/A' }}</span>
                </div>
              </div>

              <!-- Tabela de Apostadores -->
              <div class="overflow-x-auto">
                <table class="w-full border-collapse">
                  <thead>
                    <tr class="bg-gradient-to-r from-red-100 to-rose-100">
                      <th class="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-800">Apostador</th>
                      <th class="border border-gray-300 px-4 py-3 text-right font-semibold text-gray-800">Total Apostado</th>
                      <th class="border border-gray-300 px-4 py-3 text-right font-semibold text-gray-800">Total Prêmios Vencidos</th>
                      <th class="border border-gray-300 px-4 py-3 text-right font-semibold text-gray-800">Saldo Final</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr 
                      v-for="(apostador, index) in dadosRelatorioPagamentos.apostadores" 
                      :key="apostador.id ?? `${apostador.nome}-${index}`"
                      class="hover:bg-gray-50 transition-colors"
                    >
                      <td class="border border-gray-300 px-4 py-3 text-gray-800 font-medium">{{ apostador.nome }}</td>
                      <td class="border border-gray-300 px-4 py-3 text-right text-gray-700">{{ formatCurrency(apostador.totalApostado) }}</td>
                      <td class="border border-gray-300 px-4 py-3 text-right text-green-600 font-semibold">{{ formatCurrency(apostador.totalPremiosVencidos) }}</td>
                      <td 
                        :class="[
                          'border border-gray-300 px-4 py-3 text-right font-bold',
                          apostador.saldoFinal >= 0 ? 'text-green-600' : 'text-red-600'
                        ]"
                      >
                        {{ formatCurrency(apostador.saldoFinal) }}
                      </td>
                    </tr>
                  </tbody>
                  <tfoot v-if="dadosRelatorioPagamentos.apostadores && dadosRelatorioPagamentos.apostadores.length > 0">
                    <tr class="bg-gradient-to-r from-gray-100 to-gray-200 font-bold">
                      <td class="border border-gray-300 px-4 py-3 text-gray-800">TOTAIS</td>
                      <td class="border border-gray-300 px-4 py-3 text-right text-gray-800">
                        {{ formatCurrency(dadosRelatorioPagamentos.apostadores.reduce((sum, a) => sum + (a.totalApostado || 0), 0)) }}
                      </td>
                      <td class="border border-gray-300 px-4 py-3 text-right text-green-700">
                        {{ formatCurrency(dadosRelatorioPagamentos.apostadores.reduce((sum, a) => sum + (a.totalPremiosVencidos || 0), 0)) }}
                      </td>
                      <td 
                        :class="[
                          'border border-gray-300 px-4 py-3 text-right',
                          dadosRelatorioPagamentos.apostadores.reduce((sum, a) => sum + (a.saldoFinal || 0), 0) >= 0 ? 'text-green-700' : 'text-red-700'
                        ]"
                      >
                        {{ formatCurrency(dadosRelatorioPagamentos.apostadores.reduce((sum, a) => sum + (a.saldoFinal || 0), 0)) }}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              <!-- Mensagem se não houver apostadores -->
              <div v-if="!dadosRelatorioPagamentos.apostadores || dadosRelatorioPagamentos.apostadores.length === 0" class="text-center py-12">
                <p class="text-gray-600">Nenhum apostador encontrado para este campeonato.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Modal de Texto Copiável -->
      <div
        v-if="modalTextoRelatorioOpen"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        @click.self="fecharModalTextoRelatorio"
      >
        <div class="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden">
          <div class="flex justify-between items-center p-4 border-b bg-gray-900 text-white">
            <div>
              <h2 class="text-xl font-bold">Relatório de Pagamentos - Formato Copiável</h2>
              <p class="text-sm text-gray-300 mt-1">{{ descricaoRelatorioPagamentos }}</p>
            </div>
            <button
              @click="fecharModalTextoRelatorio"
              class="text-gray-300 hover:text-white transition-colors"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>

          <div class="p-6 bg-gray-50">

            <button
              @click="copiarRelatorioTexto"
              class="mb-4 inline-flex items-center px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16h8M8 12h8m-2-8h3a1 1 0 011 1v14a1 1 0 01-1 1H7a1 1 0 01-1-1V5a1 1 0 011-1h3"></path>
              </svg>
              Copiar texto
            </button>
            <p v-if="mensagemTextoCopiado" class="mb-3 text-sm" :class="mensagemTextoCopiado.includes('não') ? 'text-red-600' : 'text-green-600'">
              {{ mensagemTextoCopiado }}
            </p>
            <textarea
              :value="relatorioTextoCopiavel"
              readonly
              class="w-full h-64 border border-gray-300 rounded-lg p-4 font-mono text-sm bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-400"
            ></textarea>
          </div>

          <div class="flex justify-end space-x-3 p-4 border-t bg-gray-100">
            <button
              @click="fecharModalTextoRelatorio"
              class="px-4 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Fechar
            </button>
          </div>
        </div>
      </div>

      <!-- Dropdown de Finalistas -->
      <div class="max-w-7xl mx-auto mb-6">
        <div class="bg-white rounded-lg shadow-lg overflow-hidden">
          <!-- Header do Dropdown -->
          <button
            @click="toggleDropdown('finalistas')"
            class="w-full px-6 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-left flex items-center justify-between hover:from-purple-700 hover:to-indigo-700 transition-colors"
          >
            <div class="flex items-center space-x-3">
              <span class="text-2xl">🏆</span>
              <h2 class="text-xl font-semibold">Finalistas</h2>
            </div>
            <svg 
              :class="['w-6 h-6 transition-transform duration-200', dropdownsAbertos.finalistas ? 'rotate-180' : '']"
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </button>

          <!-- Conteúdo do Dropdown -->
          <div v-if="dropdownsAbertos.finalistas" class="p-6">
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <!-- Seleção de Campeonato -->
              <div class="bg-gray-50 rounded-lg p-6">
                <h3 class="text-lg font-semibold text-gray-800 mb-4">🎯 Selecionar Campeonato</h3>
                <div class="mb-4">
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Campeonato
                  </label>
                  <select
                    v-model="campeonatoFinalistas"
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="">Selecione um campeonato</option>
                    <option v-for="campeonato in campeonatos" :key="campeonato.id" :value="campeonato.id">
                      {{ campeonato.nome }}
                    </option>
                  </select>
                </div>

                <button 
                  @click="carregarFinalistas"
                  :disabled="carregandoFinalistas || !campeonatoFinalistas"
                  class="w-full px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  <svg v-if="carregandoFinalistas" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>{{ carregandoFinalistas ? 'Buscando...' : 'Carregar Finalistas' }}</span>
                </button>

                <button
                  @click="abrirModalSelecionarCampeao"
                  :disabled="carregandoSelecaoCampeao || !campeonatoFinalistas"
                  class="mt-3 w-full px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center space-x-2 disabled:bg-gray-400 disabled:hover:bg-gray-400 disabled:cursor-not-allowed"
                >
                  <svg
                    v-if="!carregandoSelecaoCampeao"
                    class="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 11c1.657 0 3-1.343 3-3S13.657 5 12 5 9 6.343 9 8s1.343 3 3 3zm0 2c-2.21 0-4 1.567-4 3.5V18h8v-1.5c0-1.933-1.79-3.5-4-3.5z"></path>
                  </svg>
                  <svg
                    v-else
                    class="animate-spin w-5 h-5 -ml-1 mr-2 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>{{ carregandoSelecaoCampeao ? 'Carregando dados...' : 'Selecionar Campeão de Rodada' }}</span>
                </button>

                <div
                  v-if="mensagemSelecaoCampeao"
                  :class="[
                    'mt-3 text-sm font-medium',
                    mensagemSelecaoCampeaoTipo === 'sucesso' ? 'text-green-600' : 'text-red-600'
                  ]"
                >
                  {{ mensagemSelecaoCampeao }}
                </div>
              </div>

              <!-- Card de Vencedores -->
              <div class="bg-gray-50 rounded-lg p-6">
                <h3 class="text-lg font-semibold text-gray-800 mb-4">🏆 Vencedores do Campeonato</h3>
                
                <div class="mb-4">
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Campeonato
                  </label>
                  <select
                    v-model="campeonatoVencedores"
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="">Selecione um campeonato</option>
                    <option v-for="campeonato in campeonatos" :key="campeonato.id" :value="campeonato.id">
                      {{ campeonato.nome }}
                    </option>
                  </select>
                </div>

                <button 
                  @click="carregarVencedores"
                  :disabled="carregandoVencedores || !campeonatoVencedores"
                  class="w-full px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  <svg v-if="carregandoVencedores" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>{{ carregandoVencedores ? 'Buscando...' : 'Buscar Vencedores' }}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Modal Selecionar Campeão -->
      <div
        v-if="modalSelecionarCampeaoOpen"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        @click.self="fecharModalSelecionarCampeao"
      >
        <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4">
          <div class="flex justify-between items-center p-4 border-b">
            <h2 class="text-xl font-bold text-gray-800">Selecionar Campeão</h2>
            <button
              @click="fecharModalSelecionarCampeao"
              class="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>

          <div class="p-6 space-y-4">
            <div v-if="carregandoSelecaoCampeao" class="py-12 text-center text-gray-600 space-y-3">
              <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600 mx-auto"></div>
              <p>Carregando dados para seleção...</p>
            </div>
            <template v-else>
              <p class="text-sm text-gray-600">
                Escolha o cavalo e a rodada para definir o campeão específico deste campeonato.
              </p>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Campeonato
                </label>
                <input
                  type="text"
                  :value="nomeCampeonatoFinalistas || 'Nenhum campeonato selecionado'"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600"
                  disabled
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Rodada
                </label>
                <select
                  v-model="rodadaSelecionadaCampeao"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="" disabled>Selecione uma rodada</option>
                  <option
                    v-for="rodada in rodadasDisponiveisCampeao"
                    :key="rodada.valor"
                    :value="rodada.valor"
                  >
                    {{ rodada.rotulo }}
                  </option>
                </select>
                <p v-if="!rodadasDisponiveisCampeao.length" class="mt-2 text-sm text-gray-500">
                  Nenhuma rodada encontrada. Carregue os dados de rodadas do campeonato.
                </p>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Cavalo
                </label>
                <select
                  v-model="campeaoSelecionado"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="" disabled>Selecione um cavalo</option>
                  <option
                    v-for="cavalo in cavalosDisponiveisCampeao"
                    :key="cavalo.id"
                    :value="cavalo.id"
                  >
                    {{ cavalo.nome }}
                  </option>
                </select>
                <p v-if="!cavalosDisponiveisCampeao.length" class="mt-2 text-sm text-gray-500">
                  Nenhum cavalo encontrado. Verifique se os finalistas foram carregados para este campeonato.
                </p>
              </div>

              

              <div
                v-if="mensagemModalCampeao"
                :class="[
                  'text-sm font-medium',
                  mensagemModalCampeaoTipo === 'sucesso' ? 'text-green-600' : 'text-red-600'
                ]"
              >
                {{ mensagemModalCampeao }}
              </div>
            </template>
          </div>

          <div class="flex justify-end space-x-3 p-4 border-t bg-gray-50">
            <button
              @click="fecharModalSelecionarCampeao"
              class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Cancelar
            </button>
            <button
              @click="confirmarSelecaoCampeao"
              :disabled="salvandoSelecaoCampeao || !campeaoSelecionado || !rodadaSelecionadaCampeao || carregandoSelecaoCampeao"
              class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              <svg
                v-if="salvandoSelecaoCampeao"
                class="animate-spin h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>{{ salvandoSelecaoCampeao ? 'Salvando...' : 'Confirmar Seleção' }}</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Modal de Possíveis Ganhadores -->
      <div v-if="modalPossiveisGanhadoresOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" @click.self="fecharModalPossiveisGanhadores">
        <div class="bg-white rounded-lg shadow-xl max-w-5xl w-full mx-4 max-h-[90vh] overflow-hidden">
          <!-- Header -->
          <div class="flex justify-between items-center p-4 border-b">
            <h2 class="text-xl font-bold text-gray-800">Possíveis Ganhadores</h2>
            <div class="flex items-center space-x-2">

              <button 
                @click="fecharModalPossiveisGanhadores"
                class="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg"
              >
                Fechar
              </button>
            </div>
          </div>
          <!-- Conteúdo -->
          <div class="overflow-auto max-h-[calc(90vh-80px)]">
            <div v-if="carregandoCavalosPossiveisGanhadores" class="p-6 text-center">
              <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600 mx-auto mb-4"></div>
              <p class="text-gray-600">Carregando cavalos...</p>
            </div>
            <div v-else-if="cavalosPossiveisGanhadores.length === 0" class="p-6 text-center text-gray-600">
              <p>Nenhum cavalo encontrado para esta rodada.</p>
            </div>
            <div v-else class="p-6">
              <div class="mb-4 flex justify-between items-center">
                <h3 class="text-lg font-semibold text-gray-800">Cavalos Disponíveis</h3>
                <div class="flex items-center space-x-2">
                  <button
                    @click="salvarGanhadoresPossiveis"
                    :disabled="salvandoGanhadoresPossiveis || cavalosSelecionadosFinalistas.size === 0"
                    class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center space-x-2"
                  >
                    <svg v-if="salvandoGanhadoresPossiveis" class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>{{ salvandoGanhadoresPossiveis ? 'Salvando...' : `Salvar Finalistas (${cavalosSelecionadosFinalistas.size})` }}</span>
                  </button>
                </div>
              </div>

              <div
                v-if="mensagemGanhadoresPossiveis"
                :class="[
                  'mb-4 text-sm font-medium',
                  mensagemGanhadoresPossiveisTipo === 'sucesso' ? 'text-green-600' : 'text-red-600'
                ]"
              >
                {{ mensagemGanhadoresPossiveis }}
              </div>

              <div
                v-if="cavalosSelecionadosFinalistasDetalhes.length"
                class="mb-4 p-3 border border-green-200 bg-green-50 rounded-lg"
              >
                <div class="flex items-center justify-between mb-2">
                  <h4 class="text-sm font-semibold text-green-700">
                    Selecionados atualmente ({{ cavalosSelecionadosFinalistasDetalhes.length }})
                  </h4>
                  <span class="text-xs text-green-600 font-medium">
                    Clique novamente para remover
                  </span>
                </div>
                <div class="flex flex-wrap gap-2">
                  <span
                    v-for="cavalo in cavalosSelecionadosFinalistasDetalhes"
                    :key="cavalo.id"
                    class="px-3 py-1 bg-white border border-green-300 text-green-700 rounded-full text-xs font-medium"
                  >
                    {{ cavalo.nome }} (ID: {{ cavalo.id }})
                  </span>
                </div>
              </div>
              
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div 
                  v-for="cavalo in cavalosPossiveisGanhadoresOrdenados" 
                  :key="cavalo.id || cavalo.idcavalo"
                  @click="toggleCavaloFinalista(cavalo.id || cavalo.idcavalo)"
                  :class="[
                    'rounded-lg p-4 hover:shadow-md transition-all cursor-pointer border-2',
                    cavalosSelecionadosFinalistas.has(cavalo.id || cavalo.idcavalo)
                      ? 'bg-gradient-to-r from-green-100 to-emerald-100 border-green-500 shadow-lg'
                      : 'bg-gradient-to-r from-yellow-50 to-amber-50 border-yellow-200 hover:border-yellow-300'
                  ]"
                >
                  <div class="font-semibold text-gray-800 mb-2">{{ cavalo.nome || cavalo.nomecavalo || `Cavalo ${cavalo.id || cavalo.idcavalo}` }}</div>
                  <div class="text-sm text-gray-600">
                    ID: {{ cavalo.id || cavalo.idcavalo }}
                  </div>
                  <div v-if="cavalosSelecionadosFinalistas.has(cavalo.id || cavalo.idcavalo)" class="mt-2 text-sm font-medium text-green-700 flex items-center space-x-1">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span>Selecionado</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Modal de Finalistas -->
      <div v-if="modalFinalistasOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" @click.self="fecharModalFinalistas">
        <div class="bg-white rounded-lg shadow-xl max-w-5xl w-full mx-4 max-h-[90vh] overflow-hidden">
          <!-- Header -->
          <div class="flex justify-between items-center p-4 border-b bg-gradient-to-r from-yellow-500 to-amber-500">
            <h2 class="text-xl font-bold text-white">Finalistas - {{ nomeCampeonatoFinalistas }}</h2>
            <button 
              @click="fecharModalFinalistas"
              class="bg-white hover:bg-gray-100 text-gray-800 px-4 py-2 rounded-lg transition-colors"
            >
              Fechar
            </button>
          </div>
          <!-- Conteúdo -->
          <div class="overflow-auto max-h-[calc(90vh-120px)] p-6">
            <div v-if="cavalosFinalistas.length === 0" class="text-center py-12 text-gray-600">
              Nenhum cavalo finalista encontrado.
            </div>
            <div v-else class="space-y-4">
              <div class="mb-4">
                <h3 class="text-lg font-semibold text-gray-800 mb-2">Selecione o(s) Cavalo(s) Vencedor(es):</h3>
                <p class="text-sm text-gray-600">Clique para selecionar ou desmarcar. É possível escolher mais de um cavalo.</p>
              </div>
              
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div 
                  v-for="cavalo in cavalosFinalistas" 
                  :key="cavalo.idcavalo || cavalo.id"
                  @click="toggleVencedorSelecionado(cavalo.idcavalo || cavalo.id)"
                  :class="[
                    'border-2 rounded-lg p-4 cursor-pointer transition-all',
                    vencedoresSelecionados.has(cavalo.idcavalo || cavalo.id)
                      ? 'border-green-500 bg-green-50 shadow-lg ring-2 ring-green-500'
                      : 'border-gray-300 hover:border-yellow-400 hover:bg-yellow-50'
                  ]"
                >
                  <div class="flex items-center justify-between">
                    <div class="flex-1">
                      <div class="font-semibold text-gray-800 text-lg mb-1">
                        {{ cavalo.nomecavalo || cavalo.nome }}
                      </div>
                      <div class="text-sm text-gray-600">
                        ID: {{ cavalo.idcavalo || cavalo.id }}
                      </div>
                    </div>
                    <div v-if="vencedoresSelecionados.has(cavalo.idcavalo || cavalo.id)" class="ml-2">
                      <svg class="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Botão para salvar vencedor -->
              <div class="mt-6 flex justify-center">
                <button
                  @click="salvarVencedor"
                  :disabled="salvandoVencedor || !vencedoresSelecionados.size"
                  class="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center space-x-2 font-semibold"
                >
                  <svg v-if="salvandoVencedor" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>{{ salvandoVencedor ? 'Salvando...' : 'Salvar Vencedor' }}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Modal de Vencedores -->
      <div v-if="modalVencedoresOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" @click.self="fecharModalVencedores">
        <div class="bg-white rounded-lg shadow-xl max-w-3xl w-full mx-4 max-h-[90vh] overflow-hidden">
          <!-- Header -->
          <div class="flex justify-between items-center p-4 border-b bg-gradient-to-r from-purple-600 to-indigo-600">
            <h2 class="text-xl font-bold text-white">Vencedores - {{ nomeCampeonatoVencedores }}</h2>
            <div class="flex items-center space-x-2">
              <button 
                v-if="dadosVencedores && dadosVencedores.vencedores && dadosVencedores.vencedores.length > 0"
                @click="gerarPDFVencedores"
                class="bg-white text-purple-600 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors flex items-center space-x-2"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
                <span>Download PDF</span>
              </button>
              <button 
                @click="fecharModalVencedores"
                class="bg-white hover:bg-gray-100 text-gray-800 px-4 py-2 rounded-lg transition-colors"
              >
                Fechar
              </button>
            </div>
          </div>
          <!-- Conteúdo -->
          <div class="overflow-auto max-h-[calc(90vh-80px)]">
            <div v-if="carregandoVencedores" class="p-6 text-center">
              <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
              <p class="text-gray-600">Carregando vencedores...</p>
            </div>
            <div v-else-if="!dadosVencedores" class="p-6 text-center text-gray-600">
              <p>Nenhum dado de vencedores disponível.</p>
            </div>
            <div v-else class="p-6">
              <div class="mb-5">
                <h3 class="text-lg font-semibold text-gray-800 mb-3">📊 Resumo dos Vencedores</h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div class="bg-purple-50 border border-purple-200 rounded-lg p-3">
                    <p class="text-xs uppercase text-purple-600 font-semibold tracking-wide">Cavalos vencedores</p>
                    <p class="text-2xl font-bold text-purple-700">{{ dadosVencedores.vencedores?.length || 0 }}</p>
                  </div>
                  <div class="bg-green-50 border border-green-200 rounded-lg p-3">
                    <p class="text-xs uppercase text-green-600 font-semibold tracking-wide">Total de prêmios pagos</p>
                    <p class="text-2xl font-bold text-green-700">{{ formatCurrency(totalPremios) }}</p>
                  </div>
                </div>
              </div>

              <div v-if="dadosVencedores.vencedores && dadosVencedores.vencedores.length > 0" class="space-y-5">
                <div
                  v-for="(cavalo, index) in dadosVencedores.vencedores"
                  :key="cavalo.cavaloId || index"
                  class="border border-gray-200 rounded-xl overflow-hidden shadow-sm"
                >
                  <div class="bg-gradient-to-r from-purple-50 to-indigo-50 border-b border-gray-200 px-4 py-3 flex items-center justify-between">
                    <div class="flex items-center space-x-3">
                      <span class="text-sm font-semibold text-purple-600">#{{ index + 1 }}</span>
                      <div>
                        <h4 class="text-lg font-semibold text-gray-800">
                          {{ cavalo.nomecavalovencedor || 'Cavalo não informado' }}
                        </h4>
                        <p class="text-xs text-gray-500">ID: {{ cavalo.cavaloId || 'N/A' }}</p>
                      </div>
                    </div>
                    <div class="text-sm font-semibold text-emerald-600">
                      {{ formatCurrency(calcularTotalPremiosCavalo(cavalo)) }}
                    </div>
                  </div>

                  <div class="p-4">
                    <div v-if="Array.isArray(cavalo.vencedores) && cavalo.vencedores.length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div
                        v-for="(apostador, apostadorIndex) in cavalo.vencedores"
                        :key="`${cavalo.cavaloId || index}-${apostadorIndex}`"
                        class="rounded-lg p-3 border-2 border-gray-100 bg-gray-50 hover:bg-gray-100 transition-colors"
                      >
                        <div class="flex justify-between items-center">
                          <div class="flex flex-col">
                            <span class="text-xs font-semibold text-purple-600 uppercase tracking-wide">Apostador</span>
                            <span class="text-sm font-medium text-gray-800">{{ apostador.nomeapostador || 'Não informado' }}</span>
                          </div>
                          <span class="text-xs font-semibold text-gray-500">#{{ apostadorIndex + 1 }}</span>
                        </div>
                        <div class="mt-3">
                          <span class="text-xs uppercase text-green-600 font-semibold tracking-wide">Prêmio</span>
                          <p class="text-base font-bold text-green-700">{{ formatCurrency(apostador.valorpremio) }}</p>
                        </div>
                      </div>
                    </div>
                    <div v-else class="text-center py-6 text-sm text-gray-500">
                      Nenhum apostador vencedor registrado para este cavalo.
                    </div>
                  </div>
                </div>
              </div>

              <div v-else class="text-center py-8 text-gray-500 text-sm">
                Nenhum vencedor encontrado.
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Dropdown de Relatório de Pagamentos -->
      <div class="max-w-7xl mx-auto mb-6">
        <div class="bg-white rounded-lg shadow-lg overflow-hidden">
          <!-- Header do Dropdown -->
          <button
            @click="toggleDropdown('relatorioPagamentos')"
            class="w-full px-6 py-4 bg-gradient-to-r from-red-600 to-rose-600 text-white text-left flex items-center justify-between hover:from-red-700 hover:to-rose-700 transition-colors"
          >
            <div class="flex items-center space-x-3">
              <span class="text-2xl">🧾</span>
              <h2 class="text-xl font-semibold">Relatório de Pagamentos</h2>
            </div>
            <svg 
              :class="['w-6 h-6 transition-transform duration-200', dropdownsAbertos.relatorioPagamentos ? 'rotate-180' : '']"
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </button>

          <!-- Conteúdo do Dropdown -->
          <div v-if="dropdownsAbertos.relatorioPagamentos" class="p-6">
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <!-- Seleção de Campeonato -->
              <div class="bg-gray-50 rounded-lg p-6">
                <h3 class="text-lg font-semibold text-gray-800 mb-4">🎯 Selecionar Campeonato</h3>
                <div class="mb-4">
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Campeonato
                  </label>
                  <select
                    v-model="relatorioPagamentosCampeonato"
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  >
                    <option value="">Selecione um campeonato</option>
                    <option v-for="campeonato in campeonatos" :key="campeonato.id" :value="campeonato.id">
                      {{ campeonato.nome }}
                    </option>
                  </select>
                </div>

                <div class="mb-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label class="inline-flex items-center space-x-2">
                    <input
                      type="checkbox"
                      v-model="filtrarSaldosNegativos"
                      :disabled="filtrarSaldosPositivos"
                      class="h-4 w-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                    />
                    <span class="text-sm text-gray-700">Mostrar apenas saldos devedores</span>
                  </label>

                  <label class="inline-flex items-center space-x-2">
                    <input
                      type="checkbox"
                      v-model="filtrarSaldosPositivos"
                      :disabled="filtrarSaldosNegativos"
                      class="h-4 w-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                    />
                    <span class="text-sm text-gray-700">Mostrar apenas saldos premiados</span>
                  </label>
                </div>

                <div class="mb-4">
                  <span class="block text-sm font-medium text-gray-700 mb-2">
                    Selecionar múltiplos campeonatos
                  </span>
                  <div class="max-h-48 overflow-y-auto border border-gray-200 rounded-lg divide-y divide-gray-100">
                    <label
                      v-for="campeonato in campeonatos"
                      :key="`multi-${campeonato.id}`"
                      class="flex items-center justify-between px-3 py-2 cursor-pointer hover:bg-gray-50"
                    >
                      <span class="text-sm text-gray-700">{{ campeonato.nome }}</span>
                      <input
                        type="checkbox"
                        class="h-4 w-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                        :value="campeonato.id"
                        v-model="relatorioPagamentosCampeonatosSelecionados"
                      />
                    </label>
                  </div>
                  <p class="text-xs text-gray-500 mt-2">
                    Marque os campeonatos desejados para gerar um relatório consolidado.
                  </p>
                </div>

                <button 
                  @click="gerarRelatorioPagamentos"
                  :disabled="carregandoRelatorioPagamentos || !relatorioPagamentosCampeonato"
                  class="w-full px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  <svg v-if="carregandoRelatorioPagamentos" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>{{ carregandoRelatorioPagamentos ? 'Gerando...' : 'Gerar Relatório' }}</span>
                </button>

                <button
                  @click="gerarRelatorioPagamentosMultiplo"
                  :disabled="carregandoRelatorioPagamentos || relatorioPagamentosCampeonatosSelecionados.length === 0"
                  class="mt-3 w-full px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  <svg
                    v-if="!carregandoRelatorioPagamentos"
                    class="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a3 3 0 00-6 0v2H7a2 2 0 00-2 2v8a2 2 0 002 2h10a2 2 0 002-2v-8a2 2 0 00-2-2zM9 9V7a1 1 0 012 0v2"></path>
                  </svg>
                  <svg
                    v-else
                    class="animate-spin w-5 h-5 -ml-1 mr-2 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>{{ carregandoRelatorioPagamentos ? 'Gerando...' : 'Gerar Relatório (Múltiplos)' }}</span>
                </button>

                <button
                  @click="abrirModalTextoRelatorio"
                  :disabled="!dadosRelatorioPagamentos || !dadosRelatorioPagamentos.apostadores || dadosRelatorioPagamentos.apostadores.length === 0"
                  class="mt-3 w-full px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3a1 1 0 011-1h6a1 1 0 011 1v4M5 11h14M5 15h14M5 19h14"></path>
                  </svg>
                  <span>Ver formato copiável</span>
                </button>
              </div>

              <!-- Ajuda -->
              <div class="bg-gray-50 rounded-lg p-6">
                <h3 class="text-lg font-semibold text-gray-800 mb-4">📘 Sobre este relatório</h3>
                <p class="text-sm text-gray-700">Selecione um campeonato para gerar o relatório de pagamentos. Implementaremos a lógica de busca e exibição conforme os endpoints definidos.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Dropdown de Informações -->
      <div class="max-w-7xl mx-auto mb-6">
        <div class="bg-white rounded-lg shadow-lg overflow-hidden">
          <!-- Header do Dropdown -->
          <button
            @click="toggleDropdown('informacoes')"
            class="w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white text-left flex items-center justify-between hover:from-blue-700 hover:to-cyan-700 transition-colors"
          >
            <div class="flex items-center space-x-3">
              <span class="text-2xl">ℹ️</span>
              <h2 class="text-xl font-semibold">Informações</h2>
            </div>
            <svg 
              :class="['w-6 h-6 transition-transform duration-200', dropdownsAbertos.informacoes ? 'rotate-180' : '']"
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </button>

          <!-- Conteúdo do Dropdown -->
          <div v-if="dropdownsAbertos.informacoes" class="p-6">
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <!-- Card informativo -->
              <div class="bg-gray-50 rounded-lg p-6">
                <h3 class="text-lg font-semibold text-gray-800 mb-4">📊 Dados do Sistema</h3>
                
                <!-- Seleção de Campeonato -->
                <div class="mb-4">
                  <label for="campeonatoInfoResumo" class="block text-sm font-medium text-gray-700 mb-2">
                    Campeonatos Selecionados
                  </label>
                  <select
                    id="campeonatoInfoResumo"
                    v-model="campeonatosSelecionados"
                    multiple
                    size="5"
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option v-for="campeonato in campeonatos" :key="campeonato.id" :value="campeonato.id">
                      {{ campeonato.nome }}
                    </option>
                  </select>
                  <p class="text-xs text-gray-500 mt-2">
                    Esta seleção é compartilhada com o filtro de apostas.
                  </p>
                </div>
              </div>

              <!-- Seção de Exibição do JSON -->
              <div class="bg-gray-50 rounded-lg p-6">
                <h3 class="text-lg font-semibold text-gray-800 mb-4">📄 Visualizar JSON</h3>
                
                <div v-if="dadosPdf" class="space-y-4">
                  <div class="flex justify-between items-center">
                    <p class="text-sm text-gray-600">Dados do apostador selecionado:</p>
                    <button
                      @click="mostrarJsonDados = !mostrarJsonDados"
                      class="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                      </svg>
                      <span>{{ mostrarJsonDados ? 'Ocultar JSON' : 'Exibir JSON' }}</span>
                    </button>
                  </div>
                  
                  <div v-if="mostrarJsonDados" class="bg-gray-900 p-4 rounded-lg max-h-96 overflow-y-auto">
                    <pre class="text-xs text-green-400 whitespace-pre-wrap font-mono">{{ JSON.stringify(dadosPdf, null, 2) }}</pre>
                  </div>
                </div>
                
                <div v-else class="text-center py-8 text-gray-500">
                  <svg class="w-12 h-12 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                  </svg>
                  <p class="text-sm">Selecione um apostador para visualizar os dados em JSON</p>
                </div>
              </div>
            </div>
          </div>
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
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-semibold text-gray-800 flex items-center">
                <svg class="w-5 h-5 mr-2 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                </svg>
                Cavalos ({{ pareoSelecionado?.cavalos?.length || 0 }})
              </h3>
              <button
                v-if="!editandoPareo"
                @click="iniciarEdicaoPareo"
                class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                </svg>
                <span>Editar</span>
              </button>
            </div>
            <div class="bg-gradient-to-r from-orange-50 to-amber-50 rounded-lg p-4 space-y-3">
              <div 
                v-for="(cavalo, index) in (editandoPareo ? cavalosEditando : pareoSelecionado?.cavalos)" 
                :key="cavalo.id || index"
                class="flex items-center justify-between p-3 bg-white rounded-lg border border-orange-200"
              >
                <div class="flex-1">
                  <div v-if="editandoPareo" class="mb-2">
                    <input
                      v-model="cavalo.nome"
                      type="text"
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Nome do cavalo"
                    />
                  </div>
                  <div v-else class="font-semibold text-gray-800">{{ cavalo.nome }}</div>
                  <div v-if="cavalo.identificador && !editandoPareo" class="text-sm text-gray-600">Identificador: {{ cavalo.identificador }}</div>
                </div>
                <div class="text-xs text-gray-500 ml-4">
                  ID: {{ cavalo.id }}
                  <span v-if="cavalo.pareoId" class="block">Pareo ID: {{ cavalo.pareoId }}</span>
                </div>
              </div>
            </div>
            <div v-if="mensagemEdicaoPareo" :class="mensagemEdicaoPareoTipo === 'sucesso' ? 'text-green-600' : 'text-red-600'" class="mt-3 text-sm font-medium">
              {{ mensagemEdicaoPareo }}
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
        <div class="bg-neutral-100 px-6 py-4 flex justify-end space-x-3">
          <button 
            v-if="editandoPareo"
            @click="cancelarEdicaoPareo"
            class="px-6 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
          >
            Cancelar
          </button>
          <button 
            v-if="editandoPareo"
            @click="salvarEdicaoPareo"
            :disabled="salvandoEdicaoPareo"
            class="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            <svg v-if="salvandoEdicaoPareo" class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>{{ salvandoEdicaoPareo ? 'Salvando...' : 'Salvar' }}</span>
          </button>
          <button 
            v-if="!editandoPareo"
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
                <div class="flex items-center space-x-2">
                  <button
                    v-if="!isPareoExcluido(pareo) && pareoEditandoId !== pareo.id"
                    @click="iniciarEdicaoPareoInline(pareo)"
                    class="text-blue-600 hover:text-blue-800 transition-colors p-1"
                    title="Editar pareo"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                    </svg>
                  </button>
                  <button
                    v-if="!isPareoExcluido(pareo) && pareoEditandoId !== pareo.id"
                    @click="excluirPareo(pareo)"
                    class="text-red-600 hover:text-red-800 transition-colors p-1"
                    title="Excluir pareo"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                    </svg>
                  </button>
                  <div v-if="pareoEditandoId === pareo.id" class="flex items-center space-x-2">
                    <button
                      @click="salvarEdicaoPareoInline(pareo)"
                      :disabled="salvandoEdicaoPareo"
                      class="text-green-600 hover:text-green-800 transition-colors p-1 disabled:opacity-50"
                      title="Salvar"
                    >
                      <svg v-if="salvandoEdicaoPareo" class="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                    </button>
                    <button
                      @click="cancelarEdicaoPareoInline"
                      class="text-gray-600 hover:text-gray-800 transition-colors p-1"
                      title="Cancelar"
                    >
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
              
              <div v-if="mensagemEdicaoPareo && pareoEditandoId === pareo.id" 
                   :class="mensagemEdicaoPareoTipo === 'sucesso' ? 'text-green-600' : 'text-red-600'" 
                   class="mb-2 text-sm font-medium">
                {{ mensagemEdicaoPareo }}
              </div>
              
              <div v-for="(cavalo, index) in (pareoEditandoId === pareo.id ? cavalosEditandoPorPareo[pareo.id] : pareo.cavalos)" 
                   :key="cavalo.id || index" 
                   class="ml-4 mt-2">
                <div class="flex items-center justify-between">
                  <div class="flex-1 flex items-center space-x-2">
                    <div v-if="pareoEditandoId === pareo.id" class="flex-1">
                      <input
                        v-model="cavalo.nome"
                        type="text"
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        placeholder="Nome do cavalo"
                      />
                    </div>
                    <template v-else>
                      <span :class="[
                        'font-semibold',
                        isPareoExcluido(pareo) ? 'text-red-700' : 'text-blue-700'
                      ]">{{ cavalo.nome }}</span>
                      <span v-if="cavalo.identificador" class="text-xs text-gray-600">({{ cavalo.identificador }})</span>
                    </template>
                  </div>
                  
                  <!-- Botão para remover cavalo individual (só aparece se há mais de um cavalo e não está editando) -->
                  <button
                    v-if="!isPareoExcluido(pareo) && pareo.cavalos.length > 1 && pareoEditandoId !== pareo.id"
                    @click="removerCavaloPareo(pareo, cavalo)"
                    class="text-red-500 hover:text-red-700 transition-colors p-1 ml-2"
                    :title="`Remover ${cavalo.nome}`"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                  </button>
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

  <!-- Modal de Editar Apostador -->
  <div v-if="modalEditarApostador" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
      <!-- Header -->
      <div class="bg-blue-600 text-white px-6 py-4 rounded-t-lg flex justify-between items-center">
        <h3 class="text-lg font-semibold">Editar Nome do Apostador</h3>
        <button 
          @click="fecharModalEditar"
          class="text-white hover:text-gray-200 transition-colors"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>

      <!-- Conteúdo -->
      <div class="p-6">
        <form @submit.prevent="salvarEdicao">
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Nome Atual
            </label>
            <input
              type="text"
              :value="apostadorSelecionado?.nome"
              disabled
              class="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600"
            />
          </div>

          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Novo Nome
            </label>
            <input
              v-model="nomeEditado"
              type="text"
              required
              placeholder="Digite o novo nome"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div v-if="mensagemEdicao" :class="mensagemEdicaoTipo === 'sucesso' ? 'text-green-600' : 'text-red-600'" class="mb-4 text-sm">
            {{ mensagemEdicao }}
          </div>

          <div class="flex gap-3">
            <button
              type="button"
              @click="fecharModalEditar"
              class="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              :disabled="editandoApostador || !nomeEditado.trim()"
              class="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              <svg v-if="editandoApostador" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>{{ editandoApostador ? 'Salvando...' : 'Salvar' }}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>

</template>

<script setup>
import { useCorridaApi } from '~/composables/useCorridaApi'

const corridaApi = useCorridaApi()
const { getRodadasCampeonatoDetalhadas } = useApi()
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
const atualizandoTipoRodadaId = ref(null)
const tipoRodadaEditandoId = ref(null)
const tipoRodadaNomeEdicao = ref('')

// Estados para criar pareo
const pareoFormCriar = ref({ campeonatoId: '', tipoRodadaId: '', texto: '' })
const enviandoPareo = ref(false)
const mensagemPareo = ref('')
const mensagemPareoTipo = ref('')

// Estados para buscar pareos
const pareoFormBuscar = ref({ campeonatoId: '', tipoRodadaId: '' })
const tiposRodadasCampeonato = ref([])
const carregandoTiposCampeonato = ref(false)
const pareosListados = ref([])
const pareosExcluidos = ref([])
const carregandoPareos = ref(false)

// Estados para criar apostas
const apostaForm = ref({ campeonatoId: '', tipoRodadaId: '', texto: '' })
const enviandoApostas = ref(false)
const mensagemApostas = ref('')
const mensagemApostasTipo = ref('')

// Estados para rodadas cadastradas
const rodadasCadastradas = ref({})
const carregandoRodadas = ref(false)
const rodadaCasaForm = ref({ tipoRodadaId: '', rodada: '', valorCasa: '' })
const enviandoRodadaCasa = ref(false)
const mensagemRodadaCasa = ref('')
const mensagemRodadaCasaTipo = ref('')
const enviandoRodadaAposta = ref(false)
const mensagemRodadaAposta = ref('')
const mensagemRodadaApostaTipo = ref('')
const excluindoRodada = ref('')
const modalApostasRodadaOpen = ref(false)
const apostasRodadaSelecionada = ref([])
const editandoApostasRodada = ref(false)
const apostasRodadaEditaveis = ref([])
const salvandoApostasRodada = ref(false)
const mensagemEdicaoApostasRodada = ref('')
const mensagemEdicaoApostasRodadaTipo = ref('')
const valorOriginalPremioGlobal = ref('')
const valorPremioGlobal = ref('')
const porcentagemRetiradaGlobal = ref('')

const rodadaSelecionadaKey = computed({
  get() {
    const { tipoRodadaId, rodada } = rodadaCasaForm.value
    if (!tipoRodadaId || !rodada) {
      return ''
    }
    return `${tipoRodadaId}||${rodada}`
  },
  set(value) {
    if (!value) {
      rodadaCasaForm.value.tipoRodadaId = ''
      rodadaCasaForm.value.rodada = ''
      mensagemRodadaAposta.value = ''
      return
    }

    const [tipoRodadaId, rodada] = value.split('||')
    rodadaCasaForm.value.tipoRodadaId = tipoRodadaId || ''
    rodadaCasaForm.value.rodada = rodada || ''
    mensagemRodadaAposta.value = ''
  }
})

const selecionarRodada = (tipoRodadaId, rodada) => {
  rodadaCasaForm.value.tipoRodadaId = tipoRodadaId
  rodadaCasaForm.value.rodada = rodada
  mensagemRodadaAposta.value = ''
}

const carregarTextoRodadaSelecionada = async (
  campeonatoId = apostaForm.value.campeonatoId,
  tipoRodadaId = rodadaCasaForm.value.tipoRodadaId,
  nomeRodada = rodadaCasaForm.value.rodada
) => {
  if (!campeonatoId || !tipoRodadaId || !nomeRodada) {
    mensagemApostas.value =
      'Selecione um campeonato e uma rodada em "Rodadas Cadastradas" para carregar o texto.'
    mensagemApostasTipo.value = 'erro'
    setTimeout(() => {
      mensagemApostas.value = ''
    }, 3000)
    return
  }

  try {
    const resposta = await corridaApi.postRodadaAposta(
      campeonatoId,
      tipoRodadaId,
      nomeRodada
    )

    const apostas = Array.isArray(resposta?.apostas)
      ? resposta.apostas
      : Array.isArray(resposta)
        ? resposta
        : []

    if (!apostas.length) {
      mensagemApostas.value =
        'Nenhuma aposta encontrada para a rodada selecionada.'
      mensagemApostasTipo.value = 'erro'
      setTimeout(() => (mensagemApostas.value = ''), 3000)
      return
    }

    const textoGerado = gerarTextoApostasRodada(
      nomeRodada,
      apostas
    )

    apostaForm.value.tipoRodadaId = tipoRodadaId
    apostaForm.value.texto = textoGerado
    mensagemApostas.value = 'Texto preenchido com sucesso!'
    mensagemApostasTipo.value = 'sucesso'
    setTimeout(() => (mensagemApostas.value = ''), 3000)
  } catch (error) {
    console.error('Erro ao carregar texto da rodada:', error)
    mensagemApostas.value =
      'Erro ao carregar as apostas da rodada. Verifique se a API está online.'
    mensagemApostasTipo.value = 'erro'
    setTimeout(() => (mensagemApostas.value = ''), 3000)
  }
}

const apostasRodadaParaExibicao = computed(() => {
  return editandoApostasRodada.value
    ? apostasRodadaEditaveis.value
    : apostasRodadaSelecionada.value
})

const handleRodadaDblClick = async (tipoRodadaId, rodada) => {
  selecionarRodada(tipoRodadaId, rodada)
  await enviarRodadaAposta()
}

const enviarRodadaAposta = async () => {
  if (
    !apostaForm.value.campeonatoId ||
    !rodadaCasaForm.value.tipoRodadaId ||
    !rodadaCasaForm.value.rodada
  ) {
    mensagemRodadaAposta.value = 'Selecione um campeonato e uma rodada antes de enviar'
    mensagemRodadaApostaTipo.value = 'erro'
    return
  }

  enviandoRodadaAposta.value = true
  mensagemRodadaAposta.value = ''

  try {
    const response = await corridaApi.postRodadaAposta(
      apostaForm.value.campeonatoId,
      rodadaCasaForm.value.tipoRodadaId,
      rodadaCasaForm.value.rodada
    )

    mensagemRodadaAposta.value = 'Rodada enviada para apostas com sucesso!'
    mensagemRodadaApostaTipo.value = 'sucesso'

    const apostas = Array.isArray(response) ? [...response] : []
    apostas.sort((a, b) => {
      const numeroA = Number(a?.numeroPareo) || 0
      const numeroB = Number(b?.numeroPareo) || 0
      return numeroA - numeroB
    })

    apostasRodadaSelecionada.value = apostas
    apostasRodadaEditaveis.value = apostas.map(aposta => prepararApostaParaEdicao(aposta))
    editandoApostasRodada.value = false
    mensagemEdicaoApostasRodada.value = ''
    mensagemEdicaoApostasRodadaTipo.value = ''
    modalApostasRodadaOpen.value = true

    setTimeout(() => {
      mensagemRodadaAposta.value = ''
    }, 3000)
  } catch (error) {
    mensagemRodadaAposta.value = 'Erro ao enviar rodada para apostas. Verifique se a API está online.'
    mensagemRodadaApostaTipo.value = 'erro'
    console.error('Erro ao enviar rodada para apostas:', error)
  } finally {
    enviandoRodadaAposta.value = false
  }
}

const fecharModalApostasRodada = () => {
  modalApostasRodadaOpen.value = false
  editandoApostasRodada.value = false
  salvandoApostasRodada.value = false
  mensagemEdicaoApostasRodada.value = ''
  mensagemEdicaoApostasRodadaTipo.value = ''
}

const excluirRodadaCadastrada = async (campeonatoId, tipoRodadaId, nomeRodada) => {
  if (!campeonatoId || !tipoRodadaId || !nomeRodada) {
    mensagemRodadaAposta.value = 'Dados insuficientes para excluir a rodada'
    mensagemRodadaApostaTipo.value = 'erro'
    setTimeout(() => {
      mensagemRodadaAposta.value = ''
    }, 3000)
    return
  }

  const chaveRodada = `${tipoRodadaId}-${nomeRodada}`
  excluindoRodada.value = chaveRodada
  mensagemRodadaAposta.value = ''
  mensagemRodadaApostaTipo.value = ''

  try {
    await corridaApi.deleteRodadaAposta(campeonatoId, tipoRodadaId, nomeRodada)
    
    mensagemRodadaAposta.value = 'Rodada excluída com sucesso!'
    mensagemRodadaApostaTipo.value = 'sucesso'
    
    // Recarregar rodadas cadastradas para atualizar a lista
    await carregarRodadasCadastradas()
    
    // Limpar seleção se a rodada excluída estava selecionada
    if (rodadaCasaForm.value.tipoRodadaId === tipoRodadaId && rodadaCasaForm.value.rodada === nomeRodada) {
      rodadaCasaForm.value.tipoRodadaId = ''
      rodadaCasaForm.value.rodada = ''
    }
    
    setTimeout(() => {
      mensagemRodadaAposta.value = ''
    }, 3000)
  } catch (error) {
    console.error('Erro ao excluir rodada:', error)
    mensagemRodadaAposta.value = 'Erro ao excluir rodada. Tente novamente.'
    mensagemRodadaApostaTipo.value = 'erro'
    setTimeout(() => {
      mensagemRodadaAposta.value = ''
    }, 3000)
  } finally {
    excluindoRodada.value = ''
  }
}

// Estados para apostadores e PDF
const campeonatosSelecionados = ref([])
const apostadores = ref([])
const totalApostadores = ref(0)
const apostadorSelecionado = ref(null)
const dadosPdf = ref(null)
const mostrarJsonDados = ref(false)
const carregandoApostadores = ref(false)
const carregandoPdf = ref(false)
const gerandoPDF = ref(false)
const filtroApostador = ref('')
const gerandoPDFTodos = ref(false)
const apostadoresSelecionados = ref([])
const enviandoApostadoresCombinados = ref(false)
const mensagemApostadoresCombinados = ref('')
const mensagemApostadoresCombinadosTipo = ref('')
const cacheApostasCombinadas = ref({})
const deletandoApostadoresCombinados = ref(false)
const grupoIdentificadorParaDeletar = ref('')

const gerarChaveNomes = (nomes) => {
  if (!Array.isArray(nomes)) return ''
  return nomes
    .map(nome => normalizarTexto(nome))
    .filter(Boolean)
    .sort()
    .join('|')
}

const obterChaveApostador = (apostador) => {
  if (!apostador) return ''
  if (apostador.chaveUnica) return apostador.chaveUnica
  const campeonatoId = apostador.campeonatoId ?? apostador.campeonatoID ?? apostador.campeonato_id ?? '0'
  return `${campeonatoId}-${apostador.id}`
}

const isApostadorSelecionado = (apostador) => {
  if (!apostadorSelecionado.value) return false
  return obterChaveApostador(apostadorSelecionado.value) === obterChaveApostador(apostador)
}

// Computed para filtrar apostadores
const apostadoresFiltrados = computed(() => {
  if (!filtroApostador.value.trim()) {
    return apostadores.value
  }
  const termoFiltro = filtroApostador.value.toLowerCase().trim()
  return apostadores.value.filter(apostador => 
    apostador.nome?.toLowerCase().includes(termoFiltro)
  )
})

const apostadoresSelecionadosDetalhes = computed(() => {
  if (!apostadoresSelecionados.value.length) return []
  const selecionadosSet = new Set(apostadoresSelecionados.value)
  return apostadores.value.filter(apostador => selecionadosSet.has(obterChaveApostador(apostador)))
})

// Estados para editar apostador
const modalEditarApostador = ref(false)
const editandoApostador = ref(false)
const nomeEditado = ref('')
const mensagemEdicao = ref('')
const mensagemEdicaoTipo = ref('')

// Estados para modal de pareo
const modalPareoOpen = ref(false)
const pareoSelecionado = ref(null)
const editandoPareo = ref(false)
const cavalosEditando = ref([])
const salvandoEdicaoPareo = ref(false)
const mensagemEdicaoPareo = ref('')
const mensagemEdicaoPareoTipo = ref('')
const pareoEditandoId = ref(null)
const cavalosEditandoPorPareo = ref({})

// Estados para modal de lista de pareos
const modalPareosOpen = ref(false)

// Estados Possíveis Ganhadores
const campeonatoPossiveisGanhadores = ref('')
const tiposRodadasPossiveisGanhadores = ref([])
const carregandoTiposPossiveisGanhadores = ref(false)
const tipoRodadaSelecionadoPossiveisGanhadores = ref('')
const rodadaIdPossiveisGanhadores = ref('')
const carregandoRodadaPossiveisGanhadores = ref(false)
const cavalosPossiveisGanhadores = ref([])
const carregandoCavalosPossiveisGanhadores = ref(false)
const modalPossiveisGanhadoresOpen = ref(false)
const cavalosSelecionadosFinalistas = ref(new Set())
const cavalosSelecionadosVencedores = ref(new Set())
const salvandoGanhadoresPossiveis = ref(false)
const mensagemGanhadoresPossiveis = ref('')
const mensagemGanhadoresPossiveisTipo = ref('')
const cavalosPossiveisGanhadoresOrdenados = computed(() => {
  if (!Array.isArray(cavalosPossiveisGanhadores.value)) {
    return []
  }

  return [...cavalosPossiveisGanhadores.value].sort((a, b) => {
    const nomeA = a?.nome ?? a?.nomecavalo ?? ''
    const nomeB = b?.nome ?? b?.nomecavalo ?? ''
    return nomeA.localeCompare(nomeB, 'pt-BR', { sensitivity: 'base' })
  })
})

const cavalosSelecionadosFinalistasDetalhes = computed(() => {
  if (!Array.isArray(cavalosPossiveisGanhadores.value) || cavalosPossiveisGanhadores.value.length === 0) {
    return []
  }

  const selecionados = []
  const idsSelecionados = cavalosSelecionadosFinalistas.value

  cavalosPossiveisGanhadores.value.forEach(cavalo => {
    const rawId = cavalo.id ?? cavalo.idcavalo
    const idNumerico = typeof rawId === 'number' ? rawId : parseInt(rawId)

    if (!Number.isNaN(idNumerico) && idsSelecionados.has(idNumerico)) {
      selecionados.push({
        id: idNumerico,
        nome: cavalo.nome ?? cavalo.nomecavalo ?? `Cavalo ${rawId}`
      })
    }
  })

  return selecionados
})

const normalizarTexto = (texto) => {
  if (!texto && texto !== 0) return ''
  return texto
    .toString()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .trim()
}

const mapaCavalosPorNome = computed(() => {
  const mapa = new Map()

  if (!Array.isArray(cavalosPossiveisGanhadores.value)) {
    return mapa
  }

  cavalosPossiveisGanhadores.value.forEach(cavalo => {
    const rawId = cavalo.id ?? cavalo.idcavalo
    const idNumerico = typeof rawId === 'number' ? rawId : parseInt(rawId)
    if (Number.isNaN(idNumerico)) {
      return
    }

    const nomesPossiveis = [cavalo.nome, cavalo.nomecavalo, `Cavalo ${rawId}`]
    nomesPossiveis.forEach(nome => {
      const chave = normalizarTexto(nome)
      if (chave) {
        mapa.set(chave, idNumerico)
      }
    })
  })

  return mapa
})
const campeonatoVisualizarGanhadores = ref('')
const carregandoGanhadoresVisualizacao = ref(false)
const dadosGanhadoresVisualizacao = ref([])
const modalVisualizacaoGanhadoresOpen = ref(false)
const campeonatoVisualizacaoNome = ref('')
const ganhadoresAgrupados = ref(false)

// Estados Finalistas
const campeonatoFinalistas = ref('')
const carregandoFinalistas = ref(false)
const modalFinalistasOpen = ref(false)
const htmlFinalistas = ref('')
const cavalosFinalistas = ref([])
const vencedoresSelecionados = ref(new Set())
const salvandoVencedor = ref(false)
const modalSelecionarCampeaoOpen = ref(false)
const campeaoSelecionado = ref('')
const rodadaSelecionadaCampeao = ref('')
const cavalosDisponiveisCampeao = ref([])
const rodadasDisponiveisCampeao = ref([])
const carregandoSelecaoCampeao = ref(false)
const salvandoSelecaoCampeao = ref(false)
const mensagemSelecaoCampeao = ref('')
const mensagemSelecaoCampeaoTipo = ref('')
const mensagemModalCampeao = ref('')
const mensagemModalCampeaoTipo = ref('')

// Estados Vencedores
const campeonatoVencedores = ref('')
const carregandoVencedores = ref(false)
const dadosVencedores = ref(null)
const modalVencedoresOpen = ref(false)

// Estados Relatório de Pagamentos
const relatorioPagamentosCampeonato = ref('')
const carregandoRelatorioPagamentos = ref(false)
const dadosRelatorioPagamentos = ref(null)
const modalRelatorioPagamentosOpen = ref(false)
const modalTextoRelatorioOpen = ref(false)
const filtrarSaldosNegativos = ref(false)
const filtrarSaldosPositivos = ref(false)
const relatorioPagamentosCampeonatosSelecionados = ref([])
const mensagemTextoCopiado = ref('')

const descricaoRelatorioPagamentos = computed(() => {
  if (!dadosRelatorioPagamentos.value) {
    return ''
  }

  const dados = dadosRelatorioPagamentos.value

  if (Array.isArray(dados.campeonatos) && dados.campeonatos.length > 0) {
    return dados.campeonatos.map((c) => c?.nome || `ID ${c?.id ?? ''}`).join(', ')
  }

  return dados.campeonato?.nome || ''
})

const tituloResumoRelatorioPagamentos = computed(() => {
  if (!dadosRelatorioPagamentos.value) {
    return 'Campeonato:'
  }

  const dados = dadosRelatorioPagamentos.value

  if (Array.isArray(dados.campeonatos) && dados.campeonatos.length > 0) {
    return 'Campeonatos:'
  }

  return 'Campeonato:'
})

// Estados para dropdowns
const dropdownsAbertos = ref({
  campeonatos: false,
  tiposRodadas: false,
  pareos: false,
  apostas: false,
  possiveisGanhadores: false,
  finalistas: false,
  relatorioPagamentos: false,
  informacoes: false
})

// Função para alternar dropdowns
const toggleDropdown = (dropdown) => {
  dropdownsAbertos.value[dropdown] = !dropdownsAbertos.value[dropdown]
}

// Funções para Possíveis Ganhadores
const onCampeonatoPossiveisGanhadoresChange = async () => {
  // Resetar valores quando o campeonato mudar
  tipoRodadaSelecionadoPossiveisGanhadores.value = ''
  tiposRodadasPossiveisGanhadores.value = []
  rodadaIdPossiveisGanhadores.value = ''
}

const buscarCavalosPossiveisGanhadores = async () => {
  if (!campeonatoPossiveisGanhadores.value) return

  mensagemGanhadoresPossiveis.value = ''
  mensagemGanhadoresPossiveisTipo.value = ''
  carregandoCavalosPossiveisGanhadores.value = true
  cavalosPossiveisGanhadores.value = []
  // Limpar seleções anteriores ao carregar novos cavalos
  cavalosSelecionadosFinalistas.value = new Set()
  cavalosSelecionadosVencedores.value = new Set()
  
  try {
    // Buscar cavalos usando o endpoint rodadas-cavalos
    // O retorno é um array direto de objetos com idcavalo e nomecavalo
    // Estrutura: [{ idcavalo: 184, nomecavalo: "MAXIMO SENATOR HBR" }, ...]
    const resposta = await corridaApi.getRodadasCavalos(
      campeonatoPossiveisGanhadores.value
    )
    
    // O retorno agora é diretamente um array de cavalos
    if (Array.isArray(resposta) && resposta.length > 0) {
      const respostaFiltrada = resposta.filter(cavalo => {
        const nomeTipoRodada = cavalo?.nometiporodada ?? cavalo?.nomeTipoRodada ?? cavalo?.tiporodada ?? ''
        return !String(nomeTipoRodada).toLowerCase().includes('final')
      })

      // Mapear os cavalos para o formato esperado pela interface
      cavalosPossiveisGanhadores.value = respostaFiltrada.map(cavalo => ({
        id: cavalo.idcavalo,
        nome: cavalo.nomecavalo,
        idcavalo: cavalo.idcavalo,
        nomecavalo: cavalo.nomecavalo
      }))
    } else {
      cavalosPossiveisGanhadores.value = []
    }
    
    // Buscar ganhadores possíveis já salvos
    await carregarGanhadoresPossiveis()
    
    modalPossiveisGanhadoresOpen.value = true
  } catch (error) {
    console.error('Erro ao buscar cavalos:', error)
    cavalosPossiveisGanhadores.value = []
    modalPossiveisGanhadoresOpen.value = true
  } finally {
    carregandoCavalosPossiveisGanhadores.value = false
  }
}

const carregarGanhadoresPossiveis = async () => {
  if (!campeonatoPossiveisGanhadores.value) return

  try {
    const novosFinalistas = new Set()
    const novosVencedores = new Set()

    // Buscar ganhadores possíveis já salvos usando GET (sem tipo de rodada)
    const ganhadores = await corridaApi.getGanhadoresPossiveis(
      campeonatoPossiveisGanhadores.value
    )
    
    const mapaNomesParaId = mapaCavalosPorNome.value

    if (Array.isArray(ganhadores)) {
      ganhadores.forEach(grupo => {
        if (!grupo || typeof grupo !== 'object') return

        Object.entries(grupo).forEach(([chave, valor]) => {
          if (['tiporodada', 'nometiporodada'].includes(chave)) {
            return
          }

          const nomeNormalizado = normalizarTexto(chave)
          const cavaloId = mapaNomesParaId.get(nomeNormalizado)

          if (cavaloId !== undefined) {
            novosFinalistas.add(cavaloId)
          }
        })
      })
    } else if (ganhadores && typeof ganhadores === 'object') {
      Object.entries(ganhadores).forEach(([nomeCavalo, _valor]) => {
        if (['tiporodada', 'nometiporodada'].includes(nomeCavalo)) {
          return
        }

        const cavaloId = mapaNomesParaId.get(normalizarTexto(nomeCavalo))
        if (cavaloId !== undefined) {
          novosFinalistas.add(cavaloId)
        }
      })
    }

    cavalosSelecionadosFinalistas.value = novosFinalistas
    cavalosSelecionadosVencedores.value = novosVencedores
  } catch (error) {
    console.error('Erro ao carregar ganhadores possíveis:', error)
    // Não bloquear a exibição se houver erro ao carregar os salvos
  }
}

const fecharModalPossiveisGanhadores = () => {
  modalPossiveisGanhadoresOpen.value = false
  // Limpar seleções ao fechar
  cavalosSelecionadosFinalistas.value = new Set()
  cavalosSelecionadosVencedores.value = new Set()
  mensagemGanhadoresPossiveis.value = ''
  mensagemGanhadoresPossiveisTipo.value = ''
}

const toggleCavaloFinalista = (cavaloId) => {
  mensagemGanhadoresPossiveis.value = ''
  mensagemGanhadoresPossiveisTipo.value = ''

  // Garantir que o ID seja um número válido
  const id = typeof cavaloId === 'number' ? cavaloId : parseInt(cavaloId)
  
  if (isNaN(id) || id === null || id === undefined) {
    console.warn('ID de cavalo inválido:', cavaloId)
    return
  }
  
  const novoSet = new Set(cavalosSelecionadosFinalistas.value)

  if (novoSet.has(id)) {
    novoSet.delete(id)
  } else {
    novoSet.add(id)
  }

  cavalosSelecionadosFinalistas.value = novoSet
}

const toggleCavaloVencedor = (cavaloId) => {
  // Por enquanto não faz nada, mas mantém o estado para uso futuro
  if (cavalosSelecionadosVencedores.value.has(cavaloId)) {
    cavalosSelecionadosVencedores.value.delete(cavaloId)
  } else {
    cavalosSelecionadosVencedores.value.add(cavaloId)
  }
}

// Remover função toggleCavaloVencedor não será mais necessária já que removemos os checkboxes
// Mas mantenho para uso futuro se necessário

const visualizarGanhadoresPossiveis = async () => {
  if (!campeonatoVisualizarGanhadores.value) {
    modalVisualizacaoGanhadoresOpen.value = false
    dadosGanhadoresVisualizacao.value = []
    return
  }

  carregandoGanhadoresVisualizacao.value = true
  dadosGanhadoresVisualizacao.value = []

  try {
    // Buscar ganhadores possíveis usando GET /ganhadores-possiveis/:idcampeonato?agrupado=true/false
    const ganhadores = await corridaApi.getGanhadoresPossiveis(
      campeonatoVisualizarGanhadores.value,
      ganhadoresAgrupados.value
    )
    
    // Quando agrupado: retorno é um array de objetos com a estrutura:
    // [{ tiporodada, nometiporodada, "NOME CAVALO": [{ nomeapostador, valorpremio }], ... }]
    // Quando não agrupado: retorno é um objeto direto com a estrutura:
    // { "NOME CAVALO": [{ nomeapostador, valorpremio }], ... }
    const deveIgnorarTipo = (dados) => {
      const nomeTipo = dados?.nometiporodada ?? dados?.nomeTipoRodada ?? dados?.tiporodada ?? ''
      if (typeof nomeTipo !== 'string') {
        return false
      }
      return nomeTipo.toLowerCase().includes('final')
    }

    if (ganhadoresAgrupados.value) {
      // Formato agrupado: array de objetos
      if (Array.isArray(ganhadores) && ganhadores.length > 0) {
        dadosGanhadoresVisualizacao.value = ganhadores.filter(item => !deveIgnorarTipo(item))
      } else {
        dadosGanhadoresVisualizacao.value = []
      }
    } else {
      // Formato não agrupado: objeto direto
      if (ganhadores && typeof ganhadores === 'object' && Object.keys(ganhadores).length > 0) {
        if (deveIgnorarTipo(ganhadores)) {
          dadosGanhadoresVisualizacao.value = []
        } else {
          // Converter objeto para array compatível com a renderização
          dadosGanhadoresVisualizacao.value = [ganhadores]
        }
      } else {
        dadosGanhadoresVisualizacao.value = []
      }
    }
    
    // Verificar se há dados válidos (cavalos com apostadores que tenham valores)
    const temDados = dadosGanhadoresVisualizacao.value.length > 0 && 
      dadosGanhadoresVisualizacao.value.some(item => {
        const cavalos = obterCavalosDoTipo(item)
        // Verificar se há cavalos com apostadores que tenham valores de prêmio
        return cavalos.length > 0 && cavalos.some(cavalo => 
          cavalo.apostadores && cavalo.apostadores.length > 0 &&
          cavalo.apostadores.some(apostador => {
            const valorPremio = apostador?.valorpremio ?? apostador?.valorPremio ?? 0
            return valorPremio > 0
          })
        )
      })
    
    if (temDados) {
      // Buscar nome do campeonato
      const campeonato = campeonatos.value.find(c => c.id === parseInt(campeonatoVisualizarGanhadores.value))
      campeonatoVisualizacaoNome.value = campeonato?.nome || ''
      
      modalVisualizacaoGanhadoresOpen.value = true
    } else {
      alert('Nenhum ganhador possível encontrado para este campeonato.')
    }
  } catch (error) {
    console.error('Erro ao buscar ganhadores possíveis:', error)
    alert('Erro ao carregar ganhadores possíveis. Tente novamente.')
  } finally {
    carregandoGanhadoresVisualizacao.value = false
  }
}

const fecharModalVisualizacaoGanhadores = () => {
  modalVisualizacaoGanhadoresOpen.value = false
}

// Função auxiliar para obter todos os cavalos de um tipo de rodada ou objeto
const obterCavalosDoTipo = (dados) => {
  const cavalos = []
  // Iterar sobre todas as propriedades do objeto
  for (const key in dados) {
    // Ignorar propriedades que não são cavalos (tiporodada, nometiporodada)
    if (key !== 'tiporodada' && key !== 'nometiporodada' && key !== 'nomeTipoRodada') {
      // Verificar se a chave começa com "cavalo" (formato antigo) ou é diretamente o nome do cavalo
      let nomeCavalo = key
      if (key.startsWith('cavalo')) {
        const cavaloId = key.replace('cavalo', '')
        nomeCavalo = `Cavalo ${cavaloId}`
      }
      
      // Verificar se o valor é um array (lista de apostadores)
      if (Array.isArray(dados[key])) {
        // Não mostrar se o array estiver vazio
        if (dados[key].length === 0) {
          continue
        }
        
        // Filtrar apostadores que tenham valor de prêmio válido
        const apostadoresComValor = (dados[key] || []).filter(apostador => {
          const valorPremio = apostador?.valorpremio ?? apostador?.valorPremio ?? 0
          return valorPremio > 0
        })
        
        // Só adicionar o cavalo se tiver apostadores com valores
        if (apostadoresComValor.length > 0) {
          // Ordenar apostadores alfabeticamente por nome
          const apostadoresOrdenados = [...apostadoresComValor].sort((a, b) => {
            const nomeA = (a.nomeapostador || '').toLowerCase()
            const nomeB = (b.nomeapostador || '').toLowerCase()
            return nomeA.localeCompare(nomeB, 'pt-BR')
          })
          
          cavalos.push({
            id: key,
            nome: nomeCavalo,
            apostadores: apostadoresOrdenados
          })
        }
      }
    }
  }
  // Ordenar cavalos alfabeticamente por nome
  return cavalos.sort((a, b) => {
    const nomeA = (a.nome || '').toLowerCase()
    const nomeB = (b.nome || '').toLowerCase()
    return nomeA.localeCompare(nomeB, 'pt-BR')
  })
}

const salvarGanhadoresPossiveis = async () => {
  if (!campeonatoPossiveisGanhadores.value) return
  if (cavalosSelecionadosFinalistas.value.size === 0) return

  salvandoGanhadoresPossiveis.value = true
  mensagemGanhadoresPossiveis.value = ''
  mensagemGanhadoresPossiveisTipo.value = ''
  
  try {
    // Converter Set para Array de números válidos, removendo null, undefined e NaN
    const cavalosIds = Array.from(cavalosSelecionadosFinalistas.value)
      .map(id => {
        const numId = typeof id === 'number' ? id : parseInt(id)
        return isNaN(numId) ? null : numId
      })
      .filter(id => id !== null && id !== undefined && !isNaN(id))
    
    // Verificar se há IDs válidos após filtragem
    if (cavalosIds.length === 0) {
      mensagemGanhadoresPossiveis.value = 'Nenhum cavalo válido selecionado.'
      mensagemGanhadoresPossiveisTipo.value = 'erro'
      return
    }
    
    // Enviar para o endpoint POST /ganhadores-possiveis/:idcampeonato (sem tipo de rodada)
    await corridaApi.postGanhadoresPossiveis(
      campeonatoPossiveisGanhadores.value,
      cavalosIds
    )
    
    // Limpar seleções após salvar
    await carregarGanhadoresPossiveis()

    mensagemGanhadoresPossiveis.value = 'Ganhadores possíveis salvos com sucesso!'
    mensagemGanhadoresPossiveisTipo.value = 'sucesso'
  } catch (error) {
    console.error('Erro ao salvar ganhadores possíveis:', error)
    mensagemGanhadoresPossiveis.value = 'Erro ao salvar ganhadores possíveis. Tente novamente.'
    mensagemGanhadoresPossiveisTipo.value = 'erro'
  } finally {
    salvandoGanhadoresPossiveis.value = false
  }
}

const nomeCampeonatoFinalistas = computed(() => {
  const c = (campeonatos.value || []).find(c => c.id === campeonatoFinalistas.value)
  return c ? c.nome : ''
})

const nomeCampeonatoVencedores = computed(() => {
  const c = (campeonatos.value || []).find(c => c.id === campeonatoVencedores.value)
  return c ? c.nome : ''
})

const totalPremios = computed(() => {
  if (!dadosVencedores.value?.vencedores || !Array.isArray(dadosVencedores.value.vencedores)) {
    return 0
  }

  return dadosVencedores.value.vencedores.reduce((accTotal, vencedor) => {
    if (!Array.isArray(vencedor.vencedores)) {
      return accTotal
    }

    const subtotal = vencedor.vencedores.reduce((acc, vencedorApostador) => {
      return acc + (Number(vencedorApostador.valorpremio) || 0)
    }, 0)

    return accTotal + subtotal
  }, 0)
})

const calcularTotalPremiosCavalo = (cavalo) => {
  if (!cavalo || !Array.isArray(cavalo.vencedores)) {
    return 0
  }

  return cavalo.vencedores.reduce((acc, vencedor) => {
    return acc + (Number(vencedor.valorpremio) || 0)
  }, 0)
}

const carregarFinalistas = async () => {
  if (!campeonatoFinalistas.value) return
  carregandoFinalistas.value = true
  htmlFinalistas.value = ''
  try {
    // 1. Buscar cavalos do endpoint rodadas-cavalos/idcampeonato
    const cavalosRodada = await corridaApi.getRodadasCavalos(campeonatoFinalistas.value)
    
    if (!Array.isArray(cavalosRodada) || cavalosRodada.length === 0) {
      cavalosFinalistas.value = []
      htmlFinalistas.value = '<div class="p-6 text-center text-gray-600">Nenhum cavalo encontrado para este campeonato.</div>'
      modalFinalistasOpen.value = true
      return
    }

    // 2. Buscar ganhadores possíveis do endpoint ganhadores-possiveis/idcampeonato (não agrupado)
    const ganhadoresPossiveis = await corridaApi.getGanhadoresPossiveis(
      campeonatoFinalistas.value,
      false // não agrupado
    )

    // 3. Extrair nomes dos cavalos dos ganhadores possíveis
    const nomesCavalosGanhadores = new Set()
    
    // Quando não agrupado, retorna um objeto direto com chaves sendo nomes de cavalos
    if (ganhadoresPossiveis && typeof ganhadoresPossiveis === 'object') {
      // Extrair todas as chaves que não são tiporodada ou nometiporodada
      for (const key in ganhadoresPossiveis) {
        if (key !== 'tiporodada' && key !== 'nometiporodada') {
          nomesCavalosGanhadores.add(key)
        }
      }
    }

    // 4. Filtrar cavalos de rodadas-cavalos mantendo apenas os que estão nos ganhadores possíveis
    const cavalosFiltrados = cavalosRodada.filter(cavalo => {
      const nomeCavalo = cavalo.nomecavalo || cavalo.nome || ''
      return nomesCavalosGanhadores.has(nomeCavalo)
    })

    if (cavalosFiltrados.length === 0) {
      cavalosFinalistas.value = []
      htmlFinalistas.value = '<div class="p-6 text-center text-gray-600">Nenhum cavalo finalista encontrado (nenhum cavalo dos ganhadores possíveis está nas rodadas).</div>'
      modalFinalistasOpen.value = true
      return
    }

    // 5. Armazenar cavalos filtrados e gerar HTML
    cavalosFinalistas.value = cavalosFiltrados
    htmlFinalistas.value = gerarHTMLFinalistasFiltrados(cavalosFiltrados)

    // 6. Buscar vencedores atuais para pré-selecionar
    const idsDisponiveis = new Set(
      cavalosFiltrados
        .map(c => c.idcavalo ?? c.id)
        .map(rawId => (typeof rawId === 'number' ? rawId : parseInt(rawId)))
        .filter(id => !Number.isNaN(id))
    )

    const vencedoresSet = new Set()

    try {
      const vencedoresAtuais = await corridaApi.getVencedoresCampeonato(campeonatoFinalistas.value)

      if (vencedoresAtuais && Array.isArray(vencedoresAtuais.vencedores)) {
        vencedoresAtuais.vencedores.forEach(item => {
          const rawId = item?.cavaloId
          const id = typeof rawId === 'number' ? rawId : parseInt(rawId)
          if (!Number.isNaN(id) && idsDisponiveis.has(id)) {
            vencedoresSet.add(id)
          }
        })
      }
    } catch (erroVencedores) {
      console.error('Erro ao carregar vencedores atuais:', erroVencedores)
    }

    vencedoresSelecionados.value = vencedoresSet
    modalFinalistasOpen.value = true
  } catch (e) {
    console.error('Erro ao carregar finalistas:', e)
    cavalosFinalistas.value = []
    htmlFinalistas.value = '<div class="p-6 text-center text-red-600">Erro ao carregar finalistas. Tente novamente.</div>'
    modalFinalistasOpen.value = true
  } finally {
    carregandoFinalistas.value = false
  }
}

const carregarVencedores = async () => {
  if (!campeonatoVencedores.value) {
    dadosVencedores.value = null
    return
  }
  
  carregandoVencedores.value = true
  dadosVencedores.value = null
  modalVencedoresOpen.value = true
  
  try {
    const response = await corridaApi.getVencedoresCampeonato(campeonatoVencedores.value)
    dadosVencedores.value = response
  } catch (error) {
    console.error('Erro ao carregar vencedores:', error)
    dadosVencedores.value = null
  } finally {
    carregandoVencedores.value = false
  }
}

const fecharModalVencedores = () => {
  modalVencedoresOpen.value = false
}

const gerarHTMLFinalistasFiltrados = (cavalos) => {
  let html = `
    <style>
      .tipo-title{background:#D4AF37;color:#fff;padding:10px 14px;font-weight:bold;border-radius:4px;margin-bottom:10px}
      .cavalo{border:1px solid #ddd;border-radius:4px;margin-bottom:14px;overflow:hidden}
      .cavalo-h{background:#f5f5f5;padding:10px 14px;font-weight:bold;border-bottom:2px solid #D4AF37}
      .cavalo-body{padding:10px 14px}
      .cavalo-n{font-weight:600;font-size:16px;margin-bottom:5px}
      .muted{font-size:12px;color:#777}
      .empty{padding:16px;text-align:center;color:#666}
    </style>
  `

  if (!Array.isArray(cavalos) || cavalos.length === 0) {
    html += `<div class="empty">Nenhum cavalo finalista encontrado.</div>`
    return html
  }

  html += `<div class="tipo-title">FINALISTAS (${cavalos.length} ${cavalos.length === 1 ? 'cavalo' : 'cavalos'})</div>`

  cavalos.forEach(cavalo => {
    const nomeCavalo = cavalo.nomecavalo || cavalo.nome || 'N/A'
    const idCavalo = cavalo.idcavalo || cavalo.id || 'N/A'
    
    html += `<div class="cavalo">`
    html += `<div class="cavalo-h">${nomeCavalo}</div>`
    html += `<div class="cavalo-body">`
    html += `<div class="cavalo-n">${nomeCavalo}</div>`
    html += `<div class="muted">ID: ${idCavalo}</div>`
    html += `</div>`
    html += `</div>`
  })

  return html
}

const gerarHTMLFinalistas = (porTipo) => {
  let html = `
    <style>
      .tipo-title{background:#D4AF37;color:#fff;padding:10px 14px;font-weight:bold;border-radius:4px;margin-bottom:10px}
      .pareo{border:1px solid #ddd;border-radius:4px;margin-bottom:14px;overflow:hidden}
      .pareo-h{background:#f5f5f5;padding:10px 14px;font-weight:bold;border-bottom:2px solid #D4AF37}
      .cavalo{padding:10px 14px;border-bottom:1px solid #eee}
      .cavalo:last-child{border-bottom:none}
      .cavalo-n{font-weight:600}
      .muted{font-size:11px;color:#777}
      .empty{padding:16px;text-align:center;color:#666}
    </style>
  `

  const tiposNomes = Object.keys(porTipo || {})
  if (tiposNomes.length === 0) {
    html += `<div class="empty">Nenhuma aposta encontrada para os tipos finalistas.</div>`
    return html
  }

  tiposNomes.forEach(tipoNome => {
    const itens = porTipo[tipoNome] || []
    html += `<div class="tipo"><div class="tipo-title">${tipoNome.toUpperCase()}</div>`

    // Agrupar por pareo número
    const mapaPareos = new Map()
    itens.forEach(a => {
      const pareoObj = a?.pareo ? a.pareo : a
      const numero = pareoObj?.numero ?? 'N/A'
      if (!mapaPareos.has(numero)) {
        mapaPareos.set(numero, new Set())
      }
      ;(pareoObj?.cavalos || []).forEach(c => {
        mapaPareos.get(numero).add(JSON.stringify({ nome: c?.nome, identificador: c?.identificador, id: c?.id }))
      })
    })

    if (mapaPareos.size === 0) {
      html += `<div class="empty">Nenhum pareo encontrado para este tipo.</div>`
    } else {
      mapaPareos.forEach((cavalosSet, numero) => {
        const cavalos = Array.from(cavalosSet).map(s => JSON.parse(s))
        const header = `Pareo ${numero} - ${cavalos.map(c=>c.nome).filter(Boolean).join(' / ')}`
        html += `<div class="pareo"><div class="pareo-h">${header}</div>`
        cavalos.forEach(c => {
          html += `<div class="cavalo"><div class="cavalo-n">${c.nome || 'N/A'}</div>`
          if (c.identificador) html += `<div class="muted">Identificador: ${c.identificador}</div>`
          if (c.id) html += `<div class="muted">ID: ${c.id}</div>`
          html += `</div>`
        })
        html += `</div>`
      })
    }

    html += `</div>`
  })

  return html
}

const fecharModalFinalistas = () => {
  modalFinalistasOpen.value = false
  vencedoresSelecionados.value = new Set()
  cavalosFinalistas.value = []
}

const abrirModalSelecionarCampeao = async () => {
  if (!campeonatoFinalistas.value) {
    mensagemSelecaoCampeao.value = 'Selecione um campeonato antes de escolher o campeão da rodada.'
    mensagemSelecaoCampeaoTipo.value = 'erro'
    setTimeout(() => {
      mensagemSelecaoCampeao.value = ''
    }, 3000)
    return
  }

  mensagemSelecaoCampeao.value = ''
  mensagemSelecaoCampeaoTipo.value = ''
  campeaoSelecionado.value = ''
  rodadaSelecionadaCampeao.value = ''
  mensagemModalCampeao.value = ''
  mensagemModalCampeaoTipo.value = ''
  cavalosDisponiveisCampeao.value = []
  rodadasDisponiveisCampeao.value = []

  modalSelecionarCampeaoOpen.value = true
  carregandoSelecaoCampeao.value = true

  try {
    const [cavalosResponse, rodadasResponse] = await Promise.all([
      corridaApi.getRodadasCavalos(campeonatoFinalistas.value),
      corridaApi.getRodadasCampeonato(campeonatoFinalistas.value)
    ])

    const cavalosLista = Array.isArray(cavalosResponse)
      ? cavalosResponse
        .map((cavalo) => {
          const rawId = cavalo.id ?? cavalo.idcavalo
          if (rawId === undefined || rawId === null) {
            return null
          }
          const idNumerico = typeof rawId === 'number' ? rawId : parseInt(rawId, 10)
          if (Number.isNaN(idNumerico)) {
            return null
          }
          const nome =
            cavalo.nome ??
            cavalo.nomecavalo ??
            `Cavalo ${idNumerico}`
          return {
            id: idNumerico.toString(),
            nome
          }
        })
        .filter(Boolean)
      : []

    const rodadasLista = []

    if (rodadasResponse && typeof rodadasResponse === 'object') {
      Object.values(rodadasResponse).forEach((dados) => {
        const nomeTipo = dados?.nometiporodada ?? ''
        if (Array.isArray(dados?.rodadas)) {
          dados.rodadas.forEach((rodada) => {
            const valor = rodada !== undefined && rodada !== null ? String(rodada) : ''
            if (valor) {
              rodadasLista.push({
                valor,
                rotulo: nomeTipo ? `${valor} - ${nomeTipo}` : valor
              })
            }
          })
        }
      })
    }

    cavalosDisponiveisCampeao.value = cavalosLista
    rodadasDisponiveisCampeao.value = rodadasLista

    if (!cavalosLista.length || !rodadasLista.length) {
      mensagemModalCampeao.value = 'Carregue os finalistas e rodadas do campeonato para selecionar o campeão.'
      mensagemModalCampeaoTipo.value = 'erro'
    }
  } catch (error) {
    console.error('Erro ao carregar dados para seleção de campeão:', error)
    mensagemModalCampeao.value = 'Erro ao carregar dados para seleção. Tente novamente.'
    mensagemModalCampeaoTipo.value = 'erro'
  } finally {
    carregandoSelecaoCampeao.value = false
  }
}

const fecharModalSelecionarCampeao = () => {
  modalSelecionarCampeaoOpen.value = false
  campeaoSelecionado.value = ''
  rodadaSelecionadaCampeao.value = ''
  mensagemModalCampeao.value = ''
  mensagemModalCampeaoTipo.value = ''
  carregandoSelecaoCampeao.value = false
  salvandoSelecaoCampeao.value = false
}

const confirmarSelecaoCampeao = async () => {
  if (!campeonatoFinalistas.value) {
    mensagemModalCampeao.value = 'Selecione um campeonato válido.'
    mensagemModalCampeaoTipo.value = 'erro'
    return
  }

  if (!campeaoSelecionado.value || !rodadaSelecionadaCampeao.value) {
    mensagemModalCampeao.value = 'Escolha o cavalo e a rodada antes de confirmar.'
    mensagemModalCampeaoTipo.value = 'erro'
    return
  }

  salvandoSelecaoCampeao.value = true
  mensagemModalCampeao.value = ''

  try {
    const cavaloIdNumerico = Number(campeaoSelecionado.value)
    const cavaloIdPayload = Number.isNaN(cavaloIdNumerico)
      ? campeaoSelecionado.value
      : cavaloIdNumerico

    await corridaApi.postVencedorRodada(campeonatoFinalistas.value, {
      nomeRodada: rodadaSelecionadaCampeao.value,
      cavaloId: cavaloIdPayload
    })

    mensagemSelecaoCampeao.value = 'Campeão da rodada atualizado com sucesso!'
    mensagemSelecaoCampeaoTipo.value = 'sucesso'

    setTimeout(() => {
      mensagemSelecaoCampeao.value = ''
    }, 3000)

    fecharModalSelecionarCampeao()
  } catch (error) {
    console.error('Erro ao salvar campeão da rodada:', error)
    mensagemModalCampeao.value = 'Erro ao salvar campeão da rodada. Tente novamente.'
    mensagemModalCampeaoTipo.value = 'erro'
  } finally {
    salvandoSelecaoCampeao.value = false
  }
}

const toggleVencedorSelecionado = (cavaloId) => {
  if (cavaloId === undefined || cavaloId === null) return

  const novoSet = new Set(vencedoresSelecionados.value)

  if (novoSet.has(cavaloId)) {
    novoSet.delete(cavaloId)
  } else {
    novoSet.add(cavaloId)
  }

  vencedoresSelecionados.value = novoSet
}

const salvarVencedor = async () => {
  if (!vencedoresSelecionados.value.size || !campeonatoFinalistas.value) return

  salvandoVencedor.value = true
  
  try {
    const cavalosIds = Array.from(vencedoresSelecionados.value)

    await corridaApi.postVencedor(
      campeonatoFinalistas.value,
      cavalosIds
    )
    fecharModalFinalistas()
  } catch (error) {
    console.error('Erro ao salvar vencedor:', error)
  } finally {
    salvandoVencedor.value = false
  }
}

const gerarRelatorioPagamentos = async () => {
  if (!relatorioPagamentosCampeonato.value) return
  
  carregandoRelatorioPagamentos.value = true
  dadosRelatorioPagamentos.value = null
  
  try {
    let dados = null

    if (filtrarSaldosNegativos.value) {
      dados = await corridaApi.getSaldosCampeonatoNegativados(relatorioPagamentosCampeonato.value)
    } else if (filtrarSaldosPositivos.value) {
      dados = await corridaApi.getSaldosCampeonatoPositivados(relatorioPagamentosCampeonato.value)
    } else {
      dados = await corridaApi.getSaldosCampeonato(relatorioPagamentosCampeonato.value)
    }

    dados = aplicarFiltroLocalSaldos(dados)
    
    // Verificar se retornou dados válidos
    if (dados && dados.apostadores) {
      dadosRelatorioPagamentos.value = dados
      modalRelatorioPagamentosOpen.value = true
    } else {
      alert('Nenhum dado encontrado para este campeonato.')
    }
  } catch (error) {
    console.error('Erro ao gerar relatório de pagamentos:', error)
    alert('Erro ao carregar relatório de pagamentos. Tente novamente.')
  } finally {
    carregandoRelatorioPagamentos.value = false
  }
}

const fecharModalRelatorioPagamentos = () => {
  modalRelatorioPagamentosOpen.value = false
}

const abrirModalTextoRelatorio = () => {
  if (!dadosRelatorioPagamentos.value) {
    return
  }
  modalTextoRelatorioOpen.value = true
}

const fecharModalTextoRelatorio = () => {
  modalTextoRelatorioOpen.value = false
}

const gerarRelatorioPagamentosMultiplo = async () => {
  if (!relatorioPagamentosCampeonatosSelecionados.value.length) {
    return
  }

  carregandoRelatorioPagamentos.value = true
  dadosRelatorioPagamentos.value = null

  try {
    const ids = relatorioPagamentosCampeonatosSelecionados.value.map((id) => {
      const numero = Number(id)
      return Number.isNaN(numero) ? id : numero
    })

    let dados = await corridaApi.postSaldosCampeonatos({
      campeonatosIds: ids
    })

    dados = aplicarFiltroLocalSaldos(dados)

    if (dados && dados.apostadores) {
      dadosRelatorioPagamentos.value = dados
      modalRelatorioPagamentosOpen.value = true
    } else {
      alert('Nenhum dado encontrado para os campeonatos selecionados.')
    }
  } catch (error) {
    console.error('Erro ao gerar relatório de múltiplos campeonatos:', error)
    alert('Erro ao carregar relatório dos campeonatos selecionados. Tente novamente.')
  } finally {
    carregandoRelatorioPagamentos.value = false
  }
}

const aplicarFiltroLocalSaldos = (dados) => {
  if (!dados || !Array.isArray(dados.apostadores)) {
    return dados
  }

  if (filtrarSaldosNegativos.value) {
    return {
      ...dados,
      apostadores: dados.apostadores.filter((apostador) => (apostador?.saldoFinal ?? 0) < 0)
    }
  }

  if (filtrarSaldosPositivos.value) {
    return {
      ...dados,
      apostadores: dados.apostadores.filter((apostador) => (apostador?.saldoFinal ?? 0) >= 0)
    }
  }

  return dados
}

const prepararApostaParaEdicao = (aposta) => {
  const copia = JSON.parse(JSON.stringify(aposta || {}))

  const camposString = [
    'numeroPareo',
    'valor',
    'valorOriginal',
    'porcentagemAposta',
    'porcentagemPremio',
    'valorPremio',
    'valorOriginalPremio',
    'porcentagemRetirada'
  ]

  camposString.forEach((campo) => {
    if (copia[campo] === undefined || copia[campo] === null) {
      copia[campo] = ''
    } else {
      copia[campo] = String(copia[campo])
    }
  })

  if (!copia.apostador || typeof copia.apostador !== 'object') {
    copia.apostador = { id: '', nome: '' }
  } else {
    const apostador = { ...copia.apostador }
    if (apostador.id === undefined || apostador.id === null) {
      apostador.id = ''
    } else {
      apostador.id = String(apostador.id)
    }
    if (apostador.nome === undefined || apostador.nome === null) {
      apostador.nome = ''
    }
    copia.apostador = apostador
  }

  copia._valorOriginalBase = copia.valorOriginal
  copia._valorPremioBase = copia.valorPremio
  copia._valorOriginalPremioBase = copia.valorOriginalPremio
  copia._porcentagemRetiradaBase = copia.porcentagemRetirada

  return copia
}

const atualizarValorPremioGlobal = () => {
  const valorOriginal = normalizarNumero(valorOriginalPremioGlobal.value)
  const retirada = normalizarNumero(porcentagemRetiradaGlobal.value)

  if (valorOriginal === '' || retirada === '') {
    valorPremioGlobal.value = ''
    return
  }

  const calculado = Number(valorOriginal) * (1 - Number(retirada) / 100)
  valorPremioGlobal.value = calculado.toFixed(2)
}

const formatarPercentual = (valor) => {
  const numero = normalizarNumero(valor)
  if (numero === '') {
    return ''
  }
  return Number(numero).toFixed(2).replace('.00', '')
}

const gerarTextoApostasRodada = (nomeRodada, apostas) => {
  if (!Array.isArray(apostas) || !apostas.length) {
    return `${nomeRodada};\n`
  }

  const linhas = [`${nomeRodada};`]

  const agrupadoPorPareo = new Map()

  apostas.forEach((aposta) => {
    const chave = aposta.numeroPareo || aposta.pareo || ''
    if (!agrupadoPorPareo.has(chave)) {
      agrupadoPorPareo.set(chave, [])
    }
    agrupadoPorPareo.get(chave).push(aposta)
  })

  const paresOrdenados = Array.from(agrupadoPorPareo.entries()).sort(
    ([pareoA], [pareoB]) =>
      (parseInt(pareoA, 10) || 0) - (parseInt(pareoB, 10) || 0)
  )

  paresOrdenados.forEach(([pareo, apostasDoPareo]) => {
    const valorBase = normalizarNumero(
      apostasDoPareo[0]?.valorOriginal ??
      apostasDoPareo[0]?._valorOriginalBase ??
      apostasDoPareo[0]?.valor
    )
    const valorFormatado = valorBase === ''
      ? '0'
      : Number(valorBase).toLocaleString('pt-BR', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
      })

    const porcentagemTotal = apostasDoPareo.reduce((sum, item) => {
      const percentual = normalizarNumero(
        item.porcentagemAposta ?? item.porcentagemPremio
      )
      return sum + (percentual === '' ? 0 : Number(percentual))
    }, 0)

    let partes = []

    if (apostasDoPareo.length === 2 && Math.abs(porcentagemTotal - 100) < 0.1) {
      partes = apostasDoPareo.map((item) => {
        const nome = item.apostador?.nome ?? item.apostador ?? item.nome ?? ''
        return nome
      })
      linhas.push(`${pareo}- ${valorFormatado} ${partes.join(' / ')} ✅`)
      return
    }

    partes = apostasDoPareo.map((item) => {
      const nome = item.apostador?.nome ?? item.apostador ?? item.nome ?? ''
      const percentual = formatarPercentual(
        item.porcentagemAposta ?? item.porcentagemPremio
      )

      if (percentual === '' || Number(percentual) === 0 || Number(percentual) === 100) {
        return nome
      }

      return `${nome} ${percentual}%`
    })

    linhas.push(
      `${pareo}- ${valorFormatado} ${partes.join(' / ')} ✅`
    )
  })

  const valorTotalRodada = (() => {
    const primeiro = apostas.find((aposta) => aposta.valorOriginalPremio !== undefined && aposta.valorOriginalPremio !== null)
    const valor = normalizarNumero(primeiro?.valorOriginalPremio ?? primeiro?.valorPremio ?? primeiro?.valorOriginal)
    if (valor === '') {
      return 0
    }
    return Number(valor)
  })()

  const retiradaPercent =
    normalizarNumero(apostas[0]?.porcentagemRetirada ?? 0) || 0

  linhas.push('')
  const totalFormatado = valorTotalRodada
    ? formatCurrency(valorTotalRodada).replace('\u00A0', ' ')
    : 'R$ 0,00'
  linhas.push(`TOTAL ${totalFormatado}`)
  linhas.push('')
  linhas.push(`Retirada ${retiradaPercent}%`)

  return linhas.join('\n')
}

watch(valorOriginalPremioGlobal, (novo) => {
  if (!editandoApostasRodada.value) return
  const valor = normalizarNumero(novo)
  if (valor === '') {
    apostasRodadaEditaveis.value.forEach((aposta) => {
      if (aposta._valorOriginalPremioBase !== undefined) {
        const base = normalizarNumero(aposta._valorOriginalPremioBase)
        if (base !== '') {
          aposta.valorOriginalPremio = Number(base).toFixed(2)
        }
      }
    })
    valorPremioGlobal.value = ''
    return
  }
  const valorFormatado = Number(valor).toFixed(2)
  apostasRodadaEditaveis.value.forEach((aposta) => {
    aposta.valorOriginalPremio = valorFormatado
    aposta._valorOriginalPremioBase = valorFormatado
  })

  atualizarValorPremioGlobal()
})

watch(porcentagemRetiradaGlobal, (novo) => {
  if (!editandoApostasRodada.value) return
  const valor = normalizarNumero(novo)
  if (valor === '') {
    apostasRodadaEditaveis.value.forEach((aposta) => {
      if (aposta._porcentagemRetiradaBase !== undefined) {
        const base = normalizarNumero(aposta._porcentagemRetiradaBase)
        if (base !== '') {
          aposta.porcentagemRetirada = Number(base).toFixed(2)
        }
      }
    })
    atualizarValorPremioGlobal()
    return
  }
  const valorFormatado = Number(valor).toFixed(2)
  apostasRodadaEditaveis.value.forEach((aposta) => {
    aposta.porcentagemRetirada = valorFormatado
    aposta._porcentagemRetiradaBase = valorFormatado
  })

  atualizarValorPremioGlobal()
})

watch(valorPremioGlobal, (novo) => {
  if (!editandoApostasRodada.value) return
  const valor = normalizarNumero(novo)
  if (valor === '') {
    apostasRodadaEditaveis.value.forEach((aposta) => {
      if (aposta._valorPremioBase !== undefined) {
        const base = normalizarNumero(aposta._valorPremioBase)
        if (base !== '') {
          aposta.valorPremio = Number(base).toFixed(2)
        }
      }
    })
    return
  }
  const valorFormatado = Number(valor).toFixed(2)
  apostasRodadaEditaveis.value.forEach((aposta) => {
    aposta.valorPremio = valorFormatado
    aposta._valorPremioBase = valorFormatado
  })
})

watch(
  apostasRodadaEditaveis,
  () => {
    if (!editandoApostasRodada.value) return

    const grupos = new Map()

    apostasRodadaEditaveis.value.forEach((aposta) => {
      const chave = aposta.numeroPareo || ''
      if (!grupos.has(chave)) {
        grupos.set(chave, [])
      }
      grupos.get(chave).push(aposta)
    })

    grupos.forEach((apostasGrupo) => {
      if (!apostasGrupo.length) {
        return
      }

      const baseValorOriginal = normalizarNumero(
        apostasGrupo[0]?._valorOriginalBase ?? apostasGrupo[0]?.valorOriginal
      )
      const valorOriginalPadrao =
        baseValorOriginal === '' ? null : Number(baseValorOriginal)

      const retiradaGlobal = normalizarNumero(porcentagemRetiradaGlobal.value)

      const primeiraAposta = apostasGrupo[0]
      const percApostaPrimeira =
        normalizarNumero(primeiraAposta.porcentagemAposta) === ''
          ? 0
          : Number(normalizarNumero(primeiraAposta.porcentagemAposta))

      const resto = Math.max(0, 100 - percApostaPrimeira)
      const partes = apostasGrupo.length - 1
      const valoresPercentuais = [percApostaPrimeira]

      if (partes === 1) {
        valoresPercentuais.push(resto)
      } else if (partes > 1) {
        let restante = resto
        for (let i = 0; i < partes; i++) {
          let valorAtual = restante / (partes - i)
          valorAtual = parseFloat(valorAtual.toFixed(2))
          if (i === partes - 1) {
            valorAtual = parseFloat((restante).toFixed(2))
          }
          valoresPercentuais.push(Math.max(0, valorAtual))
          restante = Math.max(0, restante - valorAtual)
        }
      }

      apostasGrupo.forEach((aposta, indice) => {
        const percentualAtual =
          valoresPercentuais[indice] !== undefined
            ? Number(valoresPercentuais[indice])
            : 0

        aposta.porcentagemAposta = percentualAtual.toFixed(2)
        aposta.porcentagemPremio = percentualAtual.toFixed(2)

        if (valorOriginalPadrao !== null) {
          aposta.valorOriginal = valorOriginalPadrao.toFixed(2)
        }

        const retiradaLocalNumero =
          retiradaGlobal === '' ? normalizarNumero(aposta._porcentagemRetiradaBase ?? aposta.porcentagemRetirada) : retiradaGlobal
        const retiradaPercent =
          retiradaLocalNumero === '' ? 0 : Number(retiradaLocalNumero)
        aposta.porcentagemRetirada = retiradaPercent.toFixed(2)

        const valorPremioBase = normalizarNumero(
          aposta._valorPremioBase ?? aposta.valorPremio
        )
        if (valorPremioBase !== '' && valorPremioBase !== null) {
          aposta.valorPremio = Number(valorPremioBase).toFixed(2)
        }

        if (valorOriginalPremioGlobal.value) {
          const valorPremioOriginalNumero = normalizarNumero(
            valorOriginalPremioGlobal.value
          )
          if (valorPremioOriginalNumero !== '') {
            aposta.valorOriginalPremio = Number(
              valorPremioOriginalNumero
            ).toFixed(2)
          }
        } else if (aposta._valorOriginalPremioBase !== undefined) {
          const base = normalizarNumero(aposta._valorOriginalPremioBase)
          if (base !== '') {
            aposta.valorOriginalPremio = Number(base).toFixed(2)
          }
        }
      })
    })
  },
  { deep: true }
)

const habilitarEdicaoApostasRodada = () => {
  if (!apostasRodadaSelecionada.value.length) {
    mensagemEdicaoApostasRodada.value = 'Nenhuma aposta disponível para edição.'
    mensagemEdicaoApostasRodadaTipo.value = 'erro'
    setTimeout(() => {
      mensagemEdicaoApostasRodada.value = ''
    }, 3000)
    return
  }

  apostasRodadaEditaveis.value = apostasRodadaSelecionada.value.map((aposta) => prepararApostaParaEdicao(aposta))
  valorOriginalPremioGlobal.value = apostasRodadaEditaveis.value.find((aposta) => aposta.valorOriginalPremio)?.valorOriginalPremio || ''
  valorPremioGlobal.value = apostasRodadaEditaveis.value.find((aposta) => aposta.valorPremio)?.valorPremio || ''
  porcentagemRetiradaGlobal.value = apostasRodadaEditaveis.value.find((aposta) => aposta.porcentagemRetirada)?.porcentagemRetirada || ''
  if (valorOriginalPremioGlobal.value) {
    apostasRodadaEditaveis.value.forEach((aposta) => {
      aposta.valorOriginalPremio = valorOriginalPremioGlobal.value
      aposta._valorOriginalPremioBase = valorOriginalPremioGlobal.value
    })
  }
  if (valorPremioGlobal.value) {
    apostasRodadaEditaveis.value.forEach((aposta) => {
      aposta.valorPremio = valorPremioGlobal.value
      aposta._valorPremioBase = valorPremioGlobal.value
    })
  }
  if (porcentagemRetiradaGlobal.value) {
    apostasRodadaEditaveis.value.forEach((aposta) => {
      aposta.porcentagemRetirada = porcentagemRetiradaGlobal.value
      aposta._porcentagemRetiradaBase = porcentagemRetiradaGlobal.value
    })
  }
  atualizarValorPremioGlobal()
  editandoApostasRodada.value = true
  mensagemEdicaoApostasRodada.value = ''
  mensagemEdicaoApostasRodadaTipo.value = ''
}

const cancelarEdicaoApostasRodada = () => {
  editandoApostasRodada.value = false
  salvandoApostasRodada.value = false
  mensagemEdicaoApostasRodada.value = ''
  mensagemEdicaoApostasRodadaTipo.value = ''
  apostasRodadaEditaveis.value = apostasRodadaSelecionada.value.map((aposta) => prepararApostaParaEdicao(aposta))
  valorOriginalPremioGlobal.value = apostasRodadaEditaveis.value.find((aposta) => aposta.valorOriginalPremio)?.valorOriginalPremio || ''
  valorPremioGlobal.value = apostasRodadaEditaveis.value.find((aposta) => aposta.valorPremio)?.valorPremio || ''
  porcentagemRetiradaGlobal.value = apostasRodadaEditaveis.value.find((aposta) => aposta.porcentagemRetirada)?.porcentagemRetirada || ''
}

const salvarEdicaoApostasRodada = async () => {
  if (!apostaForm.value.campeonatoId || !rodadaCasaForm.value.tipoRodadaId || !rodadaCasaForm.value.rodada) {
    mensagemEdicaoApostasRodada.value = 'Informe o campeonato e a rodada antes de salvar.'
    mensagemEdicaoApostasRodadaTipo.value = 'erro'
    setTimeout(() => {
      mensagemEdicaoApostasRodada.value = ''
    }, 3000)
    return
  }

  let valorOriginalPremioGlobalPayload = ''
  let porcentagemRetiradaGlobalPayload = ''

  apostasRodadaEditaveis.value.forEach((aposta) => {
    if (!valorOriginalPremioGlobalPayload && aposta?.valorOriginalPremio) {
      valorOriginalPremioGlobalPayload = aposta.valorOriginalPremio
    }
    if (!porcentagemRetiradaGlobalPayload && aposta?.porcentagemRetirada) {
      porcentagemRetiradaGlobalPayload = aposta.porcentagemRetirada
    }
  })

  const apostasPayload = apostasRodadaEditaveis.value.map((aposta) => {
    const apostadorIdRaw = aposta?.apostador?.id ?? ''
    let apostadorId = apostadorIdRaw
    if (apostadorIdRaw !== '' && apostadorIdRaw !== null && apostadorIdRaw !== undefined) {
      const parsedId = Number(apostadorIdRaw)
      apostadorId = Number.isNaN(parsedId) ? apostadorIdRaw : parsedId
    }

    const campos = {
      valor: aposta?.valor ?? '',
      valorOriginal: normalizarNumero(aposta?.valorOriginal ?? ''),
      porcentagemAposta: normalizarNumero(aposta?.porcentagemAposta ?? ''),
      porcentagemPremio: normalizarNumero(aposta?.porcentagemPremio ?? ''),
      valorPremio: normalizarNumero(aposta?.valorPremio ?? ''),
      valorOriginalPremio: aposta?.valorOriginalPremio ?? '',
      porcentagemRetirada: aposta?.porcentagemRetirada ?? ''
    }

    Object.keys(campos).forEach((campo) => {
      const valorCampo = campos[campo]
      if (valorCampo === '' || valorCampo === null || valorCampo === undefined) {
        campos[campo] = ''
        return
      }

      if (typeof valorCampo === 'number') {
        campos[campo] = valorCampo.toFixed(2)
      } else {
        const normalizado = normalizarNumero(valorCampo)
        campos[campo] =
          normalizado === '' ? String(valorCampo) : Number(normalizado).toFixed(2)
      }
    })

    return {
      id: aposta?.id,
      numeroPareo: aposta?.numeroPareo ?? '',
      apostador: {
        id: apostadorId === '' ? null : apostadorId,
        nome: aposta?.apostador?.nome ?? ''
      },
      ...campos,
      valorOriginalPremio: valorOriginalPremioGlobalPayload || campos.valorOriginalPremio || '',
      porcentagemRetirada: porcentagemRetiradaGlobalPayload || campos.porcentagemRetirada || ''
    }
  })

  salvandoApostasRodada.value = true
  mensagemEdicaoApostasRodada.value = ''
  mensagemEdicaoApostasRodadaTipo.value = ''

  try {
    const response = await corridaApi.updateApostasRodada(
      apostaForm.value.campeonatoId,
      rodadaCasaForm.value.tipoRodadaId,
      {
        nomeRodada: rodadaCasaForm.value.rodada,
        apostas: apostasPayload
      }
    )

    let apostasAtualizadas = []

    if (Array.isArray(response)) {
      apostasAtualizadas = response
    } else if (response && Array.isArray(response.apostas)) {
      apostasAtualizadas = response.apostas
    } else {
      apostasAtualizadas = apostasPayload
    }

    apostasAtualizadas.sort((a, b) => {
      const numeroA = Number(a?.numeroPareo) || 0
      const numeroB = Number(b?.numeroPareo) || 0
      return numeroA - numeroB
    })

    apostasRodadaSelecionada.value = apostasAtualizadas
    apostasRodadaEditaveis.value = apostasAtualizadas.map((aposta) => prepararApostaParaEdicao(aposta))
    valorOriginalPremioGlobal.value = apostasRodadaEditaveis.value.find((aposta) => aposta.valorOriginalPremio)?.valorOriginalPremio || ''
    porcentagemRetiradaGlobal.value = apostasRodadaEditaveis.value.find((aposta) => aposta.porcentagemRetirada)?.porcentagemRetirada || ''
    editandoApostasRodada.value = false

    mensagemEdicaoApostasRodada.value = 'Apostas atualizadas com sucesso!'
    mensagemEdicaoApostasRodadaTipo.value = 'sucesso'

    setTimeout(() => {
      mensagemEdicaoApostasRodada.value = ''
    }, 3000)
  } catch (error) {
    console.error('Erro ao salvar apostas da rodada:', error)
    mensagemEdicaoApostasRodada.value = 'Erro ao salvar alterações. Tente novamente.'
    mensagemEdicaoApostasRodadaTipo.value = 'erro'
  } finally {
    salvandoApostasRodada.value = false
  }
}

const relatorioTextoCopiavel = computed(() => {
  if (!dadosRelatorioPagamentos.value || !Array.isArray(dadosRelatorioPagamentos.value.apostadores)) {
    return ''
  }

  const apostadoresOrdenados = [...dadosRelatorioPagamentos.value.apostadores].sort(
    (a, b) => {
      const nomeA = (a?.nome || '').toLowerCase()
      const nomeB = (b?.nome || '').toLowerCase()
      return nomeA.localeCompare(nomeB, 'pt-BR')
    }
  )

  const total = apostadoresOrdenados.reduce(
    (sum, apostador) => sum + (apostador?.saldoFinal ?? 0),
    0
  )

  const titulo = total >= 0 ? 'PREMIADOS' : 'DEVEDORES'
  const saldoTotalFormatado = formatCurrency(Math.abs(total))

  const linhas = [`${titulo} ${saldoTotalFormatado.replace('\u00A0', ' ')}`]

  apostadoresOrdenados.forEach((apostador) => {
    const nome = apostador?.nome ?? ''
    const saldo = formatCurrency(apostador?.saldoFinal ?? 0).replace('\u00A0', ' ')
    linhas.push(`${nome} ${saldo}`)
  })

  return linhas.join('\n')
})

const copiarRelatorioTexto = async () => {
  const texto = relatorioTextoCopiavel.value

  if (!texto) {
    return
  }

  try {
    await navigator.clipboard.writeText(texto)
    mensagemTextoCopiado.value = 'Texto copiado para a área de transferência!'
  } catch (error) {
    console.error('Erro ao copiar texto:', error)
    mensagemTextoCopiado.value = 'Não foi possível copiar automaticamente. Selecione o texto manualmente.'
  } finally {
    setTimeout(() => {
      mensagemTextoCopiado.value = ''
    }, 3000)
  }
}

// Função para gerar PDF do relatório de pagamentos
const gerarPDFRelatorioPagamentos = () => {
  if (!dadosRelatorioPagamentos.value || !dadosRelatorioPagamentos.value.apostadores || dadosRelatorioPagamentos.value.apostadores.length === 0) {
    return
  }

  const dados = dadosRelatorioPagamentos.value
  const campeonatoNome = descricaoRelatorioPagamentos.value || 'N/A'
  
  // Calcular totais
  const totalApostado = dados.apostadores.reduce((sum, a) => sum + (a.totalApostado || 0), 0)
  const totalPremios = dados.apostadores.reduce((sum, a) => sum + (a.totalPremiosVencidos || 0), 0)
  const totalSaldo = dados.apostadores.reduce((sum, a) => sum + (a.saldoFinal || 0), 0)

  // Criar conteúdo HTML para o PDF
  const content = `
    <html>
      <head>
        <title>Relatório de Pagamentos - ${campeonatoNome}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #dc2626; padding-bottom: 15px; }
          .title { font-size: 24px; font-weight: bold; color: #dc2626; }
          .subtitle { font-size: 16px; color: #666; margin-top: 5px; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
          th, td { border: 1px solid #ddd; padding: 10px; text-align: left; }
          th { background-color: #fef2f2; font-weight: bold; color: #991b1b; }
          tfoot th, tfoot td { background-color: #f3f4f6; font-weight: bold; }
          .text-right { text-align: right; }
          .text-green { color: #059669; }
          .text-red { color: #dc2626; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="title">Relatório de Pagamentos</div>
          <div class="subtitle">${campeonatoNome}</div>
        </div>
        
        <table>
          <thead>
            <tr>
              <th>Apostador</th>
              <th class="text-right">Total Apostado</th>
              <th class="text-right">Total Prêmios Vencidos</th>
              <th class="text-right">Saldo Final</th>
            </tr>
          </thead>
          <tbody>
            ${dados.apostadores.map(apostador => `
              <tr>
                <td>${apostador.nome || 'N/A'}</td>
                <td class="text-right">${formatCurrency(apostador.totalApostado || 0)}</td>
                <td class="text-right text-green">${formatCurrency(apostador.totalPremiosVencidos || 0)}</td>
                <td class="text-right ${apostador.saldoFinal >= 0 ? 'text-green' : 'text-red'}" style="font-weight: bold;">
                  ${formatCurrency(apostador.saldoFinal || 0)}
                </td>
              </tr>
            `).join('')}
          </tbody>
          <tfoot>
            <tr>
              <th>TOTAIS</th>
              <th class="text-right">${formatCurrency(totalApostado)}</th>
              <th class="text-right text-green">${formatCurrency(totalPremios)}</th>
              <th class="text-right ${totalSaldo >= 0 ? 'text-green' : 'text-red'}"></th>
            </tr>
          </tfoot>
        </table>
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

const gerarPDFVencedores = () => {
  if (!dadosVencedores.value || !dadosVencedores.value.vencedores || dadosVencedores.value.vencedores.length === 0) {
    return
  }

  const dados = dadosVencedores.value
  const campeonatoNome = nomeCampeonatoVencedores.value || dados.nomeCampeonato || 'N/A'
  const totalPremiosCampeonato = dados.vencedores.reduce((sum, cavalo) => {
    if (!Array.isArray(cavalo.vencedores)) {
      return sum
    }
    const premiosCavalo = cavalo.vencedores.reduce((acc, apostador) => {
      return acc + (Number(apostador.valorpremio) || 0)
    }, 0)
    return sum + premiosCavalo
  }, 0)

  // Criar conteúdo HTML para o PDF
  const content = `
    <html>
      <head>
        <title>Vencedores - ${campeonatoNome}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #7c3aed; padding-bottom: 15px; }
          .title { font-size: 24px; font-weight: bold; color: #7c3aed; }
          .subtitle { font-size: 16px; color: #666; margin-top: 5px; }
          .resumo { display: flex; gap: 16px; flex-wrap: wrap; margin-bottom: 24px; }
          .card { flex: 1 1 220px; border: 1px solid #e0e7ff; background: #f5f3ff; padding: 14px; border-radius: 8px; }
          .card-title { font-size: 12px; text-transform: uppercase; letter-spacing: 0.08em; color: #5b21b6; margin-bottom: 6px; }
          .card-value { font-size: 20px; font-weight: bold; color: #4338ca; }
          .cavalo-section { border: 1px solid #e5e7eb; border-radius: 12px; margin-bottom: 24px; overflow: hidden; box-shadow: 0 10px 25px rgba(79, 70, 229, 0.08); }
          .cavalo-header { background: linear-gradient(90deg, #ede9fe, #e0f2fe); padding: 20px; display: flex; justify-content: space-between; align-items: center; }
          .cavalo-header h3 { margin: 0; font-size: 18px; color: #312e81; }
          .cavalo-header p { margin: 4px 0 0; font-size: 13px; color: #4c1d95; }
          .cavalo-total { font-weight: bold; color: #047857; font-size: 18px; }
          table { width: 100%; border-collapse: collapse; }
          th, td { border: 1px solid #e5e7eb; padding: 12px 14px; text-align: left; }
          th { background-color: #ede9fe; font-weight: bold; color: #4c1d95; }
          tbody tr:nth-child(even) { background-color: #f9fafb; }
          tfoot th, tfoot td { background-color: #f3f4f6; font-weight: bold; }
          .text-right { text-align: right; }
          .text-green { color: #059669; font-weight: bold; }
          .empty-row { text-align: center; color: #6b7280; font-style: italic; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="title">Vencedores do Campeonato</div>
          <div class="subtitle">${campeonatoNome}</div>
        </div>

        <div class="resumo">
          <div class="card">
            <div class="card-title">Cavalos vencedores</div>
            <div class="card-value">${dados.vencedores.length}</div>
          </div>
          <div class="card">
            <div class="card-title">Total de prêmios pagos</div>
            <div class="card-value">${formatCurrency(totalPremiosCampeonato)}</div>
          </div>
        </div>

        ${dados.vencedores.map((cavalo, index) => {
          const premiosCavalo = calcularTotalPremiosCavalo(cavalo)
          const linhas = Array.isArray(cavalo.vencedores) && cavalo.vencedores.length > 0
            ? cavalo.vencedores.map((apostador, apostadorIndex) => `
                <tr>
                  <td>${apostadorIndex + 1}</td>
                  <td>${apostador.nomeapostador || 'N/A'}</td>
                  <td class="text-right text-green">${formatCurrency(apostador.valorpremio)}</td>
                </tr>
              `).join('')
            : '<tr><td class="empty-row" colspan="3">Nenhum apostador vencedor registrado para este cavalo.</td></tr>'

          return `
            <div class="cavalo-section">
              <div class="cavalo-header">
                <div>
                  <h3>🐎 Cavalo ${index + 1}: ${cavalo.nomecavalovencedor || 'N/A'}</h3>
                  <p>ID: ${cavalo.cavaloId || 'N/A'}</p>
                </div>
                <div class="cavalo-total">${formatCurrency(premiosCavalo)}</div>
              </div>
              <table>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Apostador</th>
                    <th class="text-right">Prêmio</th>
                  </tr>
                </thead>
                <tbody>
                  ${linhas}
                </tbody>
                <tfoot>
                  <tr>
                    <th colspan="2">TOTAL DO CAVALO</th>
                    <th class="text-right text-green">${formatCurrency(premiosCavalo)}</th>
                  </tr>
                </tfoot>
              </table>
            </div>
          `
        }).join('')}
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

const gerarPDFGanhadoresPossiveis = () => {
  if (!cavalosPossiveisGanhadores.value || cavalosPossiveisGanhadores.value.length === 0) {
    return
  }

  const campeonatoNome = campeonatoPossiveisGanhadores.value ? 
    (campeonatos.value || []).find(c => c.id === campeonatoPossiveisGanhadores.value)?.nome || 'N/A' 
    : 'N/A'

  // Criar conteúdo HTML para o PDF
  const content = `
    <html>
      <head>
        <title>Possíveis Ganhadores - ${campeonatoNome}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #eab308; padding-bottom: 15px; }
          .title { font-size: 24px; font-weight: bold; color: #ca8a04; }
          .subtitle { font-size: 16px; color: #666; margin-top: 5px; }
          .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 15px; margin-top: 20px; }
          .cavalo-card { border: 2px solid #fde047; border-radius: 8px; padding: 15px; background-color: #fefce8; }
          .cavalo-card.selected { border-color: #10b981; background-color: #d1fae5; }
          .cavalo-nome { font-weight: bold; font-size: 16px; color: #713f12; margin-bottom: 5px; }
          .cavalo-id { font-size: 12px; color: #78716c; }
          .selected-badge { color: #059669; font-size: 12px; margin-top: 5px; font-weight: bold; }
          .total { text-align: center; margin-top: 20px; padding-top: 20px; border-top: 2px solid #eab308; }
          .total-text { font-size: 18px; font-weight: bold; color: #ca8a04; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="title">Possíveis Ganhadores</div>
          <div class="subtitle">${campeonatoNome}</div>
        </div>
        
        <div class="grid">
          ${cavalosPossiveisGanhadores.value.map(cavalo => {
            const isSelected = cavalosSelecionadosFinalistas.value.has(cavalo.id || cavalo.idcavalo)
            return `
              <div class="cavalo-card ${isSelected ? 'selected' : ''}">
                <div class="cavalo-nome">${cavalo.nome || cavalo.nomecavalo || `Cavalo ${cavalo.id || cavalo.idcavalo}`}</div>
                <div class="cavalo-id">ID: ${cavalo.id || cavalo.idcavalo}</div>
                ${isSelected ? '<div class="selected-badge">✓ Selecionado</div>' : ''}
              </div>
            `
          }).join('')}
        </div>
        
        <div class="total">
          <div class="total-text">Total de Cavalos: ${cavalosPossiveisGanhadores.value.length}</div>
          <div class="total-text">Selecionados: ${cavalosSelecionadosFinalistas.value.size}</div>
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

const gerarPDFGanhadoresVisualizacao = () => {
  if (!dadosGanhadoresVisualizacao.value || dadosGanhadoresVisualizacao.value.length === 0) {
    return
  }

  const campeonatoNome = campeonatoVisualizacaoNome.value || 'N/A'
  
  // Construir HTML do PDF
  let htmlContent = ''
  
  dadosGanhadoresVisualizacao.value.forEach((tipoRodada, tipoIndex) => {
    const cavalos = obterCavalosDoTipo(tipoRodada)
    
    if (cavalos.length === 0) return
    
    // Título do tipo de rodada (se agrupado)
    if (ganhadoresAgrupados.value && tipoRodada.nometiporodada) {
      htmlContent += `
        <div style="margin-top: ${tipoIndex > 0 ? '40px' : '0'}; margin-bottom: 20px; page-break-after: avoid;">
          <h3 style="background-color: #fef3c7; color: #713f12; padding: 12px; border-radius: 8px; font-size: 18px; font-weight: bold;">
            ${tipoRodada.nometiporodada || `Tipo ${tipoRodada.tiporodada || ''}`}
          </h3>
        </div>
      `
    }
    
    // Grid de cavalos
    htmlContent += '<div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 15px; margin-bottom: 30px;">'
    
    cavalos.forEach(cavalo => {
      const totalPremio = cavalo.apostadores.reduce((sum, a) => sum + (a.valorpremio || 0), 0)
      
      htmlContent += `
        <div style="border: 2px solid #fde047; border-radius: 8px; overflow: hidden; background-color: #fefce8; page-break-inside: avoid;">
          <div style="background: linear-gradient(to right, #facc15, #fbbf24); color: #1f2937; padding: 12px; font-weight: bold; font-size: 16px;">
            ${cavalo.nome}
          </div>
          <div style="background-color: #000; color: #fff; padding: 8px; font-size: 12px; font-weight: bold;">
            PRÊMIO
          </div>
          <div style="padding: 0;">
            ${cavalo.apostadores.length > 0 ? cavalo.apostadores.map(apostador => `
              <div style="padding: 10px 12px; border-bottom: 1px solid #e5e7eb; display: flex; justify-content: space-between; align-items: center;">
                <span style="font-size: 13px; font-weight: 500; color: #1f2937;">${apostador.nomeapostador || 'N/A'}</span>
                <span style="font-size: 13px; font-weight: 600; color: #1f2937;">${formatCurrency(apostador.valorpremio || 0)}</span>
              </div>
            `).join('') : '<div style="padding: 12px; color: #6b7280; text-align: center;">Nenhum apostador</div>'}
          </div>
          ${cavalo.apostadores.length > 0 ? `
            <div style="background-color: #f3f4f6; padding: 10px 12px; border-top: 1px solid #d1d5db; display: flex; justify-content: space-between; align-items: center;">
              <span style="font-size: 12px; font-weight: bold; color: #374151;">Total:</span>
              <span style="font-size: 12px; font-weight: bold; color: #1f2937;">${formatCurrency(totalPremio)}</span>
            </div>
          ` : ''}
        </div>
      `
    })
    
    htmlContent += '</div>'
  })

  // Criar conteúdo HTML completo para o PDF
  const content = `
    <html>
      <head>
        <title>Possíveis Ganhadores - ${campeonatoNome}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #eab308; padding-bottom: 15px; }
          .title { font-size: 24px; font-weight: bold; color: #ca8a04; }
          .subtitle { font-size: 16px; color: #666; margin-top: 5px; }
          @media print {
            .page-break { page-break-after: always; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="title">Possíveis Ganhadores</div>
          <div class="subtitle">${campeonatoNome}</div>
        </div>
        ${htmlContent}
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

const iniciarEdicaoTipoRodada = (tipoRodada) => {
  tipoRodadaEditandoId.value = tipoRodada.id
  tipoRodadaNomeEdicao.value = tipoRodada.nome || ''
  mensagemTipoRodada.value = ''
}

const cancelarEdicaoTipoRodada = () => {
  tipoRodadaEditandoId.value = null
  tipoRodadaNomeEdicao.value = ''
  atualizandoTipoRodadaId.value = null
}

const salvarEdicaoTipoRodada = async () => {
  const id = tipoRodadaEditandoId.value
  if (!id) {
    return
  }

  const tipoAtual = tiposRodadas.value.find((tipo) => tipo.id === id)
  const nomeAtual = (tipoAtual?.nome || '').trim()
  const nomeLimpo = (tipoRodadaNomeEdicao.value || '').trim()

  if (!nomeLimpo) {
    mensagemTipoRodada.value = 'O nome não pode ser vazio.'
    mensagemTipoRodadaTipo.value = 'erro'
    setTimeout(() => {
      mensagemTipoRodada.value = ''
    }, 3000)
    return
  }

  if (nomeLimpo === nomeAtual) {
    mensagemTipoRodada.value = 'Nenhuma alteração realizada.'
    mensagemTipoRodadaTipo.value = 'erro'
    setTimeout(() => {
      mensagemTipoRodada.value = ''
    }, 3000)
    return
  }

  atualizandoTipoRodadaId.value = id
  mensagemTipoRodada.value = ''

  try {
    await corridaApi.updateTipoRodada(id, { nome: nomeLimpo })

    mensagemTipoRodada.value = 'Tipo de rodada atualizado com sucesso!'
    mensagemTipoRodadaTipo.value = 'sucesso'

    await loadTiposRodadas()
    cancelarEdicaoTipoRodada()

    setTimeout(() => {
      mensagemTipoRodada.value = ''
    }, 3000)
  } catch (err) {
    mensagemTipoRodada.value = 'Erro ao atualizar tipo de rodada.'
    mensagemTipoRodadaTipo.value = 'erro'
    console.error('Erro ao atualizar tipo de rodada:', err)
  } finally {
    atualizandoTipoRodadaId.value = null
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

  if (pareoFormCriar.value.texto.trim().toUpperCase().startsWith('R')) {
    mensagemPareo.value = 'Adicione o texto válido, aqui tem que ser o pareo/cavalos'
    mensagemPareoTipo.value = 'erro'
    return;
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

// Função para carregar tipos de rodadas do campeonato
const carregarTiposRodadasCampeonato = async () => {
  if (!pareoFormBuscar.value.campeonatoId) {
    tiposRodadasCampeonato.value = []
    pareoFormBuscar.value.tipoRodadaId = ''
    return
  }

  carregandoTiposCampeonato.value = true
  
  try {
    const response = await corridaApi.getTiposRodadasCampeonato(pareoFormBuscar.value.campeonatoId)
    tiposRodadasCampeonato.value = Array.isArray(response.tipos) ? response.tipos : []
    pareoFormBuscar.value.tipoRodadaId = '' // Limpar seleção anterior
    console.log('Tipos de rodadas do campeonato carregados:', response)
  } catch (err) {
    console.error('Erro ao carregar tipos de rodadas do campeonato:', err)
    tiposRodadasCampeonato.value = []
  } finally {
    carregandoTiposCampeonato.value = false
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
  editandoPareo.value = false
  cavalosEditando.value = []
  mensagemEdicaoPareo.value = ''
  mensagemEdicaoPareoTipo.value = ''
}

const iniciarEdicaoPareo = () => {
  if (!pareoSelecionado.value?.cavalos) return
  
  const pareoId = pareoSelecionado.value.id || pareoSelecionado.value.pareoId
  
  cavalosEditando.value = pareoSelecionado.value.cavalos.map(cavalo => ({
    pareoId: cavalo.pareoId || pareoId,
    id: cavalo.id,
    nome: cavalo.nome || ''
  }))
  
  editandoPareo.value = true
  mensagemEdicaoPareo.value = ''
  mensagemEdicaoPareoTipo.value = ''
}

const cancelarEdicaoPareo = () => {
  editandoPareo.value = false
  cavalosEditando.value = []
  mensagemEdicaoPareo.value = ''
  mensagemEdicaoPareoTipo.value = ''
}

const iniciarEdicaoPareoInline = (pareo) => {
  if (!pareo?.cavalos) return
  
  const pareoId = pareo.id || pareo.pareoId
  
  cavalosEditandoPorPareo.value[pareoId] = pareo.cavalos.map(cavalo => ({
    pareoId: cavalo.pareoId || pareoId,
    id: cavalo.id,
    nome: cavalo.nome || ''
  }))
  
  pareoEditandoId.value = pareoId
  mensagemEdicaoPareo.value = ''
  mensagemEdicaoPareoTipo.value = ''
}

const cancelarEdicaoPareoInline = () => {
  pareoEditandoId.value = null
  cavalosEditandoPorPareo.value = {}
  mensagemEdicaoPareo.value = ''
  mensagemEdicaoPareoTipo.value = ''
}

const salvarEdicaoPareoInline = async (pareo) => {
  if (!pareo || !pareoEditandoId.value) return
  
  const pareoId = pareoEditandoId.value
  const cavalosEditando = cavalosEditandoPorPareo.value[pareoId]
  
  if (!cavalosEditando || cavalosEditando.length === 0) return
  
  salvandoEdicaoPareo.value = true
  mensagemEdicaoPareo.value = ''
  mensagemEdicaoPareoTipo.value = ''
  
  try {
    const cavalosParaEnviar = cavalosEditando.map(cavalo => ({
      pareoId: cavalo.pareoId,
      id: cavalo.id,
      nome: cavalo.nome.trim()
    })).filter(cavalo => cavalo.nome)
    
    if (cavalosParaEnviar.length === 0) {
      mensagemEdicaoPareo.value = 'Pelo menos um cavalo deve ter um nome válido.'
      mensagemEdicaoPareoTipo.value = 'erro'
      salvandoEdicaoPareo.value = false
      return
    }
    
    await corridaApi.atualizarPareo(
      pareo.campeonatoId,
      pareo.tipoRodadaId,
      cavalosParaEnviar
    )
    
    mensagemEdicaoPareo.value = 'Pareo atualizado com sucesso!'
    mensagemEdicaoPareoTipo.value = 'sucesso'
    
    // Atualizar os dados do pareo na lista
    pareo.cavalos = cavalosParaEnviar.map(cavalo => ({
      ...cavalo,
      identificador: pareo.cavalos.find(c => c.id === cavalo.id)?.identificador
    }))
    
    pareoEditandoId.value = null
    delete cavalosEditandoPorPareo.value[pareoId]
    
    // Recarregar pareos para atualizar a lista
    if (pareoFormBuscar.value.campeonatoId && pareoFormBuscar.value.tipoRodadaId) {
      await carregarPareos()
    }
    
    setTimeout(() => {
      mensagemEdicaoPareo.value = ''
    }, 3000)
  } catch (error) {
    console.error('Erro ao atualizar pareo:', error)
    mensagemEdicaoPareo.value = 'Erro ao atualizar pareo. Tente novamente.'
    mensagemEdicaoPareoTipo.value = 'erro'
  } finally {
    salvandoEdicaoPareo.value = false
  }
}

const salvarEdicaoPareo = async () => {
  if (!pareoSelecionado.value || !cavalosEditando.value.length) return
  
  salvandoEdicaoPareo.value = true
  mensagemEdicaoPareo.value = ''
  mensagemEdicaoPareoTipo.value = ''
  
  try {
    const cavalosParaEnviar = cavalosEditando.value.map(cavalo => ({
      pareoId: cavalo.pareoId,
      id: cavalo.id,
      nome: cavalo.nome.trim()
    })).filter(cavalo => cavalo.nome)
    
    if (cavalosParaEnviar.length === 0) {
      mensagemEdicaoPareo.value = 'Pelo menos um cavalo deve ter um nome válido.'
      mensagemEdicaoPareoTipo.value = 'erro'
      return
    }
    
    await corridaApi.atualizarPareo(
      pareoSelecionado.value.campeonatoId,
      pareoSelecionado.value.tipoRodadaId,
      cavalosParaEnviar
    )
    
    mensagemEdicaoPareo.value = 'Pareo atualizado com sucesso!'
    mensagemEdicaoPareoTipo.value = 'sucesso'
    
    // Atualizar os dados do pareo selecionado
    pareoSelecionado.value.cavalos = cavalosParaEnviar.map(cavalo => ({
      ...cavalo,
      identificador: pareoSelecionado.value.cavalos.find(c => c.id === cavalo.id)?.identificador
    }))
    
    editandoPareo.value = false
    cavalosEditando.value = []
    
    // Recarregar pareos se necessário
    if (pareoFormBuscar.value.campeonatoId && pareoFormBuscar.value.tipoRodadaId) {
      await carregarPareos()
    }
    
    setTimeout(() => {
      mensagemEdicaoPareo.value = ''
    }, 3000)
  } catch (error) {
    console.error('Erro ao atualizar pareo:', error)
    mensagemEdicaoPareo.value = 'Erro ao atualizar pareo. Tente novamente.'
    mensagemEdicaoPareoTipo.value = 'erro'
  } finally {
    salvandoEdicaoPareo.value = false
  }
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

// Função para remover cavalo individual do pareo
const removerCavaloPareo = async (pareo, cavalo) => {
  if (!confirm(`Tem certeza que deseja remover o cavalo "${cavalo.nome}" do pareo #${pareo.numero}?`)) {
    return
  }

  try {
    const response = await corridaApi.removerCavaloPareo(
      pareoFormBuscar.value.campeonatoId,
      pareoFormBuscar.value.tipoRodadaId,
      pareo.numero,
      cavalo.nome
    )
    
    alert('Cavalo removido com sucesso!')
    
    // Recarregar lista de pareos
    await carregarPareos()
    
    console.log('Cavalo removido:', response)
  } catch (err) {
    alert('Erro ao remover cavalo. Verifique se a API está online.')
    console.error('Erro ao remover cavalo:', err)
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
  
  if (!apostaForm.value.texto.trim().toUpperCase().startsWith('R')) {
    mensagemApostas.value = 'Adicione o texto válido, adicione a rodada aqui'
    mensagemApostasTipo.value = 'erro'
    return;
  }

  // Processar o texto: substituir 'retirada' por 'Retirada' (primeira letra maiúscula)
  let textoProcessado = apostaForm.value.texto
  // Substituir 'retirada' por 'Retirada' (case-insensitive, mas mantendo o resto do texto)
  textoProcessado = textoProcessado.replace(/\bretirada\b/gi, (match) => {
    return 'Retirada'
  })
  // Substituir U+00A0 (non-breaking space) por U+0020 (espaço normal) entre 'retirada'/'Retirada' e número
  textoProcessado = textoProcessado.replace(/\bretirada\u00A0(\d)/gi, (match, numero) => {
    return `Retirada ${numero}`
  })
  // Adicionar espaço antes de '✅' se não houver espaço antes
  textoProcessado = textoProcessado.replace(/([^\s])✅/g, '$1 ✅')

  try {
    const response = await corridaApi.criarApostas(
      apostaForm.value.campeonatoId,
      apostaForm.value.tipoRodadaId,
      textoProcessado
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

// Função para carregar rodadas cadastradas
const carregarRodadasCadastradas = async () => {
  if (!apostaForm.value.campeonatoId) {
    rodadasCadastradas.value = {}
    rodadaCasaForm.value = { tipoRodadaId: '', rodada: '', valorCasa: '' }
    mensagemRodadaAposta.value = ''
    return
  }

  carregandoRodadas.value = true
  rodadasCadastradas.value = {}
  
  try {
    const response = await corridaApi.getRodadasCampeonato(apostaForm.value.campeonatoId)
    rodadasCadastradas.value = response || {}
    console.log('Rodadas carregadas:', response)
    mensagemRodadaAposta.value = ''
  } catch (err) {
    console.error('Erro ao carregar rodadas:', err)
    rodadasCadastradas.value = {}
  } finally {
    carregandoRodadas.value = false
  }
}

// Função para enviar rodada-casa
const enviarRodadaCasa = async () => {
  if (!apostaForm.value.campeonatoId || !rodadaCasaForm.value.rodada || !rodadaCasaForm.value.valorCasa) {
    mensagemRodadaCasa.value = 'Por favor, preencha todos os campos'
    mensagemRodadaCasaTipo.value = 'erro'
    return
  }

  const valorCasa = parseFloat(rodadaCasaForm.value.valorCasa)
  if (isNaN(valorCasa) || valorCasa < 0) {
    mensagemRodadaCasa.value = 'Por favor, insira um valor válido'
    mensagemRodadaCasaTipo.value = 'erro'
    return
  }

  enviandoRodadaCasa.value = true
  mensagemRodadaCasa.value = ''
  
  try {
    const response = await corridaApi.postRodadaCasa(
      apostaForm.value.campeonatoId,
      rodadaCasaForm.value.rodada,
      valorCasa
    )
    
    mensagemRodadaCasa.value = 'Rodada-casa enviada com sucesso!'
    mensagemRodadaCasaTipo.value = 'sucesso'
    
    // Limpar formulário
    rodadaCasaForm.value = { tipoRodadaId: '', rodada: '', valorCasa: '' }
    
    // Limpar mensagem após 3 segundos
    setTimeout(() => {
      mensagemRodadaCasa.value = ''
    }, 3000)
    
    console.log('Rodada-casa enviada:', response)
  } catch (err) {
    mensagemRodadaCasa.value = 'Erro ao enviar rodada-casa. Verifique se a API está online.'
    mensagemRodadaCasaTipo.value = 'erro'
    console.error('Erro ao enviar rodada-casa:', err)
  } finally {
    enviandoRodadaCasa.value = false
  }
}

// Função para carregar apostadores
const carregarApostadores = async () => {
  if (!campeonatosSelecionados.value.length) {
    apostadores.value = []
    totalApostadores.value = 0
    apostadorSelecionado.value = null
    dadosPdf.value = null
    apostadoresSelecionados.value = []
    cacheApostasCombinadas.value = {}
    return
  }

  carregandoApostadores.value = true
  apostadoresSelecionados.value = []
  mensagemApostadoresCombinados.value = ''
  mensagemApostadoresCombinadosTipo.value = ''
  
  try {
    cacheApostasCombinadas.value = {}

    const idsSelecionados = Array.from(new Set(
      campeonatosSelecionados.value.map(id => parseInt(id))
    )).filter(id => !Number.isNaN(id))

    const [resultados, resultadosCombinados] = await Promise.all([
      Promise.allSettled(idsSelecionados.map(id => corridaApi.getApostadores(id))),
      Promise.allSettled(idsSelecionados.map(id => corridaApi.getApostadoresCombinados(id)))
    ])

    const combinadosPorCampeonato = {}
    resultadosCombinados.forEach((resultado, indice) => {
      const campeonatoId = idsSelecionados[indice]
      if (resultado.status === 'fulfilled' && Array.isArray(resultado.value)) {
        combinadosPorCampeonato[campeonatoId] = resultado.value
      } else if (resultado.status === 'rejected') {
        console.error(`Erro ao carregar apostadores combinados do campeonato ${campeonatoId}:`, resultado.reason)
      }
    })

    const listaApostadores = []

    resultados.forEach((resultado, indice) => {
      const campeonatoId = idsSelecionados[indice]
      const campeonato = campeonatos.value.find(c => c.id === parseInt(campeonatoId))

      if (resultado.status === 'fulfilled') {
        const resposta = resultado.value || {}
        const apostadoresCampeonato = (resposta.apostadores || []).map(apostador => ({
          ...apostador,
          campeonatoId: parseInt(campeonatoId),
          campeonatoNome: campeonato?.nome || `Campeonato ${campeonatoId}`
        }))
        listaApostadores.push(...apostadoresCampeonato)
      } else {
        console.error(`Erro ao carregar apostadores do campeonato ${campeonatoId}:`, resultado.reason)
      }
    })

    // Processar apostadores combinados
    idsSelecionados.forEach(campeonatoId => {
      const combos = combinadosPorCampeonato[campeonatoId] || []
      const campeonato = campeonatos.value.find(c => c.id === parseInt(campeonatoId))
      const nomeCampeonato = campeonato?.nome || `Campeonato ${campeonatoId}`

      combos.forEach(combo => {
        const nomes = Array.isArray(combo?.apostadores) ? combo.apostadores : []
        const chaveNomes = gerarChaveNomes(nomes)
        if (!chaveNomes) {
          return
        }

        const nomesNormalizados = new Set(
          nomes.map(nome => normalizarTexto(nome)).filter(Boolean)
        )

        const membros = []

        for (let i = listaApostadores.length - 1; i >= 0; i--) {
          const apostador = listaApostadores[i]
          if (apostador.combinado) continue
          const campeonatoItemId = apostador.campeonatoId ?? apostador.campeonatoID ?? apostador.campeonato_id
          if (campeonatoItemId !== parseInt(campeonatoId)) continue
          const nomeNormalizado = normalizarTexto(apostador.nome)
          if (nomeNormalizado && nomesNormalizados.has(nomeNormalizado)) {
            membros.push(apostador)
            listaApostadores.splice(i, 1)
          }
        }

        const totalApostado = membros.reduce((acc, item) => acc + (Number(item.totalApostado) || 0), 0)
        const totalPremio = membros.reduce((acc, item) => acc + (Number(item.totalPremio) || 0), 0)
        const totalApostas = membros.reduce((acc, item) => acc + (Number(item.totalApostas) || 0), 0)

        const nomeCombinado = nomes.length > 0 ? nomes.join(' + ') : (combo.grupoIdentificador || 'Apostadores Combinados')

        listaApostadores.push({
          id: `comb-${campeonatoId}-${combo.grupoIdentificador || chaveNomes}`,
          chaveUnica: `comb-${campeonatoId}-${combo.grupoIdentificador || chaveNomes}`,
          campeonatoId: parseInt(campeonatoId),
          campeonatoNome: nomeCampeonato,
          nome: nomeCombinado,
          combinado: true,
          grupoIdentificador: combo.grupoIdentificador || null,
          nomesCombinados: nomes,
          nomesChave: chaveNomes,
          componentes: membros.map(membro => ({
            id: membro.id,
            nome: membro.nome,
            campeonatoId: membro.campeonatoId
          })),
          totalApostado,
          totalPremio,
          totalApostas
        })
      })
    })

    listaApostadores.sort((a, b) => {
      const nomeA = a.nome || ''
      const nomeB = b.nome || ''
      return nomeA.localeCompare(nomeB, 'pt-BR', { sensitivity: 'base' })
    })

    apostadores.value = listaApostadores
    totalApostadores.value = listaApostadores.length
    apostadorSelecionado.value = null
    dadosPdf.value = null
    filtroApostador.value = ''
    console.log('Apostadores carregados:', listaApostadores)
  } catch (err) {
    console.error('Erro ao carregar apostadores:', err)
    apostadores.value = []
    totalApostadores.value = 0
    filtroApostador.value = ''
  } finally {
    carregandoApostadores.value = false
  }
}

const enviarApostadoresCombinados = async () => {
  if (apostadoresSelecionadosDetalhes.value.length < 2) {
    mensagemApostadoresCombinados.value = 'Selecione ao menos dois apostadores para combinar.'
    mensagemApostadoresCombinadosTipo.value = 'erro'
    return
  }

  enviandoApostadoresCombinados.value = true
  mensagemApostadoresCombinados.value = ''
  mensagemApostadoresCombinadosTipo.value = ''

  try {
    const gruposPorCampeonato = apostadoresSelecionadosDetalhes.value.reduce((acc, apostador) => {
      if (!apostador.campeonatoId) {
        console.warn(`Apostador ${apostador.nome} sem campeonato associado. Ignorando.`)
        return acc
      }

      const chave = apostador.campeonatoId
      if (!acc[chave]) {
        acc[chave] = []
      }

      if (apostador.nome) {
        acc[chave].push(apostador.nome)
      }

      return acc
    }, {})

    const entradas = Object.entries(gruposPorCampeonato).filter(([, nomes]) => nomes.length > 0)

    if (entradas.length === 0) {
      mensagemApostadoresCombinados.value = 'Nenhum apostador válido selecionado para envio.'
      mensagemApostadoresCombinadosTipo.value = 'erro'
      return
    }

    const resultados = await Promise.allSettled(
      entradas.map(([campeonatoId, nomes]) =>
        corridaApi.postApostadoresCombinados(campeonatoId, nomes)
      )
    )

    const houveErro = resultados.some(resultado => resultado.status === 'rejected')

    if (houveErro) {
      mensagemApostadoresCombinados.value = 'Algumas combinações não puderam ser enviadas. Verifique o console para detalhes.'
      mensagemApostadoresCombinadosTipo.value = 'erro'
    } else {
      mensagemApostadoresCombinados.value = 'Apostadores combinados enviados com sucesso!'
      mensagemApostadoresCombinadosTipo.value = 'sucesso'
      apostadoresSelecionados.value = []
    }
  } catch (error) {
    console.error('Erro ao enviar apostadores combinados:', error)
    mensagemApostadoresCombinados.value = 'Erro ao enviar apostadores combinados. Tente novamente.'
    mensagemApostadoresCombinadosTipo.value = 'erro'
  } finally {
    enviandoApostadoresCombinados.value = false
  }
}

const deletarApostadoresCombinados = async () => {
  if (!grupoIdentificadorParaDeletar.value || !grupoIdentificadorParaDeletar.value.trim()) {
    mensagemApostadoresCombinados.value = 'Por favor, informe o grupo identificador'
    mensagemApostadoresCombinadosTipo.value = 'erro'
    setTimeout(() => {
      mensagemApostadoresCombinados.value = ''
    }, 3000)
    return
  }

  if (campeonatosSelecionados.value.length === 0) {
    mensagemApostadoresCombinados.value = 'Por favor, selecione pelo menos um campeonato'
    mensagemApostadoresCombinadosTipo.value = 'erro'
    setTimeout(() => {
      mensagemApostadoresCombinados.value = ''
    }, 3000)
    return
  }

  deletandoApostadoresCombinados.value = true
  mensagemApostadoresCombinados.value = ''
  mensagemApostadoresCombinadosTipo.value = ''

  try {
    // Deletar para cada campeonato selecionado
    const resultados = await Promise.allSettled(
      campeonatosSelecionados.value.map((campeonatoId) =>
        corridaApi.deleteApostadoresCombinados(campeonatoId, grupoIdentificadorParaDeletar.value.trim())
      )
    )

    const houveErro = resultados.some(resultado => resultado.status === 'rejected')

    if (houveErro) {
      mensagemApostadoresCombinados.value = 'Algumas deleções não puderam ser realizadas. Verifique o console para detalhes.'
      mensagemApostadoresCombinadosTipo.value = 'erro'
      resultados.forEach((resultado, index) => {
        if (resultado.status === 'rejected') {
          console.error(`Erro ao deletar apostadores combinados do campeonato ${campeonatosSelecionados.value[index]}:`, resultado.reason)
        }
      })
    } else {
      mensagemApostadoresCombinados.value = 'Apostadores combinados deletados com sucesso!'
      mensagemApostadoresCombinadosTipo.value = 'sucesso'
      grupoIdentificadorParaDeletar.value = ''
      // Recarregar apostadores para atualizar a lista
      await carregarApostadores()
    }
  } catch (error) {
    console.error('Erro ao deletar apostadores combinados:', error)
    mensagemApostadoresCombinados.value = 'Erro ao deletar apostadores combinados. Tente novamente.'
    mensagemApostadoresCombinadosTipo.value = 'erro'
  } finally {
    deletandoApostadoresCombinados.value = false
  }
}

const obterApostasCombinadasPorCampeonato = async (campeonatoId) => {
  if (!campeonatoId) return []
  const chave = campeonatoId.toString()
  if (!cacheApostasCombinadas.value[chave]) {
    try {
      const resposta = await corridaApi.getApostadoresCombinadosApostas(campeonatoId)
      cacheApostasCombinadas.value[chave] = resposta
    } catch (error) {
      console.error(`Erro ao buscar apostas combinadas do campeonato ${campeonatoId}:`, error)
      cacheApostasCombinadas.value[chave] = []
    }
  }
  return cacheApostasCombinadas.value[chave] || []
}

const transformarGrupoCombinadoParaPdf = (grupo, apostador) => {
  const nomesGrupo = Array.isArray(grupo?.apostadores) ? grupo.apostadores : []
  return {
    apostador: {
      nome: apostador?.nome || (nomesGrupo.join(' + ') || 'Apostadores Combinados'),
      nomesCombinados: apostador?.nomesCombinados || nomesGrupo,
      grupoIdentificador: grupo?.grupoIdentificador || apostador?.grupoIdentificador || '',
      combinado: true
    },
    apostasPorRodada: Array.isArray(grupo?.apostasPorRodada) ? grupo.apostasPorRodada : [],
    raw: grupo
  }
}

// Função para carregar dados do PDF
const carregarDadosPdf = async (apostador) => {
  if (!apostador?.campeonatoId || !apostador.id) {
    return
  }

  apostadorSelecionado.value = apostador // Marcar apostador como selecionado
  carregandoPdf.value = true
  
  try {
    if (apostador.combinado) {
      // Preencher automaticamente o grupoIdentificador se o apostador for combinado
      if (apostador.grupoIdentificador) {
        grupoIdentificadorParaDeletar.value = apostador.grupoIdentificador
      }
      
      const dadosCombinados = await obterApostasCombinadasPorCampeonato(apostador.campeonatoId)
      let grupoEncontrado = null

      if (Array.isArray(dadosCombinados)) {
        const chaveNomes = apostador.nomesChave || gerarChaveNomes(apostador.nomesCombinados)

        grupoEncontrado = dadosCombinados.find(grupo => {
          if (!grupo) return false
          if (apostador.grupoIdentificador && grupo.grupoIdentificador) {
            return grupo.grupoIdentificador === apostador.grupoIdentificador
          }
          const nomesGrupo = Array.isArray(grupo.apostadores) ? gerarChaveNomes(grupo.apostadores) : ''
          return nomesGrupo && nomesGrupo === chaveNomes
        })
      }

      if (!grupoEncontrado) {
        throw new Error('Combinação não encontrada no endpoint de apostas combinadas.')
      }

      // Garantir que o grupoIdentificador seja preenchido mesmo se não estava no apostador
      if (grupoEncontrado.grupoIdentificador && !grupoIdentificadorParaDeletar.value) {
        grupoIdentificadorParaDeletar.value = grupoEncontrado.grupoIdentificador
      }

      dadosPdf.value = transformarGrupoCombinadoParaPdf(grupoEncontrado, apostador)
      console.log('Dados do PDF combinados carregados:', dadosPdf.value)
    } else {
      // Limpar o grupoIdentificador se o apostador não for combinado
      grupoIdentificadorParaDeletar.value = ''
      
      const response = await corridaApi.getPdfDados(apostador.campeonatoId, apostador.id)
      dadosPdf.value = response
      console.log('Dados do PDF carregados:', response)
    }
  } catch (err) {
    console.error('Erro ao carregar dados do PDF:', err)
    dadosPdf.value = null
  } finally {
    carregandoPdf.value = false
  }
}

// Função para gerar PDF (formato similar ao relatorio.vue)
const gerarPDF = async () => {
  if (!dadosPdf.value) {
    alert('Nenhum dado disponível para gerar PDF')
    return
  }

  gerandoPDF.value = true
  
  try {
    // Processar dados para o formato do relatório
    const apostasCarregadas = []
    const apostasAgrupadas = {}
    const isCombinado = dadosPdf.value.apostador?.combinado || apostadorSelecionado.value?.combinado || false
    
    // Ordenar rodadas
    const ordenarRodadas = (rodadas) => {
      if (!rodadas || !Array.isArray(rodadas)) return rodadas
      
      return [...rodadas].sort((a, b) => {
        const nomeA = (a.nomeRodada || '').trim()
        const nomeB = (b.nomeRodada || '').trim()
        
        const regexNumero = /(\d+)/i
        const matchA = nomeA.match(regexNumero)
        const matchB = nomeB.match(regexNumero)
        
        const numeroA = matchA ? parseInt(matchA[1], 10) : 0
        const numeroB = matchB ? parseInt(matchB[1], 10) : 0
        
        if (numeroA !== numeroB) {
          return numeroA - numeroB
        }
        
        const temBA = /\bB\b/i.test(nomeA)
        const temBB = /\bB\b/i.test(nomeB)
        
        if (temBA && !temBB) return 1
        if (!temBA && temBB) return -1
        
        return 0
      })
    }
    
    const rodadasOrdenadas = ordenarRodadas(dadosPdf.value.apostasPorRodada)
    
    rodadasOrdenadas?.forEach((rodada) => {
      if (!rodada.apostas || !Array.isArray(rodada.apostas)) return
      
      const nomeTipo = rodada.tipoRodada?.nome || 'SEM TIPO'
      const nomeRodada = rodada.nomeRodada || 'N/A'
      // Calcular valorRodada: usar o valor da API ou calcular somando os valores das apostas
      let valorRodada = parseFloat(rodada.valorRodada || 0)
      if (!valorRodada || valorRodada === 0) {
        // Se não tiver valorRodada, calcular somando os valores das apostas da rodada usando valorOriginalPremio
        valorRodada = rodada.apostas.reduce((total, aposta) => {
          return total + parseFloat(aposta.valorOriginalPremio || aposta.valorPremio || 0)
        }, 0)
      }
      
      rodada.apostas.forEach((aposta) => {
        if (!aposta.pareo || !aposta.pareo.cavalos || !Array.isArray(aposta.pareo.cavalos)) {
          return
        }
        
        const cavalosNomes = aposta.pareo.cavalos.map(cavalo => cavalo.nome).join(' / ')
        const nomeCavalo = `${aposta.pareo.numero || ''} - ${cavalosNomes}`
        const chave = nomeCavalo
        
        // Obter nome do apostador se for aposta combinada
        const nomeApostador = isCombinado ? (aposta.apostador?.nome || '') : ''
        
        apostasCarregadas.push({
          rodada: nomeRodada,
          chave: chave,
          valorAposta: parseFloat(aposta.valor || 0),
          porcentagem: parseFloat(aposta.porcentagemAposta || 0),
          premioIndividual: parseFloat(aposta.valorPremio || 0),
          totalRodada: valorRodada,
          tipo: nomeTipo,
          cavalo: nomeCavalo,
          nomeApostador: nomeApostador,
          isCombinado: isCombinado
        })
        
        // Agrupar por tipo e cavalo
        if (!apostasAgrupadas[nomeTipo]) {
          apostasAgrupadas[nomeTipo] = {
            _totalPremio: 0,
            _totalRodada: 0
          }
        }
        
        if (!apostasAgrupadas[nomeTipo][nomeCavalo]) {
          apostasAgrupadas[nomeTipo][nomeCavalo] = {
            rodada: nomeRodada,
            porcentagem: parseFloat(aposta.porcentagemAposta || 0),
            premioIndividual: 0,
            totalRodada: 0
          }
        }
        
        apostasAgrupadas[nomeTipo][nomeCavalo].premioIndividual += parseFloat(aposta.valorPremio || 0)
        apostasAgrupadas[nomeTipo][nomeCavalo].totalRodada += valorRodada
        apostasAgrupadas[nomeTipo]._totalPremio += parseFloat(aposta.valorPremio || 0)
        apostasAgrupadas[nomeTipo]._totalRodada += valorRodada
      })
    })
    
    const valorTotalApostas = apostasCarregadas.reduce((total, aposta) => total + aposta.valorAposta, 0)
    const apostadorNome = dadosPdf.value.apostador?.nome || apostadorSelecionado.value?.nome || 'N/A'
    // Buscar nome do campeonato usando o campeonatoId do apostador selecionado
    const campeonatoId = apostadorSelecionado.value?.campeonatoId || dadosPdf.value.campeonato?.id || dadosPdf.value.campeonatoId
    const campeonatoEncontrado = campeonatos.value.find(c => c.id === parseInt(campeonatoId))
    const campeonatoNome = campeonatoEncontrado?.nome || dadosPdf.value.campeonato?.nome || apostadorSelecionado.value?.campeonatoNome || ''
    
    const formatCurrency = (value) => {
      const numValue = parseFloat(value)
      if (isNaN(numValue) || numValue === null || numValue === undefined) {
        return 'R$ 0,00'
      }
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      }).format(numValue)
    }
    
    // Criar conteúdo HTML para o PDF (mesmo formato do relatorio.vue)
    const content = `
      <html>
        <head>
          <title>Relatório de Apostas - ${apostadorNome}</title>
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
            .info-card {
              background: #ffcc00;
              color: black;
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
              background: #000000;
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
            @media print {
              body { margin: 0; }
              .container { box-shadow: none; }
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div style="display: flex; align-items: center; gap: 30px; margin-bottom: 30px;">
                <img src="/images/aa.png" alt="JOGOS ONLINE" style="height: 80px; width: auto; border: 4px solid #ffcc00; border-radius: 8px;" />
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; flex: 1;">
                  <div class="info-card">
                    <div class="info-label">NOME APOSTADOR</div>
                    <div class="info-value">${apostadorNome}</div>
                  </div>
                  <div class="info-card">
                    <div class="info-label">NOME CAMPEONATO</div>
                    <div class="info-value">${campeonatoNome}</div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Tabela Original de Apostas -->
            <h2 style="font-size: 24px; font-weight: bold; color: #333; margin: 30px 0 20px 0; text-align: center;">Apostas Detalhadas</h2>
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px; background-color: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
              <thead>
                <tr style="background: #000000; color: white;">
                  <th style="border: 1px solid #e5e5e5; padding: 12px; text-align: left; font-weight: bold; font-size: 14px;">RODADA</th>
                  <th style="border: 1px solid #e5e5e5; padding: 12px; text-align: left; font-weight: bold; font-size: 14px;">CHAVE</th>
                  <th style="border: 1px solid #e5e5e5; padding: 12px; text-align: left; font-weight: bold; font-size: 14px;">VALOR DA APOSTA</th>
                  <th style="border: 1px solid #e5e5e5; padding: 12px; text-align: left; font-weight: bold; font-size: 14px;">%</th>
                  <th style="border: 1px solid #e5e5e5; padding: 12px; text-align: left; font-weight: bold; font-size: 14px;">PRÊMIO INDIVIDUAL</th>
                  <th style="border: 1px solid #e5e5e5; padding: 12px; text-align: left; font-weight: bold; font-size: 14px;">TOTAL DA RODADA</th>
                  ${isCombinado ? '<th style="border: 1px solid #e5e5e5; padding: 12px; text-align: left; font-weight: bold; font-size: 14px;">APOSTADOR</th>' : ''}
                </tr>
              </thead>
              <tbody>
                ${apostasCarregadas.map(aposta => `
                  <tr>
                    <td style="border: 1px solid #e5e5e5; padding: 12px; background-color: white; font-size: 14px;">${aposta.rodada}</td>
                    <td style="border: 1px solid #e5e5e5; padding: 12px; background-color: white; font-size: 14px;">${aposta.chave}</td>
                    <td style="border: 1px solid #e5e5e5; padding: 12px; background-color: white; font-size: 14px;">${formatCurrency(aposta.valorAposta)}</td>
                    <td style="border: 1px solid #e5e5e5; padding: 12px; background-color: white; font-size: 14px;">${aposta.porcentagem}%</td>
                    <td style="border: 1px solid #e5e5e5; padding: 12px; background-color: white; font-size: 14px;">${formatCurrency(aposta.premioIndividual)}</td>
                    <td style="border: 1px solid #e5e5e5; padding: 12px; background-color: white; font-size: 14px;">${formatCurrency(aposta.totalRodada)}</td>
                    ${isCombinado ? `<td style="border: 1px solid #e5e5e5; padding: 12px; background-color: white; font-size: 14px;">${aposta.nomeApostador || '-'}</td>` : ''}
                  </tr>
                `).join('')}
              </tbody>
            </table>

            <!-- Resumos Originais -->
            <div style="display: grid; grid-template-columns: 1fr; gap: 20px; margin-bottom: 30px;">
              <div style="border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                <div style="background: #000000; color: white; padding: 15px; text-align: center; font-weight: bold; font-size: 16px;">VALOR TOTAL DA APOSTA</div>
                <div style="background: #ffcc00; color: black; padding: 20px; text-align: center;">
                  <div style="font-size: 24px; font-weight: bold;">${formatCurrency(valorTotalApostas)}</div>
                </div>
              </div>
            </div>

            <!-- Seção de Agrupamento -->
            <h2 style="font-size: 24px; font-weight: bold; color: #333; margin: 30px 0 20px 0; text-align: center;">Resumo por Tipo e Cavalo</h2>
            <p style="text-align: center; color: #666; margin-bottom: 30px; font-size: 14px;">Apostas agrupadas e somadas por tipo de rodada e cavalo</p>
            
            ${Object.entries(apostasAgrupadas).map(([tipo, tipoData]) => `
              <div style="margin-bottom: 30px;">
                <h3 style="background: #ffcc00; color: black; padding: 15px; margin: 0; font-size: 18px; font-weight: bold;">${tipo}</h3>
                <table style="border-collapse: collapse; width: 100%; border: 1px solid #e5e5e5;">
                  <thead>
                    <tr style="background: #f5f5f5;">
                    </tr>
                  </thead>
                  <tbody>
                    ${Object.entries(tipoData).filter(([key]) => !key.startsWith('_')).map(([cavalo, cavaloData]) => `
                      <tr>
                        <td style="border: 1px solid #e5e5e5; padding: 12px; background: white; font-weight: bold;">${cavalo}</td>
                        <td style="border: 1px solid #e5e5e5; padding: 12px; background: white;">${formatCurrency(cavaloData.premioIndividual)}</td>
                      </tr>
                    `).join('')}
                  </tbody>
                </table>
              </div>
            `).join('')}
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
    
  } catch (err) {
    console.error('Erro ao gerar PDF:', err)
    alert('Erro ao gerar PDF')
  } finally {
    gerandoPDF.value = false
  }
}

// Função auxiliar para gerar HTML de um apostador (mesmo estilo do relatorio.vue)
const gerarHTMLApostador = (dados) => {
  // Processar dados para o formato do relatório
  const apostasCarregadas = []
  const apostasAgrupadas = {}
  
  // Função para ordenar rodadas
  const ordenarRodadas = (rodadas) => {
    if (!rodadas || !Array.isArray(rodadas)) return rodadas
    
    return [...rodadas].sort((a, b) => {
      const nomeA = (a.nomeRodada || '').trim()
      const nomeB = (b.nomeRodada || '').trim()
      
      const regexNumero = /(\d+)/i
      const matchA = nomeA.match(regexNumero)
      const matchB = nomeB.match(regexNumero)
      
      const numeroA = matchA ? parseInt(matchA[1], 10) : 0
      const numeroB = matchB ? parseInt(matchB[1], 10) : 0
      
      if (numeroA !== numeroB) {
        return numeroA - numeroB
      }
      
      const temBA = /\bB\b/i.test(nomeA)
      const temBB = /\bB\b/i.test(nomeB)
      
      if (temBA && !temBB) return 1
      if (!temBA && temBB) return -1
      
      return 0
    })
  }
  
  const formatCurrency = (value) => {
    const numValue = parseFloat(value)
    if (isNaN(numValue) || numValue === null || numValue === undefined) {
      return 'R$ 0,00'
    }
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(numValue)
  }
  
  const rodadasOrdenadas = ordenarRodadas(dados.apostasPorRodada)
  
  // Verificar se é aposta combinada
  const isCombinado = dados.apostador?.combinado || false
  
  rodadasOrdenadas?.forEach((rodada) => {
    if (!rodada.apostas || !Array.isArray(rodada.apostas)) return
    
    const nomeTipo = rodada.tipoRodada?.nome || 'SEM TIPO'
    const nomeRodada = rodada.nomeRodada || 'N/A'
    // Calcular valorRodada: usar o valor da API ou calcular somando os valores das apostas
    let valorRodada = parseFloat(rodada.valorRodada || 0)
    if (!valorRodada || valorRodada === 0) {
      // Se não tiver valorRodada, calcular somando os valores das apostas da rodada usando valorOriginalPremio
      valorRodada = rodada.apostas.reduce((total, aposta) => {
        return total + parseFloat(aposta.valorOriginalPremio || aposta.valorPremio || 0)
      }, 0)
    }
    
    rodada.apostas.forEach((aposta) => {
      if (!aposta.pareo || !aposta.pareo.cavalos || !Array.isArray(aposta.pareo.cavalos)) {
        return
      }
      
      const cavalosNomes = aposta.pareo.cavalos.map(cavalo => cavalo.nome).join(' / ')
      const nomeCavalo = `${aposta.pareo.numero || ''} - ${cavalosNomes}`
      const chave = nomeCavalo
      
      // Obter nome do apostador se for aposta combinada
      const nomeApostador = isCombinado ? (aposta.apostador?.nome || '') : ''
      
      apostasCarregadas.push({
        rodada: nomeRodada,
        chave: chave,
        valorAposta: parseFloat(aposta.valor || 0),
        porcentagem: parseFloat(aposta.porcentagemAposta || 0),
        premioIndividual: parseFloat(aposta.valorPremio || 0),
        totalRodada: valorRodada,
        tipo: nomeTipo,
        cavalo: nomeCavalo,
        nomeApostador: nomeApostador,
        isCombinado: isCombinado
      })
      
      // Agrupar por tipo e cavalo
      if (!apostasAgrupadas[nomeTipo]) {
        apostasAgrupadas[nomeTipo] = {
          _totalPremio: 0,
          _totalRodada: 0
        }
      }
      
      if (!apostasAgrupadas[nomeTipo][nomeCavalo]) {
        apostasAgrupadas[nomeTipo][nomeCavalo] = {
          rodada: nomeRodada,
          porcentagem: parseFloat(aposta.porcentagemAposta || 0),
          premioIndividual: 0,
          totalRodada: 0
        }
      }
      
      apostasAgrupadas[nomeTipo][nomeCavalo].premioIndividual += parseFloat(aposta.valorPremio || 0)
      apostasAgrupadas[nomeTipo][nomeCavalo].totalRodada += valorRodada
      apostasAgrupadas[nomeTipo]._totalPremio += parseFloat(aposta.valorPremio || 0)
      apostasAgrupadas[nomeTipo]._totalRodada += valorRodada
    })
  })
  
  const valorTotalApostas = apostasCarregadas.reduce((total, aposta) => total + aposta.valorAposta, 0)
  const apostadorNome = dados.apostador?.nome || 'N/A'
  // Buscar nome do campeonato usando o campeonatoId dos dados
  const campeonatoId = dados.campeonatoId || dados.campeonato?.id
  const campeonatoEncontrado = campeonatoId ? campeonatos.value.find(c => c.id === parseInt(campeonatoId)) : null
  const campeonatoNome = campeonatoEncontrado?.nome || dados.campeonato?.nome || (campeonatoId ? `Campeonato ${campeonatoId}` : '')
  
  return `
    <div class="page-break">
      <div class="container">
        <div class="header">
          <div style="display: flex; align-items: center; gap: 30px; margin-bottom: 30px;">
            <img src="/images/aa.png" alt="JOGOS ONLINE" style="height: 80px; width: auto; border: 4px solid #ffcc00; border-radius: 8px;" />
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; flex: 1;">
              <div class="info-card">
                <div class="info-label">NOME APOSTADOR</div>
                <div class="info-value">${apostadorNome}</div>
              </div>
              <div class="info-card">
                <div class="info-label">NOME CAMPEONATO</div>
                <div class="info-value">${campeonatoNome}</div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Tabela Original de Apostas -->
        <h2 style="font-size: 24px; font-weight: bold; color: #333; margin: 30px 0 20px 0; text-align: center;">Apostas Detalhadas</h2>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px; background-color: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          <thead>
            <tr style="background: #000000; color: white;">
              <th style="border: 1px solid #e5e5e5; padding: 12px; text-align: left; font-weight: bold; font-size: 14px;">RODADA</th>
              <th style="border: 1px solid #e5e5e5; padding: 12px; text-align: left; font-weight: bold; font-size: 14px;">CHAVE</th>
              <th style="border: 1px solid #e5e5e5; padding: 12px; text-align: left; font-weight: bold; font-size: 14px;">VALOR DA APOSTA</th>
              <th style="border: 1px solid #e5e5e5; padding: 12px; text-align: left; font-weight: bold; font-size: 14px;">%</th>
              <th style="border: 1px solid #e5e5e5; padding: 12px; text-align: left; font-weight: bold; font-size: 14px;">PRÊMIO INDIVIDUAL</th>
              <th style="border: 1px solid #e5e5e5; padding: 12px; text-align: left; font-weight: bold; font-size: 14px;">TOTAL DA RODADA</th>
              ${isCombinado ? '<th style="border: 1px solid #e5e5e5; padding: 12px; text-align: left; font-weight: bold; font-size: 14px;">APOSTADOR</th>' : ''}
            </tr>
          </thead>
          <tbody>
            ${apostasCarregadas.map(aposta => `
              <tr>
                <td style="border: 1px solid #e5e5e5; padding: 12px; background-color: white; font-size: 14px;">${aposta.rodada}</td>
                <td style="border: 1px solid #e5e5e5; padding: 12px; background-color: white; font-size: 14px;">${aposta.chave}</td>
                <td style="border: 1px solid #e5e5e5; padding: 12px; background-color: white; font-size: 14px;">${formatCurrency(aposta.valorAposta)}</td>
                <td style="border: 1px solid #e5e5e5; padding: 12px; background-color: white; font-size: 14px;">${aposta.porcentagem}%</td>
                <td style="border: 1px solid #e5e5e5; padding: 12px; background-color: white; font-size: 14px;">${formatCurrency(aposta.premioIndividual)}</td>
                <td style="border: 1px solid #e5e5e5; padding: 12px; background-color: white; font-size: 14px;">${formatCurrency(aposta.totalRodada)}</td>
                ${isCombinado ? `<td style="border: 1px solid #e5e5e5; padding: 12px; background-color: white; font-size: 14px;">${aposta.nomeApostador || '-'}</td>` : ''}
              </tr>
            `).join('')}
          </tbody>
        </table>

        <!-- Resumos Originais -->
        <div style="display: grid; grid-template-columns: 1fr; gap: 20px; margin-bottom: 30px;">
          <div style="border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
            <div style="background: #000000; color: white; padding: 15px; text-align: center; font-weight: bold; font-size: 16px;">VALOR TOTAL DA APOSTA</div>
            <div style="background: #ffcc00; color: black; padding: 20px; text-align: center;">
              <div style="font-size: 24px; font-weight: bold;">${formatCurrency(valorTotalApostas)}</div>
            </div>
          </div>
        </div>

        <!-- Seção de Agrupamento -->
        <h2 style="font-size: 24px; font-weight: bold; color: #333; margin: 30px 0 20px 0; text-align: center;">Resumo por Tipo e Cavalo</h2>
        <p style="text-align: center; color: #666; margin-bottom: 30px; font-size: 14px;">Apostas agrupadas e somadas por tipo de rodada e cavalo</p>
        
        ${Object.entries(apostasAgrupadas).map(([tipo, tipoData]) => `
          <div style="margin-bottom: 30px;">
            <h3 style="background: #ffcc00; color: black; padding: 15px; margin: 0; font-size: 18px; font-weight: bold;">${tipo}</h3>
            <table style="border-collapse: collapse; width: 100%; border: 1px solid #e5e5e5;">
              <thead>
                <tr style="background: #f5f5f5;">
                </tr>
              </thead>
              <tbody>
                ${Object.entries(tipoData).filter(([key]) => !key.startsWith('_')).map(([cavalo, cavaloData]) => `
                  <tr>
                    <td style="border: 1px solid #e5e5e5; padding: 12px; background: white; font-weight: bold;">${cavalo}</td>
                    <td style="border: 1px solid #e5e5e5; padding: 12px; background: white;">${formatCurrency(cavaloData.premioIndividual)}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        `).join('')}
      </div>
    </div>
  `
}

// Função para gerar PDF de todos os apostadores
const gerarPDFTodosApostadores = async () => {
  if (apostadoresFiltrados.value.length === 0) {
    return
  }

  gerandoPDFTodos.value = true
  
  try {
    // Buscar dados de todos os apostadores
    const dadosApostadores = []
    for (const apostador of apostadoresFiltrados.value) {
      if (!apostador.campeonatoId) {
        console.warn(`Apostador ${apostador.nome} sem campeonato associado. Pulando.`)
        continue
      }
      try {
        let dadosPdf = null
        if (apostador.combinado) {
          const dadosCombinados = await obterApostasCombinadasPorCampeonato(apostador.campeonatoId)
          let grupoEncontrado = null
          if (Array.isArray(dadosCombinados)) {
            const chaveNomes = apostador.nomesChave || gerarChaveNomes(apostador.nomesCombinados)
            grupoEncontrado = dadosCombinados.find(grupo => {
              if (!grupo) return false
              if (apostador.grupoIdentificador && grupo.grupoIdentificador) {
                return grupo.grupoIdentificador === apostador.grupoIdentificador
              }
              const nomesGrupo = Array.isArray(grupo.apostadores) ? gerarChaveNomes(grupo.apostadores) : ''
              return nomesGrupo && nomesGrupo === chaveNomes
            })
          }

          if (grupoEncontrado) {
            dadosPdf = transformarGrupoCombinadoParaPdf(grupoEncontrado, apostador)
          } else {
            console.warn(`Combinação ${apostador.nome} não encontrada para geração de PDF.`)
          }
        } else {
          const response = await corridaApi.getPdfDados(apostador.campeonatoId, apostador.id)
          dadosPdf = response
        }
        
        // Adicionar campeonatoId aos dados para facilitar a busca do nome
        if (dadosPdf) {
          dadosPdf.campeonatoId = apostador.campeonatoId
          dadosApostadores.push(dadosPdf)
        }
      } catch (err) {
        console.error(`Erro ao buscar dados do apostador ${apostador.nome}:`, err)
      }
    }

    if (dadosApostadores.length === 0) {
      alert('Não foi possível carregar dados dos apostadores')
      return
    }

    // Gerar HTML para cada apostador
    const htmlApostadores = dadosApostadores.map(dados => gerarHTMLApostador(dados)).join('')

    // HTML completo com estilos (mesmo estilo do relatorio.vue)
    const htmlCompleto = `
      <!DOCTYPE html>
      <html lang="pt-BR">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Relatório de Apostas - Todos os Apostadores</title>
        <style>
          @media print {
            .page-break {
              page-break-after: always;
              page-break-inside: avoid;
            }
            .page-break:last-child {
              page-break-after: avoid;
            }
            body { margin: 0; }
            .container { box-shadow: none; }
          }
          
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
            margin-bottom: 40px;
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
          .info-card {
            background: #ffcc00;
            color: black;
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
            background: #000000;
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
        </style>
      </head>
      <body>
        ${htmlApostadores}
      </body>
      </html>
    `

    // Criar nova janela para impressão
    const printWindow = window.open('', '_blank')
    printWindow.document.write(htmlCompleto)
    printWindow.document.close()
    
    // Aguardar carregamento e imprimir
    printWindow.onload = () => {
      printWindow.print()
    }
    
  } catch (err) {
    console.error('Erro ao gerar PDF de todos os apostadores:', err)
    alert('Erro ao gerar PDF. Verifique se a API está online.')
  } finally {
    gerandoPDFTodos.value = false
  }
}

// Funções para modal de lista de pareos
const fecharModalPareos = () => {
  modalPareosOpen.value = false
  pareoEditandoId.value = null
  cavalosEditandoPorPareo.value = {}
  mensagemEdicaoPareo.value = ''
  mensagemEdicaoPareoTipo.value = ''
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

// Função para formatar moeda
const formatCurrency = (value) => {
  if (!value && value !== 0) return 'R$ 0,00'
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(parseFloat(value))
}

const formatPercent = (value) => {
  if (value === undefined || value === null || value === '') {
    return '0%'
  }
  const str = String(value).trim()
  return str.endsWith('%') ? str : `${str}%`
}

const normalizarNumero = (valor) => {
  if (valor === null || valor === undefined || valor === '') {
    return ''
  }

  const str = String(valor).replace(',', '.').replace(/[^0-9.-]/g, '')
  if (!str) {
    return ''
  }

  const parsed = parseFloat(str)
  if (Number.isNaN(parsed)) {
    return ''
  }

  return parsed
}

// Funções para editar apostador
const abrirModalEditar = () => {
  if (!apostadorSelecionado.value) return
  
  nomeEditado.value = apostadorSelecionado.value.nome
  mensagemEdicao.value = ''
  mensagemEdicaoTipo.value = ''
  modalEditarApostador.value = true
}

const fecharModalEditar = () => {
  modalEditarApostador.value = false
  nomeEditado.value = ''
  mensagemEdicao.value = ''
  mensagemEdicaoTipo.value = ''
}

const salvarEdicao = async () => {
  if (!apostadorSelecionado.value || !nomeEditado.value.trim()) {
    mensagemEdicao.value = 'Nome não pode estar vazio'
    mensagemEdicaoTipo.value = 'erro'
    return
  }

  if (nomeEditado.value.trim() === apostadorSelecionado.value.nome) {
    mensagemEdicao.value = 'O novo nome deve ser diferente do atual'
    mensagemEdicaoTipo.value = 'erro'
    return
  }

  editandoApostador.value = true
  mensagemEdicao.value = ''
  
  try {
    await corridaApi.renomearApostador(
      apostadorSelecionado.value.campeonatoId,
      apostadorSelecionado.value.nome,
      nomeEditado.value.trim()
    )
    
    mensagemEdicao.value = 'Nome atualizado com sucesso!'
    mensagemEdicaoTipo.value = 'sucesso'
    
    // Atualizar o nome do apostador selecionado
    apostadorSelecionado.value.nome = nomeEditado.value.trim()
    
    // Atualizar a lista de apostadores
    await carregarApostadores()
    
    // Fechar modal após 2 segundos
    setTimeout(() => {
      fecharModalEditar()
    }, 2000)
    
  } catch (err) {
    mensagemEdicao.value = 'Erro ao atualizar nome. Verifique se a API está online.'
    mensagemEdicaoTipo.value = 'erro'
    console.error('Erro ao renomear apostador:', err)
  } finally {
    editandoApostador.value = false
  }
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


