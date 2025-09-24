<template>
  <div class="space-y-2">
    <label :for="selectId" class="block text-sm font-semibold text-neutral-700">
      <div class="flex items-center space-x-2">
        <component :is="iconComponent" v-if="iconComponent" class="w-4 h-4 text-primary-600" />
        <span>{{ label }}</span>
        <span v-if="required" class="text-red-500">*</span>
      </div>
    </label>
    
    <div class="relative">
      <!-- Input de busca -->
      <input
        :id="selectId"
        type="text"
        :value="searchValue"
        @input="handleSearch"
        @focus="handleFocus"
        @blur="handleBlur"
        @click="handleClick"
        :placeholder="placeholder || `Buscar ${(label || '').toLowerCase()}...`"
        class="form-input pr-10"
        :class="{ 'border-red-500': required && !modelValue }"
      />
      
      <!-- Ícone de dropdown -->
      <div class="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
        <ChevronDownIcon class="w-5 h-5 text-neutral-400" />
      </div>
      
      <!-- Dropdown de opções -->
      <div 
        v-if="showDropdown && filteredOptions.length > 0" 
        class="absolute z-50 w-full mt-1 bg-white border border-neutral-200 rounded-lg shadow-lg max-h-60 overflow-y-auto"
      >
        <div
          v-for="option in filteredOptions"
          :key="option.value"
          @mousedown="selectOption(option)"
          class="px-4 py-2 hover:bg-neutral-100 cursor-pointer text-sm"
          :class="{ 'bg-primary-100 text-primary-700': modelValue === option.value }"
        >
          {{ option.label }}
        </div>
        
        <!-- Mensagem quando não há resultados -->
        <div v-if="filteredOptions.length === 0" class="px-4 py-2 text-sm text-neutral-500">
          Nenhum resultado encontrado
        </div>
      </div>
    </div>
    
    <!-- Valor selecionado (apenas para exibição) -->
    <div v-if="modelValue && selectedOption" class="text-sm text-neutral-600 bg-neutral-50 px-3 py-2 rounded">
      Selecionado: {{ selectedOption.label }}
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { ChevronDownIcon } from '@heroicons/vue/24/outline'
import { 
  UserIcon, 
  SparklesIcon, 
  TrophyIcon 
} from '@heroicons/vue/24/outline'

const props = defineProps({
  label: String,
  modelValue: String,
  options: Array,
  required: { type: Boolean, default: false },
  icon: String,
  placeholder: String,
  disabled: { type: Boolean, default: false }
})

const emit = defineEmits(['update:modelValue'])

const searchValue = ref('')
const showDropdown = ref(false)

const selectId = computed(() => `select-${(props.label || '').toLowerCase().replace(/\s+/g, '-')}`)

const iconComponent = computed(() => {
  const icons = {
    UserIcon,
    SparklesIcon,
    TrophyIcon
  }
  return props.icon ? icons[props.icon] : null
})

const selectedOption = computed(() => {
  return props.options.find(option => option.value === props.modelValue)
})

const filteredOptions = computed(() => {
  if (!searchValue.value.trim()) {
    return props.options
  }
  
  const searchTerm = searchValue.value.toLowerCase()
  return props.options.filter(option => 
    option.label && option.label.toLowerCase().includes(searchTerm)
  )
})

const handleSearch = (event) => {
  searchValue.value = event.target.value
  showDropdown.value = true
}

const handleFocus = () => {
  showDropdown.value = true
}

const handleClick = () => {
  // Sempre limpar o campo de busca quando clicar para facilitar nova busca
  searchValue.value = ''
  showDropdown.value = true
}

const selectOption = (option) => {
  emit('update:modelValue', option.value)
  searchValue.value = option.label || ''
  showDropdown.value = false
}

const handleBlur = () => {
  // Delay para permitir clique nas opções
  setTimeout(() => {
    showDropdown.value = false
    
    // Se não há valor selecionado, limpar a busca
    if (!props.modelValue) {
      searchValue.value = ''
    } else if (selectedOption.value) {
      // Se há valor selecionado, mostrar o label
      searchValue.value = selectedOption.value.label || ''
    }
  }, 150)
}

// Watch para atualizar o searchValue quando modelValue muda externamente
watch(() => props.modelValue, (newValue) => {
  if (newValue && selectedOption.value) {
    searchValue.value = selectedOption.value.label || ''
  } else if (!newValue) {
    searchValue.value = ''
  }
}, { immediate: true })

// Watch para limpar quando options mudam
watch(() => props.options, () => {
  if (!props.modelValue) {
    searchValue.value = ''
  }
})
</script>
