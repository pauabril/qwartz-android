<script setup lang="ts">
import { computed } from 'vue'

interface DayCell {
  date: Date | null
  hours: number | null
}

const props = defineProps<{
  chartData: { date: Date | string; hours: number }[]
  year?: number
  squareSize?: number
}>()

const year =
  props.year ??
  (props.chartData.length
    ? new Date(props.chartData[0].date).getFullYear()
    : new Date().getFullYear())
const startOfYear = new Date(year, 0, 1)
const daysInYear = Math.round(
  (new Date(year + 1, 0, 1).getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24),
)
const firstDay = startOfYear.getDay() // 0 = Sun

const dataMap = new Map<string, number>()
props.chartData.forEach((d) => {
  const dt = typeof d.date === 'string' ? new Date(d.date) : d.date
  const key = dt.toISOString().slice(0, 10)
  dataMap.set(key, d.hours)
})

const weeks = Math.ceil((firstDay + daysInYear) / 7)

const cells = computed<DayCell[]>(() => {
  const arr: DayCell[] = []
  for (let col = 0; col < weeks; col++) {
    for (let row = 0; row < 7; row++) {
      const dayNumber = col * 7 + row - firstDay + 1
      if (dayNumber >= 1 && dayNumber <= daysInYear) {
        const d = new Date(year, 0, dayNumber)
        const key = d.toISOString().slice(0, 10)
        arr.push({ date: d, hours: dataMap.get(key) ?? 0 })
      } else {
        arr.push({ date: null, hours: null })
      }
    }
  }
  return arr
})

const maxHours = Math.max(...props.chartData.map((d) => d.hours), 1)
const intensity = (h: number | null) => {
  if (h === null || h === 0) return 0
  return Math.max(0, Math.min(1, h / maxHours))
}

const weekdayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
</script>

<template>
  <div class="flex flex-row overflow-x-auto">
    <div
      _v-if="props.showWeekdays !== false"
      class="flex flex-col text-xs text-muted-foreground pr-1 sticky left-0 bg-card/75 bg-linear-to-r from-card to-transparent"
    >
      <div
        class="h-full text-end flex items-center justify-center"
        v-for="w in weekdayLabels"
        :key="w"
      >
        {{ w }}
      </div>
    </div>

    <div class="w-full">
      <div
        class="inline-grid grid-flow-col gap-1"
        :style="{
          gridAutoColumns: 'calc(var(--spacing) * 6)',
          gridTemplateRows: 'repeat(7, calc(var(--spacing) * 6))',
        }"
      >
        <div
          v-for="(cell, idx) in cells"
          :key="idx"
          class="rounded-sm size-6"
          :title="cell.date ? `${cell.date.toLocaleDateString()} — ${cell.hours}h` : ''"
          :style="{
            backgroundColor:
              cell.hours === null
                ? 'transparent'
                : `color-mix(var(--chart-3) ${intensity(cell.hours) * 100}%, transparent)`,
          }"
          :class="{
            'border border-border': cell.date,
          }"
        />
      </div>
    </div>
  </div>
  <div class="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
    <div class="flex items-center gap-4 w-full">
      <div>0h</div>
      <div
        class="flex-1 h-2 bg-linear-to-r from-transparent to-chart-3 rounded-sm border border-border"
      />
      <div>{{ maxHours }}h</div>
    </div>
  </div>
</template>
