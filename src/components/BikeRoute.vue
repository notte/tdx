<template>
  <div class="bike-route" ref="scrollDOM">
    <div class="list" ref="getListDOM">
      <div
        class="item"
        v-for="(item, index) in bikeroute"
        :key="index"
        @click="getClickedRoute(index, item.GeometryArray)"
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
import { cityStore } from "@/store/index";
import EventBus from "@/utilities/event-bus";
import Api from "@/api/bikeroute";
import Wkt from "wicket";
import "@/assets/scss/bike-route.scss";

export default defineComponent({
  components: {},
  setup() {
    const getListDOM = ref();
    const scrollDOM = ref();
    const city = cityStore();

    const locationCity: string = city.$state.en
      ? city.$state.en
      : window.location.pathname.slice(1);
    let bikeroute = reactive<Model.IBikeRouteResponse[]>([]);

    Api.getBikeRoute(locationCity).then(
      (response: Model.IBikeRouteResponse[]) => {
        bikeroute = Object.assign(bikeroute, response);

        for (let item of bikeroute) {
          setRoutePoint(item).then((res) => {
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
        EventBus.emit("get-route-list", bikeroute);
      }
    );

    async function setRoutePoint(
      item: Model.IBikeRouteResponse
    ): Promise<number[]> {
      const wkt = new Wkt.Wkt();
      let array = wkt.read(item.Geometry).toJson();
      let newData: number[] = [];
      for (let i = 0; i < array.coordinates.length; i++) {
        for (let j = 0; j < array.coordinates[i].length; j++) {
          newData.push(array.coordinates[i][j].reverse());
        }
      }
      return Promise.resolve(newData as number[]);
    }

    function getClickedRoute(index: number, route: number[]) {
      const Array = getListDOM.value.children;
      for (let index = 0; index < Array.length; index++) {
        Array[index].classList.value = Array[index].classList.value.replace(
          "active",
          ""
        );
      }
      Array[index].classList.value = "item active";
      scrollDOM.value.scrollTop = 126 * index;
      EventBus.emit("route-click-event", route);
    }

    return { bikeroute, getListDOM, scrollDOM, getClickedRoute };
  },
});
</script>
