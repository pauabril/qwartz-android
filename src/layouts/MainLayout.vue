<script setup lang="ts">
import { ref, computed } from "vue";
import { RouterView, RouterLink, useRoute } from "vue-router";

import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/vue";

const route = useRoute();

const navBarButtons = [
  { name: "calendar", label: "Calendar", icon: "tabler:calendar-month" },
  { name: "list", label: "Home", icon: "tabler:home" },
  { name: "insights", label: "Insights", icon: "tabler:chart-line" },
];

const isNavRoute = computed(() => ["calendar", "list", "insights"].includes(route.name as string));

const shouldExpand = (btnName: string) => !isNavRoute.value || route.name === btnName;
</script>

<template>
  <main class="h-full w-full overflow-scroll relative">
    <RouterView />
  </main>

  <nav class="bg-white border-t w-full h-16 px-4 py-2 flex justify-around gap-2 mt-auto">
    <Button
      v-for="btn in navBarButtons"
      :key="btn.name"
      :as="RouterLink"
      :to="{ name: btn.name }"
      size="icon-lg"
      :class="shouldExpand(btn.name) ? 'flex-grow' : 'flex-shrink-0'"
      class="transition-all duration-100 overflow-hidden"
    >
      <Icon :icon="btn.icon" class="w-5 h-5 flex-shrink-0" />
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
