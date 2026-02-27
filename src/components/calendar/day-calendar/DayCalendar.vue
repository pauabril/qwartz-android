<script setup lang="ts">
import { ref, computed } from 'vue'
import { useEventListener } from '@vueuse/core'

import { Icon } from '@iconify/vue'

import { Button } from '@/components/ui/button'

// ─── Types ────────────────────────────────────────────────────────────────────

interface TimeEntry {
  id: string
  title: string
  tags: string[]
  start: string // ISO datetime string
  end: string // ISO datetime string
}

interface PositionedEntry {
  entry: TimeEntry
  top: number // px from top of grid
  height: number // px
  col: number // column index (for overlap handling)
  totalCols: number // total columns in this cluster
}

// ─── Props & Emits ────────────────────────────────────────────────────────────

const props = defineProps<{
  entries: TimeEntry[]
  modelValue?: Date
  hourHeight?: number // initial px per hour row, default 64
  startHour?: number // first visible hour, default 0
  endHour?: number // last visible hour, default 24
}>()

const emit = defineEmits<{
  'update:modelValue': [date: Date]
  'entry-click': [entry: TimeEntry]
}>()

// ─── Config & Zoom ────────────────────────────────────────────────────────────

const HOUR_HEIGHT_MIN = 32
const HOUR_HEIGHT_MAX = 240

const zoomHourHeight = ref(props.hourHeight ?? 64)
const HOUR_HEIGHT = computed(() => zoomHourHeight.value)
const START_HOUR = computed(() => props.startHour ?? 0)
const END_HOUR = computed(() => props.endHour ?? 24)
const TOTAL_HOURS = computed(() => END_HOUR.value - START_HOUR.value)
const TOTAL_HEIGHT = computed(() => TOTAL_HOURS.value * HOUR_HEIGHT.value)

// ─── Pinch to Zoom ────────────────────────────────────────────────────────────

const gridRef = ref<HTMLElement | null>(null)

let pinchStartDistance = 0
let pinchStartHourHeight = 0

function getTouchDistance(touches: TouchList): number {
  const dx = touches[0].clientX - touches[1].clientX
  const dy = touches[0].clientY - touches[1].clientY
  return Math.sqrt(dx * dx + dy * dy)
}

useEventListener(
  gridRef,
  'touchstart',
  (e: TouchEvent) => {
    if (e.touches.length === 2) {
      pinchStartDistance = getTouchDistance(e.touches)
      pinchStartHourHeight = zoomHourHeight.value
    }
  },
  { passive: true },
)

useEventListener(
  gridRef,
  'touchmove',
  (e: TouchEvent) => {
    if (e.touches.length !== 2) return
    // Prevent scroll while pinching
    e.preventDefault()

    const scale = getTouchDistance(e.touches) / pinchStartDistance
    zoomHourHeight.value = Math.round(
      Math.min(HOUR_HEIGHT_MAX, Math.max(HOUR_HEIGHT_MIN, pinchStartHourHeight * scale)),
    )
  },
  { passive: false },
)

// ─── Date Navigation ──────────────────────────────────────────────────────────

const _internalDate = ref(props.modelValue ?? new Date())

const currentDate = computed({
  get: () => props.modelValue ?? _internalDate.value,
  set: (val: Date) => {
    _internalDate.value = val
    emit('update:modelValue', val)
  },
})

function prevDay() {
  const d = new Date(currentDate.value)
  d.setDate(d.getDate() - 1)
  currentDate.value = d
}

function nextDay() {
  const d = new Date(currentDate.value)
  d.setDate(d.getDate() + 1)
  currentDate.value = d
}

const headerTitle = computed(() => {
  switch (currentDate.value.getDate()) {
    case new Date().getDate():
      return 'Today'
    case new Date().getDate() - 1:
      return 'Yesterday'
    case new Date().getDate() + 1:
      return 'Tomorrow'
    default:
      return currentDate.value.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'short',
        day: 'numeric',
      })
  }
})

// ─── Hour Labels ──────────────────────────────────────────────────────────────

const hours = computed(() =>
  Array.from({ length: TOTAL_HOURS.value }, (_, i) => {
    const h = i + START_HOUR.value
    return {
      value: h,
      label:
        h === 0
          ? ''
          : new Date(0, 0, 0, h).toLocaleTimeString('en-US', {
              hour: 'numeric',
              hour12: true,
            }),
    }
  }),
)

// ─── Entry Layout ─────────────────────────────────────────────────────────────

function toMinutes(isoString: string): number {
  const d = new Date(isoString)
  return d.getHours() * 60 + d.getMinutes()
}

function isSameDay(isoString: string, date: Date): boolean {
  const d = new Date(isoString)
  return (
    d.getFullYear() === date.getFullYear() &&
    d.getMonth() === date.getMonth() &&
    d.getDate() === date.getDate()
  )
}

const positionedEntries = computed((): PositionedEntry[] => {
  const dayEntries = props.entries
    .filter((e) => isSameDay(e.start, currentDate.value))
    .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime())

  // ── Step 1: group into overlap clusters ──────────────────────────────────────
  type WithMinutes = { entry: TimeEntry; startMin: number; endMin: number }

  const withMinutes: WithMinutes[] = dayEntries.map((entry) => ({
    entry,
    startMin: toMinutes(entry.start),
    endMin: toMinutes(entry.end),
  }))

  const clusters: WithMinutes[][] = []
  const assigned = new Set<number>()

  for (let i = 0; i < withMinutes.length; i++) {
    if (assigned.has(i)) continue

    const cluster: WithMinutes[] = [withMinutes[i]]
    assigned.add(i)

    let clusterEnd = withMinutes[i].endMin
    for (let j = i + 1; j < withMinutes.length; j++) {
      if (assigned.has(j)) continue
      if (withMinutes[j].startMin < clusterEnd) {
        cluster.push(withMinutes[j])
        assigned.add(j)
        clusterEnd = Math.max(clusterEnd, withMinutes[j].endMin)
      }
    }

    clusters.push(cluster)
  }

  // ── Step 2: assign columns within each cluster ───────────────────────────────
  const result: PositionedEntry[] = []

  for (const cluster of clusters) {
    const columnEnds: number[] = []

    const withCols = cluster.map(({ entry, startMin, endMin }) => {
      let col = columnEnds.findIndex((end) => end <= startMin)
      if (col === -1) {
        col = columnEnds.length
        columnEnds.push(endMin)
      } else {
        columnEnds[col] = endMin
      }
      return { entry, startMin, endMin, col }
    })

    const totalCols = Math.max(columnEnds.length, 1)

    for (const { entry, startMin, endMin, col } of withCols) {
      const clampedStart = Math.max(startMin, START_HOUR.value * 60)
      const clampedEnd = Math.min(endMin, END_HOUR.value * 60)
      const top = ((clampedStart - START_HOUR.value * 60) / 60) * HOUR_HEIGHT.value
      const height = Math.max(((clampedEnd - clampedStart) / 60) * HOUR_HEIGHT.value, 24)
      result.push({ entry, top, height, col, totalCols })
    }
  }

  return result
})

// ─── Entry style ─────────────────────────────────────────────────────────────

function entryStyle(item: PositionedEntry): Record<string, string> {
  const GAP = -8
  const colW = `calc((100% - ${(item.totalCols - 1) * GAP}px) / ${item.totalCols})`
  const colL = `calc(${item.col} * ((100% - ${(item.totalCols - 1) * GAP}px) / ${item.totalCols} + ${GAP}px))`

  return {
    position: 'absolute',
    top: `${item.top}px`,
    height: `${item.height}px`,
    width: colW,
    left: colL,
  }
}
</script>

<template>
  <div
    class="flex flex-col h-full w-full overflow-hidden bg-background text-foreground select-none"
  >
    <!-- ── Header ──────────────────────────────────────────────────────────── -->
    <slot
      name="header"
      :date="currentDate"
      :title="headerTitle"
      :prev-day="prevDay"
      :next-day="nextDay"
    >
      <div
        class="flex items-center justify-between px-4 py-3 bg-sidebar border-b border-border shrink-0"
      >
        <Button variant="ghost" size="icon-lg" @click="prevDay" aria-label="Previous day"
          ><Icon icon="tabler:chevron-left" class="size-6"
        /></Button>

        <h1 class="text-lg font-bold tracking-tight">{{ headerTitle }}</h1>

        <Button variant="ghost" size="icon-lg" @click="nextDay" aria-label="Next day"
          ><Icon icon="tabler:chevron-right" class="size-6"
        /></Button>
      </div>
    </slot>

    <!-- ── Time Grid (pinch target) ────────────────────────────────────────── -->
    <div ref="gridRef" class="flex flex-1 overflow-y-auto overflow-x-hidden touch-pan-y">
      <!-- Hour labels column -->
      <div
        class="shrink-0 w-14 relative"
        :style="{ height: `${TOTAL_HEIGHT}px` }"
        aria-hidden="true"
      >
        <div
          v-for="hour in hours"
          :key="hour.value"
          class="absolute right-0 flex items-start pr-2 border-r border-border"
          :style="{
            top: `${(hour.value - START_HOUR) * HOUR_HEIGHT}px`,
            height: `${HOUR_HEIGHT}px`,
          }"
        >
          <span class="text-[11px] text-muted-foreground -translate-y-[7px]">
            {{ hour.label }}
          </span>
        </div>
      </div>

      <!-- Grid lines + events column -->
      <div class="relative flex-1">
        <!-- Hour divider lines -->
        <div
          :style="{ height: `${TOTAL_HEIGHT}px` }"
          class="absolute inset-x-0 top-0 pointer-events-none"
          aria-hidden="true"
        >
          <div
            v-for="hour in hours"
            :key="hour.value"
            class="absolute inset-x-0 border-t border-border/50"
            :style="{ top: `${(hour.value - START_HOUR) * HOUR_HEIGHT}px` }"
          />
          <div
            v-for="hour in hours"
            :key="`half-${hour.value}`"
            class="absolute inset-x-0 border-t border-border/25 border-dashed"
            :style="{ top: `${(hour.value - START_HOUR) * HOUR_HEIGHT + HOUR_HEIGHT / 2}px` }"
          />
        </div>

        <!-- Events layer -->
        <div class="absolute inset-x-1" :style="{ height: `${TOTAL_HEIGHT}px` }">
          <div
            v-for="item in positionedEntries"
            :key="item.entry.id"
            :style="entryStyle(item)"
            class="cursor-pointer"
            @click="emit('entry-click', item.entry)"
          >
            <slot
              name="event"
              :entry="item.entry"
              :height="item.height"
              :is-short="item.height < 48"
            >
              <!-- Default card -->
              <div
                class="h-full w-full rounded-md bg-primary/15 border border-primary/30 px-2 py-1 overflow-hidden"
              >
                <p class="text-xs font-semibold leading-tight truncate text-primary">
                  {{ item.entry.title }}
                </p>
                <p
                  v-if="item.height >= 48"
                  class="text-[10px] text-muted-foreground mt-0.5 truncate"
                >
                  {{
                    new Date(item.entry.start).toLocaleTimeString('en-US', {
                      hour: 'numeric',
                      minute: '2-digit',
                      hour12: true,
                    })
                  }}
                  –
                  {{
                    new Date(item.entry.end).toLocaleTimeString('en-US', {
                      hour: 'numeric',
                      minute: '2-digit',
                      hour12: true,
                    })
                  }}
                </p>
              </div>
            </slot>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
