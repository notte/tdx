import { defineStore } from "pinia";

export const cityStore = defineStore("city", {
  state: () => {
    return {
      cn: "",
      en: "",
    };
  },
  getters: {
    cnCity: (state) => state.cn,
    enCity: (state) => state.en,
  },
  actions: {
    increment() {
      console.log("increment");
      return this;
    },
  },
});

export const userPositionStore = defineStore("user-position", {
  state: () => {
    return {
      latitude: 0,
      longitude: 0,
    };
  },
  getters: {
    getLatitude: (state) => state.latitude,
    getLongitude: (state) => state.longitude,
  },
  actions: {
    increment() {
      console.log("increment");
      return this;
    },
  },
});
