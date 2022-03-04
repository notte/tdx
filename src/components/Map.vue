<template>
  <div id="map"></div>
</template>
<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";
import EventBus from "@/utilities/event-bus";
import { IPointList } from "@/models/interface/common";
import * as map_handler from "@/utilities/map-handler";
import * as L from "leaflet";
import "leaflet/dist/leaflet.css";
export default defineComponent({
  components: {},
  setup() {
    const latitude = Number(localStorage.getItem("latitude"));
    const longitude = Number(localStorage.getItem("longitude"));
    let map: L.Map;

    // 記錄目前地圖上的所有標註點資料（從別的組件傳過來的資料）
    let pointList = ref<IPointList[]>();
    // 記錄目前地圖上的所有標註點（指地圖上使用的標註點本身，例如用哪個 icon 等等）
    let markers = ref<L.Marker[]>([]);

    const user: L.Marker = L.marker([latitude, longitude], {
      icon: map_handler.userIcon,
    });
    user.bindPopup("user");
    user.on("click", () => {
      map.panTo([latitude, longitude]);
    });

    // 監聽獲取到位置經緯度，以使用者為中心渲染出地圖，並標註使用者位置

    /*
      這裡的邏輯要變，如果無法取得定位點資訊
      就直接給予一個經緯度（面試時可能會用到）
      變數名稱改為地圖中心點 center
      */
    onMounted(() => {
      map_handler.renderMap(latitude, longitude).then((res) => {
        map = res;
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

    // tab 切換事件
    EventBus.on("click-tab", (page) => {
      if (page !== localStorage.getItem("tab")) {
        for (let item of markers.value) {
          map.removeLayer(item as L.Marker);
        }
        map.removeLayer(user);
        pointList.value = [];
        markers.value = [];
        localStorage.setItem("tab", String(page));
      } else {
        return;
      }

      if (page === "YoubikeList") {
        user.addTo(map);
      }
    });

    return {
      latitude,
      longitude,
    };
  },
});
</script>
