import axios, {
  AxiosRequestConfig,
  AxiosRequestHeaders,
  AxiosResponse,
  Method,
} from "axios";
import { requestFail, responseFail } from "@/utilities/error-handler";
import { ElNotification } from "element-plus";
import jsSHA from "jssha";

class handler {
  config: AxiosRequestConfig;

  constructor() {
    this.config = {
      baseURL: "https://ptx.transportdata.tw/MOTC/v2/",
      responseType: "json",
      headers: this.GetAuthorizationHeader(),
    };
  }

  async createAxios(url: string, method: Method): Promise<AxiosResponse> {
    this.config.url = url;
    this.config.method = method;
    const instance = axios.create();

    instance.interceptors.request.use(
      (config) => {
        return config;
      },
      (error) => {
        requestFail(error);
      }
    );
    instance.interceptors.response.use(
      (response) => {
        return response;
      },
      (error) => {
        responseFail(error);
      }
    );

    let result;

    try {
      result = await instance.request(this.config);
      return Promise.resolve(result);
    } catch (error) {
      ElNotification({
        title: "Error",
        message: "get result fail",
        type: "error",
      });
      return Promise.reject(error);
    }
  }

  GetAuthorizationHeader(): AxiosRequestHeaders {
    const APPID = "2fb32863865346ed90d14cf06c85479a";
    const APPKey = "cPT6MlWK5aRZjHzHqD7rrnGDj4U";
    const GMTString = new Date().toUTCString();
    const ShaObj = new jsSHA("SHA-1", "TEXT");

    ShaObj.setHMACKey(APPKey, "TEXT");
    ShaObj.update("x-date: " + GMTString);
    const HMAC = ShaObj.getHMAC("B64");

    const Authorization =
      'hmac username="' +
      APPID +
      '", algorithm="hmac-sha1", headers="x-date", signature="' +
      HMAC +
      '"';

    return { Authorization: Authorization, "X-Date": GMTString };
  }
}

const APIhandler = new handler();

export default APIhandler;
