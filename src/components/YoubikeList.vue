<template>
  <div class="youbike" ref="scrollDOM">
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
import { defineComponent, watch, reactive, ref } from "vue";
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
    let youbikeList = reactive<Model.IYoubikeListResponse[]>([]);
    let youbikeStatus = reactive<Model.IYoubikeStatus[]>([]);
    let pointList = reactive<IPointList[]>([]);

    youbike_handler.getYoubikeStatusAPI(youbikeStatus, youbikeList);

    watch([() => youbikeList.length, () => youbikeStatus.length], () => {
      youbike_handler.renderYoubikeList(youbikeList, pointList, youbikeStatus);
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
