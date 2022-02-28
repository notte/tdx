<template>
  <div id="map"></div>
</template>
<script lang="ts">
import { defineComponent, ref, watch } from "vue";
import { userPositionStore } from "@/store/index";
import { IYoubikeListResponse } from "@/models/interface/youbike";
import EventBus from "@/utilities/event-bus";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

export default defineComponent({
  components: {},
  setup() {
    // pinia 儲存的使用者定位位置
    const position = userPositionStore();

    /* eslint-disable no-undef */
    let latitude = ref();
    let longitude = ref();
    let options = { enableHighAccuracy: true };
    let map: any;

    // 記錄目前地圖上的所有標註點資料（從別的組件傳過來的資料）
    let pointList = ref<IYoubikeListResponse[]>();
    // 記錄目前地圖上的所有標註點（指地圖上使用的標註點本身，例如用哪個 icon 等等）
    let markers = ref<any[]>([]);

    const userIcon = new L.Icon({
      iconUrl: "../icons/map.png",
      shadowUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
      iconSize: [40, 41],
      shadowSize: [41, 41],
      shadowAnchor: [12, 20],
      bounceOnAdd: true,
      bounceOnAddOptions: { duration: 1500, height: 200, loop: 10 },
    });
    const bicycleIcon = new L.Icon({
      iconUrl: "../icons/bicycle.png",
      shadowUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
      iconSize: [40, 41],
      shadowSize: [41, 41],
      shadowAnchor: [12, 20],
      bounceOnAdd: true,
      bounceOnAddOptions: { duration: 1500, height: 200, loop: 10 },
    });
    const clickedBicycleIcon = new L.Icon({
      iconUrl: "../icons/clickedBicycle.png",
      shadowUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
      iconSize: [40, 41],
      shadowSize: [41, 41],
      shadowAnchor: [12, 20],
      bounceOnAdd: true,
      bounceOnAddOptions: { duration: 1500, height: 200, loop: 10 },
    });

    // 取得 user 定位，賦值在兩個變數 longitude、longitude，以及 pinia
    navigator.geolocation.getCurrentPosition(success, error, options);

    // 監聽獲取到位置經緯度，以使用者為中心渲染出地圖，並標註使用者位置
    watch(latitude, () => {
      map = L.map("map", { zoom: 16, minZoom: 15 }).setView([
        latitude.value,
        longitude.value,
      ]);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(
        map
      );
      const user = L.marker([latitude.value, longitude.value], {
        icon: userIcon,
      }).addTo(map);

      user.bindPopup("user");
      user.on("click", () => {
        map.panTo([latitude.value, longitude.value]);
      });
    });

    // 接收要標註位置的事件，標註到畫面上
    EventBus.on("get-bike-list", (data) => {
      pointList.value = data as IYoubikeListResponse[];
      // 建立標註點的陣列後，再渲染到畫面上
      createMarkers(pointList.value).then(() => {
        setMap();
      });
    });

    // 接收右側列表被點擊事件（會帶入被標註的位置）
    EventBus.on("bike-click-event", (position) => {
      // 標註地圖上
      setMap();
      const latitude = (position as number[])[0];
      const longitude = (position as number[])[1];

      // 將地圖中心點移到被點擊的標註點
      map.panTo([latitude, longitude]);

      // 從標註點陣列中，找到被點擊的標注點，將 icon 替換成被點擊的 icon 樣式
      for (const item of markers.value) {
        if (item._latlng.lat === latitude) {
          item.setIcon(clickedBicycleIcon);
          item.setZIndexOffset(1000);
        }
      }
    });

    EventBus.on("click-tab", () => {
      map.remove();
    });

    // 建立標註點陣列
    async function createMarkers(
      pointList: IYoubikeListResponse[]
    ): Promise<boolean> {
      // 迭代標註點列表資料
      for (const item of pointList as IYoubikeListResponse[]) {
        // 建立標註點
        const marker = L.marker(
          [item.StationPosition.PositionLat, item.StationPosition.PositionLon],
          {
            icon: bicycleIcon,
          }
        );

        // 綁定點擊事件，單一標註點被點擊
        marker.on("click", () => {
          // 先重新將所有標註點放到地圖上（以免出現多個被點擊 icon 樣式）
          setMap().then(() => {
            // 地圖中心移到被點擊的標注點
            map.panTo([
              item.StationPosition.PositionLat,
              item.StationPosition.PositionLon,
            ]);

            // 發送地圖被點擊事件給列表組件，帶入 id 及經緯度
            EventBus.emit("map-click-event", {
              StationUID: item.StationUID,
              latitude: item.StationPosition.PositionLat,
              longitude: item.StationPosition.PositionLon,
            });

            // 替換被點擊 icon  樣式
            marker.setIcon(clickedBicycleIcon);
            // 將被點擊 icon z-index 層級提升
            marker.setZIndexOffset(1000);
          });
        });

        // 加入到陣列中
        markers.value.push(marker);
      }
      return Promise.resolve(true);
    }
    // 將標註點顯示於地圖（初始狀態）
    async function setMap(): Promise<boolean> {
      // 迭代標註點陣列
      for (const item of markers.value) {
        item.setIcon(bicycleIcon);
        item.setZIndexOffset(0);
        item.addTo(map);
      }
      return Promise.resolve(true);
    }
    function success(location: GeolocationPosition): void {
      longitude.value = location.coords.longitude;
      latitude.value = location.coords.latitude;
      position.longitude = location.coords.longitude;
      position.latitude = location.coords.latitude;
    }
    function error(error: GeolocationPositionError): void {
      console.log("error:" + error.message);
    }

    return {
      success,
      error,
      options,
      latitude,
      longitude,
      position,
      createMarkers,
    };
  },
});
</script>
