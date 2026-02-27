<script setup lang="ts">
import { computed, ref } from 'vue'
import { useSwipe } from '@vueuse/core'
import { useRouter } from 'vue-router'
import { useActiveTimerStore } from '@/stores/active'
import { Button } from '@/components/ui/button'
import { Icon } from '@iconify/vue'

const DRAG_THRESHOLD = 80 // px — how far up before navigating
const MAX_DRAG = 160 // px — cap how far it can follow finger

const emit = defineEmits<{ action: [] }>()

const router = useRouter()
const activeTimer = useActiveTimerStore()

const playerRef = ref<HTMLElement | null>(null)
const dragY = ref(0)

// clamp so the element only moves upward and not too far
const clampedDragY = computed(() => Math.max(-MAX_DRAG, Math.min(0, dragY.value)))

const { isSwiping, direction, lengthY } = useSwipe(playerRef, {
  passive: true,

  onSwipe() {
    if (direction.value === 'up') {
      // lengthY is negative when swiping up in vueuse, so negate it
      dragY.value = -Math.abs(lengthY.value)
    } else {
      dragY.value = 0
    }
  },

  onSwipeEnd() {
    if (direction.value === 'up' && Math.abs(lengthY.value) >= DRAG_THRESHOLD) {
      navigateToDetail()
    } else {
      // spring back
      dragY.value = 0
    }
  },
})

function navigateToDetail() {
  dragY.value = 0
  //   router.push({ name: 'Detail', params: { id: item.value.id } })
  router.push({ name: 'edit-active-entry' })
}

function handleTap() {
  // only treat as tap if not a swipe gesture
  if (!isSwiping.value) {
    navigateToDetail()
  }
}

// Update end time every second to reflect the active entry duration
setInterval(() => {
  timeEntryData.value.end = new Date().toISOString().split('T')[1]?.split('.')[0] || '00:00:00'
}, 1000)

const timeEntryData = ref({
  start: '08:03:51',
  end: new Date().toISOString().split('T')[1]?.split('.')[0] || '10:31:25', // current time
  date: new Date().toISOString().split('T')[0],
  title: 'Active Time Entry',
  tags: ['tag1', 'tag2'],
})

const timeEntryDuration = computed(() => {
  if (!timeEntryData.value.start || !timeEntryData.value.end) {
    return '00:00:00'
  }

  // return duration in HH:MM:SS format
  // const start = new Date(formValues.value.start);
  // const end = new Date(formValues.value.end);
  const start = new Date(`1970-01-01T${timeEntryData.value.start}`)
  const end = new Date(`1970-01-01T${timeEntryData.value.end}`)

  if (!start.getTime() || !end.getTime()) {
    return '00:00:00'
  }

  const diff = end.getTime() - start.getTime()
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((diff % (1000 * 60)) / 1000)

  return `${hours.toString().padStart(2, '0')}:${minutes
    .toString()
    .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
})
</script>

<template>
  <div
    ref="playerRef"
    class="w-full bg-card border-t border-border px-4 py-3 flex items-center gap-3 select-none touch-none transition-transform duration-100"
    :style="{ transform: `translateY(${clampedDragY}px)` }"
    @click="handleTap"
  >
    <!-- blur effect -->
    <div
      class="absolute inset-0 bg-card/75 backdrop-blur-sm border-t border-border pointer-events-none"
      :class="{
        'opacity-0': !isSwiping,
        'opacity-100': isSwiping,
      }"
      style="transition: opacity 0.2s"
    />

    <div class="flex flex-col gap-2">
      <h1 class="text-lg font-bold line-clamp-1">{{ timeEntryData.title }}</h1>
      <div class="flex gap-2 mt-2">
        <span
          v-for="tag in timeEntryData.tags"
          :key="tag"
          class="bg-gray-200 text-gray-800 px-2 py-1 rounded-full text-xs"
        >
          {{ tag }}
        </span>
      </div>
    </div>
    <div class="flex items-center justify-end gap-4 ml-auto">
      {{ timeEntryDuration }}

      <Button variant="destructive" size="lg" @click.stop="activeTimer.stopActiveTimer()">
        <Icon icon="tabler:player-stop" class="size-6" /> Stop
      </Button>
    </div>
  </div>
</template>
