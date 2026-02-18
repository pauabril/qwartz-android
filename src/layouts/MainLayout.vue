<script setup lang="ts">
import { ref, computed } from "vue";
import { RouterView, RouterLink, useRoute } from "vue-router";

import { NavBar } from "@/components/nav-bar";

const navBarButtons = [
  { name: "calendar", label: "Calendar", icon: "tabler:calendar-month" },
  { name: "list", label: "Home", icon: "tabler:home" },
  { name: "insights", label: "Insights", icon: "tabler:chart-line" },
];
</script>

<template>
  <main class="h-full w-full overflow-scroll relative">
    <RouterView />
  </main>

  <NavBar :buttons="navBarButtons" />
</template>
