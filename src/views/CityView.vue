<template>
  <div class="container">
    <div class="map"><City /></div>
    <div class="tab-container">
      <div class="tab">
        <button class="active">腳踏車路線列表</button
        ><button>Youbike 列表</button>
      </div>
      <BikeRoute class="tab-content" />
      <YouBikeList class="tab-content" style="display: none" />
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import City from "@/components/City.vue";
import { cityStore } from "@/store/index";
import BikeRoute from "@/components/BikeRoute.vue";
import YouBikeList from "@/components/YouBikeList.vue";
import "@/assets/scss/city.scss";

export default defineComponent({
  components: { City, BikeRoute, YouBikeList },
  setup() {
    const store = cityStore();
    return { store };
  },
});
</script>
