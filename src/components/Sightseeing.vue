<template>
  <div class="sightseeing">
    <button @click="setFoodInfo">
      <img src="../assets/icons/food.png" alt="餐飲" v-if="status.food" />
      <img src="../assets/icons/food-off.png" alt="餐飲" v-if="!status.food" />
    </button>
    <button @click="setSightseeInfo">
      <img
        src="../assets/icons/sightsee.png"
        alt="景點"
        v-if="status.sightsee"
      />
      <img
        src="../assets/icons/sightsee-off.png"
        alt="景點"
        v-if="!status.sightsee"
      />
    </button>
    <button @click="setPartyInfo">
      <img src="../assets/icons/party.png" alt="活動" v-if="status.party" />
      <img
        src="../assets/icons/party-off.png"
        alt="活動"
        v-if="!status.party"
      />
    </button>
    <button @click="setRoomInfo">
      <img src="../assets/icons/room.png" alt="旅宿" v-if="status.room" />
      <img src="../assets/icons/room-off.png" alt="旅宿" v-if="!status.room" />
    </button>
  </div>
</template>
<script lang="ts">
import { defineComponent, reactive } from "vue";
import { cityStore } from "@/store/index";
import * as Model from "@/models/interface/other";
import EventBus from "@/utilities/event-bus";
import "@/assets/scss/sightseeing.scss";
import Api from "@/api/other";

export default defineComponent({
  setup() {
    let status = reactive({
      food: false,
      sightsee: false,
      party: false,
      room: false,
    });

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
      for (let item of Object.getOwnPropertyNames(status)) {
        status[item] = false;
      }
      status.food = !status.food;
      pointList = [];
      if (status.food === true) {
        for (const item of foodList) {
          pointList.push({
            name: item.RestaurantName,
            latitude: item.Position.PositionLat,
            longitude: item.Position.PositionLon,
            address: item.Address,
            opentime: item.OpenTime,
          });
        }
        EventBus.emit("get-other-list", [pointList, "restaurant"]);
      } else {
        return;
      }
    }

    function setSightseeInfo() {
      for (let item of Object.getOwnPropertyNames(status)) {
        status[item] = false;
      }
      status.sightsee = !status.sightsee;
      pointList = [];
      if (status.sightsee === true) {
        for (const item of sightseeList) {
          pointList.push({
            name: item.ScenicSpotName,
            latitude: item.Position.PositionLat,
            longitude: item.Position.PositionLon,
            address: item.Address,
            opentime: item.OpenTime,
          });
        }
        EventBus.emit("get-other-list", [pointList, "scenicspot"]);
      } else {
        return;
      }
    }

    function setPartyInfo() {
      for (let item of Object.getOwnPropertyNames(status)) {
        status[item] = false;
      }
      status.party = !status.party;
      pointList = [];
      if (status.party === true) {
        for (const item of partyList) {
          pointList.push({
            name: item.ActivityName,
            latitude: item.Position.PositionLat,
            longitude: item.Position.PositionLon,
            address: item.Address,
            opentime: item.Cycle,
          });
        }
        EventBus.emit("get-other-list", [pointList, "activity"]);
      } else {
        return;
      }
    }

    function setRoomInfo() {
      for (let item of Object.getOwnPropertyNames(status)) {
        status[item] = false;
      }
      status.room = !status.room;
      pointList = [];
      if (status.room === true) {
        for (const item of roomList) {
          pointList.push({
            name: item.HotelName,
            latitude: item.Position.PositionLat,
            longitude: item.Position.PositionLon,
            address: item.Address,
          });
        }
        EventBus.emit("get-other-list", [pointList, "hotel"]);
      } else {
        return;
      }
    }

    return {
      status,
      setFoodInfo,
      setSightseeInfo,
      setPartyInfo,
      setRoomInfo,
    };
  },
});
</script>
