<template>
  <div id="nav"></div>
</template>
<script lang="ts">
import { defineComponent, reactive, onMounted } from "vue";
import "@/assets/scss/common.scss";
import * as d3 from "d3";
interface ResponseData {
  features: any[];
}
export default defineComponent({
  name: "App",
  setup() {
    onMounted(() => {
      let taiwanCountry = reactive([]);
      var projection = d3.geoMercator().center([121, 24]).scale(10000);
      var path = d3.geoPath().projection(projection);
      d3.json<ResponseData>("./map.json")
        .then((data) => {
          console.log(data?.features);
          if (data) {
            let map = d3
              .selectAll("path")
              .data(data.features)
              .enter()
              .append("path")
              .attr("d", path)
              .attr("stroke", "black")
              .attr("stroke-width", "1")
              .attr("fill", "#184200");
          }
        })
        .catch((err) => {
          // Handle err
        });

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

      // // 建立 svg 空間
      // const svg = d3
      //   .select("#nav")
      //   .append("svg")
      //   .attr("width", "100%")
      //   .attr("height", "100%")
      //   .attr("style", "border:5px solid #ff0000");

      // // 取得地圖資料
      // fetch("./map.json")
      //   .then((res) => res.json())
      //   .then((data) => {
      //     taiwanCountry = data.features;
      //     // d3.geoPath(data.features);
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
