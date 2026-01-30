<script setup lang="ts">
import { ref, computed } from 'vue'
// import { useI18n } from "vue-i18n";

// const { t, d } = useI18n();

const items = ref<Array<{ id: number; name: string }>>([
  { id: 1, name: 'Item One' },
  { id: 2, name: 'Item Two' },
  { id: 3, name: 'Item Three' },
])
</script>

<template>
  <div v-for="item in items" :key="item.id">
    {{ item.name }}
  </div>
</template>
