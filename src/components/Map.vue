<script lang="ts">
import { defineComponent } from "vue";
import * as Model from "@/models/interface/map";
import EventBus from "@/utilities/event-bus";
import * as d3 from "d3";

export default defineComponent({
  setup() {
    EventBus.on("send-map-size", (data) => {
      let width = (data as Model.IMapSize).width - 100;
      let height = (data as Model.IMapSize).height - 100;

      let projection = d3
        .geoMercator()
        .scale(10000)
        .translate([width / 2, height / 2 - 80])
        .center([121, 24]);
      let path = d3.geoPath().projection(projection);
      let svg = d3
        .select(".map")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("id", "svg-container");
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
            })
            .on("click", (e, d) => {
              EventBus.emit("send-click-city", d.properties["COUNTYNAME"]);
            });
        }
      });

      let zoom = d3
        .zoom()
        .scaleExtent([1, 2])
        .translateExtent([
          [0, 0],
          [width, height],
        ])
        .on("zoom", function (event) {
          g.selectAll("path").attr("transform", event.transform);
        });
      svg.call(zoom as never);
    });
  },
});
</script>
