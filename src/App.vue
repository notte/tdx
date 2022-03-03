<template>
  <router-view />
</template>
<script lang="ts">
import { defineComponent } from "vue";
import "@/assets/scss/common.scss";

export default defineComponent({
  components: {},
  setup() {
    let options = { enableHighAccuracy: true };

    // 取得 user 定位，賦值在兩個變數 longitude、longitude，以及 pinia
    navigator.geolocation.getCurrentPosition(success, error, options);
    function success(location) {
      localStorage.setItem("latitude", String(location.coords.latitude));
      localStorage.setItem("longitude", String(location.coords.longitude));
      // longitude.value = location.coords.longitude;
      // latitude.value = location.coords.latitude;
      // position.longitude = location.coords.longitude;
      // position.latitude = location.coords.latitude;
    }
    function error(error) {
      console.log("error:" + error.message);
    }
    return {};
  },
});
</script>
