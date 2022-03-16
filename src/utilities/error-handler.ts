import { AxiosPromise } from "axios";
import { ElNotification } from "element-plus";

export function requestFail<T>(error: T): AxiosPromise {
  ElNotification({
    title: "Error",
    message: "request Fail",
    type: "error",
  });
  return Promise.reject(error);
}

export function responseFail<T>(error: T): AxiosPromise {
  ElNotification({
    title: "Error",
    message: "response fail",
    type: "error",
  });
  return Promise.reject(error);
}
