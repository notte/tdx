import APIhandler from "@/utilities/api-handler";
import * as Model from "@/models/interface/other";
import { Method } from "axios";

interface IRequestConfig {
  url: string;
  method: Method;
}

export default {
  async getFood(city: string): Promise<Model.IGetFoodResponse[]> {
    const config: IRequestConfig = {
      url: "Tourism/Restaurant/" + city,
      method: "get",
    };
    const result = await APIhandler.createAxios(config.url, config.method);
    return <Model.IGetFoodResponse[]>result.data;
  },
  async getSightsee(city: string): Promise<Model.IGetSightseeResponse[]> {
    const config: IRequestConfig = {
      url: "Tourism/ScenicSpot/" + city,
      method: "get",
    };
    const result = await APIhandler.createAxios(config.url, config.method);
    return <Model.IGetSightseeResponse[]>result.data;
  },
  async getParty(city: string): Promise<Model.IGetPartyResponse[]> {
    const config: IRequestConfig = {
      url: "Tourism/Activity/" + city,
      method: "get",
    };
    const result = await APIhandler.createAxios(config.url, config.method);
    return <Model.IGetPartyResponse[]>result.data;
  },
  async getRoom(city: string): Promise<Model.IGetRoomResponse[]> {
    const config: IRequestConfig = {
      url: "Tourism/Hotel/" + city,
      method: "get",
    };
    const result = await APIhandler.createAxios(config.url, config.method);
    return <Model.IGetRoomResponse[]>result.data;
  },
};
