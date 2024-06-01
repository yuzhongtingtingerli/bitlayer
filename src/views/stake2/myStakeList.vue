<template>
  <div class="myStakeList" v-if="SakeList">
    <div class="title">My Stake List</div>
    <div class="bg">
      <div class="top">
        <div class="left">
          <div class="myScore">
            <div class="mean">My Total Score</div>
            <div class="num">{{ getMoney(SakeList?.TotalScore || 0) }}</div>
          </div>
          <div class="myTotal">
            <div class="mean">My Total TVL</div>
            <div class="num">{{ getMoney(SakeList?.TotalTVL || 0) }} BTC</div>
          </div>
        </div>
        <div class="right">
          <div class="time" v-if="treasureData?.TimeTreasure == 1">
            <div class="stake1"></div>
            <div class="stake2"></div>
            <div class="text">Time Treasure</div>
          </div>
          <div class="score" v-if="treasureData?.ScoreTreasure == 1">
            <div class="stake1"></div>
            <div class="stake2"></div>
            <div class="text">Score Treasure</div>
          </div>
        </div>
      </div>
      <!-- <div class="nomain" v-if="StakeInfo?.length === 0"></div> -->
      <div class="main">
        <div class="nocontent" v-if="StakeInfo?.length === 0">Empty</div>
        <div class="content" v-else>
          <div class="list header">
            <div class="token">Token</div>
            <div class="amount">Amount</div>
            <div class="stakeBalance">Total Score</div>
            <div class="availableStatus">Day Score</div>
          </div>
          <div class="lists">
            <div class="list" v-for="(item, index) in StakeInfo" :key="index">
              <div class="token">
                {{ decodeURIComponent(item.TokenSymbol) }}
              </div>
              <div class="amount">{{ getMoney(item.TokenAmount) }}</div>
              <div class="stakeBalance">
                {{ getMoney(item.TotalScore) }}
              </div>
              <div class="availableStatus">
                {{ getMoney(item.DailyScore) }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import { getMoney } from "@/utils/Tools.js";
import { getSakeListData, getTreasureData } from "@/services/index";
import { useAddressStore } from "@/store/address";

const Address = useAddressStore();
const SakeList = ref(null);
const StakeInfo = ref(null);
const getSakeList = async () => {
  const res = await getSakeListData({ UserAddress: Address.ETHaddress });
  SakeList.value = res.result;
  StakeInfo.value = res.result.StakeInfo || [];
};
const treasureData = ref(null);
const getTreasure = async () => {
  const res = await getTreasureData({ UserAddress: Address.ETHaddress });
  treasureData.value = res.result;
};
watch(
  Address,
  (newVal, oldVal) => {
    if (Address.ETHaddress) {
      getSakeList();
      getTreasure();
    }
  },
  { immediate: true }
);
</script>
<style scoped lang="scss">
.myStakeList {
  width: 570px;
  .title {
    font-family: LilitaOne;
    font-size: 20px;
    font-weight: 400;
    line-height: 23px;
    letter-spacing: 0em;
    text-align: left;
    border-left: 2px solid #fff;
    padding-left: 10px;
    margin-bottom: 17px;
  }
  .bg {
    background: linear-gradient(
      135deg,
      rgba(131, 196, 255, 0.1) 0%,
      rgba(255, 255, 255, 0.1) 100%
    );
    height: 328px;
  }
  .top {
    display: flex;
    justify-content: space-between;
    margin-bottom: 38px;
    margin-top: 10px;
    height: 80px;
    .left {
      display: flex;
      justify-self: start;
      padding-top: 26px;
      padding-left: 34px;
    }
    .right {
      display: flex;
      justify-self: start;
      position: relative;
    }
    .myScore,
    .myTotal {
      width: 143px;
      margin-right: 34px;
      .mean {
        font-family: LilitaOne;
        font-size: 13px;
        font-weight: 400;
        line-height: 15px;
        letter-spacing: 0em;
        text-align: left;
        margin-bottom: 7px;
      }
      .num {
        font-family: LilitaOne;
        font-size: 20px;
        font-weight: 400;
        line-height: 23px;
        letter-spacing: 0em;
        text-align: left;
        color: #ffc500;
      }
    }
    .time {
      right: 133px;
    }
    .score {
      right: 20px;
    }
    .time,
    .score {
      position: absolute;
      top: -10px;
      width: 85px;
      height: 85px;
      background: linear-gradient(
        135deg,
        rgba(131, 196, 255, 0.1) 0%,
        rgba(255, 255, 255, 0.1) 100%
      );

      .stake1 {
        position: absolute;
        top: -5px;
        right: -7px;
        width: 54px;
        height: 55px;
        background-image: url("@/assets/stake2.png");
      }
      .stake2 {
        position: absolute;
        top: 9px;
        left: 9px;
        width: 50px;
        height: 51px;
        background-image: url("@/assets/stake1.png");
      }
      .text {
        position: absolute;
        bottom: 6px;
        left: 6px;
        font-family: LilitaOne;
        font-size: 10px;
        font-weight: 400;
        line-height: 11px;
        letter-spacing: 0em;
        text-align: left;
      }
    }
  }
  .nocontent {
    height: 200px;
    line-height: 200px;
    text-align: center;
    font-family: LilitaOne;
    font-size: 15px;
    font-weight: 400;
  }
  .main {
    height: 200px;
    .content {
      .lists {
        height: 118px;
        overflow-y: scroll;
      }
      .list {
        display: flex;
        justify-content: space-between;
        font-family: LilitaOne;
        font-size: 15px;
        margin-bottom: 28px;
        text-align: center;
        height: 22px;
        line-height: 22px;
        .token {
          min-width: 60px;
        }
        .amount {
          min-width: 100px;
        }
        .stakeBalance {
          min-width: 100px;
        }
        .availableStatus {
          min-width: 140px;
        }
      }
    }
  }
}
</style>
