<template>
  <div id="map"></div>
</template>
<script lang="ts">
import { defineComponent, onMounted, reactive, ref } from "vue";
import EventBus from "@/utilities/event-bus";
import { IPointList, IBikeRoutePointList } from "@/models/interface/common";
import { IOtherPointList } from "@/models/interface/other";
import * as map_handler from "@/utilities/map-handler";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster";
import "leaflet.markercluster/dist/MarkerCluster.css";
import { cityStore } from "@/store";

export default defineComponent({
  components: {},
  setup() {
    const city = cityStore();
    const latitude = Number(localStorage.getItem("latitude"));
    const longitude = Number(localStorage.getItem("longitude"));

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
      if (page !== localStorage.getItem("tab")) {
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
        localStorage.setItem("tab", String(page));
      } else {
        return;
      }

      if (page === "YoubikeList") {
        map.setMinZoom(15);
        map.flyTo([latitude, longitude], 16);
        user.addTo(map);
      }

      if (page === "BikeRoute") {
        map.setMinZoom(11);
        for (const item of map_handler.cityCenter) {
          if (item.name === city.en) {
            map.flyTo([item.center[0], item.center[1]], 14);
          }
        }
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
          console.log(error);
        });
    });

    EventBus.on("get-route-list", (data) => {
      pointList.value = data as IBikeRoutePointList[];
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
          item.setZIndexOffset(1000);
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

    return {
      latitude,
      longitude,
    };
  },
});
</script>
