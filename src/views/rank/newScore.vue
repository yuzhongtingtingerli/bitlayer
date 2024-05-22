<template>
  <div class="newScore">
    <div class="title">Recent Joins</div>
    <div class="content">
      <div class="list header">
        <div class="Address">Address</div>
        <div class="TVL">TVL(BTC)</div>
        <div class="Time">Time</div>
      </div>
      <a-spin :spinning="spinning">
        <div
          class="lists scroll-write-wrap"
          ref="scrollContainer"
          @scroll="handleScroll"
        >
          <div class="list" v-for="(item, index) in LastScoreRank" :key="index">
            <div class="Address">
              <div class="img">
                <img width="20px" :src="item.OwnersLogo" alt="" srcset="" />
              </div>
              <div class="text">{{ getAddress(item.OwnersAddress) }}</div>
            </div>
            <div class="TVL">+ {{ getMoney(item.OwnersTVL) }}</div>
            <div class="Time">{{ item.OwnersTime }}</div>
          </div>
        </div>
      </a-spin>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { getMoney, getAddress } from "./../../utils/Tools.js";
import { getLastScoreRankData } from "@/services/index";

onMounted(() => {
  getLastScoreRank();
});
const spinning = ref(false);
const offset = ref(1);
const total = ref(1);
// 获取最新积分信息
const LastScoreRank = ref(null);
const getLastScoreRank = async () => {
  spinning.value = true;
  const data = await getLastScoreRankData({ Offset: offset.value, Limit: 20 });
  LastScoreRank.value = [
    ...(LastScoreRank.value || []),
    ...data.result.OwnersInfo,
  ];
  total.value = data.result.TotalListNumber;
  spinning.value = false;
};

// 容器引用
const scrollContainer = ref(null);

// 滚动处理函数
const handleScroll = () => {
  if (spinning.value || total.value <= LastScoreRank.value?.length) return;
  const container = scrollContainer.value;
  if (container.scrollTop + container.clientHeight >= container.scrollHeight) {
    console.log("触底了");
    offset.value++;
    getLastScoreRank();
  }
};
</script>
<style scoped lang="scss">
.title {
  font-size: 20px;
  font-family: LilitaOne;
  padding: 20px;
}
.content {
  margin: 0 10px;
  .lists {
    height: 596px;
    overflow-y: scroll;
  }
  .list {
    display: flex;
    justify-content: space-between;
    font-family: LilitaOne;
    font-size: 14px;
    margin-bottom: 16px;
    text-align: center;
    height: 20px;
    .Address {
      width: 125px;
      display: flex;
      justify-content: center;
      .img {
        margin-right: 2px;
      }
    }
    .TVL {
      width: 120px;
    }
    .Time {
      width: 120px;
    }
  }
  .header {
    color: #ffaa08;
  }
}
</style>
