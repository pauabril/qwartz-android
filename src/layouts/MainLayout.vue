<script setup lang="ts">
import { ref, computed } from "vue";
import { RouterView, RouterLink } from "vue-router";

import { Button } from "@/components/ui/button";

// const { t, d } = useI18n();
</script>

<template>
  <main class="h-full w-full overflow-scroll">
    <RouterView />
  </main>

  <nav class="bg-white border-t w-full h-16 px-4 py-2 flex justify-around mt-auto">
    <Button :as="RouterLink" :to="{ name: 'calendar' }" size="icon">📅</Button>
    <Button :as="RouterLink" :to="{ name: 'list' }" size="icon">📋</Button>
    <Button :as="RouterLink" :to="{ name: 'insights' }" size="icon">📊</Button>
  </nav>
</template>
