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
      const svg = d3
        .select("#nav")
        .append("svg")
        .attr("width", "100%")
        .attr("height", "100%")
        .attr("style", "border:3px solid #999999")
        .attr("id", "container");
      // 121, 24
      let projection = d3.geoMercator().center([121, 24]).scale(1000);
      let path = d3.geoPath().projection(projection);
      console.log(path);

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
              });
          }
        })
        .catch();
      svg.call(d3.zoom());
    });

    return {};
  },
});
</script>
