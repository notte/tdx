<template>
  <div class="container">
    <div class="map" @click="demo"><Map /></div>
    <div class="tab-container">
      <div class="tab">
        <button
          @click="clickTab(BikeRoute)"
          :class="Current === BikeRoute ? 'active' : ''"
        >
          腳踏車路線列表</button
        ><button
          @click="clickTab(YoubikeList)"
          :class="Current === YoubikeList ? 'active' : ''"
        >
          Youbike 列表
        </button>
      </div>
      <YoubikeList class="tab-content" v-if="isShow(YoubikeList)" />
      <BikeRoute class="tab-content" v-if="isShow(BikeRoute)" />
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref } from "vue";
import Map from "@/components/Map.vue";
import BikeRoute from "@/components/BikeRoute.vue";
import YoubikeList from "@/components/YoubikeList.vue";
import EventBus from "@/utilities/event-bus";
import * as Status from "@/models/status/type";
import "@/assets/scss/city.scss";

export default defineComponent({
  components: {
    Map,
    YoubikeList,
    BikeRoute,
  },
  setup() {
    const Current = ref(Status.TabType.YoubikeList);
    const YoubikeList = ref(Status.TabType.YoubikeList);
    const BikeRoute = ref(Status.TabType.BikeRoute);

    localStorage.setItem("tab", "YoubikeList");
    function isShow(page: Status.TabType): boolean {
      return Current.value === page ? true : false;
    }
    function clickTab(page: Status.TabType) {
      Current.value = page;
      EventBus.emit("click-tab", page);
    }
    return {
      Current,
      YoubikeList,
      BikeRoute,
      isShow,
      clickTab,
    };
  },
});
</script>
