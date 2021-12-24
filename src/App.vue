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
      let width = window.innerWidth,
        height = window.innerHeight;
      const svg = d3
        .select("#nav")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("style", "border:3px solid #999999")
        .attr("id", "container");

      let projection = d3
        .geoMercator()
        .scale(100)
        .translate([width / 2, height / 2 - 80])
        .center([121, 24]);
      let path = d3.geoPath().projection(projection);

      let zoom = d3.zoom().scaleExtent([1, 30]);
      console.log(zoom);

      d3.json<Model.IResponseData>("./map.geojson")
        .then((data) => {
          if (data) {
            svg
              .selectAll("path")
              .data(data.features)
              .enter()
              .append("path")
              .attr("d", path as never)
              .attr("id", (d) => {
                return d.properties["COUNTYENG"].split(" ")[0];
              })
              .call(zoom as never);
          }
        })
        .catch();
      svg.call(d3.zoom());
    });

    return {};
  },
});
</script>
