<template>
  <div id="nav"></div>
</template>
<script lang="ts">
import { defineComponent, onMounted } from "vue";
import "@/assets/scss/common.scss";
import * as Model from "@/models/interface/map";
import * as d3 from "d3";

export default defineComponent({
  name: "App",
  setup() {
    onMounted(() => {
      // 建立 svg 容器
      const svg = d3
        .select("#nav")
        .append("svg")
        .attr("width", "100%")
        .attr("height", "100%")
        .attr("style", "border:3px solid #999999")
        .attr("id", "container");
      // 設定投影方式
      let projection = d3.geoMercator().center([121, 24]).scale(100);
      // 產生 path function
      let path = d3.geoPath().projection(projection) as any;
      console.log(path);
      // 取得 地圖資料
      d3.json<Model.IResponseData>("./map.geojson")
        .then((data) => {
          if (data) {
            svg
              .selectAll("path")
              .data(data.features)
              .enter()
              .append("path")
              .attr("d", path)
              .attr("id", (d, i) => {
                return "data" + i;
              });
          }
        })
        .catch();
    });

    return {};
  },
});
</script>
