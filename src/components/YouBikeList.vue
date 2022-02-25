<template>
  <div class="youbike" ref="scrollDOM">
    <!-- <div
      style="background: #000; width: 100px; height: 100px"
      ref="demoDOM"
    ></div> -->
    <div class="list" ref="getListDOM">
      <div
        :class="item.StationUID + ' ' + 'item'"
        v-for="item in youbikeList"
        :key="item.StationUID"
        @click="
          getClickedBike(
            item.StationUID,
            item.StationPosition.PositionLat,
            item.StationPosition.PositionLon
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
import { defineComponent, watch, reactive, ref, onMounted } from "vue";
import { userPositionStore, cityStore } from "@/store/index";
import * as Model from "@/models/interface/youbike";
import EventBus from "@/utilities/event-bus";
import Api from "@/api/youbike";
import L from "leaflet";
import { GeodesicLine } from "leaflet.geodesic";
import "@/assets/scss/youbike.scss";

export default defineComponent({
  components: {},
  setup() {
    const position = userPositionStore();
    const city = cityStore();

    const getListDOM = ref();
    const scrollDOM = ref();
    const demoDOM = ref();

    // const word = ref<string>("");
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
          }
        );
      }
    );
    watch(
      () => youbikeList.length,
      () => {
        const UserPosition = new L.LatLng(
          position.latitude,
          position.longitude
        );
        for (let item of youbikeList) {
          const BikeStation = new L.LatLng(
            item.StationPosition.PositionLat,
            item.StationPosition.PositionLon
          );
          const line = new GeodesicLine();
          const distance = line.distance(UserPosition, BikeStation);
          const status = getStatus(item.StationUID);
          item = Object.assign(item, status, {
            distance: Math.floor(distance),
          });
        }
        youbikeList.sort((a, b) => {
          return Number(a.distance) - Number(b.distance);
        });
        EventBus.emit("get-bike-list", youbikeList);
      }
    );

    onMounted(() => {
      EventBus.on("map-click-event", (data) => {
        getClickedBike(
          (data as Model.IGetClickedBike).StationUID,
          (data as Model.IGetClickedBike).latitude,
          (data as Model.IGetClickedBike).longitude
        );
      });
    });

    function getClickedBike(id: string, latitude: number, longitude: number) {
      const Array = getListDOM.value.children;
      for (let index = 0; index < Array.length; index++) {
        console.log(Array[index].classList);
      }
      // for (const item of getListDOM.value?.children) {
      //   const index = item.classList.value.lastIndexOf("active");
      //   if (index !== -1) {
      //     item.classList.value = item.classList.value.replace("active", "");
      //   }
      //   if (item.classList[0] === id) {
      //     item.classList.value = id + " item active";
      //     scrollDOM.value.scrollTop = 182;
      //     console.log(getListDOM.value.scrollTop, scrollDOM.value.scrollTop);
      //   }
      // }
      // EventBus.emit("bike-click-event", [latitude, longitude, id]);
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
      // word,
      city,
      distance,
      youbikeList,
      youbikeStatus,
      getListDOM,
      getClickedBike,
      scrollBehavior,
      scrollDOM,
      demoDOM,
    };
  },
});
</script>
