<template>
  <div class="youbike" ref="scrollDOM">
    <div class="list" ref="getListDOM">
      <div
        :class="item.StationUID + ' ' + 'item'"
        v-for="item in youbikeList"
        :key="item.StationUID"
        @click="
          getClickedBike(
            item.StationUID,
            item.StationPosition.PositionLat,
            item.StationPosition.PositionLon
          )
        "
      >
        <div class="name">
          <h4>{{ item.StationName.Zh_tw }}</h4>
          <span>{{ item.distance }} m</span>
        </div>
        <p>{{ item.StationAddress.Zh_tw }}</p>
        <div class="set">
          <p>可租借車數</p>
          <h3>{{ item.AvailableRentBikes }}</h3>
        </div>
        <div class="set">
          <p>可歸還車數</p>
          <h3>{{ item.AvailableReturnBikes }}</h3>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, watch, reactive, ref } from "vue";
import { userPositionStore, cityStore } from "@/store/index";
import * as Model from "@/models/interface/youbike";
import { IPointList } from "@/models/interface/common";
import EventBus from "@/utilities/event-bus";
import Api from "@/api/youbike";
import L from "leaflet";
import { GeodesicLine } from "leaflet.geodesic";
import "@/assets/scss/youbike.scss";

export default defineComponent({
  components: {},
  setup() {
    // pinia 記錄的使用者位置 & 選擇的城市
    const position = userPositionStore();
    const city = cityStore();

    // <list> 的 DOM
    const getListDOM = ref();
    // 實際可以滾動的 DOM
    const scrollDOM = ref();

    // 要帶入 API 中的 url 參數
    const distance = ref<string>("");
    // 站點要取得的物理範圍
    const meters = ref<number>(500);
    // 確保縣市參數即使 F5 之後也存在
    const locationCity: string = city.$state.en
      ? city.$state.en
      : window.location.pathname.slice(1);

    // 範圍內的 youbike 的站點列表
    let youbikeList = reactive<Model.IYoubikeListResponse[]>([]);
    // 所有 youbike 狀態
    let youbikeStatus = reactive<Model.IYoubikeStatus[]>([]);

    // 先帶入縣市參數，取得所有站點狀態（車位之類的）
    getYoubikeStatusAPI();

    // 確定可以獲取到使用者經緯度後
    watch(
      () => position.latitude,
      () => {
        getYoubikeListAPI();
      }
    );

    // 確定已取得 youbike 站點後
    watch(
      () => youbikeList.length,
      () => {
        renderYoubikeList();
      }
    );

    // 接收地圖被點擊事件
    EventBus.on("map-click-event", (data) => {
      // 右側列表執行被點擊站點事件
      getClickedBike(
        (data as Model.IGetClickedBike).StationUID,
        (data as Model.IGetClickedBike).latitude,
        (data as Model.IGetClickedBike).longitude
      );
    });

    /* 
    youbike tab 被點擊事件 
    */
    EventBus.on("click-youbike-tab", () => {
      renderYoubikeList();
      // console.log(position.latitude, position.longitude);
    });

    // 站點被點擊事件，接收被點擊 id、經緯度
    function getClickedBike(id: string, latitude: number, longitude: number) {
      // 取得 DOM 中被渲染的 youbike 列表
      const Array = getListDOM.value.children;

      // 迭代 DOM 列表
      for (let index = 0; index < Array.length; index++) {
        // 尋找單一 DOM class 名稱是否包含 active
        const className = Array[index].classList.value.lastIndexOf("active");

        // 如果不等於 -1 (有找到)
        if (className !== -1) {
          // 將 class 刪除
          Array[index].classList.value = Array[index].classList.value.replace(
            "active",
            ""
          );
        }
        // 如果 class 名稱包含被帶入的 id，表示此為被點擊的站點，新增 active
        if (Array[index].classList[0] == id) {
          Array[index].classList.value = id + " item active";
          // 捲軸移到對應 DOM 位置（DOM高度乘以陣列中第幾個位置）
          scrollDOM.value.scrollTop = 172 * index;
        }
      }
      // 發送右側列表被點擊事件給 map
      EventBus.emit("bike-click-event", [latitude, longitude, id]);
    }
    // 取得站點狀態
    function getStatus(StationUID: string) {
      // 迭代所有站點
      for (const item of youbikeStatus) {
        // 如果 id 與 範圍內的站點一樣
        if (item.StationUID === StationUID) {
          // 返回對應狀態資訊
          return {
            AvailableRentBikes: item.AvailableRentBikes,
            AvailableReturnBikes: item.AvailableReturnBikes,
          };
        }
      }
    }
    function renderYoubikeList(): void {
      // user 位置
      const UserPosition = new L.LatLng(position.latitude, position.longitude);

      const newArray: IPointList[] = [];

      // 迭代所有 youbike 站點
      for (let item of youbikeList) {
        newArray.push({
          StationUID: item.StationUID,
          latitude: item.StationPosition.PositionLat,
          longitude: item.StationPosition.PositionLon,
        });
        // 每一個 youbike 站點位置
        const BikeStation = new L.LatLng(
          item.StationPosition.PositionLat,
          item.StationPosition.PositionLon
        );

        // 計算兩者之間的距離
        const line = new GeodesicLine();
        const distance = line.distance(UserPosition, BikeStation);

        // 取得站點狀態
        const status = getStatus(item.StationUID);

        // 加入到物件中
        item = Object.assign(item, status, {
          distance: Math.floor(distance),
        });
      }

      // 依照距離排序
      youbikeList.sort((a, b) => {
        return Number(a.distance) - Number(b.distance);
      });

      // 發送取得 youbike 事件，並帶入資料
      EventBus.emit("get-bike-list", newArray);
    }
    function getYoubikeStatusAPI(): void {
      Api.getYoubikeStatus(locationCity).then(
        (response: Model.IYoubikeStatus[]) => {
          youbikeStatus = Object.assign(youbikeStatus, response);
        }
      );
    }
    function getYoubikeListAPI(): void {
      // 建立 url 距離參數
      distance.value =
        "&%24spatialFilter=nearby(" +
        position.latitude +
        "%2C%20" +
        position.longitude +
        "%2C%20" +
        meters.value +
        ")&%24";

      // 帶入後呼叫 API，取得範圍內 youbike
      Api.getYoubikeList(locationCity, distance.value).then(
        (response: Model.IYoubikeListResponse[]) => {
          youbikeList = Object.assign(youbikeList, response);
        }
      );
    }

    return {
      position,
      city,
      distance,
      youbikeList,
      youbikeStatus,
      getListDOM,
      scrollDOM,
      getClickedBike,
      getStatus,
    };
  },
});
</script>
