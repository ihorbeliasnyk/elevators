const SPEED = 1000;
const WAITING = 3000;
const wait = async (milliseconds) =>
  new Promise((resolve) => setTimeout(resolve, milliseconds));

class Elevator {
  constructor() {
    this.position = 1;
    this.status = "IDLE";
    this.floorCalls = [];
  }

  isInWork(floor) {
    return this.floorCalls.includes(floor);
  }

  addCall(floor) {
    this.floorCalls.push(floor);
  }

  async start() {
    // eslint-disable-next-line no-constant-condition
    while (true) {
      await wait(200);
      if (this.floorCalls.length === 0) {
        this.status = "IDLE";
        continue;
      }

      const destination = this.floorCalls[0];
      await this._move(destination);
      await this._wait();
      this.floorCalls.shift();
    }
  }

  async _wait() {
    this.status = "WAITING";
    return wait(WAITING);
  }

  async _move(destination) {
    this.status = "MOVING";
    while (this.position !== destination) {
      await wait(SPEED);
      if (destination > this.position) {
        this.position++;
      } else {
        this.position--;
      }
    }
    return;
  }
}

export default class ElevatorsManager {
  constructor(elevatorsAmount = 1, floorsAmount = 5) {
    this.elevators = [];
    for (let i = 1; i <= elevatorsAmount; i++) {
      this.elevators.push(new Elevator());
    }
    this.elevators.forEach((e) => e.start());
    this.floorsAmount = floorsAmount;
  }

  callElevator(floor) {
    const isAnyElevatorOnFloor = this.elevators.some((elevator) => {
      return elevator.status !== "MOVING" && elevator.position === floor;
    });
    if (isAnyElevatorOnFloor) return;

    const isFloorInWork = this.elevators.some((elevator) =>
      elevator.isInWork(floor)
    );
    if (isFloorInWork) return;
    const minimallyLoadedElevator = this._getMinimallyLoadedElevator(floor);
    minimallyLoadedElevator.addCall(floor);
  }

  _getMinimallyLoadedElevator(toFloor) {
    const idleElevators = this.elevators.filter((el) => el.status === "IDLE");
    if (idleElevators.length) {
      return this._getClosestElevatorToFloor(idleElevators, toFloor);
    }
    const floorsInWork = this.elevators.map((el) => el.floorCalls.length);
    const minimalLoad = Math.min(...floorsInWork);
    const m = this.elevators.find((el) => (el.floorCalls.length === minimalLoad));
    console.log('minimally loaded', { floorsInWork, minimalLoad, m})
    return m 
  }

  _getClosestElevatorToFloor(elevators, floor) {
    return elevators.reduce((prev, curr) =>
      Math.abs(curr.position - floor) < Math.abs(prev.position - floor)
        ? curr
        : prev
    );
  }
}
