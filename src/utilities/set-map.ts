import { ref, onMounted, watch } from "vue";
import * as Model from "@/models/interface/youbike";
import L, { Map } from "leaflet";
import { Icon } from "leaflet";

// 顯示多個定位點在地圖上
export function setPoints<T>(placeList: T, map: T, icon: T): void {
  console.log(placeList, map, icon);
  //   for (const item of placeList) {
  // L.marker(
  //   [item.StationPosition.PositionLat, item.StationPosition.PositionLon],
  //   {
  //     icon: icon,
  //   }
  // ).addTo(map);
  //   }
}
