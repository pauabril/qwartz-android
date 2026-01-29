<script setup lang="ts">
import { ref, computed } from "vue";
// import { useI18n } from "vue-i18n";

// const { t, d } = useI18n();

const items = ref<Array<{ id: number; name: string }>>([
  { id: 1, name: "Item One" },
  { id: 2, name: "Item Two" },
  { id: 3, name: "Item Three" },
]);
</script>

<template>
  <!-- day calendar placeholder -->
  <div>
    <h2>Calendar View</h2>
    <div
      style="
        width: 100%;
        height: 400px;
        border: 1px solid #ccc;
        display: flex;
        align-items: center;
        justify-content: center;
      "
    >
      Day Calendar Placeholder
    </div>
  </div>
</template>
