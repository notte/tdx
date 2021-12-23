<template>
  <div id="nav"></div>
</template>
<script lang="ts">
import { defineComponent, reactive, onMounted } from "vue";
import "@/assets/scss/common.scss";
import * as d3 from "d3";
import * as turf from "@turf/rewind";
import * as polygon from "@turf/helpers";
interface ResponseData {
  features: any[];
}
export default defineComponent({
  name: "App",
  setup() {
    onMounted(() => {
      let taiwanCountry = reactive([]);

      // 在頁面加入 svg
      const svg = d3
        .select("#nav")
        .append("svg")
        .attr("width", "100%")
        .attr("height", "100%")
        .attr("style", "border:5px solid #ff0000")
        .attr("id", "container");

      // 獲取寬高
      // const width = document.getElementById("container")?.clientWidth || 0;
      // const height = document.getElementById("container")?.clientHeight || 0;

      // let mercatorScale,
      //   w = window.screen.width;
      // if (w > 1366) {
      //   mercatorScale = 11000;
      // } else if (w <= 1366 && w > 480) {
      //   mercatorScale = 9000;
      // } else {
      //   mercatorScale = 6000;
      // }

      let path = d3
        .geoPath()
        .projection(d3.geoMercator().center([121, 24]).scale(10));

      // // 取得地圖資料
      fetch("./map.json")
        .then((res) => res.json())
        .then((data) => {
          taiwanCountry = data.features;

          console.log(taiwanCountry);
          svg
            .selectAll("path")
            .data(taiwanCountry)
            .enter()
            .append("path")
            .attr("id", (d, i) => {
              return "data" + i;
            })
            .attr("d", path);
          // .attr("stroke", "black")
          // .attr("stroke-width", "1")
          // .attr("fill", "#ffffff")
        });

      // d3.json<ResponseData>("./map.json")
      //   .then((data) => {
      //     if (data) {
      //       svg
      //         .selectAll("path")
      //         .data(data.features)
      //         .enter()
      //         .append("path")
      //         .attr("d", path)
      //         .attr("stroke", "black")
      //         .attr("stroke-width", "1")
      //         .attr("fill", "#ffffff");
      //     }
      //   })
      //   .catch((err) => {
      //     // Handle err
      //   });

      // var map = d3
      //   .select("g")
      //   .selectAll("path")
      //   .data(geojson.features)
      //   .enter()
      //   .append("path")
      //   .attr("d", path)
      //   .attr("stroke", "black")
      //   .attr("stroke-width", "1")
      //   .attr("fill", "#184200")
      //   .on("mouseover", function (d) {
      //     d3.select(this).attr("fill", "#e0f9d1");
      //   })
      //   .on("mouseleave", function (d) {
      //     d3.select(this).attr("fill", "#184200");
      //   });

      // // 設定投影方式
      // const projection = d3.geoMercator().center([121, 24]);
      // // 轉換成路徑資料
      // const path = d3.geoPath().projection(projection);
      // console.log(projection);
      // svg
      //   .selectAll("path")
      //   .data(taiwanCountry)
      //   .enter()
      //   .append("path")
      //   .attr("d", path)
      //   .attr("stroke-width", 3)
      //   .attr("stroke", "#000000")
      //   .attr("fill", "#ffffff");
    });

    return {};
  },
});
</script>
