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
    const position = userPositionStore();
    /* eslint-disable no-undef */
    let latitude = ref();
    let longitude = ref();
    let options = { enableHighAccuracy: true };
    const greenIcon = new L.Icon({
      iconUrl: "../icons/map.png",
      shadowUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
      iconSize: [40, 41],
      shadowSize: [41, 41],
      shadowAnchor: [12, 20],
      bounceOnAdd: true,
      bounceOnAddOptions: { duration: 1500, height: 200, loop: 10 },
    });
    let map: unknown;
    navigator.geolocation.getCurrentPosition(success, error, options);

    watch(latitude, () => {
      map = L.map("map").setView([latitude.value, longitude.value], 16);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(
        map
      );
      const user = L.marker([latitude.value, longitude.value], {
        icon: greenIcon,
      }).addTo(map);

      user.bindPopup("在這裡哦").openPopup();
      // user.on("click", () => {
      //   user.bounce({ duration: 500, height: 200, loop: 10 });
      //   user.bindPopup("在這裡哦").openPopup();
      // });
    });

    // 接收定位點 Array，標註到畫面上
    EventBus.on("send-place-list", (data) => {
      for (const item of data as IYoubikeListResponse[]) {
        const marker = L.marker(
          [item.StationPosition.PositionLat, item.StationPosition.PositionLon],
          {
            icon: greenIcon,
          }
        ).addTo(map);
        marker.bindPopup(item.StationName.Zh_tw);
        marker.on("click", () => {
          EventBus.emit("send-map-click-event", item);
        });
      }
    });

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
    };
  },
});
</script>
