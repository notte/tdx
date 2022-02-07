<template>
  <div class="container">
    <div class="map"><City /></div>
    <div class="tab-container">
      <div class="tab">
        <button class="active">腳踏車路線列表</button
        ><button>周邊 Youbike 列表</button>
      </div>
      <YouBikeList class="tab-content" />
      <!-- <BikeRoute class="tab-content" /> -->
      <!-- <RouteItem class="tab-content" /> -->
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import City from "@/components/City.vue";
import { cityStore } from "@/store/index";
// import BikeRoute from "@/components/BikeRoute.vue";
// import RouteItem from "@/components/RouteItem.vue";
import YouBikeList from "@/components/YouBikeList.vue";
import "@/assets/scss/city.scss";

export default defineComponent({
  components: {
    City,
    YouBikeList,
    // RouteItem, BikeRoute
  },
  setup() {
    const store = cityStore();
    return { store };
  },
});
</script>
