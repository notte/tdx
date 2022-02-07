import { AxiosPromise } from "axios";

export function requestFail<T>(error: T): AxiosPromise {
  return Promise.reject(error);
}

export function responseFail<T>(error: T): AxiosPromise {
  return Promise.reject(error);
}
