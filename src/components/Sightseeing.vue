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
import { defineComponent, ref, reactive } from "vue";
import { cityStore } from "@/store/index";
import * as Model from "@/models/interface/other";
import EventBus from "@/utilities/event-bus";
import "@/assets/scss/sightseeing.scss";
import Api from "@/api/other";

export default defineComponent({
  setup() {
    let food = ref<boolean>(false);
    let sightsee = ref<boolean>(false);
    let party = ref<boolean>(false);
    let room = ref<boolean>(false);
    const city = cityStore();
    const locationCity: string = city.$state.en
      ? city.$state.en
      : window.location.pathname.slice(1);

    let foodList = reactive<Model.IGetFoodResponse[]>([]);
    let sightseeList = reactive<Model.IGetSightseeResponse[]>([]);
    let partyList = reactive<Model.IGetPartyResponse[]>([]);
    let roomList = reactive<Model.IGetRoomResponse[]>([]);

    let pointList = reactive<Model.IOtherPointList[]>([]);

    Api.getFood(locationCity).then((res) => {
      foodList = Object.assign(foodList, res);
    });
    Api.getSightsee(locationCity).then((res) => {
      sightseeList = Object.assign(sightseeList, res);
    });
    Api.getParty(locationCity).then((res) => {
      partyList = Object.assign(partyList, res);
    });
    Api.getRoom(locationCity).then((res) => {
      roomList = Object.assign(roomList, res);
    });

    function setFoodInfo() {
      food.value = !food.value;
      pointList = [];
      if (food.value === true) {
        for (const item of foodList) {
          pointList.push({
            name: item.RestaurantName,
            latitude: item.Position.PositionLat,
            longitude: item.Position.PositionLon,
            address: item.Address,
            opentime: item.OpenTime,
          });
        }
        EventBus.emit("get-other-list", pointList);
      } else {
        return;
      }
    }

    function setSightseeInfo() {
      sightsee.value = !sightsee.value;
      pointList = [];
      if (sightsee.value === true) {
        for (const item of sightseeList) {
          console.log(item);
          pointList.push({
            name: item.ScenicSpotName,
            latitude: item.Position.PositionLat,
            longitude: item.Position.PositionLon,
            address: item.Address,
            opentime: item.OpenTime,
          });
        }
        EventBus.emit("get-other-list", pointList);
      } else {
        return;
      }
    }

    function setPartyInfo() {
      party.value = !party.value;
      pointList = [];
      if (party.value === true) {
        for (const item of partyList) {
          pointList.push({
            name: item.ActivityName,
            latitude: item.Position.PositionLat,
            longitude: item.Position.PositionLon,
            address: item.Address,
            opentime: item.Cycle,
          });
        }
        EventBus.emit("get-other-list", pointList);
      } else {
        return;
      }
    }

    function setRoomInfo() {
      room.value = !room.value;
      pointList = [];
      if (room.value === true) {
        for (const item of roomList) {
          pointList.push({
            name: item.HotelName,
            latitude: item.Position.PositionLat,
            longitude: item.Position.PositionLon,
            address: item.Address,
          });
        }
        EventBus.emit("get-other-list", pointList);
      } else {
        return;
      }
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
