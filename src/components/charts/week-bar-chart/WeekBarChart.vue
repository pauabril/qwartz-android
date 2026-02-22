<script setup lang="ts">
import type { ChartConfig } from '@/components/ui/chart'

import { VisAxis, VisGroupedBar, VisXYContainer } from '@unovis/vue'
import { TrendingUp } from 'lucide-vue-next'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  ChartContainer,
  ChartCrosshair,
  ChartTooltip,
  ChartTooltipContent,
  componentToString,
} from '@/components/ui/chart'

interface Data {
  date: string
  hours: number
}

const props = defineProps<{
  chartData: Data[]
}>()

const chartConfig = {
  hours: {
    label: 'Desktop',
    color: 'var(--chart-1)',
  },
} satisfies ChartConfig
</script>

<template>
  <ChartContainer :config="chartConfig">
    <VisXYContainer :data="props.chartData" :y-domain="[0, undefined]">
      <VisGroupedBar
        :x="(d: Data) => d.date"
        :y="(d: Data) => d.hours"
        :color="chartConfig.hours.color"
        :rounded-corners="10"
      />
      <VisAxis
        type="x"
        :x="(d: Data) => d.date"
        :tick-line="false"
        :domain-line="false"
        :grid-line="false"
        :num-ticks="6"
        :tick-format="
          (d: number) => {
            const date = new Date(d)
            return date.toLocaleDateString('en-US', {
              weekday: 'short',
            })
          }
        "
        :tick-values="props.chartData.map((d) => d.date)"
      />
      <VisAxis
        type="y"
        :num-ticks="3"
        :tick-line="false"
        :domain-line="false"
        :tick-format="(d: number) => d + 'h'"
      />
    </VisXYContainer>
  </ChartContainer>
</template>
