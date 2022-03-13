<template>
  <div class="sightseeing">
    <button @click="setFoodInfo">
      <img src="../assets/icons/food.png" alt="餐飲" v-if="food" />
      <img src="../assets/icons/food-off.png" alt="餐飲" v-if="!food" />
    </button>
    <button @click="setSightseeInfo">
      <img src="../assets/icons/sightsee.png" alt="景點" v-if="sightsee" />
      <img src="../assets/icons/sightsee-off.png" alt="景點" v-if="!sightsee" />
    </button>
    <button @click="setPartyInfo">
      <img src="../assets/icons/party.png" alt="活動" v-if="party" />
      <img src="../assets/icons/party-off.png" alt="活動" v-if="!party" />
    </button>
    <button @click="setRoomInfo">
      <img src="../assets/icons/room.png" alt="旅宿" v-if="room" />
      <img src="../assets/icons/room-off.png" alt="旅宿" v-if="!room" />
    </button>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref } from "vue";
import "@/assets/scss/sightseeing.scss";
export default defineComponent({
  setup() {
    let food = ref<boolean>(false);
    let sightsee = ref<boolean>(false);
    let party = ref<boolean>(false);
    let room = ref<boolean>(false);
    function setFoodInfo() {
      food.value = !food.value;
    }
    function setSightseeInfo() {
      sightsee.value = !sightsee.value;
    }
    function setPartyInfo() {
      party.value = !party.value;
    }
    function setRoomInfo() {
      room.value = !room.value;
    }
    return {
      food,
      sightsee,
      party,
      room,
      setFoodInfo,
      setSightseeInfo,
      setPartyInfo,
      setRoomInfo,
    };
  },
});
</script>
