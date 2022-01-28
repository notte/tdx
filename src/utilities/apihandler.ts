import axios from "axios";

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace API {
  class handler {
    private APPID = "2fb32863865346ed90d14cf06c85479a";
    private APPKey = "cPT6MlWK5aRZjHzHqD7rrnGDj4U";
    private baseURL = "https://ptx.transportdata.tw/MOTC/v2/";
    private url;
    private method;

    constructor(url: string, method: string) {
      this.url = url;
      this.method = method;
    }

    createAxios() {
      const instance = axios.create();
      console.log(instance);
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
  }
}
