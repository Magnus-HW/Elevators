import { defineStore } from "pinia";
import { useElevatorsStore } from "@/stores/elevators.js";

export const useFloorsStore = defineStore({
  id: "floors",
  state: () => ({
    floors: [
      {
        id: 1,
        status: "idle",
      },
      {
        id: 2,
        status: "idle",
      },
      {
        id: 3,
        status: "idle",
      },
      {
        id: 4,
        status: "idle",
      },
      {
        id: 5,
        status: "idle",
      },
      {
        id: 6,
        status: "idle",
      },
    ],
  }),
  getters: {},
  actions: {
    callElevator(id) {
      const elevatorsMethods = useElevatorsStore();
      console.log(`Elevator Called to the ${id} floor`);
      this.floors = [
        ...this.floors.map((floor) =>
          floor.id != id ? floor : { ...floor, status: "waiting" }
        ),
      ];
      elevatorsMethods.addEvent(id);
    },
    elevatorArrived(id) {
      this.floors = [
        ...this.floors.map((floor) =>
          floor.id == id ? floor : { ...floor, status: "idle" }
        ),
      ];
    },
  },
});
