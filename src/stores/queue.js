import { defineStore } from "pinia";

export const useQueueStore = defineStore({
  id: "queue",
  state: () => ({
    queue: [],
  }),
  getters: {
    getQueueLength() {
      return this.queue.length;
    },
    getLastItem() {
      return this.queue[this.queue.length - 1];
    },
  },
  actions: {
    unshiftFloor(newFloor) {
      this.queue.unshift(newFloor);
    },
    popFloor() {
      this.queue.pop();
    },
  },
});
