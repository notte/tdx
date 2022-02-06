import axios, { AxiosRequestConfig, Method } from "axios";
import jsSHA from "jssha";

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace API {
  export class handler {
    config: AxiosRequestConfig;

    constructor(url: string, method: Method) {
      this.config = {
        url: url,
        method: method,
        baseURL: "https://ptx.transportdata.tw/MOTC/v2/",
        responseType: "json",
        headers: this.GetAuthorizationHeader(),
      };
    }

    createAxios() {
      const instance = axios.create();

      instance.interceptors.request.use(
        (config) => {
          // requestSuccess(config)
        },
        (err) => {
          // requestFail(err);
        }
      );
      instance.interceptors.response.use(
        (response) => {
          console.log(response);
          // responseSuccess(response)
        },
        (err) => {
          console.log(err);
          // responseFail(error)
        }
      );

      let result;

      try {
        result = instance.request(this.config);
      } catch (error) {
        console.log(error);
      }

      //   axios({
      //     method: "GET",
      //     url: `${BASE_URL}/get`,
      //     params: user,
      //   })
      //     .then((res: AxiosResponse) => {
      //       console.log("res: ", res);
      //       return res.data;
      //     })
      //     .then((data: User) => {
      //       console.log("data: ", data);
      //     })
      //     .catch((err: any) => {
      //       console.log("err: ", err);
      //     });
    }

    GetAuthorizationHeader() {
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

    requestSuccess(config: AxiosRequestConfig) {
      //
    }
    requestFail(error: any) {
      console.log(error);
    }
  }
}
