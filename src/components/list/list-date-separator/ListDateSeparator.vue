<script setup lang="ts">
import { ref, computed } from 'vue'

import { Separator } from '@/components/ui/separator'

interface Props {
  label: string
  time: string
  header?: {
    label: string
    time: string
  }
}

const props = withDefaults(defineProps<Props>(), {
  header: undefined,
})

const emit = defineEmits<{
  close: []
}>()
</script>

<template>
  <div class="flex flex-col gap-0.5 select-none">
    <div
      v-if="!!props.header"
      class="w-full flex items-center justify-center gap-4 text-sm text-foreground"
    >
      <span class="shrink-0">{{ props.header.label }}</span>
      <Separator class="shrink" />
      <span class="shrink-0">{{ props.header.time }}</span>
    </div>

    <div class="w-full flex items-center justify-center gap-4 text-xs text-muted-foreground">
      <span class="shrink-0">{{ props.label }}</span>
      <Separator class="shrink" />
      <span class="shrink-0">{{ props.time }}</span>
    </div>
  </div>
</template>
