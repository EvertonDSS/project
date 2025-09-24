<template>
  <div class="space-y-2">
    <label :for="inputId" class="block text-sm font-semibold text-neutral-700">
      <div class="flex items-center space-x-2">
        <component :is="iconComponent" v-if="iconComponent" class="w-4 h-4 text-primary-600" />
        <span>{{ label }}</span>
        <span v-if="required" class="text-red-500">*</span>
      </div>
    </label>
    
    <div class="relative">
      <div v-if="prefix" class="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-500 font-medium">
        {{ prefix }}
      </div>
      
      <input
        :id="inputId"
        :type="type"
        :step="step"
        :value="modelValue"
        @input="updateValue"
        @keyup="validateOnKeyup"
        @blur="validateOnBlur"
        :required="required"
        :min="min"
        :max="max"
        :class="[
          'form-input',
          prefix ? 'pl-12' : '',
          suffix ? 'pr-12' : ''
        ]"
        :placeholder="placeholder || `Digite ${label.toLowerCase()}`"
      />
      
      <div v-if="suffix" class="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-500 font-medium">
        {{ suffix }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { 
  CurrencyDollarIcon, 
  BanknotesIcon, 
  CalculatorIcon 
} from '@heroicons/vue/24/outline'

const props = defineProps({
  label: String,
  type: { type: String, default: 'text' },
  step: String,
  modelValue: [String, Number],
  required: { type: Boolean, default: false },
  prefix: String,
  suffix: String,
  icon: String,
  min: [String, Number],
  max: [String, Number],
  placeholder: String
})

const emit = defineEmits(['update:modelValue'])

const inputId = computed(() => `input-${props.label.toLowerCase().replace(/\s+/g, '-')}`)

const iconComponent = computed(() => {
  const icons = {
    CurrencyDollarIcon,
    BanknotesIcon,
    CalculatorIcon
  }
  return props.icon ? icons[props.icon] : null
})

const updateValue = (event) => {
  let value = event.target.value
  
  // Validação para números com min/max
  if (props.type === 'number' && value !== '') {
    // Para campos de ano, manter "20" fixo e permitir apenas os 2 últimos dígitos
    if (props.label && props.label.toLowerCase().includes('ano')) {
      // Se o valor começa com "20", manter apenas os 2 últimos dígitos
      if (value.startsWith('20')) {
        value = '20' + value.slice(2, 4)
      } else if (value.length <= 2 && value !== '') {
        // Se tem 2 dígitos ou menos e não está vazio, adicionar "20" na frente
        value = '20' + value.slice(0, 2)
      } else if (value.length > 2 && !value.startsWith('20')) {
        // Se tem mais de 2 dígitos e não começa com "20", pegar apenas os 2 últimos
        value = '20' + value.slice(-2)
      }
      // Se value está vazio, manter vazio (não adicionar "20")
      
      // Garantir que não exceda 4 dígitos
      value = value.slice(0, 4)
      
      // Só validar min/max se o valor tem 4 dígitos completos
      if (value.length === 4) {
        const numValue = parseFloat(value)
        
        // Se tem min definido e o valor é menor, usar o min
        if (props.min !== undefined && numValue < parseFloat(props.min)) {
          value = props.min.toString()
        }
        
        // Se tem max definido e o valor é maior, usar o max
        if (props.max !== undefined && numValue > parseFloat(props.max)) {
          value = props.max.toString()
        }
      }
    } else if (props.label && props.label.toLowerCase().includes('porcentagem')) {
      // Para campos de porcentagem, limitar entre 0 e 100
      const numValue = parseFloat(value)
      
      // Não permitir valores negativos
      if (numValue < 0) {
        value = '0'
      }
      
      // Se tem min definido e o valor é menor, usar o min
      if (props.min !== undefined && numValue < parseFloat(props.min)) {
        value = props.min.toString()
      }
      
      // Limitar porcentagem a 100
      if (numValue > 100) {
        value = '100'
      }
      
      // Se tem max definido e o valor é maior, usar o max
      if (props.max !== undefined && numValue > parseFloat(props.max)) {
        value = props.max.toString()
      }
    } else {
      // Para outros campos numéricos, validar normalmente
      const numValue = parseFloat(value)
      
      // Se tem min definido e o valor é menor, usar o min
      if (props.min !== undefined && numValue < parseFloat(props.min)) {
        value = props.min.toString()
      }
      
      // Se tem max definido e o valor é maior, usar o max
      if (props.max !== undefined && numValue > parseFloat(props.max)) {
        value = props.max.toString()
      }
    }
  }
  
  emit('update:modelValue', value)
}

const validateOnKeyup = (event) => {
  // Validação em tempo real para campos de ano
  if (props.type === 'number' && props.label && props.label.toLowerCase().includes('ano')) {
    let value = event.target.value
    
    // Se tem 4 dígitos e é menor que o mínimo, corrigir
    if (value.length === 4 && value.startsWith('20')) {
      const numValue = parseFloat(value)
      if (props.min !== undefined && numValue < parseFloat(props.min)) {
        event.target.value = props.min.toString()
        emit('update:modelValue', props.min.toString())
      }
    }
  }
  
  // Validação em tempo real para campos de porcentagem
  if (props.type === 'number' && props.label && props.label.toLowerCase().includes('porcentagem')) {
    let value = event.target.value
    
    if (value !== '') {
      const numValue = parseFloat(value)
      
      // Não permitir valores negativos
      if (numValue < 0) {
        event.target.value = '0'
        emit('update:modelValue', '0')
      }
      
      // Limitar porcentagem a 100
      if (numValue > 100) {
        event.target.value = '100'
        emit('update:modelValue', '100')
      }
    }
  }
}

const validateOnBlur = (event) => {
  // Validação final quando o campo perde o foco
  if (props.type === 'number' && event.target.value !== '') {
    let value = event.target.value
    const numValue = parseFloat(value)
    
    // Validação especial para campos de porcentagem
    if (props.label && props.label.toLowerCase().includes('porcentagem')) {
      // Não permitir valores negativos
      if (numValue < 0) {
        event.target.value = '0'
        emit('update:modelValue', '0')
        return
      }
      
      // Limitar porcentagem a 100
      if (numValue > 100) {
        event.target.value = '100'
        emit('update:modelValue', '100')
        return
      }
    }
    
    // Se tem min definido e o valor é menor, usar o min
    if (props.min !== undefined && numValue < parseFloat(props.min)) {
      event.target.value = props.min.toString()
      emit('update:modelValue', props.min.toString())
    }
    
    // Se tem max definido e o valor é maior, usar o max
    if (props.max !== undefined && numValue > parseFloat(props.max)) {
      event.target.value = props.max.toString()
      emit('update:modelValue', props.max.toString())
    }
  }
}
</script>