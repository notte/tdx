import { ref } from "vue";
import * as Model from "@/models/interface/youbike";
import { ElNotification } from "element-plus";
import { IPointList } from "@/models/interface/common";
import { GeodesicLine } from "leaflet.geodesic";
import EventBus from "@/utilities/event-bus";
import Api from "@/api/youbike";
import L from "leaflet";

const latitude = Number(localStorage.getItem("latitude"));
const longitude = Number(localStorage.getItem("longitude"));
const distance = ref<string>(
  "&%24spatialFilter=nearby(" +
    latitude +
    "%2C%20" +
    longitude +
    "%2C%20" +
    500 +
    ")&%24"
);

export async function getYoubikeStatusAPI(
  youbikeStatus: Model.IYoubikeStatus[],
  youbikeList: Model.IYoubikeListResponse[]
): Promise<boolean> {
  Api.getYoubikeStatus(distance.value)
    .then((response: Model.IYoubikeStatus[]) => {
      youbikeStatus = Object.assign(youbikeStatus, response);
    })
    .catch((error) => {
      ElNotification({
        title: "Error",
        message: error.message,
        type: "error",
      });
    });
  await getYoubikeListAPI(youbikeList);
  return Promise.resolve(true);
}

export function getYoubikeListAPI(
  youbikeList: Model.IYoubikeListResponse[]
): void {
  Api.getYoubikeList(distance.value)
    .then((response: Model.IYoubikeListResponse[]) => {
      youbikeList = Object.assign(youbikeList, response);
    })
    .catch((error) => {
      ElNotification({
        title: "Error",
        message: error.message,
        type: "error",
      });
    });
}

export async function renderYoubikeList(
  youbikeList: Model.IYoubikeListResponse[],
  pointList: IPointList[],
  youbikeStatus: Model.IYoubikeStatus[]
): Promise<boolean> {
  const UserPosition = new L.LatLng(latitude, longitude);
  let status;

  for (const item of youbikeStatus) {
    if (item.StationUID === item.StationUID) {
      status = {
        AvailableRentBikes: item.AvailableRentBikes,
        AvailableReturnBikes: item.AvailableReturnBikes,
      };
    }
  }
  for (let item of youbikeList) {
    pointList.push({
      StationUID: item.StationUID,
      latitude: item.StationPosition.PositionLat,
      longitude: item.StationPosition.PositionLon,
    });
    const BikeStation = new L.LatLng(
      item.StationPosition.PositionLat,
      item.StationPosition.PositionLon
    );

    const line = new GeodesicLine();
    const distance = line.distance(UserPosition, BikeStation);

    item = Object.assign(item, status, {
      distance: Math.floor(distance),
    });
  }

  youbikeList.sort((a, b) => {
    return Number(a.distance) - Number(b.distance);
  });

  EventBus.emit("get-bike-list", pointList);
  return Promise.resolve(true);
}

export function getClickedBike(
  id: string,
  latitude: number,
  longitude: number,
  getListDOM: HTMLElement,
  scrollDOM: HTMLElement
): void {
  const Array = getListDOM?.children;

  for (let index = 0; index < Array?.length; index++) {
    const className = Array[index].classList.value.lastIndexOf("active");

    if (className !== -1) {
      Array[index].classList.value = Array[index].classList.value.replace(
        "active",
        ""
      );
    }
    if (Array[index].classList[0] == id) {
      Array[index].classList.value = id + " item active";
      scrollDOM.scrollTop = 172 * index;
    }
  }
  EventBus.emit("bike-click-event", [latitude, longitude, id]);
}
