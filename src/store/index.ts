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
