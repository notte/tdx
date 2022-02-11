<template>
  <div class="container">
    <div class="map"><Map /></div>
    <div class="tab-container">
      <div class="tab">
        <button class="active">腳踏車路線列表</button
        ><button>周邊 Youbike 列表</button>
      </div>
      <YoubikeList class="tab-content" />
      <!-- <BikeRoute class="tab-content" /> -->
      <!-- <RouteItem class="tab-content" /> -->
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import Map from "@/components/Map.vue";
// import BikeRoute from "@/components/BikeRoute.vue";
// import RouteItem from "@/components/RouteItem.vue";
import YoubikeList from "@/components/YoubikeList.vue";
import "@/assets/scss/city.scss";

export default defineComponent({
  components: {
    Map,
    YoubikeList,
    // RouteItem, BikeRoute
  },
  setup() {
    return {};
  },
});
</script>
