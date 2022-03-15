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
import { defineComponent, reactive, ref } from "vue";
import * as Model from "@/models/interface/bikeroute";
import * as bikeroute_handler from "@/utilities/bikeroute-handler";
import { cityStore } from "@/store/index";
import Api from "@/api/bikeroute";
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

    Api.getBikeRoute(locationCity).then(
      (response: Model.IBikeRouteResponse[]) => {
        bikeroute = Object.assign(bikeroute, response);

        for (let item of bikeroute) {
          bikeroute_handler.setRoutePoint(item).then((res) => {
            item.GeometryArray = res;
          });
        }

        bikeroute.sort((a, b) => {
          return Number(a.CyclingLength) - Number(b.CyclingLength);
        });
        for (let index in bikeroute as Model.IBikeRouteResponse[]) {
          if (bikeroute[index].RoadSectionStart === undefined) {
            bikeroute.splice(Number(index), 1);
          }
          if (bikeroute[index].RoadSectionEnd === undefined) {
            bikeroute.splice(Number(index), 1);
          }
        }
      }
    );

    return { bikeroute, getListDOM, scrollDOM, getClickedRoute };
  },
});
</script>
