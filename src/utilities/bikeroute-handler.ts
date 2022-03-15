import * as Model from "@/models/interface/bikeroute";
import EventBus from "@/utilities/event-bus";
import Wkt from "wicket";

export async function setRoutePoint(
  item: Model.IBikeRouteResponse
): Promise<number[]> {
  const wkt = new Wkt.Wkt();
  const array = wkt.read(item.Geometry).toJson();
  const newData: number[] = [];
  for (let i = 0; i < array.coordinates.length; i++) {
    for (let j = 0; j < array.coordinates[i].length; j++) {
      newData.push(array.coordinates[i][j].reverse());
    }
  }
  return Promise.resolve(newData as number[]);
}

export function getClickedRoute(
  getListDOM: HTMLElement,
  scrollDOM: HTMLElement,
  index: number,
  route: number[]
): void {
  const Array = getListDOM.children;
  for (let index = 0; index < Array.length; index++) {
    Array[index].classList.value = Array[index].classList.value.replace(
      "active",
      ""
    );
  }
  Array[index].classList.value = "item active";
  scrollDOM.scrollTop = 126 * index;
  EventBus.emit("route-click-event", route);
}
