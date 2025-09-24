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
        :required="required"
        :class="[
          'form-input',
          prefix ? 'pl-12' : '',
          suffix ? 'pr-12' : ''
        ]"
        :placeholder="`Digite ${label.toLowerCase()}`"
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
  modelValue: String,
  required: { type: Boolean, default: false },
  prefix: String,
  suffix: String,
  icon: String
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
  emit('update:modelValue', event.target.value)
}
</script>