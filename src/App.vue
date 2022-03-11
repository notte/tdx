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

    navigator.geolocation.getCurrentPosition(success, error, options);

    function success(location) {
      localStorage.setItem("latitude", String(location.coords.latitude));
      localStorage.setItem("longitude", String(location.coords.longitude));
    }
    function error(error) {
      console.log("error:" + error.message);
    }

    return {};
  },
});
</script>
