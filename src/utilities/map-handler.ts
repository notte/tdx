import * as Model from "@/models/interface/common";
import EventBus from "@/utilities/event-bus";
import * as L from "leaflet";

export const userIcon = new L.Icon({
  iconUrl: "../icons/map.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
  iconSize: [40, 41],
  shadowSize: [41, 41],
  shadowAnchor: [12, 20],
  bounceOnAdd: true,
  bounceOnAddOptions: { duration: 1500, height: 200, loop: 10 },
});
export const bicycleIcon = new L.Icon({
  iconUrl: "../icons/bicycle.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
  iconSize: [40, 41],
  shadowSize: [41, 41],
  shadowAnchor: [12, 20],
  bounceOnAdd: true,
  bounceOnAddOptions: { duration: 1500, height: 200, loop: 10 },
});
export const clickedBicycleIcon = new L.Icon({
  iconUrl: "../icons/clickedBicycle.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
  iconSize: [40, 41],
  shadowSize: [41, 41],
  shadowAnchor: [12, 20],
  bounceOnAdd: true,
  bounceOnAddOptions: { duration: 1500, height: 200, loop: 10 },
});
export async function renderMap(
  latitude: number,
  longitude: number
): Promise<L.Map> {
  const map = L.map("map", { zoom: 16, minZoom: 15 }).setView([
    latitude,
    longitude,
  ]);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);
  return Promise.resolve(map);
}
// 建立標註點陣列
export async function createMarkers(
  pointList: Model.IPointList[],
  markers: L.Marker[],
  map: L.Map
): Promise<boolean> {
  // 迭代標註點列表資料
  for (const item of pointList as Model.IPointList[]) {
    // 建立標註點
    const marker = L.marker([item.latitude, item.longitude], {
      icon: bicycleIcon,
    });

    // 綁定點擊事件，單一標註點被點擊
    marker.on("click", () => {
      // 先重新將所有標註點放到地圖上（以免出現多個被點擊 icon 樣式）
      setMap(markers, map).then(() => {
        // 地圖中心移到被點擊的標注點
        map.panTo([item.latitude, item.longitude]);

        // 發送地圖被點擊事件給列表組件，帶入 id 及經緯度
        EventBus.emit("map-click-event", {
          StationUID: item.StationUID,
          latitude: item.latitude,
          longitude: item.longitude,
        });

        // 替換被點擊 icon  樣式
        marker.setIcon(clickedBicycleIcon);
        // 將被點擊 icon z-index 層級提升
        marker.setZIndexOffset(1000);
      });
    });
    // 加入到陣列中
    markers.push(marker);
  }

  return Promise.resolve(true);
}
// 將標註點顯示於地圖（初始狀態）
export async function setMap(
  markers: L.Marker[],
  map: L.Map
): Promise<boolean> {
  // 迭代標註點陣列
  for (const item of markers) {
    item.setIcon(bicycleIcon);
    item.setZIndexOffset(0);
    item.addTo(map);
  }
  // const markerPane = map.getPane("markerPane");
  // const shadowPane = map.getPane("shadowPane");
  // console.log(markerPane, shadowPane);
  return Promise.resolve(true);
}
