<script setup>
import { computed } from "vue";
import TheElevator from "@/components/TheElevator.vue";
import TheFloor from "./components/TheFloor.vue";
import { rowHeight } from "@/presets";

import { useElevatorsStore } from "@/stores/elevators.js";
import { useFloorsStore } from "./stores/floors";

const elevators = computed(() => useElevatorsStore().elevators);
const floors = computed(() => useFloorsStore().floors);
const floorsAmount = floors.value.length;
const elevatorShaftHeight = computed(() => `${rowHeight * floorsAmount}px`);
console.log(elevators);
</script>

<template>
  <div class="simulator">
    <div class="elevators">
      <TheElevator
        v-for="elevator in elevators"
        :key="elevator.id"
        :elevator="elevator"
      />
    </div>
    <div class="floors-buttons">
      <TheFloor v-for="floor in floors" :key="floor.id" :floor="floor" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.simulator {
  display: flex;
  height: v-bind(elevatorShaftHeight);
}
.floors-buttons {
  display: flex;
  background-color: rgba(92, 92, 92, 0.63);
  width: 30px;
  height: 100%;
}
</style>
