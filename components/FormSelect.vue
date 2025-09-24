<template>
  <div class="space-y-2">
    <label :for="selectId" class="block text-sm font-semibold text-neutral-700">
      <div class="flex items-center space-x-2">
        <component :is="iconComponent" v-if="iconComponent" class="w-4 h-4 text-primary-600" />
        <span>{{ label }}</span>
        <span v-if="required" class="text-red-500">*</span>
      </div>
    </label>
    
    <select
      :id="selectId"
      :value="modelValue"
      @change="updateValue"
      :required="required"
      class="form-select"
    >
      <option value="" class="text-neutral-400">Selecione...</option>
      <option
        v-for="option in options"
        :key="option.value"
        :value="option.value"
        class="text-neutral-900"
      >
        {{ option.label }}
      </option>
    </select>
  </div>
</template>

<script setup>
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
  icon: String
})

const emit = defineEmits(['update:modelValue'])

const selectId = computed(() => `select-${props.label.toLowerCase().replace(/\s+/g, '-')}`)

const iconComponent = computed(() => {
  const icons = {
    UserIcon,
    SparklesIcon,
    TrophyIcon
  }
  return props.icon ? icons[props.icon] : null
})

const updateValue = (event) => {
  emit('update:modelValue', event.target.value)
}
</script>