<template>
  <div class="youbike">
    <div class="search">
      <div class="search-item">
        <p>關鍵字</p>
        <input v-model="word" type="search" />
      </div>
      <button @click="search(word)">搜尋</button>
    </div>
    <div class="list" v-if="word === ''" ref="getListDOM">
      <div
        :class="item.StationUID + ' ' + 'item'"
        v-for="item in youbikeList"
        :key="item.StationUID"
        @click="getClickedBike(item.StationUID)"
      >
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
import { defineComponent, watch, reactive, ref, onMounted } from "vue";
import { userPositionStore, cityStore } from "@/store/index";
import * as Model from "@/models/interface/youbike";
import EventBus from "@/utilities/event-bus";
import Api from "@/api/youbike";

export default defineComponent({
  components: {},
  setup() {
    const position = userPositionStore();
    const city = cityStore();

    const getListDOM = ref();
    // const searchList = ref<null | HTMLElement>();

    const word = ref<string>("");
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
            console.log(youbikeList);
            EventBus.emit("send-place-list", youbikeList);
          }
        );
      }
    );

    onMounted(() => {
      EventBus.on("send-map-click-event", (data) => {
        getClickedBike(data as string);
      });
    });

    function getClickedBike(data: string) {
      for (const item of getListDOM.value?.children) {
        const index = item.classList.value.lastIndexOf("active");
        if (index !== -1) {
          item.classList.value = item.classList.value.replace("active", "");
        }
        if (item.classList[0] === data) {
          item.classList.value = data + " item active";
          // getListDOM.value.offsetTop = item.offsetTop;
          // console.log(item.offsetTop);
        }
      }
    }

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
    function scrollBehavior(position: number) {
      return { x: 0, y: position, behavior: "smooth" };
    }

    return {
      position,
      word,
      city,
      distance,
      youbikeList,
      youbikeStatus,
      getListDOM,
      getClickedBike,
      scrollBehavior,
      // searchList,
    };
  },
});
</script>
