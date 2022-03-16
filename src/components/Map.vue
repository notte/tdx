<template>
  <div id="map"></div>
</template>
<script lang="ts">
import { defineComponent, onMounted, reactive, ref } from "vue";
import EventBus from "@/utilities/event-bus";
import { IPointList, IBikeRoutePointList } from "@/models/interface/common";
import { IOtherPointList } from "@/models/interface/other";
import * as map_handler from "@/utilities/map-handler";
import { ElNotification } from "element-plus";
import { cityStore } from "@/store/index";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster";
import "leaflet.markercluster/dist/MarkerCluster.css";

export default defineComponent({
  components: {},
  setup() {
    const latitude = Number(localStorage.getItem("latitude"));
    const longitude = Number(localStorage.getItem("longitude"));
    const city = cityStore();

    let map: L.Map;
    let pointList = ref<IPointList[] | IBikeRoutePointList[]>();
    let otherPointList = reactive<IOtherPointList[]>([]);
    let markers = ref<L.Marker[]>([]);
    const markerGroup = L.markerClusterGroup();

    let polylines = ref<L.Polyline[]>([]);

    const user: L.Marker = L.marker([latitude, longitude], {
      icon: map_handler.userIcon,
    });
    user.bindPopup("user");
    user.on("click", () => {
      map.panTo([latitude, longitude]);
    });

    onMounted(() => {
      map_handler.renderMap(latitude, longitude).then((res) => {
        map = res;
        user.addTo(map);
      });
    });

    EventBus.on("click-tab", (page) => {
      if (page === localStorage.getItem("tab")) {
        return;
      }

      localStorage.setItem("tab", String(page));

      for (let item of markers.value) {
        map.removeLayer(item as L.Marker);
      }
      for (let item of polylines.value) {
        map.removeLayer(item as L.Polyline);
      }
      markerGroup.eachLayer((layer) => {
        if (layer instanceof L.Marker) {
          markerGroup.removeLayer(layer);
        }
      });

      map.removeLayer(user as L.Marker);
      pointList.value = [];
      markers.value = [];
      polylines.value = [];

      if (page === "YoubikeList") {
        map.setMinZoom(15);
        map.flyTo([latitude, longitude], 16);
        user.addTo(map);
      }

      if (page === "BikeRoute") {
        map.setMinZoom(11);
        let lat;
        let lon;

        switch (city.en) {
          case "Taipei":
            lat = 25.083747;
            lon = 121.561618;
            break;
          case "Taoyuan":
            lat = 24.93759;
            lon = 121.2168;
            break;
          case "Taichung":
            lat = 24.23321;
            lon = 120.9417;
            break;
          case "Tainan":
            lat = 23.1417;
            lon = 120.2513;
            break;
          case "Kaohsiung":
            lat = 23.01087;
            lon = 120.666;
            break;
          case "Keelung":
            lat = 25.10898;
            lon = 121.7081;
            break;
          case "HsinchuCounty":
            lat = 24.80395;
            lon = 120.9647;
            break;
          case "MiaoliCounty":
            lat = 24.48927;
            lon = 120.9417;
            break;
          case "PingtungCounty":
            lat = 22.54951;
            lon = 120.62;
            break;
          case "KinmenCounty":
            lat = 24.43679;
            lon = 118.3186;
            break;
          case "ChiayiCounty":
            lat = 23.45889;
            lon = 120.574;
            break;
          case "ChanghuaCounty":
            lat = 23.99297;
            lon = 120.4818;
            break;
          case "YunlinCounty":
            lat = 23.75585;
            lon = 120.3897;
            break;
          case "HualienCounty":
            lat = 23.7569;
            lon = 121.3542;
            break;
          case "YilanCounty":
            lat = 24.69295;
            lon = 121.7195;
            break;
          case "TaitungCounty":
            lat = 22.98461;
            lon = 120.9876;
            break;
          case "NantouCounty":
            lat = 23.83876;
            lon = 120.9876;
            break;
          default:
            break;
        }

        if (city.en.indexOf("NewTaipei") === 0) {
          lat = 24.91571;
          lon = 121.6739;
        }

        map.flyTo([lat, lon], 11);
      }
    });

    EventBus.on("get-bike-list", (data) => {
      pointList.value = data as IPointList[];
      map_handler
        .createYoubikeMarkers(pointList.value, markers.value as L.Marker[], map)
        .then(() => {
          map_handler.setMap(markers.value as L.Marker[], map);
        })
        .catch((error) => {
          ElNotification({
            title: "Error",
            message: error.message,
            type: "error",
          });
        });
    });

    EventBus.on("get-other-list", (data) => {
      markerGroup.eachLayer((layer) => {
        if (layer instanceof L.Marker) {
          markerGroup.removeLayer(layer);
        }
      });
      otherPointList = [];
      otherPointList = (data as IOtherPointList | string[])[0];
      const type = (data as IOtherPointList | string[])[1];
      map_handler.createOtherMarkers(otherPointList, type, markerGroup, map);
    });

    EventBus.on("bike-click-event", (position) => {
      for (let item of markers.value) {
        map.removeLayer(item as L.Marker);
      }
      map_handler.setMap(markers.value as L.Marker[], map);

      const latitude = (position as number[])[0];
      const longitude = (position as number[])[1];

      map.panTo([latitude, longitude]);

      for (const item of markers.value) {
        if (item.getLatLng().lat === latitude) {
          item.setIcon(map_handler.clickedBicycleIcon);
          item.setZIndexOffset(999);
        }
      }
    });

    EventBus.on("route-click-event", (route) => {
      for (let item of polylines.value) {
        map.removeLayer(item as L.Polyline);
      }

      map_handler.setBikeRouteMarkers(
        route as number[],
        polylines.value as L.Polyline[],
        map
      );
    });
  },
});
</script>
