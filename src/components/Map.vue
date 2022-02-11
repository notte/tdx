<template>
  <div id="map"></div>
</template>
<script lang="ts">
import { defineComponent, ref, watch } from "vue";
import { userPositionStore } from "@/store/index";
import EventBus from "@/utilities/event-bus";
import { setPoints } from "@/utilities/set-map";
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
    });
    // const map = L.map("map");
    navigator.geolocation.getCurrentPosition(success, error, options);

    watch(latitude, () => {
      const map = L.map("map").setView([latitude.value, longitude.value], 18);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(
        map
      );
      L.marker([latitude.value, longitude.value], {
        icon: greenIcon,
      }).addTo(map);
    });

    EventBus.on("send-place-list", (data) => {
      // setPoints(data, map, greenIcon);
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
