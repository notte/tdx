<template>
  <div id="map"></div>
</template>
<script lang="ts">
import { defineComponent, ref, watch } from "vue";
import { userPositionStore } from "@/store/index";
import { IYoubikeListResponse } from "@/models/interface/youbike";
import EventBus from "@/utilities/event-bus";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

export default defineComponent({
  components: {},
  setup() {
    const position = userPositionStore();
    /* eslint-disable no-undef */
    let latitude = ref();
    let longitude = ref();
    let options = { enableHighAccuracy: true };
    let map: any;

    let pointList = ref<IYoubikeListResponse[]>();
    let markers = ref<any[]>([]);

    const userIcon = new L.Icon({
      iconUrl: "../icons/map.png",
      shadowUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
      iconSize: [40, 41],
      shadowSize: [41, 41],
      shadowAnchor: [12, 20],
      bounceOnAdd: true,
      bounceOnAddOptions: { duration: 1500, height: 200, loop: 10 },
    });
    const bicycleIcon = new L.Icon({
      iconUrl: "../icons/bicycle.png",
      shadowUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
      iconSize: [40, 41],
      shadowSize: [41, 41],
      shadowAnchor: [12, 20],
      bounceOnAdd: true,
      bounceOnAddOptions: { duration: 1500, height: 200, loop: 10 },
    });
    const clickedBicycleIcon = new L.Icon({
      iconUrl: "../icons/clickedBicycle.png",
      shadowUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
      iconSize: [40, 41],
      shadowSize: [41, 41],
      shadowAnchor: [12, 20],
      bounceOnAdd: true,
      bounceOnAddOptions: { duration: 1500, height: 200, loop: 10 },
    });

    navigator.geolocation.getCurrentPosition(success, error, options);

    watch(latitude, () => {
      map = L.map("map", { zoom: 16, minZoom: 12 }).setView([
        latitude.value,
        longitude.value,
      ]);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(
        map
      );
      const user = L.marker([latitude.value, longitude.value], {
        icon: userIcon,
      }).addTo(map);

      user.bindPopup("user");
      user.on("click", () => {
        map.panTo([latitude.value, longitude.value]);
      });
    });

    // 接收定位點 Array，標註到畫面上
    EventBus.on("get-bike-list", (data) => {
      pointList.value = data as IYoubikeListResponse[];
      createMarkers(pointList.value).then(() => {
        setMap();
      });
    });

    EventBus.on("bike-click-event", (position) => {
      setMap();
      const latitude = (position as number[])[0];
      const longitude = (position as number[])[1];
      map.panTo([latitude, longitude]);
      for (const item of markers.value) {
        if (item._latlng.lat === latitude) {
          item.setIcon(clickedBicycleIcon);
          item.setZIndexOffset(1000);
        }
      }
    });

    async function createMarkers(
      pointList: IYoubikeListResponse[]
    ): Promise<boolean> {
      for (const item of pointList as IYoubikeListResponse[]) {
        const marker = L.marker(
          [item.StationPosition.PositionLat, item.StationPosition.PositionLon],
          {
            icon: bicycleIcon,
          }
        );
        markers.value.push(marker);

        marker.on("click", () => {
          setMap().then(() => {
            map.panTo([
              item.StationPosition.PositionLat,
              item.StationPosition.PositionLon,
            ]);
            EventBus.emit("map-click-event", {
              StationUID: item.StationUID,
              latitude: item.StationPosition.PositionLat,
              longitude: item.StationPosition.PositionLon,
            });
            marker.setIcon(clickedBicycleIcon);
            marker.setZIndexOffset(1000);
          });
        });
        markers.value.push(marker);
      }
      return Promise.resolve(true);
    }
    async function setMap(): Promise<boolean> {
      for (const item of markers.value) {
        item.setIcon(bicycleIcon);
        item.setZIndexOffset(0);
        item.addTo(map);
      }
      return Promise.resolve(true);
    }
    function success(location: GeolocationPosition): void {
      longitude.value = location.coords.longitude;
      latitude.value = location.coords.latitude;
      position.longitude = location.coords.longitude;
      position.latitude = location.coords.latitude;
    }
    function error(error: GeolocationPositionError): void {
      console.log("error:" + error.message);
    }

    return {
      success,
      error,
      options,
      latitude,
      longitude,
      position,
      createMarkers,
    };
  },
});
</script>
