import APIhandler from "@/utilities/api-handler";
import * as Model from "@/models/interface/bikeroute";
import { Method } from "axios";

interface IRequestConfig {
  url: string;
  method: Method;
}

export default {
  async getBikeRoute(city: string): Promise<Model.IBikeRouteResponse[]> {
    const config: IRequestConfig = {
      url: "Cycling/Shape/" + city,
      method: "get",
    };
    const result = await APIhandler.createAxios(config.url, config.method);
    return <Model.IBikeRouteResponse[]>result.data;
  },
};
