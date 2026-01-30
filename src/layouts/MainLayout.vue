<script setup lang="ts">
import { ref, computed } from 'vue'
import { RouterView, RouterLink } from 'vue-router'

import { Button } from '@/components/ui/button'

// const { t, d } = useI18n();
</script>

<template>
  <main>
    <RouterView />

    <nav class="bg-white border-t fixed bottom-0 w-full px-4 py-2 flex justify-around">
      <Button :as="RouterLink" :to="{ name: 'calendar' }" size="icon">📅</Button>
      <Button :as="RouterLink" :to="{ name: 'list' }" size="icon">📋</Button>
      <Button :as="RouterLink" :to="{ name: 'insights' }" size="icon">📊</Button>
    </nav>
  </main>
</template>
