<template>
  <div class="hoursTVL">
    <div class="top">
      <div class="title">Top 3 Added TVL Past 24 Hours</div>
      <div class="taps">
        <div
          :class="`group ${type === 'group' ? 'active' : ''}`"
          @click="getTVL('group')"
        >
          Group
        </div>
        <div
          :class="`individual ${type === 'individual' ? 'active' : ''}`"
          @click="getTVL('individual')"
        >
          individual
        </div>
      </div>
    </div>
    <div class="content">
      <div class="groupInfo" v-if="type === 'group'">
        <div
          class="list"
          v-for="item in GroupTVLRankData"
          :key="item.GroupName"
        >
          <div class="left">
            <div class="img">
              <img width="22px" src="@/assets/cat_ava.png" alt="" srcset="" />
            </div>
            <div class="name">
              {{ decodeURIComponent(item.GroupName) }} Group
            </div>
          </div>
          <div class="svl">+ {{ getMoney(item.GroupTVL) }} BTC</div>
        </div>
      </div>
      <div class="ownersInfo" v-if="type === 'individual'">
        <div
          class="list"
          v-for="item in PersonalTVLRank"
          :key="item.OwnersAddress"
        >
          <div class="left">
            <div class="img">
              <img width="20px" :src="item.OwnersLogo" alt="" srcset="" />
            </div>
            <div class="name">
              {{ getAddress(item.OwnersAddress) }}
            </div>
          </div>
          <div class="svl">+ {{ getMoney(item.OwnersTVL) }} BTC</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { getMoney, getAddress } from "./../../utils/Tools.js";
import { getGroupTVLRankData, getPersonalTVLRankData } from "@/services/index";
const type = ref("group");
const getTVL = (t) => {
  // 将t赋值给type，并实现响应式
  type.value = t;
};

// 获取军团TVL排名信息
const GroupTVLRankData = ref(null);
const GroupTVLRankTotal = ref(0);
const getGroupTVLRank = async () => {
  const data = await getGroupTVLRankData();
  GroupTVLRankData.value = data.result.GroupInfo;
  GroupTVLRankTotal.value = data.result.TotalListNumber;
};
// 获取个人TVL排名信息
const PersonalTVLRank = ref(null);
const PersonalTVLRankTotal = ref(0);
const getPersonalTVLRank = async () => {
  const data = await getPersonalTVLRankData();
  PersonalTVLRank.value = data.result.OwnersInfo;
  PersonalTVLRankTotal.value = data.result.TotalListNumber;
};
onMounted(() => {
  getGroupTVLRank();
  getPersonalTVLRank();
});
</script>
<style scoped lang="scss">
.top {
  height: 40px;
  display: flex;
  justify-content: space-between;
  padding: 10px 20px;
  font-family: LilitaOne;
  .title {
    line-height: 40px;
    font-size: 20px;
  }
  .taps {
    width: 207px;
    height: 40px;
    display: flex;
    //垂直居中对齐
    justify-content: center;
    align-items: center;
    background-color: #fff;
    border-radius: 4px;
    div {
      width: 100px;
      height: 32px;
      line-height: 32px;
      text-align: center;
      color: #ccc;
      font-size: 16px;
      font-weight: 400;
      border-radius: 4px;
      cursor: pointer;
    }
    .active {
      background-color: #000;
      color: #fff;
    }
  }
}
.content {
  margin-top: 20px;
  .list {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 32px;
    margin-right: 36px;
    font-family: LilitaOne;
    line-height: 32px;
    margin-bottom: 8px;
    .left {
      display: flex;
      justify-self: start;
      .img {
        width: 20px;
        margin-left: 20px;
        margin-right: 2px;
      }
    }
  }
}
</style>
