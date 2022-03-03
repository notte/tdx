<template>
  <div id="map"></div>
</template>
<script lang="ts">
import { defineComponent, ref, watch } from "vue";
import { userPositionStore } from "@/store/index";
import EventBus from "@/utilities/event-bus";
import { IPointList } from "@/models/interface/common";
import * as map_handler from "@/utilities/map-handler";
import * as L from "leaflet";
import "leaflet/dist/leaflet.css";

export default defineComponent({
  components: {},
  setup() {
    // pinia 儲存的使用者定位位置
    const position = userPositionStore();

    let latitude = ref();
    let longitude = ref();
    let options = { enableHighAccuracy: true };
    let map: L.Map;

    // 記錄目前地圖上的所有標註點資料（從別的組件傳過來的資料）
    let pointList = ref<IPointList[]>();
    // 記錄目前地圖上的所有標註點（指地圖上使用的標註點本身，例如用哪個 icon 等等）
    let markers = ref<L.Marker[]>([]);

    // console.log(pointList.value === undefined, markers.value);
    // 監聽獲取到位置經緯度，以使用者為中心渲染出地圖，並標註使用者位置
    watch(latitude, () => {
      /*
      這裡的邏輯要變，如果無法取得定位點資訊
      就直接給予一個經緯度（面試時可能會用到）
      變數名稱改為地圖中心點 center
      */
      map_handler.renderMap(latitude.value, longitude.value).then((res) => {
        map = res;
        const user: L.Marker = L.marker([latitude.value, longitude.value], {
          icon: map_handler.userIcon,
        });
        user.bindPopup("user");
        user.on("click", () => {
          map.panTo([latitude.value, longitude.value]);
        });

        user.addTo(map);
      });
    });

    // 接收要標註位置的事件，標註到畫面上
    EventBus.on("get-bike-list", (data) => {
      pointList.value = data as IPointList[];
      // 建立標註點的陣列後，再渲染到畫面上
      map_handler
        .createMarkers(pointList.value, markers.value as L.Marker[], map)
        .then(() => {
          map_handler.setMap(markers.value as L.Marker[], map);
        })
        .catch((error) => {
          console.log(error);
        });
    });

    // 接收右側列表被點擊事件（會帶入被標註的位置）
    EventBus.on("bike-click-event", (position) => {
      // 先重新渲染標註點到地圖（會移除前一個被點擊標註點樣式）
      map_handler.setMap(markers.value as L.Marker[], map);

      // 傳入的被標註位置
      const latitude = (position as number[])[0];
      const longitude = (position as number[])[1];

      // 將地圖中心點移到被點擊的標註點
      map.panTo([latitude, longitude]);

      // 從標註點陣列中，找到被點擊的點，將 icon 替換成被點擊的 icon 樣式
      for (const item of markers.value) {
        if (item.getLatLng().lat === latitude) {
          item.setIcon(map_handler.clickedBicycleIcon);
          item.setZIndexOffset(1000);
        }
      }
    });

    EventBus.on("click-tab", (page) => {
      const markerPane = map.getPane("markerPane");
      const shadowPane = map.getPane("shadowPane");
      markerPane?.remove();
      shadowPane?.remove();

      pointList.value = [];
      markers.value = [];

      if (page === "BikeRoute") {
        console.log("BikeRoute");
      }

      if (page === "YoubikeList") {
        EventBus.emit("click-youbike-tab");
      }
    });

    // 取得 user 定位，賦值在兩個變數 longitude、longitude，以及 pinia
    navigator.geolocation.getCurrentPosition(success, error, options);
    function success(location) {
      longitude.value = location.coords.longitude;
      latitude.value = location.coords.latitude;
      position.longitude = location.coords.longitude;
      position.latitude = location.coords.latitude;
    }
    function error(error) {
      console.log("error:" + error.message);
    }

    return {
      success,
      error,
      options,
      latitude,
      longitude,
      position,
      // createMarkers,
    };
  },
});
</script>
