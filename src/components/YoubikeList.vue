<template>
  <div class="youbike" ref="scrollDOM">
    <p class="msg">每 20 秒刷新</p>
    <div class="list" ref="getListDOM">
      <div
        :class="item.StationUID + ' ' + 'item'"
        v-for="item in youbikeList"
        :key="item.StationUID"
        @click="
          getClickedBike(
            item.StationUID,
            item.StationPosition.PositionLat,
            item.StationPosition.PositionLon,
            getListDOM,
            scrollDOM
          )
        "
      >
        <div class="name">
          <h4>{{ item.StationName.Zh_tw }}</h4>
          <span>{{ item.distance }} m</span>
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
import {
  defineComponent,
  watch,
  reactive,
  ref,
  onBeforeUnmount,
  onMounted,
} from "vue";
import { cityStore } from "@/store/index";
import * as Model from "@/models/interface/youbike";
import { IPointList } from "@/models/interface/common";
import * as youbike_handler from "@/utilities/youbike-handler";
import EventBus from "@/utilities/event-bus";
import "@/assets/scss/youbike.scss";

export default defineComponent({
  components: {},
  setup() {
    const city = cityStore();
    const getListDOM = ref();
    const scrollDOM = ref();
    const getClickedBike = youbike_handler.getClickedBike;

    let pointList = reactive<IPointList[]>([]);
    let youbikeList = reactive<Model.IYoubikeListResponse[]>([]);
    let youbikeStatus = reactive<Model.IYoubikeStatus[]>([]);

    youbike_handler.getYoubikeStatusAPI(youbikeStatus);

    const timerId = setInterval(() => {
      youbike_handler.getYoubikeStatusAPI(youbikeStatus);
    }, 2000);

    watch(
      () => youbikeStatus,
      () => {
        if (youbikeList.length === 0) {
          youbike_handler.getYoubikeListAPI(youbikeList);
        } else {
          for (const item of youbikeList) {
            const status = youbikeStatus.find(
              (element) => element.StationID === item.StationID
            );
            item.AvailableRentBikes = status?.AvailableRentBikes;
            item.AvailableReturnBikes = status?.AvailableReturnBikes;
            console.log(item.AvailableRentBikes, item.AvailableReturnBikes);
          }
          console.log("1");
        }
      },
      { deep: true }
    );

    watch(
      () => youbikeList,
      () => {
        youbike_handler.combineList(youbikeList, youbikeStatus, pointList);
      },
      { deep: true }
    );

    watch(
      () => pointList,
      () => {
        // EventBus.emit("get-bike-list", pointList);
        // console.log(pointList);
        // console.log(1);
      }
      // { deep: true, immediate: true }
    );

    // onMounted(() => {
    // EventBus.emit("get-bike-list", pointList);
    // youbike_handler.setMap(pointList);
    // });

    onBeforeUnmount(() => {
      clearInterval(timerId);
    });

    EventBus.on("map-click-event", (data) => {
      youbike_handler.getClickedBike(
        (data as Model.IGetClickedBike).StationUID,
        (data as Model.IGetClickedBike).latitude,
        (data as Model.IGetClickedBike).longitude,
        getListDOM.value,
        scrollDOM.value
      );
    });

    return {
      city,
      youbikeList,
      youbikeStatus,
      getListDOM,
      scrollDOM,
      getClickedBike,
    };
  },
});
</script>
