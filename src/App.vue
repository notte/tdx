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
      let projection = d3
        .geoMercator()
        .scale(10000)
        .translate([width / 2, height / 2 - 80])
        .center([121, 24]);
      let path = d3.geoPath().projection(projection);
      let svg = d3
        .select("#nav")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("style", "border:3px solid #999999")
        .attr("id", "container");
      let g = svg.append("g").attr("id", "group");

      d3.json<Model.IResponseData>("./map.geojson").then((data) => {
        if (data) {
          g.selectAll("path")
            .data(data.features)
            .enter()
            .append("path")
            .attr("d", path as never)
            .attr("id", (d) => {
              return d.properties["COUNTYENG"].split(" ")[0];
            });
        }
      });

      let zoom = d3
        .zoom()
        .scaleExtent([1, 3])
        .on("zoom", function (event) {
          g.selectAll("path").attr("transform", event.transform);
        });
      svg.call(zoom as never);
    });

    return {};
  },
});
</script>
