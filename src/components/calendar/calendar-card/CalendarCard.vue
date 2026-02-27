<script setup lang="ts">
import { computed, useTemplateRef } from 'vue'
import { onLongPress } from '@vueuse/core'

import { Icon } from '@iconify/vue'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

interface Props {
  timeEntry: {
    id: string
    title: string
    tags: string[]
    start: string
    end: string
  }
  height: number
}

const props = withDefaults(defineProps<Props>(), {})

const emit = defineEmits<{
  longPress: [id: string]
}>()

// HH:MM:SS formatted time between start and end
const time = computed(() => {
  const start = new Date(props.timeEntry.start)
  const end = new Date(props.timeEntry.end)
  const diffMs = end.getTime() - start.getTime()
  const diffHrs = Math.floor(diffMs / (1000 * 60 * 60))
  const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))
  const diffSecs = Math.floor((diffMs % (1000 * 60)) / 1000)
  return `${diffHrs.toString().padStart(2, '0')}:${diffMins
    .toString()
    .padStart(2, '0')}:${diffSecs.toString().padStart(2, '0')}`
})

const htmlRefHook = useTemplateRef('htmlRefHook')

function onLongPressCallbackHook(e: PointerEvent) {
  emit('longPress', props.timeEntry.id)
}

onLongPress(htmlRefHook, onLongPressCallbackHook, {
  modifiers: {
    prevent: true,
  },
})
</script>

<template>
  <Card class="w-full h-full p-0" ref="htmlRefHook">
    <CardContent class="p-2 h-full flex flex-wrap">
      <div class="flex flex-col gap-2">
        <h1 class="text-lg font-bold line-clamp-1">{{ props.timeEntry.title }}</h1>
        <div class="flex gap-2" v-if="height >= 100">
          <span
            v-for="tag in props.timeEntry.tags"
            :key="tag"
            class="bg-gray-200 text-gray-800 px-2 py-1 rounded-full text-xs"
          >
            {{ tag }}
          </span>
        </div>
      </div>
      <div class="flex h-auto items-end justify-end gap-2 ml-auto pr-2">
        {{ time }}
      </div>
    </CardContent>
  </Card>
</template>
