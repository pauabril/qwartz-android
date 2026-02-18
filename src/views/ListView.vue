<script setup lang="ts">
import { ref, computed } from "vue";

import { Card, CardContent } from "@/components/ui/card";
// import { useI18n } from "vue-i18n";

// const { t, d } = useI18n();

const items = ref<Array<{ id: number; name: string }>>([
  { id: 1, name: "Item One" },
  { id: 2, name: "Item Two" },
  { id: 3, name: "Item Three" },
  { id: 1, name: "Item One" },
  { id: 2, name: "Item Two" },
  { id: 3, name: "Item Three" },
  { id: 1, name: "Item One" },
  { id: 2, name: "Item Two" },
  { id: 3, name: "Item Three" },
  { id: 1, name: "Item One" },
  { id: 2, name: "Item Two" },
  { id: 3, name: "Item Three" },
  { id: 1, name: "Item One" },
  { id: 2, name: "Item Two" },
  { id: 3, name: "Item Three" },
  { id: 1, name: "Item One" },
  { id: 2, name: "Item Two" },
  { id: 3, name: "Item Three" },
]);
</script>

<template>
  <div class="flex flex-col gap-4 p-2">
    <Card v-for="item in items" :key="item.id">
      <CardContent>
        <h1 class="text-lg font-bold">{{ item.name }}</h1>
        <p>This is a card component.</p>
      </CardContent>
    </Card>
  </div>
</template>
