<template>
  <div class="container">
    <div class="map" ref="map">
      <Taiwan />
    </div>
    <div class="menu">
      <div class="position">
        <p>想要去哪裡？</p>
        <h1 ref="local">選一個地方吧</h1>
        <button @click="toCity">出發</button>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, onMounted, watch } from "vue";
import { useRouter } from "vue-router";
import Taiwan from "@/components/Taiwan.vue";
import EventBus from "@/utilities/event-bus";
import { cityStore } from "@/store/index";
import * as Model from "@/models/interface/map";
import "@/assets/scss/taiwan.scss";

export default defineComponent({
  components: {
    Taiwan,
  },
  setup() {
    const store = cityStore();
    const map = ref();
    const local = ref();
    const router = useRouter();
    let city = ref();

    const toCity = (): void => {
      router.push({
        name: "City",
        params: { id: store.en },
      });
    };

    onMounted(() => {
      const data: Model.IMapSize = {
        width: map.value.offsetWidth,
        height: map.value.offsetHeight,
      };
      EventBus.emit("send-map-size", data);
    });

    watch(
      () => store.cn,
      () => {
        local.value.innerHTML = store.cn;
      }
    );

    return { map, local, city, toCity };
  },
});
</script>
