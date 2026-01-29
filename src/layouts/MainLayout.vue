<script setup lang="ts">
import { ref, computed } from "vue";
import { RouterView, RouterLink } from "vue-router";

// const { t, d } = useI18n();
</script>

<template>
  <main>
    <RouterView />

    <nav
      :style="{
        // sticky footer
        position: 'fixed',
        bottom: '0',
        width: '100%',
        backgroundColor: '#f8f8f8',
        borderTop: '1px solid #e7e7e7',
        padding: '10px 0',
        display: 'flex',
        justifyContent: 'space-around',
        paddingBottom: '30px',
      }"
    >
      <RouterLink :to="{ name: 'calendar' }">calendar</RouterLink>
      <RouterLink :to="{ name: 'list' }">List</RouterLink>
      <RouterLink :to="{ name: 'insights' }">Insights</RouterLink>
    </nav>
  </main>
</template>
