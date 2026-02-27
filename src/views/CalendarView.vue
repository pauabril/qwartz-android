<script setup lang="ts">
import { computed, ref } from 'vue'
import { RouterLink } from 'vue-router'

import { Button } from '@/components/ui/button'
import { CalendarCard } from '@/components/calendar/calendar-card'
import { DayCalendar } from '@/components/calendar/day-calendar'
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

const entries = [
  {
    id: '1',
    title: 'Develop new feature',
    start: new Date('2026-02-22T09:00:00+01:00').toISOString(),
    end: new Date('2026-02-22T11:45:00+01:00').toISOString(),
    tags: ['work'],
  },
  {
    id: '2',
    title: 'Team meeting',
    start: new Date('2026-02-22T12:00:00+01:00').toISOString(),
    end: new Date('2026-02-22T14:30:00+01:00').toISOString(),
    tags: ['work', 'meeting'],
  },
  {
    id: '3',
    title: 'Fix login bug',
    start: new Date('2026-02-22T13:30:00+01:00').toISOString(),
    end: new Date('2026-02-22T15:30:00+01:00').toISOString(),
    tags: ['work', 'important'],
  },
  {
    id: '4',
    title: 'Buy groceries',
    start: new Date('2026-02-22T15:00:00+01:00').toISOString(),
    end: new Date('2026-02-22T16:45:00+01:00').toISOString(),
    tags: ['personal', 'errands'],
  },
]

const selectedDate = ref(new Date('2026-02-22'))

const drawerData = ref<(typeof entries)[number] | null>(null)
const drawerOpen = computed({
  get: () => drawerData.value !== null,
  set: (val: boolean) => {
    if (!val) drawerData.value = null
  },
})

const handleDuplicate = (id: string) => {
  alert(`Unimplemented`)
  drawerOpen.value = false
}
const handleDelete = (id: string) => {
  alert(`Unimplemented`)
  drawerOpen.value = false
}
</script>

<template>
  <DayCalendar :entries="entries" v-model="selectedDate">
    <template #event="{ entry, isShort, height }">
      <!-- <pre class="absolute left-0 top-0 text-xs text-muted-foreground pointer-events-none">{{
        height
      }}</pre> -->
      <CalendarCard
        _time-entry="{
          id: calendarEvent.id.toString(),
          title: calendarEvent.title || '',
          tags: calendarEvent.tags,
        }"
        :time-entry="entry"
        :height="height"
        @long-press="drawerData = entry"
      />
    </template>
  </DayCalendar>

  <Drawer v-model:open="drawerOpen">
    <DrawerContent>
      <DrawerHeader>
        <DrawerTitle>{{ drawerData?.title }}</DrawerTitle>
        <div class="flex gap-2">
          <span
            v-for="tag in drawerData?.tags"
            :key="tag"
            class="bg-gray-200 text-gray-800 px-2 py-1 rounded-full text-xs"
          >
            {{ tag }}
          </span>
        </div>
      </DrawerHeader>
      <div class="px-4">
        <Separator />
      </div>

      <DrawerFooter>
        <Button
          :as="RouterLink"
          :to="{ name: 'edit-time-entry', params: { id: drawerData?.id || '-' } }"
          size="lg"
          variant="secondary"
          >Edit</Button
        >
        <Button size="lg" variant="secondary" @click="handleDuplicate(drawerData?.id ?? '')"
          >Duplicate</Button
        >
        <Separator />
        <Button
          size="lg"
          variant="secondary"
          class="text-destructive"
          @click="handleDelete(drawerData?.id ?? '')"
          >Delete</Button
        >
      </DrawerFooter>
    </DrawerContent>
  </Drawer>
</template>
