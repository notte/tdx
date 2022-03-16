<template>
  <div class="bike-route" ref="scrollDOM">
    <div class="list" ref="getListDOM">
      <div
        class="item"
        v-for="(item, index) in bikeroute"
        :key="index"
        @click="
          getClickedRoute(getListDOM, scrollDOM, index, item.GeometryArray)
        "
      >
        <div class="title">
          <h4>{{ item.RouteName }}</h4>
          <p>{{ item.CyclingLength }} m</p>
        </div>
        <div class="start-end">
          <img src="../assets/icons/pin.png" alt="" />
          <p>{{ item.RoadSectionStart }}</p>
        </div>
        <div class="start-end">
          <img src="../assets/icons/flag.png" alt="" />
          <p>{{ item.RoadSectionEnd }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, reactive, ref, onMounted } from "vue";
import * as Model from "@/models/interface/bikeroute";
import * as bikeroute_handler from "@/utilities/bikeroute-handler";
import EventBus from "@/utilities/event-bus";
import { cityStore } from "@/store/index";
import "@/assets/scss/bike-route.scss";

export default defineComponent({
  components: {},
  setup() {
    const getListDOM = ref();
    const scrollDOM = ref();
    const city = cityStore();
    const getClickedRoute = bikeroute_handler.getClickedRoute;
    const locationCity: string = city.$state.en
      ? city.$state.en
      : window.location.pathname.slice(1);

    let bikeroute = reactive<Model.IBikeRouteResponse[]>([]);

    bikeroute_handler.getBikeRouteAPI(locationCity, bikeroute);
    onMounted(() => {
      EventBus.emit("close-loading");
    });

    return { bikeroute, getListDOM, scrollDOM, getClickedRoute };
  },
});
</script>
