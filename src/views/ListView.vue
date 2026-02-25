<script setup lang="ts">
import { ref, computed } from 'vue'

import { RouterLink, useRouter } from 'vue-router'

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

const router = useRouter()

const items = ref<Array<{ id: number; name: string; tags?: string[] }>>([
  { id: 1, name: 'Item One', tags: ['tag1', 'tag2'] },
  { id: 2, name: 'Item Two', tags: ['tag3'] },
  { id: 3, name: 'Item Three' },
  { id: 1, name: 'Item One', tags: ['tag1', 'tag2'] },
  { id: 2, name: 'Item Two', tags: ['tag3'] },
  { id: 3, name: 'Item Three', tags: ['tag4', 'tag5'] },
  { id: 1, name: 'Item One', tags: ['tag1', 'tag2'] },
  { id: 2, name: 'Item Two', tags: ['tag3'] },
  { id: 3, name: 'Item Three', tags: ['tag4', 'tag5'] },
  { id: 1, name: 'Item One', tags: ['tag1', 'tag2'] },
  { id: 2, name: 'Item Two' },
  { id: 3, name: 'Item Three', tags: ['tag4', 'tag5'] },
  { id: 1, name: 'Item One', tags: ['tag1', 'tag2'] },
  { id: 2, name: 'Item Two', tags: ['tag3'] },
  { id: 3, name: 'Item Three' },
])

const timeEntries = ref([
  {
    id: 1,
    title: 'Mock Time Entry',
    tags: ['work', 'project1'],
    start: new Date('2026-01-01T09:00:00'),
    end: new Date('2026-01-01T12:34:56'),
  },
])
</script>

<template>
  <div class="flex flex-col gap-4 p-2">
    <Card v-for="entry in timeEntries" :key="entry.id">
      <CardContent class="flex flex-row">
        <div class="flex flex-col gap-2">
          <h1 class="text-lg font-bold">{{ entry.title }}</h1>
          <div class="flex gap-2 mt-2">
            <span
              v-for="tag in entry.tags"
              :key="tag"
              class="bg-gray-200 text-gray-800 px-2 py-1 rounded-full text-xs"
            >
              {{ tag }}
            </span>
          </div>
        </div>
        <div class="flex items-center justify-end gap-2 ml-auto">
          {{ new Date(entry.end.getTime() - entry.start.getTime()).toISOString().substr(11, 8) }}
          <Drawer>
            <DrawerTrigger>
              <Button variant="ghost" size="icon-lg"
                ><Icon icon="tabler:dots" class="size-6"
              /></Button>
            </DrawerTrigger>
            <DrawerContent>
              <DrawerHeader>
                <DrawerTitle>{{ entry.title }}</DrawerTitle>
                <div class="flex gap-2">
                  <span
                    v-for="tag in entry.tags"
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
                  :to="{ name: 'new-time-entry', params: { id: entry.id } }"
                  size="lg"
                  variant="secondary"
                  >Edit</Button
                >
                <Button size="lg" variant="secondary">Duplicate</Button>
                <Separator />
                <Button size="lg" variant="secondary" class="text-destructive">Delete</Button>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
        </div>
      </CardContent>
    </Card>

    <!-- ----------------------------------------------------------------------------------- -->
    <Separator />
    <!-- ----------------------------------------------------------------------------------- -->

    <div class="flex flex-row items-center justify-center gap-4 mr-4">
      <Card v-for="entry in timeEntries" :key="entry.id" class="w-full">
        <CardContent class="flex flex-row">
          <div class="flex flex-col gap-2">
            <h1 class="text-lg font-bold line-clamp-1">{{ entry.title }}</h1>
            <div class="flex gap-2 mt-2">
              <span
                v-for="tag in entry.tags"
                :key="tag"
                class="bg-gray-200 text-gray-800 px-2 py-1 rounded-full text-xs"
              >
                {{ tag }}
              </span>
            </div>
          </div>
          <div class="flex items-center justify-end gap-2 ml-auto">
            {{ new Date(entry.end.getTime() - entry.start.getTime()).toISOString().substr(11, 8) }}
            <Button variant="ghost" size="icon-lg"
              ><Icon icon="tabler:dots" class="size-6"
            /></Button>
          </div>
        </CardContent>
      </Card>

      <Button variant="link" size="icon-lg" class="text-destructive">
        <Icon icon="tabler:trash" class="size-6" />
      </Button>
    </div>

    <!-- ----------------------------------------------------------------------------------- -->
    <Separator />
    <!-- ----------------------------------------------------------------------------------- -->

    <div class="flex flex-row items-center justify-center gap-4 ml-4">
      <Button variant="link" size="icon-lg">
        <Icon icon="tabler:copy" class="size-6" />
      </Button>

      <Card v-for="entry in timeEntries" :key="entry.id" class="w-full">
        <CardContent class="flex flex-row">
          <div class="flex flex-col gap-2">
            <h1 class="text-lg font-bold line-clamp-1">{{ entry.title }}</h1>
            <div class="flex gap-2 mt-2">
              <span
                v-for="tag in entry.tags"
                :key="tag"
                class="bg-gray-200 text-gray-800 px-2 py-1 rounded-full text-xs"
              >
                {{ tag }}
              </span>
            </div>
          </div>
          <div class="flex items-center justify-end gap-2 ml-auto">
            {{ new Date(entry.end.getTime() - entry.start.getTime()).toISOString().substr(11, 8) }}
            <Button variant="ghost" size="icon-lg"
              ><Icon icon="tabler:dots" class="size-6"
            /></Button>
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- ----------------------------------------------------------------------------------- -->
    <Separator />
    <!-- ----------------------------------------------------------------------------------- -->

    <Card v-for="item in items" :key="item.id" @click="router.push({ name: 'new-time-entry' })">
      <CardContent>
        <h1 class="text-lg font-bold">{{ item.name }}</h1>
        <p>This is a card component.</p>
        <div v-if="item.tags" class="flex gap-2 mt-2">
          <span
            v-for="tag in item.tags"
            :key="tag"
            class="bg-gray-200 text-gray-800 px-2 py-1 rounded-full text-xs"
          >
            {{ tag }}
          </span>
        </div>
      </CardContent>
    </Card>

    <Separator />

    <Card>
      <CardContent class="flex flex-row">
        <div class="flex flex-col gap-2">
          <h1 class="text-lg font-bold">Debug Card</h1>
          <div class="flex gap-2 mt-2">
            <span
              v-for="tag in ['tag1', 'tag2', 'tag3']"
              :key="tag"
              class="bg-gray-200 text-gray-800 px-2 py-1 rounded-full text-xs"
            >
              {{ tag }}
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
            <DrawerContent>
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
                <Button size="lg" variant="secondary">Login</Button>
                <Button :as="RouterLink" :to="{ name: 'root' }" size="lg" variant="secondary"
                  >Root</Button
                >
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
