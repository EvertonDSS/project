<template>
  <nav class="bg-gradient-to-r from-neutral-800 via-neutral-900 to-neutral-800 shadow-2xl">
    <div class="container mx-auto">
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
      </ul>
    </div>
  </nav>
</template>