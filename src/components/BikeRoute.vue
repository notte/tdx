<template>
  <div class="bike-route">
    <div class="list">
      <div class="item">
        <h2>龍門-鹽寮自行車道</h2>

        <div class="tag">
          <p>單向</p>
          <p>8 m</p>
        </div>
        <p>起站</p>
        <h3>一二三</h3>
        <p>迄站</p>
        <h3>一二三</h3>
      </div>
      <div class="item active">
        <h2>龍門-鹽寮自行車道</h2>

        <div class="tag">
          <p>單向</p>
          <p>8 m</p>
        </div>
        <p>起站</p>
        <h3>一二三</h3>
        <p>迄站</p>
        <h3>一二三</h3>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref } from "vue";
import "@/assets/scss/bike-route.scss";

export default defineComponent({
  components: {},
  setup() {
    let where = ref("all"),
      who = ref("all"),
      level = ref("all"),
      word = ref("");
    return { where, who, level, word };
  },
});
</script>
