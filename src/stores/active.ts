import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useActiveTimerStore = defineStore('active-timer', () => {
  const activeItem = ref<boolean>(false)

  const stopActiveTimer = () => {
    activeItem.value = false
  }

  const startActiveTimer = () => {
    activeItem.value = true
  }

  return { activeItem, stopActiveTimer, startActiveTimer }
})
