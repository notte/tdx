<template>
  <div class="search" style="display: none">
    <div class="search-item">
      <p>關鍵字</p>
      <input v-model="word" type="search" />
    </div>
    <div class="search-item">
      <p>地區</p>
      <select v-model="where">
        <option value="all">全部</option>
        <option>北部</option>
        <option>中部</option>
        <option>南部</option>
        <option>東部</option>
      </select>
    </div>
    <div class="search-item">
      <p>難度</p>
      <select v-model="level">
        <option value="all">全部</option>
        <option>0 - 適合幼兒</option>
        <option>1 - 親子同遊</option>
        <option>2 - 中長途經驗</option>
        <option>3 - 長途經驗</option>
        <option>4 - 勇腳</option>
      </select>
    </div>
    <div class="search-item">
      <p>推薦族群</p>
      <select v-model="who">
        <option value="all">全部</option>
        <option>家庭親子</option>
        <option>健康銀髮</option>
        <option>情侶夫妻</option>
        <option>三五好友</option>
        <option>樂活健身</option>
      </select>
    </div>
    <button class="clear" @click="clear">清除</button>
    <button>搜尋</button>
  </div>
  <div class="list" style="display: none">
    <div class="item">
      <div class="img">
        <img
          src="https://taiwanbike.taiwan.net.tw/Content/Route/IndexImage/11.jpg"
          alt=""
        />
      </div>

      <h2>龍門-鹽寮自行車道</h2>
      <p class="describe">
        從福隆火車站銜接至龍門河濱公園的露營區，再經龍門吊橋至鹽寮海濱公園，沿途車道上均有生態解說牌示，是瞭解濱海生態的最佳騎乘路線。若從鹽寮繼續往前騎乘，還可順遊澳底漁港，大啖海鮮大餐！
      </p>

      <div class="tag">
        <p>・難度級別：3</p>
        <p>・適合對象：家庭親子族</p>
        <p>・車道長度：8公里</p>
      </div>
      <button>More</button>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref } from "vue";

export default defineComponent({
  components: {},
  setup() {
    let where = ref("all"),
      who = ref("all"),
      level = ref("all"),
      word = ref("");
    return { where, who, level, word };
  },
  clear(): void {
    console.log("123");
  },
});
</script>
