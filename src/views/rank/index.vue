<template>
  <div class="bg" id="rankBg">
    <div class="rank w1400">
      <a-spin :spinning="spinning">
        <div class="corpsRanking">
          <CorpsRanking
            :groupListData="groupListData"
            :groupListTotal="groupListTotal"
            :GroupName="GroupName"
            :spinning="spinning"
            @group-search="getScoreRankGroup"
            @group-list="handleGroupList"
          />
        </div>
      </a-spin>
      <div class="middle">
        <div class="hoursTVL">
          <HoursTVL />
        </div>
        <div class="groupTVLRank">
          <GroupTVLRank :GroupName="GroupName" />
        </div>
      </div>
      <div class="newScore">
        <NewScore />
      </div>
    </div>
    <ErrorInfo ref="errorInfoRef" />
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";

import CorpsRanking from "./corpsRanking.vue";
import GroupTVLRank from "./groupTVLRank.vue";
import HoursTVL from "./hoursTVL.vue";
import NewScore from "./newScore.vue";
import { getGroupListData } from "@/services/index";
import { checkRuningStatus } from "@/services/api.js";
import ErrorInfo from "@/components/error-info.vue";
const errorInfoRef = ref(null);
const isShowError = () => {
  errorInfoRef.value.open(
    "The journey will begin soon, wish you good luck ！",
    "infinite"
  );
};
const checkRuning = async () => {
  const res = await checkRuningStatus();
  if (res.result.RunningStatus <= 5) {
    isShowError();
  }
};

// 当窗口变化时，获取浏览器窗口宽高
window.onresize = () => {
  return (() => {
    window.fullHeight = document.documentElement.clientHeight;
    // 获取bg模块并设置高度
    document.getElementById("rankBg").style.height =
      window.fullHeight - 60 + "px";
  })();
};
// 获取军团列表
const spinning = ref(false);
const current = ref(1);
const groupListData = ref(null);
const groupListTotal = ref(0);
const GroupName = ref("");
const getGroupList = async () => {
  spinning.value = true;
  const data = await getGroupListData({ Offset: current.value, Limit: 10 });
  groupListData.value = [
    ...(groupListData.value || []),
    ...data.result.GroupInfo,
  ];
  groupListTotal.value = data.result.TotalListNumber;
  GroupName.value = groupListData.value[0].GroupName;
  spinning.value = false;
};
const handleGroupList = () => {
  current.value++;
  getGroupList();
};
const getScoreRankGroup = (val) => {
  GroupName.value = val;
};

onMounted(() => {
  checkRuning();
  getGroupList();
  window.fullHeight = document.documentElement.clientHeight;
  // 获取bg模块并设置高度
  document.getElementById("rankBg").style.height =
    window.fullHeight - 60 + "px";
});
</script>
<style scoped lang="scss">
// 两边固定中间自适应
.bg {
  background-color: #fccd37;
  overflow-y: auto;
}
.rank {
  display: flex;
  justify-content: space-between;
  div {
    border-radius: 8px;
    font-size: 13px;
    color: #fff;
  }
}
.corpsRanking {
  width: 320px;
  // padding: 0 6px 0 20px;
  height: 720px;
  background-color: #000;
}
.middle {
  height: 720px;
  width: 680px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  .hoursTVL {
    height: 188px;
    background-color: #000;
  }
  .groupTVLRank {
    height: 520px;
    background-color: #000;
  }
}
.newScore {
  width: 380px;
  height: 720px;
  background-color: #000;
}
</style>
