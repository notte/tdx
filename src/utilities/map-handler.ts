import { ref, onMounted, watch } from "vue";
import L from "leaflet";
import { Icon } from "leaflet";
import * as Model from "@/models/interface/common";

export async function createPointList(
  data: any[]
): Promise<Model.IPointList[]> {
  const newData = [];
  for (const item of data) {
    const newItem = {
      name: item.StationName.Zh_tw,
      latitude: item.StationPosition.PositionLat,
      longitude: item.StationPosition.PositionLon,
      StationUID: item.StationUID,
    };
    newData.push(newItem);
  }
  return newData;
}
