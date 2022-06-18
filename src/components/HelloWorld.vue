<template>
  <div>
    <tr v-for="floor in Array.from({length: this.floors}, (_, i) => i + 1).reverse()" :key="floor">
      <td><input type="button" :value="floor" @click="callElevator(floor)"></td>
      <td class="cell" v-for="(elevator, index) in elevatorManager.elevators" :key="index">
        {{
          elevator.position === floor ? elevator.status : ''
        }}
      </td>
    </tr>
  </div>
</template>

<script>
import ElevatorsManager from "./elevators";

export default {
  name: "HelloWorld",
  data() {
    return { elevatorManager: {}, floors: 12, elevators: 3 };
  },
  mounted() {
    this.elevatorManager = new ElevatorsManager(this.elevators, this.floors);
  },
  methods: {
    callElevator(floor) {
      this.elevatorManager.callElevator(floor)
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .cell {
    border: 1px solid blue;
    width: 100px;
    text-align: center;
    vertical-align: middle;
  }
  tr {
    height: 50px
  }
</style>
