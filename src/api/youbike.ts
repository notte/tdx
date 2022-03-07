import APIhandler from "@/utilities/api-handler";
import * as Model from "@/models/interface/youbike";
import { Method } from "axios";

interface IRequestConfig {
  url: string;
  method: Method;
}

export default {
  async getYoubikeStatus(distance: string): Promise<Model.IYoubikeStatus[]> {
    const config: IRequestConfig = {
      url: "Bike/Availability/NearBy/?" + distance,
      method: "get",
    };
    const result = await APIhandler.createAxios(config.url, config.method);
    return <Model.IYoubikeStatus[]>result.data;
  },
  async getYoubikeList(
    distance: string
  ): Promise<Model.IYoubikeListResponse[]> {
    const config: IRequestConfig = {
      url: "Bike/Station/NearBy/?" + distance,
      method: "get",
    };
    const result = await APIhandler.createAxios(config.url, config.method);
    return <Model.IYoubikeListResponse[]>result.data;
  },
};
