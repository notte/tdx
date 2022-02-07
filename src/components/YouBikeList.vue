<template>
  <div class="youbike-list">
    <div class="search">
      <div class="search-item">
        <p>關鍵字</p>
        <input type="search" />
      </div>
      <button class="clear" @click="clear">清除</button>
      <button>搜尋</button>
    </div>
    <div class="item">
      <h3 class="name">XXX Youbike 租借站</h3>
      <p>251巷21號</p>
      <div class="set">
        <p>可租借車數</p>
        <h3>10</h3>
      </div>
      <div class="set">
        <p>可歸還車數</p>
        <h3>10</h3>
      </div>
      <div class="set">
        <p>距離</p>
        <h3>350 m</h3>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";
import { userPositionStore } from "@/store/index";
// import Api from "@/api/youbike";
export default defineComponent({
  components: {},
  setup() {
    const store = userPositionStore();
    const distance = ref("");
    const meters = 500;
    distance.value =
      "&%24spatialFilter=nearby(" +
      store.latitude +
      "%2C%20" +
      store.longitude +
      "%2C%20" +
      meters +
      ")&%24";

    onMounted(() => {
      // Api.getYoubikeList("Taipei", distance.value).then((response) => {
      //   console.log(response);
      // });
    });
    return { store, distance };
  },
});
</script>
