<template>
  <div>{{ (latitude, longitude) }}</div>
</template>
<script lang="ts">
import { defineComponent, ref } from "vue";

export default defineComponent({
  components: {},
  setup() {
    let latitude = ref();
    let longitude = ref();

    /* eslint-disable no-undef */
    function success(position: GeolocationPosition): void {
      longitude.value = position.coords.altitude;
      latitude.value = position.coords.longitude;
      console.log(position.coords);
    }
    function error(error: GeolocationPositionError): void {
      console.log("error:" + error.message);
    }
    let options = { enableHighAccuracy: true };
    let watchId = navigator.geolocation.watchPosition(success, error, options);

    return { success, error, options, watchId, latitude, longitude };
  },
});
</script>
