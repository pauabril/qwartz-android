<script setup>
// import { getCurrentWindow } from "@tauri-apps/api/window";

import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute, RouterLink } from 'vue-router'
import { useSwipe } from '@vueuse/core'

import { Icon } from '@iconify/vue'
import { Button } from '@/components/ui/button'

const router = useRouter()
const route = useRoute()
const container = ref(null)
const transitionName = ref('slide-left')

const routes = ['/onboarding/1', '/onboarding/2', '/onboarding/3', '/onboarding/4']

const currentIndex = computed(() => routes.indexOf(route.path))

useSwipe(container, {
  onSwipeEnd(e, direction) {
    if (direction === 'left') {
      const next = currentIndex.value + 1
      if (next < routes.length) {
        transitionName.value = 'slide-left'
        router.push(routes[next])
      }
    } else if (direction === 'right') {
      const prev = currentIndex.value - 1
      if (prev >= 0) {
        transitionName.value = 'slide-right'
        router.push(routes[prev])
      }
    }
  },
})

// TODO: make onboarding views fullscreen
// onMounted(() => {
//   getCurrentWindow().setFullscreen(true)
// })
</script>

<template>
  <main class="fixed top-0 bottom-0 left-0 right-0 overflow-hidden">
    <div ref="container" class="relative w-screen h-screen overflow-hidden">
      <RouterView v-slot="{ Component }">
        <transition :name="transitionName">
          <component :is="Component" :key="$route.path" class="absolute inset-0 w-full h-full" />
        </transition>
      </RouterView>
    </div>
  </main>

  <nav
    class="fixed bottom-[env(safe-area-inset-bottom)] left-0 right-0 z-10 flex items-center justify-between px-4"
  >
    <div class="w-full flex items-center justify-start">
      <Button
        size="icon-lg"
        variant="link"
        :disabled="currentIndex === 0"
        @click="
          () => {
            if (currentIndex > 0) {
              transitionName = 'slide-right'
              router.push(routes[currentIndex - 1])
            }
          }
        "
        ><Icon icon="tabler:arrow-left" class="size-6"
      /></Button>
    </div>

    <div class="flex items-center justify-center h-full gap-2">
      <span
        v-for="(route, index) in routes"
        :key="route"
        :class="[
          'size-2 rounded-full',
          currentIndex === index
            ? 'bg-foreground'
            : currentIndex > index
              ? 'bg-foreground/75'
              : 'bg-foreground/25',
        ]"
      />
    </div>

    <div class="w-full flex items-center justify-end">
      <Button
        v-if="currentIndex < routes.length - 1"
        size="icon-lg"
        variant="link"
        :disabled="currentIndex === routes.length - 1"
        @click="
          () => {
            if (currentIndex < routes.length - 1) {
              transitionName = 'slide-left'
              router.push(routes[currentIndex + 1])
            }
          }
        "
        ><Icon icon="tabler:arrow-right" class="size-6"
      /></Button>
      <Button v-else size="lg" :as="RouterLink" :to="{ name: 'list' }">Let's go</Button>
    </div>
  </nav>
</template>

<style>
.slide-left-enter-from,
.slide-right-leave-to {
  transform: translateX(100%);
}
.slide-left-leave-to,
.slide-right-enter-from {
  transform: translateX(-100%);
}

.slide-left-enter-active,
.slide-left-leave-active,
.slide-right-enter-active,
.slide-right-leave-active {
  transition: transform 0.3s ease;
}
</style>
