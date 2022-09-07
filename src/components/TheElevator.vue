<script setup>
import { computed } from "vue";
import { rowHeight, columnWidth, gap } from "../presets";

import { useFloorsStore } from "@/stores/floors.js";

const props = defineProps({
  elevator: {
    id: { type: Number, required: true },
    status: { type: "ready" || "moving" || "waiting", required: true },
    floor: { type: Number, required: true },
  },
});

const floorsAmount = useFloorsStore().floors.length;

const elevatorShaftHeight = computed(() => `${rowHeight * floorsAmount}px`);
const elevatorHeight = computed(() => `${rowHeight}px`);
const elevatorWidth = computed(() => `${columnWidth}px`);
const elevatorGap = computed(() => `${gap}px`);

const elevatorPosition = computed(
  () => `${rowHeight * (props.elevator.floor - 1)}px`
);
const isWaiting = computed(() =>
  props.elevator.status == "waiting" ? true : false
);
</script>

<template>
  <div class="elevator-shaft">
    <div class="elevator" :class="{ waiting: isWaiting }"></div>
  </div>
</template>

<style lang="scss" scoped>
.elevator-shaft {
  display: inline-block;
  height: v-bind(elevatorShaftHeight);
  width: v-bind(elevatorWidth);
  background-color: rgb(66, 207, 209);
  margin-right: v-bind(elevatorGap);
}
.elevator {
  display: inline-block;
  position: absolute;
  //moves elevator
  bottom: v-bind(elevatorPosition);
  width: v-bind(elevatorWidth);
  height: v-bind(elevatorHeight);
  background-color: rgb(23, 66, 255);
  transition: bottom 1s linear;
  &.waiting {
    animation: flickerAnimation 1s infinite;
  }
}
@keyframes flickerAnimation {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
</style>
