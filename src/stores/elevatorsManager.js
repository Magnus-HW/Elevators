import { defineStore } from "pinia";
import { useFloorsStore } from "./floors";
import { useQueueStore } from "./queue";
export const useElevatorsStore = defineStore({
  id: "elevators",
  state: () => ({
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
    ],
  }),
  getters: {},
  actions: {
    //handle elevator call from floor
    async handleCall(floor) {
      const me = this;
      const queueStore = useQueueStore();
      return new Promise(function (resolve) {
        //add floor to the queue
        queueStore.unshiftFloor(floor);
        const elev = me.findElev(floor);
        if (elev) {
          resolve(me.moveElevator(elev, floor));
        } else {
          console.log("All lifst engaged");
        }
      });
    },

    //find closest elev
    findElev(floor) {
      const readyElevs = this.elevators.filter(
        (elev) => elev.status == "ready"
      );
      if (readyElevs.length == 0) return undefined;

      let elevToSend = readyElevs[0];
      for (let i = 1; i < readyElevs.length; i++) {
        if (
          Math.abs(readyElevs[i].floor - floor) <
          Math.abs(elevToSend.floor - floor)
        ) {
          elevToSend = readyElevs[i];
        }
      }
      return elevToSend;
    },

    //process of moving elevator
    async moveElevator(elevator, floor) {
      const queueStore = useQueueStore();
      const floorStore = useFloorsStore();
      //remove floor from queue
      queueStore.popFloor();
      // floorStore.changeFloorStatus(elevator.floor, "empty");
      floorStore.elevatorLeftFloor(elevator.floor)
      elevator = this.changeElevStatus(elevator, "moving");
      const floorToMove = floor - elevator.floor;
      const newElevState = await this.move(elevator, floorToMove);
      floorStore.changeFloorStatus(floor, "hasElevator");
      await this.wait(newElevState);
    },

    //every second elevator is moved for 1 floor
    async move(elevator, floorToMove) {
      //console.log(elevator, "in moving to the floor", floorToMove);
      const me = this;
      return new Promise(function (resolve) {
        let floorPassed = 0;
        let newElevState = elevator;
        me.moveByOneFloor(newElevState, floorToMove);
        floorPassed++;
        const inter = setInterval(() => {
          if (floorPassed == Math.abs(floorToMove)) {
            clearInterval(inter);
            newElevState = me.changeElevStatus(newElevState, "waiting");
            resolve(newElevState);
            return;
          }
          me.moveByOneFloor(newElevState, floorToMove);
          floorPassed += 1;
        }, 1000);
      });
    },
    //wait 3 sec when arrived to the floor
    async wait(elevator) {
      const me = this;
      return new Promise(function (resolve) {
        setTimeout(() => {
          elevator = me.changeElevStatus(elevator, "ready");
          me.elevatorReady(elevator);
          console.log(elevator, "ready");
          resolve();
        }, 3000);
      });
    },
    //when elevator "ready" check if there is any floors in queue to process
    elevatorReady(elevator) {
      const queueStore = useQueueStore();
      if (queueStore.getQueueLength == 0) {
        console.log("Queue is empty");
        return;
      }
      this.moveElevator(elevator, queueStore.getLastItem);
    },
    //change elevator status. Possible statuses: ready, moving, waiting
    changeElevStatus(elevator, newStatus) {
      const updatedElev = { ...elevator, status: `${newStatus}` };
      this.elevators = this.elevators.map((elev) =>
        elev.id != elevator.id ? elev : updatedElev
      );
      return updatedElev;
    },
    //move elev by one floor
    moveByOneFloor(newElevState, floorToMove) {
      if (floorToMove > 0) {
        newElevState.floor++;
        this.elevators = [
          ...this.elevators.map((elev) =>
            elev.id == newElevState.id ? { ...newElevState } : elev
          ),
        ];
      } else {
        newElevState.floor--;
        this.elevators = [
          ...this.elevators.map((elev) =>
            elev.id == newElevState.id ? { ...newElevState } : elev
          ),
        ];
      }
      return newElevState;
    },
  },
});
