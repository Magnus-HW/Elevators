import { defineStore } from "pinia";
import { useElevatorsStore } from "@/stores/elevatorsManager.js";

export const useFloorsStore = defineStore({
  id: "floors",
  state: () => ({
    floors: [
      {
        id: 1,
        status: "hasElevator",
      },
      {
        id: 2,
        status: "empty",
      },
      {
        id: 3,
        status: "empty",
      },
      {
        id: 4,
        status: "empty",
      },
      {
        id: 5,
        status: "empty",
      },
      {
        id: 6,
        status: "empty",
      },
      {
        id: 7,
        status: "empty",
      },
      {
        id: 8,
        status: "empty",
      },
    ],
  }),
  getters: {},
  actions: {
    async callElevator(floorId) {
      const elevatorsManager = useElevatorsStore();
      //check if floor already called an elevator
      if (
        this.floors.find(
          (fl) =>
            fl.id == floorId &&
            (fl.status == "hasElevator" || fl.status == "waiting")
        )
      ) {
        return;
      }
      //initial state when lifts at the same floor
      if (
        elevatorsManager.elevators.filter(
          (elev) => elev.status == "ready" && elev.floor == floorId
        ).length !== 0
      ) {
        return;
      }
      console.log(`Elevator Called to the ${floorId} floor`);
      this.changeFloorStatus(floorId, "waiting");
      await elevatorsManager.handleCall(floorId);
    },
    elevatorLeftFloor(floorLeft) {
      const elevAtFloor = useElevatorsStore().elevators.filter(
        (elev) => elev.floor == floorLeft && elev.status != "moving"
      );
      if (elevAtFloor.length == 1) {
        this.changeFloorStatus(floorLeft, "empty");
      }
    },
    changeFloorStatus(floorId, newStatus) {
      this.floors = [
        ...this.floors.map((floor) =>
          floor.id == floorId ? { ...floor, status: `${newStatus}` } : floor
        ),
      ];
    },
  },
});
