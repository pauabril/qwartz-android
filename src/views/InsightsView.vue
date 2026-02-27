<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import WeekBarChart from '@/components/charts/week-bar-chart/WeekBarChart.vue'
import TagsPieChart from '@/components/charts/tags-pie-chart/TagsPieChart.vue'

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
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer'
import { Separator } from '@/components/ui/separator'
import { MonthHeatmap } from '@/components/charts/month-heatmap'

const weekData = [
  { date: new Date('2026-01-05'), hours: 7.5, fill: 'var(--chart-1)' },
  { date: new Date('2026-01-06'), hours: 6, fill: 'var(--chart-2)' },
  { date: new Date('2026-01-07'), hours: 7.5, fill: 'var(--chart-3)' },
  { date: new Date('2026-01-08'), hours: 8, fill: 'var(--chart-4)' },
  { date: new Date('2026-01-09'), hours: 3, fill: 'var(--chart-5)' },
  { date: new Date('2026-01-10'), hours: 0, fill: 'var(--color-teal-500)' },
  { date: new Date('2026-01-11'), hours: 0, fill: 'var(--color-purple-500)' },
]
const weekTotal = computed(() => weekData.reduce((acc, curr) => acc + curr.hours, 0))

// ─────────────────────────────────────────────────────────────────────────────

const monthData = Array.from({ length: 27 }, (_, i) => ({
  date: new Date(`2026-01-${i + 5}`),
  hours: Math.floor(Math.random() * 8),
  fill: `var(--chart-${(i % 5) + 1})`,
}))
const monthTotal = computed(() => monthData.reduce((acc, curr) => acc + curr.hours, 0))

// ─────────────────────────────────────────────────────────────────────────────

const tagsData = [
  { tag: 'Tag 01', hours: 16, fill: 'var(--chart-1)' },
  { tag: 'Tag 02', hours: 11, fill: 'var(--chart-2)' },
  { tag: 'Tag 03', hours: 5, fill: 'var(--chart-3)' },
]
const tagsTotal = computed(() => tagsData.reduce((acc, curr) => acc + curr.hours, 0))

// ─────────────────────────────────────────────────────────────────────────────

const distributionTypesMap = {
  tag: { label: 'Tag' },
  day: { label: 'Day' },
  week: { label: 'Week' },
  month: { label: 'Month' },
}
const activeDistributionType = ref<keyof typeof distributionTypesMap>('tag')
watch(activeDistributionType, () => {
  if (['week', 'month'].includes(activeDistributionType.value)) {
    alertUnimplemented()
  }
})
const distributionDrawerOpen = ref(false)

// ─────────────────────────────────────────────────────────────────────────────

const piechartInfo = computed(() => {
  switch (activeDistributionType.value) {
    case 'tag':
      return {
        total: tagsTotal.value,
        data: tagsData,
      }
    case 'day':
      return {
        total: weekTotal.value,
        data: weekData.map((day) => ({
          tag: day.date.toLocaleDateString('en-US', { weekday: 'long' }),
          hours: day.hours,
          fill: day.fill,
        })),
      }

    default:
      return {
        total: 0,
        data: [],
      }
  }
})

// ─────────────────────────────────────────────────────────────────────────────

const prevDay = () => {
  alertUnimplemented()
}
const nextDay = () => {
  alertUnimplemented()
}

const selectedView = ref<'week' | 'month' | 'year'>('week')
const viewSelectorOpen = ref(false)
const headerTitle = computed(() => {
  switch (selectedView.value) {
    case 'week':
      return 'This week'
    case 'month':
      return 'This month'
    case 'year':
      return 'This year'
  }
})

const alertUnimplemented = () => {
  alert('Unimplemented')
}
</script>

<template>
  <div class="flex flex-col h-full bg-background text-foreground">
    <div
      class="flex items-center justify-between px-4 py-3 bg-sidebar border-b border-border shrink-0"
    >
      <Button variant="ghost" size="icon-lg" @click="prevDay" aria-label="Previous day"
        ><Icon icon="tabler:chevron-left" class="size-6"
      /></Button>

      <Drawer v-model:open="viewSelectorOpen">
        <DrawerTrigger>
          <Button as="h1" class="text-lg font-bold tracking-tight" variant="link" size="lg">
            {{ headerTitle }} <Icon icon="tabler:chevron-down" class="size-6" />
          </Button>
        </DrawerTrigger>

        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Date range</DrawerTitle>
          </DrawerHeader>
          <div class="px-4">
            <Separator />
          </div>

          <DrawerFooter>
            <Button
              size="lg"
              variant="secondary"
              :disabled="selectedView === 'week'"
              @click="
                () => {
                  selectedView = 'week'
                  viewSelectorOpen = false
                }
              "
            >
              This week
            </Button>
            <Button
              size="lg"
              variant="secondary"
              :disabled="selectedView === 'month'"
              @click="
                () => {
                  selectedView = 'month'
                  viewSelectorOpen = false
                }
              "
            >
              This month
            </Button>
            <Button
              size="lg"
              variant="secondary"
              :disabled="selectedView === 'year'"
              @click="
                () => {
                  selectedView = 'year'
                  viewSelectorOpen = false
                }
              "
            >
              This year
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>

      <Button variant="ghost" size="icon-lg" @click="nextDay" aria-label="Next day"
        ><Icon icon="tabler:chevron-right" class="size-6"
      /></Button>
    </div>

    <div class="flex flex-col gap-4 p-2 h-full overflow-x-hidden overflow-y-scroll">
      <Card v-if="selectedView === 'week'">
        <CardHeader>
          <CardTitle>Hours tracked</CardTitle>
          <CardDescription>Total: {{ weekTotal }}h</CardDescription>
        </CardHeader>
        <CardContent>
          <WeekBarChart :chartData="weekData" />
        </CardContent>
      </Card>

      <Card v-else-if="selectedView === 'month'">
        <CardHeader>
          <CardTitle>Hours tracked</CardTitle>
          <CardDescription>Total: {{ monthTotal }}h</CardDescription>
        </CardHeader>
        <CardContent>
          <MonthHeatmap :chartData="monthData" :month="monthData[0].date" :show-weekdays="true" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Tags distribution</CardTitle>

          <Drawer v-model:open="distributionDrawerOpen">
            <CardDescription
              >Group by
              <DrawerTrigger>
                <Button variant="link" class="p-0! h-max w-max gap-0.5">
                  {{ distributionTypesMap[activeDistributionType].label }}
                  <Icon icon="tabler:chevron-down" class="size-4" />
                </Button>
              </DrawerTrigger>
            </CardDescription>

            <DrawerContent>
              <DrawerHeader>
                <DrawerTitle>Group by</DrawerTitle>
              </DrawerHeader>
              <div class="px-4">
                <Separator />
              </div>

              <DrawerFooter>
                <Button
                  v-for="(type, typeKey) in distributionTypesMap"
                  :key="typeKey"
                  size="lg"
                  variant="secondary"
                  :disabled="typeKey === activeDistributionType"
                  @click="
                    () => {
                      activeDistributionType = typeKey
                      distributionDrawerOpen = false
                    }
                  "
                >
                  {{ type.label }}
                </Button>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
        </CardHeader>

        <CardContent>
          <TagsPieChart :chartData="piechartInfo.data" />
        </CardContent>
        <CardFooter class="flex-col items-start gap-4">
          <div v-for="tag in piechartInfo.data" :key="tag.tag" class="flex flex-col w-full gap-2">
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
                :style="{
                  width: `${(tag.hours / piechartInfo.total) * 100}%`,
                  backgroundColor: tag.fill,
                }"
              ></div>
            </div>
          </div>
        </CardFooter>
      </Card>
    </div>
  </div>
</template>
