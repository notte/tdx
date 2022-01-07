<template>
  <div class="container">
    <div class="map" ref="map">
      <Map />
    </div>
    <div class="menu">
      <div class="position">
        <p>想要去哪裡呢？</p>
        <h2 ref="local">選一個地方吧</h2>
        <button>出發</button>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import Map from "@/components/Map.vue";
import EventBus from "@/utilities/event-bus";
import * as Model from "@/models/interface/map";
import "@/assets/scss/map.scss";

export default defineComponent({
  components: {
    Map,
  },
  setup() {
    const map = ref();
    const local = ref();
    onMounted(() => {
      const data: Model.IMapSize = {
        width: map.value.offsetWidth,
        height: map.value.offsetHeight,
      };
      EventBus.emit("send-map-size", data);
      EventBus.on("send-click-city", (data) => {
        local.value.innerHTML = data;
      });
    });
    return { map, local };
  },
});
</script>
