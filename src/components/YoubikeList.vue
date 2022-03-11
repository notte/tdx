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
import { defineComponent, watch, reactive, ref } from "vue";
import { cityStore } from "@/store/index";
import * as Model from "@/models/interface/youbike";
import { IPointList } from "@/models/interface/common";
import EventBus from "@/utilities/event-bus";
import Api from "@/api/youbike";
import L from "leaflet";
import { GeodesicLine } from "leaflet.geodesic";
import "@/assets/scss/youbike.scss";

export default defineComponent({
  components: {},
  setup() {
    const city = cityStore();
    const latitude = Number(localStorage.getItem("latitude"));
    const longitude = Number(localStorage.getItem("longitude"));
    const getListDOM = ref();
    const scrollDOM = ref();
    const distance = ref<string>(
      "&%24spatialFilter=nearby(" +
        latitude +
        "%2C%20" +
        longitude +
        "%2C%20" +
        500 +
        ")&%24"
    );
    let youbikeList = reactive<Model.IYoubikeListResponse[]>([]);
    let youbikeStatus = reactive<Model.IYoubikeStatus[]>([]);
    let pointList = reactive<IPointList[]>([]);

    getYoubikeStatusAPI();

    watch([() => youbikeList.length, () => youbikeStatus.length], () => {
      renderYoubikeList();
    });

    EventBus.on("map-click-event", (data) => {
      getClickedBike(
        (data as Model.IGetClickedBike).StationUID,
        (data as Model.IGetClickedBike).latitude,
        (data as Model.IGetClickedBike).longitude
      );
    });

    function getStatus(StationUID: string) {
      for (let item of youbikeStatus) {
        if (item.StationUID === StationUID) {
          return {
            AvailableRentBikes: item.AvailableRentBikes,
            AvailableReturnBikes: item.AvailableReturnBikes,
          };
        }
      }
    }

    async function getYoubikeStatusAPI(): Promise<boolean> {
      Api.getYoubikeStatus(distance.value).then(
        (response: Model.IYoubikeStatus[]) => {
          youbikeStatus = Object.assign(youbikeStatus, response);
        }
      );
      await getYoubikeListAPI();
      return Promise.resolve(true);
    }

    function getYoubikeListAPI(): void {
      Api.getYoubikeList(distance.value).then(
        (response: Model.IYoubikeListResponse[]) => {
          youbikeList = Object.assign(youbikeList, response);
        }
      );
    }

    async function renderYoubikeList(): Promise<boolean> {
      const UserPosition = new L.LatLng(latitude, longitude);

      for (let item of youbikeList) {
        pointList.push({
          StationUID: item.StationUID,
          latitude: item.StationPosition.PositionLat,
          longitude: item.StationPosition.PositionLon,
        });
        const BikeStation = new L.LatLng(
          item.StationPosition.PositionLat,
          item.StationPosition.PositionLon
        );

        const line = new GeodesicLine();
        const distance = line.distance(UserPosition, BikeStation);

        const status = await getStatus(item.StationUID);
        item = Object.assign(item, status, {
          distance: Math.floor(distance),
        });
      }

      youbikeList.sort((a, b) => {
        return Number(a.distance) - Number(b.distance);
      });

      EventBus.emit("get-bike-list", pointList);
      return Promise.resolve(true);
    }

    function getClickedBike(id: string, latitude: number, longitude: number) {
      const Array = getListDOM.value.children;

      for (let index = 0; index < Array.length; index++) {
        const className = Array[index].classList.value.lastIndexOf("active");

        if (className !== -1) {
          Array[index].classList.value = Array[index].classList.value.replace(
            "active",
            ""
          );
        }
        if (Array[index].classList[0] == id) {
          Array[index].classList.value = id + " item active";
          scrollDOM.value.scrollTop = 172 * index;
        }
      }
      EventBus.emit("bike-click-event", [latitude, longitude, id]);
    }

    return {
      city,
      distance,
      youbikeList,
      youbikeStatus,
      getListDOM,
      scrollDOM,
      getClickedBike,
      getStatus,
    };
  },
});
</script>
