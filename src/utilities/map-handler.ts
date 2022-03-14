import * as Model from "@/models/interface/common";
import EventBus from "@/utilities/event-bus";
import { antPath } from "leaflet-ant-path";
import * as L from "leaflet";
import { markercluster } from "leaflet.markercluster";

export const userIcon = new L.Icon({
  iconUrl: "../icons/map.png",
  shadowUrl: "../icons/marker-shadow.png",
  iconSize: [40, 41],
  shadowSize: [41, 41],
  shadowAnchor: [12, 20],
  bounceOnAdd: true,
  bounceOnAddOptions: { duration: 1500, height: 200, loop: 10 },
});
export const bicycleIcon = new L.Icon({
  iconUrl: "../icons/bicycle.png",
  shadowUrl: "../icons/marker-shadow.png",
  iconSize: [40, 41],
  shadowSize: [41, 41],
  shadowAnchor: [12, 20],
  bounceOnAdd: true,
  bounceOnAddOptions: { duration: 1500, height: 200, loop: 10 },
});
export const clickedBicycleIcon = new L.Icon({
  iconUrl: "../icons/clickedBicycle.png",
  shadowUrl: "../icons/marker-shadow.png",
  iconSize: [40, 41],
  shadowSize: [41, 41],
  shadowAnchor: [12, 20],
  bounceOnAdd: true,
  bounceOnAddOptions: { duration: 1500, height: 200, loop: 10 },
});
export const cityCenter: Model.ICityCenter[] = [
  { name: "Taipei", center: [25.083747, 121.561618] },
];

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

export async function setMap(
  markers: L.Marker[],
  map: L.Map
): Promise<boolean> {
  for (const item of markers) {
    item.setIcon(bicycleIcon);
    item.setZIndexOffset(1000);
    item.addTo(map);
  }
  return Promise.resolve(true);
}

export async function createYoubikeMarkers(
  pointList: Model.IPointList[],
  markers: L.Marker[],
  map: L.Map
): Promise<boolean> {
  for (const item of pointList as Model.IPointList[]) {
    const marker = L.marker([item.latitude, item.longitude], {
      icon: bicycleIcon,
    });

    marker.on("click", () => {
      for (const point of markers) {
        map.removeLayer(point as L.Marker);
      }
      setMap(markers, map).then(() => {
        map.panTo([item.latitude, item.longitude]);

        EventBus.emit("map-click-event", {
          StationUID: item.StationUID,
          latitude: item.latitude,
          longitude: item.longitude,
        });

        marker.setIcon(clickedBicycleIcon);
        marker.setZIndexOffset(10000);
      });
    });
    markers.push(marker);
  }

  return Promise.resolve(true);
}

export async function setBikeRouteMarkers(
  route: number[],
  polylines: L.Polyline[],
  map: L.Map
): Promise<boolean> {
  let scale = 15;
  const length = Math.ceil(route.length / 2);
  const antPolyline = antPath(route, {
    use: L.polyline,
    fillColor: "red",
  });
  const center = antPolyline.getBounds().getCenter();
  antPolyline.addTo(map);
  map.panTo(center);

  if (length < 5) {
    scale = 17;
  } else {
    scale = 15;
  }

  map.setZoom(scale);
  polylines.push(antPolyline);
  return Promise.resolve(true);
}

export async function createOtherMarkers(
  pointList: Model.IOtherPointList[],
  map: L.Map
) {
  const markers = markercluster();
  console.log(markers);
  console.log(pointList);
}
