<template>
  <div class="youbike">
    <div class="search">
      <div class="search-item">
        <p>關鍵字</p>
        <input v-model="word" type="search" />
      </div>
      <button @click="search(word)">搜尋</button>
    </div>
    <div class="list" v-if="word === ''">
      <div class="item" v-for="item in youbikeList" :key="item.StationUID">
        <div class="name">
          <h4>{{ item.StationName.Zh_tw }}</h4>
          <span>350 m</span>
        </div>
        <p>{{ item.StationAddress.Zh_tw }}</p>
        <div class="set">
          <p>可租借車數</p>
          <h3>{{ item.AvailableRentBikes }}</h3>
        </div>
        <div class="set">
          <p>可歸還車數</p>
          <h3>{{ item.AvailableReturnBikes }}</h3>
        </div>
      </div>
    </div>
    <div class="list" v-if="word !== ''">
      <div class="item" v-for="item in searchList" :key="item.StationUID">
        <div class="name">
          <h4>{{ item.StationName.Zh_tw }}</h4>
          <span>350 m</span>
        </div>
        <p>{{ item.StationAddress.Zh_tw }}</p>
        <div class="set">
          <p>可租借車數</p>
          <h3>{{ item.AvailableRentBikes }}</h3>
        </div>
        <div class="set">
          <p>可歸還車數</p>
          <h3>{{ item.AvailableReturnBikes }}</h3>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, watch, reactive, ref } from "vue";
import { userPositionStore, cityStore } from "@/store/index";
import * as Model from "@/models/interface/youbike";
import EventBus from "@/utilities/event-bus";
import Api from "@/api/youbike";

export default defineComponent({
  components: {},
  setup() {
    const word = ref<string>("");
    const position = userPositionStore();
    const city = cityStore();
    const distance = ref<string>("");
    const meters = ref<number>(500);
    const locationCity: string = city.$state.en
      ? city.$state.en
      : window.location.pathname.slice(1);
    let youbikeList = reactive<Model.IYoubikeListResponse[]>([]);
    let youbikeStatus = reactive<Model.IYoubikeStatus[]>([]);

    Api.getYoubikeStatus(locationCity).then(
      (response: Model.IYoubikeStatus[]) => {
        youbikeStatus = Object.assign(youbikeStatus, response);
      }
    );

    // PositionLat: 25.079322
    // PositionLon: 121.568688

    watch(
      () => position.latitude,
      () => {
        distance.value =
          "&%24spatialFilter=nearby(" +
          position.latitude +
          "%2C%20" +
          position.longitude +
          "%2C%20" +
          meters.value +
          ")&%24";

        Api.getYoubikeList(locationCity, distance.value).then(
          (response: Model.IYoubikeListResponse[]) => {
            youbikeList = Object.assign(youbikeList, response);

            for (let item of youbikeList) {
              const status = getStatus(item.StationUID);
              item = Object.assign(item, status);
            }
            EventBus.emit("send-place-list", youbikeList);
          }
        );
      }
    );

    function getStatus(StationUID: string) {
      for (const item of youbikeStatus) {
        if (item.StationUID === StationUID) {
          return {
            AvailableRentBikes: item.AvailableRentBikes,
            AvailableReturnBikes: item.AvailableReturnBikes,
          };
        }
      }
    }

    return { position, word, city, distance, youbikeList, youbikeStatus };
  },
});
</script>
