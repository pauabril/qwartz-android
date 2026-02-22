<script setup lang="ts">
import { ref, computed } from 'vue'
import WeekBarChart from '@/components/charts/week-bar-chart/WeekBarChart.vue'
import TagsPieChart from '@/components/charts/tags-pie-chart/TagsPieChart.vue'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

const weekData = [
  { date: new Date('2026-01-05'), hours: 7.5 },
  { date: new Date('2026-01-06'), hours: 6 },
  { date: new Date('2026-01-07'), hours: 7.5 },
  { date: new Date('2026-01-08'), hours: 8 },
  { date: new Date('2026-01-09'), hours: 3 },
  { date: new Date('2026-01-10'), hours: 0 },
  { date: new Date('2026-01-11'), hours: 0 },
]
const weekTotal = computed(() => weekData.reduce((acc, curr) => acc + curr.hours, 0))

const tagsData = [
  { tag: 'Tag 01', hours: 16, fill: 'var(--chart-1)' },
  { tag: 'Tag 02', hours: 11, fill: 'var(--chart-2)' },
  { tag: 'Tag 03', hours: 5, fill: 'var(--chart-3)' },
]
const tagsTotal = computed(() => tagsData.reduce((acc, curr) => acc + curr.hours, 0))
</script>

<template>
  <div class="flex flex-col gap-4 p-2">
    <Card>
      <CardHeader>
        <CardTitle>Hours tracked</CardTitle>
        <CardDescription>Total: {{ weekTotal }}h</CardDescription>
      </CardHeader>
      <CardContent>
        <WeekBarChart :chartData="weekData" />
      </CardContent>
    </Card>

    <Card>
      <CardHeader>
        <CardTitle>Tags distribution</CardTitle>
        <CardDescription
          >Group by <span class="text-foreground underline">Tag</span></CardDescription
        >
      </CardHeader>
      <CardContent>
        <TagsPieChart :chartData="tagsData" />
      </CardContent>
      <CardFooter class="flex-col items-start gap-4">
        <div v-for="tag in tagsData" :key="tag.tag" class="flex flex-col w-full gap-2">
          <div class="w-full flex items-center justify-between">
            <div
              class="rounded-sm w-max text-white px-2 py-1 text-xs"
              :style="{
                backgroundColor: tag.fill,
              }"
            >
              {{ tag.tag }}
            </div>

            <div class="text-sm text-muted-foreground">{{ tag.hours }}h</div>
          </div>

          <!-- progress -->
          <div class="w-full h-1.5 bg-muted rounded-full">
            <div
              class="h-full rounded-full"
              :style="{ width: `${(tag.hours / tagsTotal) * 100}%`, backgroundColor: tag.fill }"
            ></div>
          </div>
        </div>
      </CardFooter>
    </Card>
  </div>
</template>
