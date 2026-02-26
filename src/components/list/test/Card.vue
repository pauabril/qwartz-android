<script setup lang="ts">
import { ref, computed } from 'vue'
import { RouterLink } from 'vue-router'
import { useSwipe } from '@vueuse/core'

import { Icon } from '@iconify/vue'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer'
import { Separator } from '@/components/ui/separator'

interface Props {
  itemId: string | number
  timeEntry: {
    id: string | number
    title: string
    tags: string[]
    time: string
    date: Date
  }
}

// ─── Props & Emits ─────────────────────────────────────────────────────────
const props = withDefaults(defineProps<Props>(), {})

const emit = defineEmits<{
  delete: [id: string | number]
  duplicate: [id: string | number]
}>()

// ─── State ─────────────────────────────────────────────────────────────────
const cardRef = ref<HTMLElement | null>(null)

/** The offset the card is locked at when snapped open (±SNAP_PX or 0) */
const snappedX = ref(0)
/** Captured during swipe so onSwipeEnd can read it even after lengthX resets */
let lastLengthX = 0

const isAnimating = ref(false)

// ─── Thresholds ─────────────────────────────────────────────────────────────
const SNAP_PX = 80 // px — card locks here when you lift your finger
const TRIGGER_RATIO = 0.55 // fraction of card width that fires the action

function cardWidth() {
  return cardRef.value?.offsetWidth ?? 320
}

// ─── Haptic ──────────────────────────────────────────────────────────────────
// Works on Android WebView natively.
// On iOS swap for @tauri-apps/plugin-haptics (Web Vibration API unsupported there).
let hapticFiredSnap = false
let hapticFiredTrigger = false

function vibrate(pattern: number | number[]) {
  try {
    navigator.vibrate?.(pattern)
  } catch {}
}

// ─── useSwipe ────────────────────────────────────────────────────────────────
// lengthX = coordsStart.x - coordsEnd.x
//   positive → finger moved LEFT  (card should slide left)
//   negative → finger moved RIGHT (card should slide right)
const { lengthX, isSwiping } = useSwipe(cardRef, {
  passive: false,
  threshold: 8, // ignore tiny jitters

  onSwipe() {
    if (isAnimating.value) return

    // Track so onSwipeEnd can use it safely
    lastLengthX = lengthX.value

    const abs = Math.abs(liveOffset())

    // Fire haptic once when crossing snap threshold
    if (abs >= SNAP_PX && !hapticFiredSnap) {
      vibrate(12)
      hapticFiredSnap = true
    }
    if (abs < SNAP_PX) {
      hapticFiredSnap = false
      hapticFiredTrigger = false
    }

    // Fire stronger haptic when crossing trigger threshold
    if (abs >= cardWidth() * TRIGGER_RATIO && !hapticFiredTrigger) {
      vibrate([15, 40, 15])
      hapticFiredTrigger = true
    }
  },

  onSwipeEnd() {
    if (isAnimating.value) return

    // Use lastLengthX — lengthX.value may already be 0 here
    const totalOffset = snappedX.value - lastLengthX
    const abs = Math.abs(totalOffset)
    const triggerPx = cardWidth() * TRIGGER_RATIO

    hapticFiredSnap = false
    hapticFiredTrigger = false
    lastLengthX = 0

    // TRIGGER: flew past 55% of card width → perform action
    if (abs >= triggerPx) {
      flyOffAndAct(totalOffset < 0 ? 'left' : 'right')
      return
    }

    // SNAP OPEN: passed SNAP_PX but not trigger → lock open
    if (abs >= SNAP_PX) {
      snappedX.value = totalOffset < 0 ? -SNAP_PX : SNAP_PX
    } else {
      // Too short → spring back
      snappedX.value = 0
    }
  },
})

// ─── Live visual offset ───────────────────────────────────────────────────────
function liveOffset(): number {
  const maxPull = cardWidth() * TRIGGER_RATIO + 28 // slight rubber-band past trigger
  const raw = snappedX.value - lengthX.value
  return Math.max(-maxPull, Math.min(maxPull, raw))
}

const translateX = computed<number>(() => {
  if (isAnimating.value) return snappedX.value
  if (isSwiping.value) return liveOffset()
  return snappedX.value
})

const showLeft = computed(() => translateX.value < -6) // card went left  → delete on right
const showRight = computed(() => translateX.value > 6) // card went right → duplicate on left

// ─── Fly-off then emit ────────────────────────────────────────────────────────
function flyOffAndAct(direction: 'left' | 'right') {
  drawerOpen.value = false
  isAnimating.value = true
  snappedX.value = direction === 'left' ? -(cardWidth() + 48) : cardWidth() + 48

  setTimeout(() => {
    if (direction === 'left') emit('delete', props.itemId)
    else emit('duplicate', props.itemId)
    snappedX.value = 0
    isAnimating.value = false
  }, 350)
}

// ─── Close snapped state on tap ───────────────────────────────────────────────
function closeSnap() {
  if (isAnimating.value || isSwiping.value) return
  snappedX.value = 0
}

const drawerOpen = ref(false)
</script>

<template>
  <!--
    Wrapper: overflow-hidden clips the sliding card.
    touch-action: pan-y lets vertical scroll work; we handle horizontal.
  -->
  <div
    class="relative overflow-x-visible select-none"
    style="touch-action: pan-y"
    @click.self="closeSnap"
  >
    <!-- ── Duplicate action (left side, revealed by swiping right) ── -->
    <div
      class="absolute inset-0 flex items-center justify-start gap-2 px-5 transition-opacity duration-200"
      :class="showRight ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'"
    >
      <Button variant="link" size="icon-lg" @click="flyOffAndAct('right')">
        <Icon icon="tabler:copy" class="size-6" />
      </Button>
    </div>

    <!-- ── Delete action (right side, revealed by swiping left) ── -->
    <div
      class="absolute inset-0 flex items-center justify-end gap-2 px-5 transition-opacity duration-200"
      :class="showLeft ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'"
    >
      <Button variant="link" size="icon-lg" class="text-destructive" @click="flyOffAndAct('left')">
        <Icon icon="tabler:trash" class="size-6" />
      </Button>
    </div>

    <!-- ── Card ── -->
    <!-- <div
      ref="cardRef"
      class="relative z-10 rounded-xl bg-card"
      :class="
        isAnimating
          ? 'transition-transform duration-300 ease-in'
          : 'transition-transform duration-[220ms] ease-[cubic-bezier(0.25,1,0.5,1)]'
      "
      :style="{ transform: `translateX(${translateX}px)` }"
      @click="snappedX !== 0 ? closeSnap() : undefined"
    >
      <slot />
    </div> -->

    <Card
      ref="cardRef"
      class="relative z-10 bg-card"
      :class="
        isAnimating
          ? 'transition-transform duration-300 ease-in'
          : 'transition-transform duration-[220ms] ease-[cubic-bezier(0.25,1,0.5,1)]'
      "
      :style="{ transform: `translateX(${translateX}px)` }"
      @click="snappedX !== 0 ? closeSnap() : undefined"
    >
      <CardContent class="flex flex-row">
        <div class="flex flex-col gap-2">
          <h1 class="text-lg font-bold line-clamp-1">{{ props.timeEntry.title }}</h1>
          <div class="flex gap-2 mt-2">
            <span
              v-for="tag in props.timeEntry.tags"
              :key="tag"
              class="bg-gray-200 text-gray-800 px-2 py-1 rounded-full text-xs"
            >
              {{ tag }}
            </span>
          </div>
        </div>
        <div class="flex items-center justify-end gap-2 ml-auto">
          {{ props.timeEntry.time }}

          <!-- TODO: there should be a single drawer in the view instead of one on each card -->
          <Drawer v-model:open="drawerOpen">
            <DrawerTrigger>
              <Button variant="ghost" size="icon-lg"
                ><Icon icon="tabler:dots" class="size-6"
              /></Button>
            </DrawerTrigger>
            <DrawerContent>
              <DrawerHeader>
                <DrawerTitle>{{ props.timeEntry.title }}</DrawerTitle>
                <div class="flex gap-2">
                  <span
                    v-for="tag in props.timeEntry.tags"
                    :key="tag"
                    class="bg-gray-200 text-gray-800 px-2 py-1 rounded-full text-xs"
                  >
                    {{ tag }}
                  </span>
                </div>
              </DrawerHeader>
              <div class="px-4">
                <Separator />
              </div>

              <DrawerFooter>
                <Button
                  :as="RouterLink"
                  :to="{ name: 'edit-time-entry', params: { id: props.timeEntry.id } }"
                  size="lg"
                  variant="secondary"
                  >Edit</Button
                >
                <Button
                  size="lg"
                  variant="secondary"
                  @click="
                    () => {
                      flyOffAndAct('right')
                      // TODO: close drawer
                    }
                  "
                  >Duplicate</Button
                >
                <Separator />
                <Button
                  size="lg"
                  variant="secondary"
                  class="text-destructive"
                  @click="
                    () => {
                      flyOffAndAct('left')
                      // TODO: close drawer
                    }
                  "
                  >Delete</Button
                >
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
