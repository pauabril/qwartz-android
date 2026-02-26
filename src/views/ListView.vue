<script setup lang="ts">
import { ref, computed } from 'vue'
import { RouterLink, useRouter } from 'vue-router'

import { uuid } from '@tanstack/vue-form'

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
import ListDateSeparator from '@/components/list/list-date-separator/ListDateSeparator.vue'
import { SwipableTimeEntryCard } from '@/components/list/time-entry-card'

const router = useRouter()

interface TimeEntry {
  id: string
  title: string
  tags: string[]
  time: string
  date: Date
}

const timeEntries = ref<TimeEntry[]>([
  {
    id: '5',
    title: 'Read a book',
    tags: ['leisure', 'education'],
    time: '02:00:00',
    date: new Date('2026-01-05'),
  },
  {
    id: '4',
    title: 'Morning workout',
    tags: ['health', 'fitness'],
    time: '01:00:00',
    date: new Date('2026-01-04'),
  },
  {
    id: '3',
    title: 'Finish project report',
    tags: ['work', 'urgent'],
    time: '02:30:00',
    date: new Date('2026-01-05'),
  },
  {
    id: '2',
    title: 'Walk the dog',
    tags: ['personal', 'pets'],
    time: '00:45:00',
    date: new Date('2026-01-04'),
  },
  {
    id: '1',
    title: 'Buy groceries',
    tags: ['personal', 'errands'],
    time: '01:23:45',
    date: new Date('2026-01-04'),
  },
  {
    id: 'ae95ac69-ddfd-4e9a-86ac-5a673d5324b6',
    title:
      'Entry with a very long title that should be truncated with an ellipsis and should not overflow the card or cause layout issues even if it exceeds the available space significantly and continues on multiple lines to test the robustness of the UI design and ensure that it remains visually appealing and functional across different screen sizes and orientations without breaking the layout or causing any unintended side effects on other elements within the card component or the overall list view that contains it and to verify that the text truncation logic works correctly and gracefully handles edge cases such as extremely long words or lack of spaces which could potentially cause overflow issues if not handled properly and to ensure that the user experience remains smooth and consistent regardless of the content length or complexity while maintaining readability and accessibility standards for all users including those with visual impairments or using assistive technologies and to confirm that the card component can dynamically adjust its layout and styling to accommodate varying content lengths without compromising the overall design integrity or usability of the application and to validate that the implementation of text truncation with ellipsis is consistent across different browsers and platforms ensuring a seamless experience for all users regardless of their choice of device or browser while also adhering to best practices for responsive design and accessibility guidelines to create an inclusive and user-friendly interface that effectively communicates information while maintaining a visually appealing and functional design across all use cases and scenarios that may arise in real-world applications where content length can vary significantly and unpredictably',
    tags: ['work', 'important'],
    time: '08:00:00',
    date: new Date('2026-01-03'),
  },
  {
    id: 'f35f0f36-6592-4f40-91c7-854560450ae7',
    title: 'Call the dentist',
    tags: ['personal'],
    time: '00:32:10',
    date: new Date('2026-01-02'),
  },
  {
    id: '033a202e-cfd3-427b-bfa7-13afdcef1247',
    title: 'Develop new feature',
    tags: ['work'],
    time: '04:15:13',
    date: new Date('2026-01-02'),
  },
  {
    id: 'a36be327-7e5a-4076-a9d9-651f8ad8d67a',
    title: 'Fix login bug',
    tags: ['work'],
    time: '06:45:00',
    date: new Date('2026-01-01'),
  },
  {
    id: 'b47c8e9d-2f1a-4c3b-9e5d-8f9a7b6c5d4e',
    title: 'Plan weekend trip',
    tags: ['personal', 'leisure'],
    time: '03:20:00',
    date: new Date('2025-12-31'),
  },
])

const sortedAndGroupedTimeEntries = computed(() => {
  // Sort items by date (newest first)
  const sorted = [...timeEntries.value].sort((a, b) => b.date.getTime() - a.date.getTime())

  // Group items by date
  const groups: { [date: string]: TimeEntry[] } = {}
  sorted.forEach((item) => {
    const dateKey = item.date.toISOString()
    if (!groups[dateKey]) {
      groups[dateKey] = []
    }
    groups[dateKey].push(item)
  })

  return groups
})

function handleDeleteTimeEntry(id: string) {
  // TODO: show confirmation dialog before deleting
  timeEntries.value = timeEntries.value.filter((i) => i.id !== id)
}

function handleDuplicateTimeEntry(id: string) {
  const original = timeEntries.value.find((i) => i.id === id)
  if (!original) return
  const index = timeEntries.value.indexOf(original)
  timeEntries.value.splice(index + 1, 0, { ...original, id: uuid() })
}
</script>

<template>
  <div class="flex flex-col gap-4 p-2 py-4 overflow-x-hidden">
    <template v-for="(items, date) in sortedAndGroupedTimeEntries" :key="date">
      <ListDateSeparator
        :label="
          new Date(date).toLocaleString('default', {
            weekday: 'short',
            day: 'numeric',
            month: 'short',
          })
        "
        :time="items[0]!.time"
        :header="
          // only show header if there is a month change between the current item and the previous one
          new Date(date).getMonth() !==
          new Date(Object.keys(sortedAndGroupedTimeEntries)[0]!).getMonth()
            ? {
                label: new Date(date).toLocaleString('default', { month: 'long', year: 'numeric' }),
                time: '',
              }
            : undefined
        "
      />

      <SwipableTimeEntryCard
        v-for="item in items"
        :key="item.id"
        :item-id="item.id"
        :time-entry="item"
        @delete="handleDeleteTimeEntry(item.id)"
        @duplicate="handleDuplicateTimeEntry(item.id)"
      />
    </template>

    <ListDateSeparator
      label="Debug Menu"
      time="00:00:00"
      :header="{
        label: 'Debug Menu',
        time: '00:00:00',
      }"
    />

    <Card class="border-dashed border-teal-400 text-teal-900 dark:text-teal-100">
      <CardContent class="flex flex-row">
        <div class="flex flex-col gap-2">
          <h1 class="text-lg font-bold">Debug Card</h1>
          <div class="flex gap-2 mt-2">
            <span class="bg-teal-200 text-teal-800 px-2 py-1 rounded-full text-xs">
              Testing only
            </span>
          </div>
        </div>
        <div class="flex items-center justify-end gap-2 ml-auto">
          00:00:00
          <Drawer>
            <DrawerTrigger>
              <Button variant="ghost" size="icon-lg"
                ><Icon icon="tabler:dots" class="size-6"
              /></Button>
            </DrawerTrigger>
            <DrawerContent class="border border-dashed border-teal-400">
              <DrawerHeader>
                <DrawerTitle>Debug Menu</DrawerTitle>
              </DrawerHeader>
              <div class="px-4">
                <Separator />
              </div>

              <DrawerFooter>
                <Button
                  :as="RouterLink"
                  :to="{ name: 'onboarding-root' }"
                  size="lg"
                  variant="secondary"
                  >Onboarding</Button
                >
                <Button :as="RouterLink" :to="{ name: 'login' }" size="lg" variant="secondary"
                  >Login</Button
                >
                <Button :as="RouterLink" :to="{ name: 'root' }" size="lg" variant="secondary"
                  >Root</Button
                >
                <Button :as="RouterLink" :to="{ name: 'test' }" size="lg" variant="secondary"
                  >Swipe</Button
                >
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
