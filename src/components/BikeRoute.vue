<template>
  <div class="bike-route">
    <div class="list">
      <div class="item" v-for="(item, index) in bikeroute" :key="index">
        <div class="title">
          <h3>{{ item.RouteName }}</h3>
          <p>{{ item.CyclingLength }} m</p>
        </div>
        <p>起站</p>
        <h3>{{ item.RoadSectionStart }}</h3>
        <p>迄站</p>
        <h3>{{ item.RoadSectionEnd }}</h3>
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
import "@/assets/scss/bike-route.scss";

export default defineComponent({
  components: {},
  setup() {
    const city = cityStore();
    const locationCity: string = city.$state.en
      ? city.$state.en
      : window.location.pathname.slice(1);
    let bikeroute = reactive<Model.IBikeRouteResponse[]>([]);

    let pointList = reactive<any[]>([]);

    Api.getBikeRoute(locationCity).then(
      (response: Model.IBikeRouteResponse[]) => {
        bikeroute = Object.assign(bikeroute, response);
        for (const item of bikeroute as Model.IBikeRouteResponse[]) {
          setRoutePoint(item.Geometry).then((res) => {
            Object.assign(item, { GeometryArray: res });
            pointList.push({
              RouteName: item.RouteName,
              RoadSectionStart: item.RoadSectionStart,
              GeometryArray: res,
            });
          });
        }
        EventBus.emit("get-route-list", pointList);
      }
    );

    async function setRoutePoint(Geometry: string): Promise<any[]> {
      const array = Geometry.slice(19, Geometry.length - 2).split(",");
      const newData: any[] = [];

      for (let item of array) {
        const data = item.split(" ");
        // newData.push({
        //   latitude: Number(data[0]),
        //   longitude: Number(data[1]),
        // });
        newData.push([Number(data[0]), Number(data[1])]);
      }

      return Promise.resolve(newData);
    }
    return { bikeroute };
  },
});
</script>
