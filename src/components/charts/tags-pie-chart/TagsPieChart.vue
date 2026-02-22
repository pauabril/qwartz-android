<script setup lang="ts">
import type { ChartConfig } from '@/components/ui/chart'

import { Donut } from '@unovis/ts'
import { VisDonut, VisSingleContainer } from '@unovis/vue'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  componentToString,
} from '@/components/ui/chart'

const description = 'A simple pie chart'

interface Data {
  tag: string
  hours: number
  fill: string
}

const props = defineProps<{
  chartData: Data[]
}>()

const chartConfig = {
  hours: {
    label: 'Hours',
    color: undefined,
  },
  tag: {
    label: 'Tag',
    color: undefined,
  },
} satisfies ChartConfig
</script>

<template>
  <ChartContainer :config="chartConfig" class="mx-auto aspect-square max-h-[192px]">
    <VisSingleContainer :data="props.chartData">
      <VisDonut
        :value="(d: Data) => d.hours"
        :color="(d: Data) => d.fill"
        :arc-width="30"
        :angle-range="[0, -2 * Math.PI]"
      />
    </VisSingleContainer>
  </ChartContainer>
</template>
