import { defineStore } from "pinia";
import { useFloorsStore } from "./floors";

export const useElevatorsStore = defineStore({
  id: "elevators",
  state: () => ({
    queue: [],
    elevators: [
      {
        id: 1,
        status: "ready",
        floor: 1,
      },
      {
        id: 2,
        status: "ready",
        floor: 1,
      },
      {
        id: 3,
        status: "ready",
        floor: 1,
      },
      {
        id: 4,
        status: "ready",
        floor: 1,
      },
    ],
  }),
  getters: {},
  actions: {
    addEvent(floor) {
      if (
        this.elevators.filter(
          (elev) => elev.status == "ready" && elev.floor == floor
        ).length !== 0
      ) {
        return;
      }

      this.queue.push(floor);
      console.log(`${floor} added to queue`, this.queue);
      const elev = this.findElev(floor);
      if (elev) {
        this.moveElevator(elev, floor);
      } else {
        console.log("all lifst engaged");
        console.log(this.queue);
      }
    },

    findElev(floor) {
      if (this.elevators.length == 0) return undefined;

      const readyElevs = this.elevators.filter(
        (elev) => elev.status == "ready" && elev.floor != floor
      );
      if (readyElevs.length == 0) return undefined;
      //function to find closest
      let elevToSend = readyElevs[0];
      for (let i = 1; i < readyElevs.length; i++) {
        if (
          Math.abs(readyElevs[i].floor - floor) <
          Math.abs(elevToSend.floor - floor)
        ) {
          elevToSend = readyElevs[i];
        }
      }
      console.log("elevToSend", elevToSend);
      return elevToSend;
    },

    async moveElevator(elevator, floor) {
      this.queue.pop();
      this.elevators = this.elevators.map((elev) =>
        elev.id != elevator.id ? elev : { ...elev, status: "moving" }
      );
      const floorToMove = floor - elevator.floor;
      console.log(floorToMove);
      await this.move(elevator, floorToMove)
      await this.wait(elevator);
      // await this.wait(elevator);
      await useFloorsStore.elevatorArrived(floor);
    },

    async move(elevator, floorToMove) {
      const me = this;
      return new Promise(function (resolve) {
        let floorPassed = 0;
        const inter = setInterval(() => {
          //console.log(this.elevators.find((elev) => elev.id == elevator.id));

          if (floorToMove > 0) {
            console.log("Moved");
            me.elevators = [
              ...me.elevators.map((elev) =>
                elev.id != elevator.id
                  ? elev
                  : { ...elev, floor: (elev.floor += 1) }
              ),
            ];
          } else {
            console.log("Moved");
            me.elevators = [
              ...me.elevators.map((elev) =>
                elev.id != elevator.id
                  ? elev
                  : { ...elev, floor: (elev.floor -= 1) }
              ),
            ];
          }
          floorPassed += 1;
          if (floorPassed == Math.abs(floorToMove)) {
            console.log("Arrived");
            me.elevators = [
              ...me.elevators.map((elev) =>
                elev.id != elevator.id ? elev : { ...elev, status: "waiting" }
              ),
            ];
            clearInterval(inter);
            resolve();
            return;
          }
        }, 1000);
      });
    },

    async wait(elevator) {
      const me = this;
      return new Promise(function () {
        setTimeout(() => {
          console.log("ready");
          me.elevators = me.elevators.map((elev) =>
            elev.id != elevator.id ? elev : { ...elev, status: "ready" }
          );
          me.elevatorReady(elevator.id);
        }, 3000);
      });
    },
    elevatorReady(elevator) {
      console.log(this.queue, this.elevators);
      if (this.queue.length == 0) {
        console.log("Queue is empty");
        return;
      }
      this.moveElevator(elevator, this.queue[length - 1]);
    },
  },
});
