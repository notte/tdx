<template>
  <router-view />
</template>
<script lang="ts">
import { defineComponent } from "vue";
import { useLoading } from "vue-loading-overlay";
import EventBus from "@/utilities/event-bus";
import { ElNotification } from "element-plus";
import "@/assets/scss/common.scss";

export default defineComponent({
  components: {},
  setup() {
    const options = { enableHighAccuracy: true };

    const $loading = useLoading();
    let loader;

    EventBus.on("show-loading", () => {
      loader = $loading.show({
        backgroundColor: "#333",
        color: "#fff",
        loader: "dots",
      });
    });

    EventBus.on("close-loading", () => {
      if (loader) {
        loader.hide();
      } else {
        return;
      }
    });

    navigator.geolocation.getCurrentPosition(success, error, options);

    function success(location) {
      localStorage.setItem("latitude", String(location.coords.latitude));
      localStorage.setItem("longitude", String(location.coords.longitude));
    }
    function error(error) {
      ElNotification({
        title: "Error",
        message: error.message,
        type: "error",
      });
    }

    return {};
  },
});
</script>
