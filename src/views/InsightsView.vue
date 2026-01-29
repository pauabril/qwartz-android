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
  <!-- placeholder bar and pie charts -->
  <div>
    <h2>Insights</h2>
    <div style="display: flex; gap: 20px">
      <div
        style="
          width: 300px;
          height: 200px;
          border: 1px solid #ccc;
          display: flex;
          align-items: center;
          justify-content: center;
        "
      >
        Bar Chart Placeholder
      </div>
      <div
        style="
          width: 200px;
          height: 200px;
          border: 1px solid #ccc;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
        "
      >
        Pie Chart Placeholder
      </div>
    </div>
  </div>
</template>
