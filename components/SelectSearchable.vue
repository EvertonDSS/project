<template>
  <div ref="rootEl" class="relative w-full">
    <label v-if="label" :for="buttonId" class="block text-sm font-medium text-gray-700 mb-2">
      {{ label }}
    </label>
    <button
      :id="buttonId"
      type="button"
      :disabled="disabled || !options.length"
      class="w-full px-4 py-2 border border-gray-300 rounded-lg text-left flex items-center justify-between gap-2 bg-white transition-shadow focus:outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
      :class="[
        ringClass,
        open ? openRingClass : 'hover:border-gray-400'
      ]"
      aria-haspopup="listbox"
      :aria-expanded="open"
      @click="onToggleClick"
    >
      <span class="truncate min-w-0" :class="displayMuted ? 'text-gray-500' : 'text-gray-900'">
        {{ displayText }}
      </span>
      <svg
        class="w-5 h-5 text-gray-400 shrink-0 transition-transform duration-200"
        :class="{ 'rotate-180': open }"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
      </svg>
    </button>

    <div
      v-show="open"
      class="absolute left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg flex flex-col max-h-72 overflow-hidden"
      :class="listboxZClass"
      role="listbox"
    >
      <input
        ref="filterInputRef"
        v-model="query"
        type="search"
        autocomplete="off"
        class="w-full px-3 py-2 border-b border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-inset"
        :class="filterInsetRingClass"
        :placeholder="filterPlaceholder"
        @keydown.escape.prevent="close"
        @click.stop
      />
      <ul class="overflow-y-auto flex-1 min-h-0 py-1 max-h-56">
        <template v-if="filtered.length === 0">
          <li class="px-3 py-2 text-sm text-gray-500 cursor-default">
            {{ props.options.length === 0 ? emptyOptionsMessage : noResultsMessage }}
          </li>
        </template>
        <template v-else>
          <li
            v-for="opt in filtered"
            :key="String(opt.value)"
            role="option"
            :aria-selected="isSelected(opt)"
            class="px-3 py-2 text-sm cursor-pointer select-none"
            :class="optionRowClass(opt)"
            @mousedown.prevent="pick(opt)"
          >
            {{ opt.label }}
          </li>
        </template>
      </ul>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: ''
  },
  options: {
    type: Array,
    default: () => []
  },
  label: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: 'Selecione…'
  },
  disabled: {
    type: Boolean,
    default: false
  },
  emptyOptionsMessage: {
    type: String,
    default: 'Nenhuma opção disponível'
  },
  noResultsMessage: {
    type: String,
    default: 'Nenhum resultado para o filtro'
  },
  filterPlaceholder: {
    type: String,
    default: 'Digite para filtrar…'
  },
  ringClass: {
    type: String,
    default: 'focus:ring-2 focus:ring-orange-500 focus:border-transparent'
  },
  /** 'orange' (padrão) ou 'indigo' para combinar com modais indigo */
  variant: {
    type: String,
    default: 'orange'
  },
  listboxZClass: {
    type: String,
    default: 'z-50'
  }
})

const openRingClass = computed(() =>
  props.variant === 'indigo'
    ? 'ring-2 ring-indigo-500 border-indigo-300'
    : 'ring-2 ring-orange-500 border-orange-300'
)

const filterInsetRingClass = computed(() =>
  props.variant === 'indigo' ? 'focus:ring-indigo-400' : 'focus:ring-orange-400'
)

const emit = defineEmits(['update:modelValue'])

const rootEl = ref(null)
const filterInputRef = ref(null)
const open = ref(false)
const query = ref('')

const buttonId = `select-searchable-${Math.random().toString(36).slice(2, 9)}`

const normalizarTexto = (texto) => {
  if (!texto && texto !== 0) {
    return ''
  }
  return texto
    .toString()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .trim()
}

const textoSoLetrasENumeros = (texto) => normalizarTexto(texto).replace(/[^a-z0-9]/g, '')

const tokensAlfanumericosFiltro = (filtro) =>
  normalizarTexto(filtro)
    .split(/\s+/)
    .map((w) => textoSoLetrasENumeros(w))
    .filter(Boolean)

const textoCasaFiltroPalavras = (textoAlvo, filtro) => {
  const tokens = tokensAlfanumericosFiltro(filtro)
  if (!tokens.length) {
    return true
  }
  const hay = textoSoLetrasENumeros(textoAlvo)
  return tokens.every((tok) => hay.includes(tok))
}

const filtered = computed(() => {
  const lista = Array.isArray(props.options) ? props.options : []
  const q = query.value
  return lista.filter((o) =>
    textoCasaFiltroPalavras(`${o.label ?? ''} ${o.searchText ?? ''}`, q)
  )
})

const selectedLabel = computed(() => {
  const v = props.modelValue
  if (v === '' || v === undefined || v === null) {
    return ''
  }
  const o = props.options.find((x) => String(x.value) === String(v))
  return o?.label ?? ''
})

const displayText = computed(() => selectedLabel.value || props.placeholder)
const displayMuted = computed(() => !selectedLabel.value)

const isSelected = (opt) => String(opt.value) === String(props.modelValue)

const optionRowClass = (opt) => {
  if (opt.disabled) {
    return 'text-gray-400 cursor-not-allowed'
  }
  if (isSelected(opt)) {
    return props.variant === 'indigo'
      ? 'bg-indigo-100 text-gray-900 font-medium'
      : 'bg-orange-100 text-gray-900 font-medium'
  }
  return props.variant === 'indigo'
    ? 'text-gray-800 hover:bg-indigo-50'
    : 'text-gray-800 hover:bg-orange-50'
}

const close = () => {
  open.value = false
  query.value = ''
  removeDocListener()
}

const pick = (opt) => {
  if (opt.disabled) {
    return
  }
  emit('update:modelValue', opt.value)
  close()
}

let docListener = null

const removeDocListener = () => {
  if (docListener) {
    document.removeEventListener('click', docListener)
    docListener = null
  }
}

const onDocClick = (e) => {
  if (!rootEl.value?.contains(e.target)) {
    close()
  }
}

const scheduleDocListener = () => {
  removeDocListener()
  setTimeout(() => {
    docListener = onDocClick
    document.addEventListener('click', docListener)
  }, 0)
}

const onToggleClick = () => {
  if (props.disabled || !props.options.length) {
    return
  }
  open.value = !open.value
  if (open.value) {
    nextTick(() => {
      filterInputRef.value?.focus()
      scheduleDocListener()
    })
  } else {
    query.value = ''
    removeDocListener()
  }
}

watch(open, (v) => {
  if (!v) {
    query.value = ''
    removeDocListener()
  }
})

watch(
  () => props.options,
  () => {
    const v = props.modelValue
    if (v === '' || v === undefined || v === null) {
      return
    }
    const ok = props.options.some((o) => String(o.value) === String(v))
    if (!ok) {
      emit('update:modelValue', '')
    }
  },
  { deep: true }
)

onUnmounted(() => {
  removeDocListener()
})
</script>
