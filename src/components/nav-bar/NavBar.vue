<script setup lang="ts">
import { ref, computed } from 'vue'
import { RouterLink, useRoute } from 'vue-router'

import { Icon } from '@iconify/vue'

import { Button } from '@/components/ui/button'

const route = useRoute()

interface NavBarButton {
  name: string
  label: string
  icon: string
}

interface Props {
  buttons: NavBarButton[]
  orientation?: 'horizontal' | 'vertical' // TODO: implement vertical orientation
}

const props = withDefaults(defineProps<Props>(), {
  orientation: 'horizontal',
})

const isNavRoute = computed(() => ['calendar', 'list', 'insights'].includes(route.name as string))

const shouldExpand = (btnName: string) => !isNavRoute.value || route.name === btnName
</script>

<template>
  <nav class="bg-white border-t w-full h-16 px-4 py-2 flex justify-around gap-2 mt-auto">
    <Button
      v-for="btn in props.buttons"
      :key="btn.name"
      :as="RouterLink"
      :to="{ name: btn.name }"
      size="lg"
      :class="shouldExpand(btn.name) ? 'flex-1' : 'shrink-0'"
      class="transition-all duration-100 overflow-hidden min-w-1/6"
    >
      <Icon :icon="btn.icon" class="w-5 h-5 shrink-0" />
      <Transition
        enter-active-class="transition-opacity duration-100"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class=""
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <span v-if="shouldExpand(btn.name)" class="ml-2">
          {{ btn.label }}
        </span>
      </Transition>
    </Button>
  </nav>
</template>
