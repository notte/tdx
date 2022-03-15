import * as Model from "@/models/interface/common";
import EventBus from "@/utilities/event-bus";
import L from "leaflet";
import "leaflet.markercluster";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import { antPath } from "leaflet-ant-path";

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
export const restaurantIcon = new L.Icon({
  iconUrl: "../icons/restaurant.png",
  shadowUrl: "../icons/marker-shadow.png",
  iconSize: [40, 41],
  shadowSize: [41, 41],
  shadowAnchor: [12, 20],
  bounceOnAdd: true,
  bounceOnAddOptions: { duration: 1500, height: 200, loop: 10 },
});
export const scenicspotIcon = new L.Icon({
  iconUrl: "../icons/scenicspot.png",
  shadowUrl: "../icons/marker-shadow.png",
  iconSize: [40, 41],
  shadowSize: [41, 41],
  shadowAnchor: [12, 20],
  bounceOnAdd: true,
  bounceOnAddOptions: { duration: 1500, height: 200, loop: 10 },
});
export const activityIcon = new L.Icon({
  iconUrl: "../icons/activity.png",
  shadowUrl: "../icons/marker-shadow.png",
  iconSize: [40, 41],
  shadowSize: [41, 41],
  shadowAnchor: [12, 20],
  bounceOnAdd: true,
  bounceOnAddOptions: { duration: 1500, height: 200, loop: 10 },
});
export const hotelIcon = new L.Icon({
  iconUrl: "../icons/hotel.png",
  shadowUrl: "../icons/marker-shadow.png",
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
  const antPolyline = antPath(route, {
    paused: false,
    reverse: false,
    delay: 2000,
    dashArray: [10, 20],
    weight: 6,
    opacity: 0.5,
  }).addTo(map);
  map.fitBounds(antPolyline.getBounds());
  polylines.push(antPolyline);
  return Promise.resolve(true);
}

export async function createOtherMarkers(
  pointList: Model.IOtherPointList[],
  type: string,
  markerGroup: L.MarkerClusterGroup,
  map: L.Map
): Promise<boolean> {
  for (const item of pointList) {
    if (item.address === undefined) {
      item.address = "";
    }
    if (item.opentime === undefined) {
      item.opentime = "";
    }

    const marker = L.marker([item.latitude, item.longitude]);
    const popup = L.popup({
      keepInView: true,
      closeButton: false,
      maxHeight: 100,
    }).setContent(
      "<h2>" +
        item.name +
        "</h2>" +
        "<p>" +
        item.address +
        "</p>" +
        "<p>" +
        item.opentime +
        "</p>"
    );
    marker.on("click", () => {
      marker.bindPopup(popup).openPopup();
      marker.setZIndexOffset(10000);
    });

    switch (type) {
      case "restaurant":
        marker.setIcon(restaurantIcon);
        break;
      case "scenicspot":
        marker.setIcon(scenicspotIcon);
        break;
      case "activity":
        marker.setIcon(activityIcon);
        break;
      case "hotel":
        marker.setIcon(hotelIcon);
        break;

      default:
        break;
    }
    markerGroup.addLayer(marker);
  }

  map.addLayer(markerGroup);

  return Promise.resolve(true);
}
