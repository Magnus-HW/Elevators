<script setup>
import { computed } from "vue";
import TheElevator from "@/components/TheElevator.vue";
import TheFloor from "./components/TheFloor.vue";
import { rowHeight } from "@/presets";

import { useElevatorsStore } from "@/stores/elevatorsManager.js";
import { useFloorsStore } from "./stores/floors";
import { useQueueStore } from "./stores/queue";

const elevators = computed(() => useElevatorsStore().elevators);
const floors = computed(() => useFloorsStore().floors);
const queue = useQueueStore().queue;

const elevatorShaftHeight = computed(
  () => `${rowHeight * floors.value.length}px`
);
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
  <div class="stats">
    Queue:
    <br />
    <div>
      <span v-for="(item, index) in queue" :key="index" class="queue">{{
        item
      }}</span>
    </div>
    Floors:
    <div v-for="(item, index) in floors" :key="index">{{ item }}</div>
    <br />
    Elevs:
    <div v-for="(item, index) in elevators" :key="index">{{ item }}</div>
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
  width: 35px;
  height: 100%;
}
.stats {
  width: 300px;
}
span {
  display: inline-block;
  margin-right: 5px;
}
</style>
