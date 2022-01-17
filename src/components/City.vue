<template>
  <div>city</div>
</template>
<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  components: {},
  setup() {
    navigator.geolocation.getCurrentPosition((position) => {
      console.log(position.coords.latitude, position.coords.longitude);
    });

    let watchId = navigator.geolocation.watchPosition((position) => {
      console.log(position.coords.latitude, position.coords.longitude);
    });

    console.log(watchId);

    return {};
  },
});
</script>
