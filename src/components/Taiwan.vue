<script lang="ts">
import { defineComponent } from "vue";
import * as Model from "@/models/interface/map";
import { cityStore } from "@/store/index";
import EventBus from "@/utilities/event-bus";
import * as d3 from "d3";

export default defineComponent({
  setup() {
    const store = cityStore();
    EventBus.on("send-map-size", (data) => {
      let width = (data as Model.IMapSize).width;
      let height = (data as Model.IMapSize).height;

      // 控制在不同平台地圖縮放大小
      let scale;

      if (width > 1366) {
        scale = 11000;
      } else if (width <= 1366 && width > 480) {
        scale = 9000;
      } else if (width <= 480 && width > 320) {
        scale = 8000;
      } else {
        scale = 6000;
      }

      let projection = d3
        .geoMercator()
        .scale(scale)
        .translate([width / 2, height / 2.5]) // 繪製地圖後，再偏移讓地圖置中
        .center([121, 24]);
      let path = d3.geoPath().projection(projection);
      let svg = d3
        .select(".map")
        .append("svg")
        .attr("width", width)
        .attr("height", height);
      // .attr("preserveAspectRatio", "xMinYMin meet");
      // .attr(
      //   "viewBox",
      //   "0 0 " + (Number(width) + 100) + " " + (Number(height) + 100)
      // )
      // .attr("viewBox", "0 0 " + width + " " + height);

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
              store.en = d.properties["COUNTYENG"].split(" ")[0];
              store.cn = d.properties["COUNTYNAME"];
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
