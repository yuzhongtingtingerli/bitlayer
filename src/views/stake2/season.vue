<template>
  <div class="season" v-if="seasonData">
    <div class="title">
      <div class="title-item">Season 1</div>
      <div class="title-item">Season 2</div>
      <div class="title-item">Season 3</div>
    </div>
    <div class="bg">
      <div class="progress">
        <div
          class="currentStake"
          :style="`width: ${getWidth(
            seasonData.TotalBlockNumber,
            seasonData.CurrentBlockNumber
          )}px`"
        ></div>
        <div
          class="box"
          :style="`left: ${
            getWidth(
              seasonData.TotalBlockNumber,
              seasonData.CurrentBlockNumber
            ) - 30
          }px`"
        ></div>
        <div class="currentStakeTime">
          Will end at BTC block height
          {{ seasonData.ReleaseBlockHeight }}
        </div>
      </div>
      <div class="info">
        <div class="will">
          <div class="num">{{ getMoney(seasonData.WillRelease) }} $BTPX</div>
          <div class="meaning">Will Release</div>
        </div>
        <div class="total">
          <div class="num">{{ getMoney(seasonData.TotalStakeToken) }} BTC</div>
          <div class="meaning">Total Staked Tokens</div>
        </div>
        <div class="stakers">
          <div class="num">{{ seasonData.Staker }}</div>
          <div class="meaning">Stakers</div>
        </div>
      </div>
      <div class="content">
        You need to be adventurous, but the bigger the waves, the more expensive
        the fish.
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { getMoney } from "@/utils/Tools.js";
import { getTotalStakeInfoData } from "@/services/index";

// 获取season数据
const seasonData = ref(null);
const getTotalStakeInfo = async () => {
  const res = await getTotalStakeInfoData();
  seasonData.value = res.result;
};
const getWidth = (total, current) => {
  return (Number(current) / Number(total)) * 1200;
};
onMounted(() => {
  getTotalStakeInfo();
});
</script>
<style scoped lang="scss">
.season {
  position: relative;
  height: 416px;
  .bg {
    backdrop-filter: blur(10px);
    background-color: rgba(0, 191, 255, 0.075);
    box-shadow: rgba(0, 0, 0, 0.3) 2px 8px 8px;
    padding: 40px 60px;
    border-radius: 4px;
  }
  .title {
    display: flex;
    justify-self: start;
    .title-item {
      width: 174px;
      height: 40px;
      font-family: LilitaOne;
      font-size: 20px;
      font-weight: 400;
      line-height: 40px;
      letter-spacing: 0em;
      text-align: center;
      color: #777e90;
    }
    .title-item:nth-child(3) {
      color: #ffc500;
      backdrop-filter: blur(10px);
      background-color: rgba(0, 191, 255, 0.075);
      box-shadow: rgba(0, 0, 0, 0.3) 2px 8px 8px;
      border-radius: 4px;
    }
  }
  .progress {
    position: relative;
    display: flex;
    justify-content: space-between;
    height: 26px;
    line-height: 26px;
    border-radius: 13px;
    background: rgba($color: #fff, $alpha: 0.1);
    margin-top: 20px;
    font-family: LilitaOne;
    font-size: 18px;
    font-weight: 400;

    .currentStake {
      position: absolute;
      left: 0;
      top: 0;
      height: 22px;
      background: #c5712e;
      box-shadow: 0px 4px 0px 0px #824308;
      border-radius: 11px;
      z-index: 9;
    }
    .box {
      position: absolute;
      width: 60px;
      height: 54.33px;
      top: -18px;
      background-image: url("@/assets/season.png");
      z-index: 10;
    }
    .currentStakeTime {
      position: absolute;
      right: 60px;
      top: 0;
      z-index: 8;
      text-transform: capitalize;
    }
  }
  .info {
    display: flex;
    justify-content: space-between;
    width: 1111px;
    margin: 0 auto;
    padding-top: 53px;
    text-align: center;
    .num {
      font-family: LilitaOne;
      font-size: 30px;
      font-weight: 400;
      line-height: 34px;
      color: #ffc500;
    }
    .meaning {
      font-family: LilitaOne;
      font-size: 18px;
      font-weight: 400;
      line-height: 21px;
      margin-top: 10px;
      opacity: 0.5;
    }
  }
  .content {
    font-family: LilitaOne;
    font-size: 18px;
    font-weight: 400;
    line-height: 30px;
    letter-spacing: 0em;
    text-align: left;
    margin-top: 40px;
    color: #c0c0c0;
  }
}
</style>
