<script lang="ts">
import { defineComponent } from "vue";
import * as Model from "@/models/interface/map";
import { cityStore } from "@/store/index";
import EventBus from "@/utilities/event-bus";
import * as d3 from "d3";

export default defineComponent({
  setup() {
    const city = cityStore();
    EventBus.on("send-map-size", (data) => {
      let width = (data as Model.IMapSize).width;
      let height = (data as Model.IMapSize).height;

      let scale;

      if (width > 1366) {
        scale = 11000;
      } else if (width <= 1366 && width > 480) {
        scale = 10000;
      } else if (width <= 480 && width > 320) {
        scale = 8000;
      } else {
        scale = 6000;
      }

      let projection = d3
        .geoMercator()
        .scale(scale)
        .translate([width / 2, height / 2.5])
        .center([121, 24]);
      let path = d3.geoPath().projection(projection);
      let svg = d3
        .select(".map")
        .append("svg")
        .attr("width", width)
        .attr("height", height);

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
              city.en = d.properties["COUNTYENG"].split(" ")[0];
              city.cn = d.properties["COUNTYNAME"];
              if (document.querySelector(".active")) {
                document.querySelector(".active")?.classList.remove("active");
              }
              document.getElementById(e.srcElement.id)?.classList.add("active");
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
