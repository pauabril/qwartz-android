<script setup lang="ts">
import { computed } from 'vue'

interface DayData {
  date: Date | null
  hours: number | null
}

const props = defineProps<{
  chartData: { date: Date | string; hours: number }[]
  month?: Date
  showWeekdays?: boolean
}>()

const month = props.month ? new Date(props.month) : new Date()
const year = month.getFullYear()
const monthIndex = month.getMonth()

const dataMap = new Map<string, number>()
props.chartData.forEach((d) => {
  const dt = typeof d.date === 'string' ? new Date(d.date) : d.date
  const key = dt.toISOString().slice(0, 10)
  dataMap.set(key, d.hours)
})

const daysInMonth = new Date(year, monthIndex + 1, 0).getDate()
const firstDay = new Date(year, monthIndex, 0).getDay() // 0=Sun
const cells = computed<DayData[]>(() => {
  const leading = firstDay
  // compute rows to fill full weeks
  const total = Math.ceil((leading + daysInMonth) / 7) * 7
  const arr: DayData[] = []
  for (let i = 0; i < total; i++) {
    const dayIndex = i - leading + 1
    if (dayIndex >= 1 && dayIndex <= daysInMonth) {
      const d = new Date(year, monthIndex, dayIndex)
      const key = d.toISOString().slice(0, 10)
      arr.push({ date: d, hours: dataMap.get(key) ?? 0 })
    } else {
      arr.push({ date: null, hours: null })
    }
  }
  return arr
})

const maxHours = Math.max(...props.chartData.map((d) => d.hours), 1)

const intensity = (hours: number | null) => {
  if (hours === null || hours === 0) return 0
  return Math.max(0, Math.min(1, hours / maxHours))
}

const weekdayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
</script>

<template>
  <div class="text-muted-foreground text-sm">
    <div v-if="props.showWeekdays !== false" class="flex gap-1 text-xs text-muted-foreground mb-2">
      <div class="w-full text-start" v-for="w in weekdayLabels" :key="w">{{ w }}</div>
    </div>

    <div class="grid gap-1" :style="{ gridTemplateColumns: 'repeat(7, 1fr)' }">
      <div
        v-for="(cell, idx) in cells"
        :key="idx"
        class="relative rounded-sm h-10 flex items-start justify-start p-1 text-xs"
        :title="cell.date ? `${cell.date.toLocaleDateString()} - ${cell.hours}h` : ''"
        :style="{
          backgroundColor:
            cell.hours === null
              ? 'transparent'
              : `color-mix(var(--chart-2) ${intensity(cell.hours) * 100}%, transparent)`,
        }"
        :class="{
          'border border-border': cell.date,
        }"
      >
        <div v-if="cell.date" class="text-xs text-foreground">{{ cell.date.getDate() }}</div>
      </div>
    </div>

    <div class="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
      <div class="flex items-center gap-4 w-full">
        <div>0h</div>
        <div
          class="flex-1 h-2 bg-linear-to-r from-transparent to-chart-2 rounded-sm border border-border"
        />
        <div>{{ maxHours }}h</div>
      </div>
    </div>
  </div>
</template>
