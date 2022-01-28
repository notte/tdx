<template>
  <div id="city">
    <!-- <div class="switch">
      <button>景點</button>
      <button>餐廳</button>
    </div> -->
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, watch, onMounted } from "vue";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

export default defineComponent({
  components: {},
  setup() {
    /* eslint-disable no-undef */
    let latitude = ref();
    let longitude = ref();
    let options = { enableHighAccuracy: true };

    navigator.geolocation.getCurrentPosition(success, error, options);

    function success(position: GeolocationPosition): void {
      longitude.value = position.coords.longitude;
      latitude.value = position.coords.latitude;
    }
    function error(error: GeolocationPositionError): void {
      console.log("error:" + error.message);
    }

    const greenIcon = new L.Icon({
      iconUrl: "../icons/map.png",
      shadowUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
      iconSize: [40, 41],
      shadowSize: [41, 41],
      shadowAnchor: [12, 20],
    });

    onMounted(() => {
      watch(latitude, (n, o) => {
        const map = L.map("city").setView(
          [latitude.value, longitude.value],
          18
        );
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(
          map
        );
        const marker = L.marker([latitude.value, longitude.value], {
          icon: greenIcon,
        }).addTo(map);
      });
    });

    return {
      success,
      error,
      options,
      latitude,
      longitude,
    };
  },
});

// let watchId = navigator.geolocation.watchPosition(success, error, options);
</script>
