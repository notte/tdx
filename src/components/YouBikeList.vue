<template>
  <div class="youbike-list">
    <div class="search">
      <div class="search-item">
        <p>關鍵字</p>
        <input v-model="word" type="search" />
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
import { defineComponent } from "vue";
import { API } from "@/utilities/apihandler";

export default defineComponent({
  components: {},
  setup() {
    // let data = new API("1", "2");
    return {};
  },
});
</script>
