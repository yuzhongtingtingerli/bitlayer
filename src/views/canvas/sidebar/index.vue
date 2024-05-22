<template>
  <div class="Sidebar" ref="SidebarRef">
    <a-drawer
      v-model:open="open"
      class="custom-class"
      :closable="false"
      :mask="false"
      :getContainer="SidebarRef"
      root-class-name="root-class-name"
      :contentWrapperStyle="{ maxWidth: '100%' }"
      @after-open-change="afterOpenChange"
    >
      <template v-if="Address.getETHaddress">
        <Props />
        <YourBrc20 @change="refreshLish" />
        <YourScore :ScoreData="ScoreData" :nftScoreData="nftScoreData" />
        <Joined :JoinGroupData="JoinGroupData" />
      </template>
      <Groups
        :groupListData="groupListData"
        :spinning="spinning"
        @load="handleScroll"
      />

      <div class="JoinGroup" @click="handleJoinGroup">Join Group</div>
      <div class="drawer-box" @click="closeDrawer">
        <img class="close-drawer" src="@/assets/close-drawer2.png" />
      </div>
    </a-drawer>
    <div class="open-drawer">
      <img src="@/assets/open-drawer.png" @click="open = true" />
    </div>
    <ErrorInfo ref="errorInfoRef" />
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { useRouter } from "vue-router";
import Props from "./props.vue";
import YourBrc20 from "./yourBrc20.vue";
import YourScore from "./yourScore.vue";
import Joined from "./joined.vue";
import Groups from "./groups.vue";
import ErrorInfo from "@/components/error-info.vue";
import {
  getScoreData,
  getJoinGroupData,
  getGroupListData,
  getNftScoreData,
} from "@/services/index";
import { useAddressStore } from "@/store/address";

const Address = useAddressStore();
const open = ref(true);
const closeDrawer = () => {
  open.value = false;
};

const SidebarRef = ref(null);
const ScoreData = ref(null);
const getScore = async () => {
  const data = await getScoreData(Address.getETHaddress);
  ScoreData.value = data.result;
};
const nftScoreData = ref(null);
const getNftScore = async () => {
  const data = await getNftScoreData({ UserAddress: Address.getETHaddress });
  let nftScore = {
    TotalListNumber: Number(data.result.TotalListNumber),
  };
  if (Number(data.result.TotalListNumber) > 0) {
    data.result.NftInfo.forEach((item) => {
      nftScore[item.NftScoreType] = {
        ...item,
        NftScore: Number(item.NftScore),
      };
    });
  }

  nftScoreData.value = nftScore;
};
const refreshLish = () => {
  console.log("???");
  getNftScore();
};
const router = useRouter();
const handleJoinGroup = () => {
  if (Address.getETHaddress) {
    router.push({ path: "/stake", query: { from: "JoinGroup" } });
  } else {
    isShowError("You should connect your wallet first, Explorer!");
  }
};

const errorInfoRef = ref(null);
const isShowError = (title) => {
  errorInfoRef.value.open(title);
};
// 加入军团列表
const JoinGroupData = ref(null);
const getJoinGroup = async () => {
  const data = await getJoinGroupData(Address.getETHaddress);
  JoinGroupData.value = data.result.GroupInfo;
};

// 获取军团列表
const groupListData = ref(null);
const getGroupList = async () => {
  spinning.value = true;
  const data = await getGroupListData({ Offset: offset.value, Limit: 10 });
  groupListData.value = [
    ...(groupListData.value || []),
    ...data.result.GroupInfo,
  ];
  total.value = data.result.TotalListNumber;
  spinning.value = false;
};
const spinning = ref(false);
const offset = ref(1);
const total = ref(1);
// 滚动处理函数
const handleScroll = () => {
  console.log(spinning.value, total.value, groupListData.value?.length);
  if (spinning.value || total.value <= groupListData.value?.length) return;

  offset.value++;
  getGroupList();
};

watch(
  Address,
  () => {
    if (Address.getETHaddress) {
      getScore();
      getNftScore();
      getJoinGroup();
    }
  },
  { immediate: true }
);
onMounted(() => {
  getGroupList();
});
</script>
<style lang="scss">
.Sidebar {
  .root-class-name {
    position: absolute;
    left: 0;
    top: 0;
    width: 400px;
    height: 735px;
  }
  .ant-drawer-content-wrapper {
    width: 400px !important;
  }
  .ant-drawer-content.custom-class {
    border-radius: 8px 0px 0px 8px;
    width: 400px;
  }
  .ant-drawer-body {
    background-color: #1b1b1b;
    border: 2px solid;
    border-image-source: linear-gradient(90deg, #4d4d4d 0%, #000000 100%);
    border-image-slice: 2;
    border-radius: 8px 0px 0px 8px;
    width: 400px;
    padding: 0;
  }
}
</style>
<style scoped lang="scss">
.Sidebar {
  position: fixed;
  top: 65px;
  right: 0;
  width: 400px;
  height: 735px;

  color: #fff;
  .JoinGroup {
    position: absolute;
    bottom: 26px;
    left: 50%;
    transform: translateX(-50%);
    height: 48px;
    width: 180px;
    color: #000;
    background-color: #f6cb37;
    box-shadow: 4px 4px 0px #000;
    border-radius: 4px;
    font-family: LilitaOne;
    font-size: 20px;
    font-weight: 400;
    letter-spacing: 0em;
    text-align: center;
    line-height: 48px;
    cursor: pointer;
  }
  .drawer-box {
    position: absolute;
    left: 0px;
    top: 50%;
    width: 14px;
    height: 300px;
    transform: translateY(-50%);
    cursor: pointer;
  }
  .close-drawer {
    position: absolute;
    left: 4px;
    top: 50%;
    width: 9px;
    transform: translateY(-50%);
    cursor: pointer;
  }
  .open-drawer {
    position: absolute;
    right: 0;
    top: 0;
    width: 6px;
    height: 735px;
    cursor: pointer;
    background: #fff;
    img {
      position: absolute;
      right: 8px;
      top: 50%;
      width: 24px;
    }
  }
}
</style>
