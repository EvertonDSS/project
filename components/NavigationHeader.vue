<template>
  <nav class="bg-gradient-to-r from-neutral-800 via-neutral-900 to-neutral-800 shadow-2xl relative">
    <div class="container mx-auto px-4">
      <!-- Desktop Navigation -->
      <div class="hidden md:block">
        <ul class="flex flex-wrap">
          <li>
            <NuxtLink 
              to="/aposta" 
              class="nav-link"
              :class="{ active: $route.path === '/aposta' }"
            >
              Aposta
            </NuxtLink>
          </li>
          <li>
            <NuxtLink 
              to="/apostador" 
              class="nav-link"
              :class="{ active: $route.path === '/apostador' }"
            >
              Apostador
            </NuxtLink>
          </li>
          <li>
            <NuxtLink 
              to="/cavalo" 
              class="nav-link"
              :class="{ active: $route.path === '/cavalo' }"
            >
              Cavalo
            </NuxtLink>
          </li>
          <li>
            <NuxtLink 
              to="/campeonato" 
              class="nav-link"
              :class="{ active: $route.path === '/campeonato' }"
            >
              Campeonato
            </NuxtLink>
          </li>
          <li>
            <NuxtLink 
              to="/rodada" 
              class="nav-link"
              :class="{ active: $route.path === '/rodada' }"
            >
              Rodada
            </NuxtLink>
          </li>
          <li>
            <NuxtLink 
              to="/relatorio" 
              class="nav-link"
              :class="{ active: $route.path === '/relatorio' }"
            >
              Relatório
            </NuxtLink>
          </li>
        </ul>
      </div>

      <!-- Mobile Navigation -->
      <div class="md:hidden">
        <div class="flex items-center justify-between py-4">
          <!-- Logo/Brand -->
          <div class="text-white font-bold text-lg">
            Sistema de Apostas
          </div>
          
          <!-- Hamburger Button -->
          <button 
            @click="toggleMobileMenu"
            class="text-white hover:text-gray-200 transition-colors p-2"
            :class="{ 'text-gray-200': isMobileMenuOpen }"
          >
            <Bars3Icon v-if="!isMobileMenuOpen" class="w-6 h-6" />
            <XMarkIcon v-else class="w-6 h-6" />
          </button>
        </div>

        <!-- Mobile Menu -->
        <div 
          v-show="isMobileMenuOpen"
          class="absolute top-full left-0 right-0 bg-neutral-900 shadow-lg z-50 border-t border-neutral-700"
        >
          <ul class="py-2">
            <li>
              <NuxtLink 
                to="/aposta" 
                class="mobile-nav-link"
                :class="{ 'mobile-nav-link-active': $route.path === '/aposta' }"
                @click="closeMobileMenu"
              >
                <div class="flex items-center space-x-3">
                  <CurrencyDollarIcon class="w-5 h-5" />
                  <span>Aposta</span>
                </div>
              </NuxtLink>
            </li>
            <li>
              <NuxtLink 
                to="/apostador" 
                class="mobile-nav-link"
                :class="{ 'mobile-nav-link-active': $route.path === '/apostador' }"
                @click="closeMobileMenu"
              >
                <div class="flex items-center space-x-3">
                  <UserIcon class="w-5 h-5" />
                  <span>Apostador</span>
                </div>
              </NuxtLink>
            </li>
            <li>
              <NuxtLink 
                to="/cavalo" 
                class="mobile-nav-link"
                :class="{ 'mobile-nav-link-active': $route.path === '/cavalo' }"
                @click="closeMobileMenu"
              >
                <div class="flex items-center space-x-3">
                  <SparklesIcon class="w-5 h-5" />
                  <span>Cavalo</span>
                </div>
              </NuxtLink>
            </li>
            <li>
              <NuxtLink 
                to="/campeonato" 
                class="mobile-nav-link"
                :class="{ 'mobile-nav-link-active': $route.path === '/campeonato' }"
                @click="closeMobileMenu"
              >
                <div class="flex items-center space-x-3">
                  <TrophyIcon class="w-5 h-5" />
                  <span>Campeonato</span>
                </div>
              </NuxtLink>
            </li>
            <li>
              <NuxtLink 
                to="/rodada" 
                class="mobile-nav-link"
                :class="{ 'mobile-nav-link-active': $route.path === '/rodada' }"
                @click="closeMobileMenu"
              >
                <div class="flex items-center space-x-3">
                  <PlayIcon class="w-5 h-5" />
                  <span>Rodada</span>
                </div>
              </NuxtLink>
            </li>
            <li>
              <NuxtLink 
                to="/relatorio" 
                class="mobile-nav-link"
                :class="{ 'mobile-nav-link-active': $route.path === '/relatorio' }"
                @click="closeMobileMenu"
              >
                <div class="flex items-center space-x-3">
                  <DocumentTextIcon class="w-5 h-5" />
                  <span>Relatório</span>
                </div>
              </NuxtLink>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { 
  Bars3Icon, 
  XMarkIcon, 
  CurrencyDollarIcon, 
  UserIcon, 
  SparklesIcon, 
  TrophyIcon, 
  PlayIcon,
  DocumentTextIcon
} from '@heroicons/vue/24/outline'

const isMobileMenuOpen = ref(false)

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false
}

// Fechar menu quando a rota mudar
watch(() => useRoute().path, () => {
  closeMobileMenu()
})
</script>

<style scoped>
/* Estilos para links mobile */
.mobile-nav-link {
  @apply block px-6 py-3 text-white hover:bg-neutral-800 transition-colors duration-200 border-l-4 border-transparent;
}

.mobile-nav-link-active {
  @apply bg-neutral-800 border-l-4 border-primary-500;
}

/* Estilos para links desktop (mantendo os existentes) */
.nav-link {
  @apply block px-6 py-4 text-white hover:bg-neutral-700 transition-colors duration-200 border-b-2 border-transparent;
}

.nav-link.active {
  @apply bg-neutral-700 border-b-2 border-primary-500;
}
</style>