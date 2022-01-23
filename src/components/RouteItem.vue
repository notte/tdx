<template>
  <div class="route-item">
    <h2>龍門-鹽寮自行車道</h2>
    <div class="base block">
      <div class="img">
        <img
          src="https://taiwanbike.taiwan.net.tw/Content/Route/IndexImage/11.jpg"
          alt=""
        />
      </div>
      <div class="tag">
        <p>難度級別：3</p>
        <p>適合對象：家庭親子族</p>
        <p>車道長度：8公里</p>
      </div>
    </div>
    <div class="block">
      <h3>一週天氣</h3>
      <div class="select">
        <p>請選擇縣市</p>
        <select v-model="where">
          <option value="all">全部</option>
          <option>北部</option>
          <option>中部</option>
          <option>南部</option>
          <option>東部</option>
        </select>
        <div class="weather">
          <div class="item">
            <p>1/22(六)</p>
            <div class="img">
              <img
                src="https://taiwanbike.taiwan.net.tw/Content/Route/IndexImage/11.jpg"
                alt=""
              />
            </div>
            <p>20.0°C</p>
          </div>
          <div class="item">
            <p>1/22(六)</p>
            <div class="img">
              <img
                src="https://taiwanbike.taiwan.net.tw/Content/Route/IndexImage/11.jpg"
                alt=""
              />
            </div>
            <p>20.0°C</p>
          </div>
          <div class="item">
            <p>1/22(六)</p>
            <div class="img">
              <img
                src="https://taiwanbike.taiwan.net.tw/Content/Route/IndexImage/11.jpg"
                alt=""
              />
            </div>
            <p>20.0°C</p>
          </div>
          <div class="item">
            <p>1/22(六)</p>
            <div class="img">
              <img
                src="https://taiwanbike.taiwan.net.tw/Content/Route/IndexImage/11.jpg"
                alt=""
              />
            </div>
            <p>20.0°C</p>
          </div>
          <div class="item">
            <p>1/22(六)</p>
            <div class="img">
              <img
                src="https://taiwanbike.taiwan.net.tw/Content/Route/IndexImage/11.jpg"
                alt=""
              />
            </div>
            <p>20.0°C</p>
          </div>
          <div class="item">
            <p>1/22(六)</p>
            <div class="img">
              <img
                src="https://taiwanbike.taiwan.net.tw/Content/Route/IndexImage/11.jpg"
                alt=""
              />
            </div>
            <p>20.0°C</p>
          </div>
          <div class="item">
            <p>1/22(六)</p>
            <div class="img">
              <img
                src="https://taiwanbike.taiwan.net.tw/Content/Route/IndexImage/11.jpg"
                alt=""
              />
            </div>
            <p>20.0°C</p>
          </div>
        </div>
      </div>
    </div>
    <div class="block">
      <div class="describe">
        在龍門公園偌大的園區裡，有一條由園區出發，經由吊橋連結龍門社區與鹽寮公園的自行車道規劃的相當完善，園區內還提供出租自行車的服務，雙人協力車、單人騎乘、兒童單車、淑女車和變速車等各種選擇，應有盡有非常方便，出租費用亦十分低廉。<br /><br />
        這條從龍門公園到鹽寮海濱公園之間的自行車專用道，一般車輛禁止進入，僅容路人和自行車經過，來回全長約8公里，難度不高，是全家大小一起騎單車的好去處。從龍門露營區出發後，會先經過雙溪河畔上紅色的龍門吊橋，長度約200公尺，騎在橋上感覺非常刺激。<br /><br />沿著路上的紅色線標，可選擇海濱路徑或木麻黃林路徑，步道上並有豎立生態看板，極具寓教於樂功能。在到達鹽寮海濱公園前除了有昭惠廟和慈仁宮等廟宇不同景點，途中也有龍門社區的涼亭可供休息。
      </div>
    </div>
    <div class="block route">
      <h3>路線</h3>
      <ul>
        <li>
          <span>A</span>
          <p>冬山火車站</p>
        </li>
        <li>
          <span>B</span>
          <p>冬山河森林公園</p>
        </li>
        <li>
          <span>C</span>
          <p>珍珠社區</p>
        </li>
        <li>
          <span>D</span>
          <p>冬山河親水公園</p>
        </li>
        <li>
          <span>E</span>
          <p>老街</p>
        </li>
        <li>
          <span>F</span>
          <p>親水公園</p>
        </li>
      </ul>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  components: {},
  setup() {
    return {};
  },
});
</script>
