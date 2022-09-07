<script setup>
import { useFloorsStore } from "@/stores/Floors";
import { rowHeight } from "../presets";

const props = defineProps({
  floor: {
    id: { type: Number, required: true },
    status: { type: "active" || "inactive", required: true },
  },
});
const floorsStore = useFloorsStore();
const floorPosition = `${rowHeight * props.floor.id - 25}px`;

function handleClick() {
  floorsStore.callElevator(props.floor.id);
}
</script>

<template>
  <button
    class="floor-button"
    v-for="floor in floorsStore.floors"
    :key="floor.id"
    @click="handleClick"
  >
    {{ props.floor.id }}
  </button>
</template>

<style lang="scss" scoped>
.floor-button {
  width: 30px;
  height: 30px;
  border: 1px solid black;
  border-radius: 50%;
  position: absolute;
  bottom: v-bind(floorPosition);
}
</style>
