<template>
  <div class="group">
    <div class="top">
      <Title title="Groups" />
      <div class="search">
        <a-input
          v-model:value="GroupName"
          @keyup.enter="getGroupName"
          placeholder="Token"
          size="small"
        >
          <template #suffix>
            <a-tooltip title="Extra information">
              <SearchOutlined
                style="color: rgba(0, 0, 0, 0.45)"
                @click="getGroupName"
              />
            </a-tooltip>
          </template>
        </a-input>
      </div>
    </div>
    <div class="list-item" v-if="groupList">
      <div class="left">
        <div class="RankNumber">{{ groupList.GroupRank }}</div>
        <!-- <div class="bg"></div> -->
        <div class="img">
          <img src="@/assets/cat_ava.png" alt="" srcset="" />
        </div>
        <div class="name">{{ groupList.GroupName }}</div>
        <div class="GroupTokenPerson">
          <img width="20px" src="@/assets/Frame2.png" alt="" srcset="" />{{
            groupList.GroupOwners
          }}
        </div>
      </div>
      <div class="svl">
        {{ getMoney(groupList.GroupSVL) }}
        <div class="unit">TVL(BTC)</div>
      </div>
    </div>
    <div class="search-group" v-if="groupList"></div>
    <a-spin :spinning="props.spinning">
      <div
        class="list scroll-wrap"
        :style="`height: ${Address.getETHaddress ? '158px' : '570px'}`"
        ref="scrollContainer"
        @scroll="handleScroll"
      >
        <div
          v-for="item in groupListData"
          :key="item.GroupRankNumber"
          @click="changeGroup(item)"
          :class="`list-item ${
            changeGroupName === item.GroupName ? 'changeGroup' : ''
          }`"
        >
          <div class="left">
            <div class="RankNumber">{{ item.GroupRankNumber }}</div>
            <div class="img">
              <img src="@/assets/cat_ava.png" alt="" srcset="" />
            </div>
            <div class="name">{{ decodeURIComponent(item.GroupName) }}</div>
            <div class="GroupTokenPerson">
              <img width="11px" src="@/assets/Frame2.png" alt="" srcset="" />{{
                item.GroupTokenPerson
              }}
            </div>
          </div>

          <div class="svl">
            {{ getMoney(item.GroupSVL) }}
            <div class="unit">TVL(BTC)</div>
          </div>
        </div>
      </div>
    </a-spin>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import Title from "@cps/title";
import { getMoney } from "@/utils/Tools.js";
import { SearchOutlined } from "@ant-design/icons-vue";
import { request } from "@/services/request.js";
import { useAddressStore } from "@/store/address";
const Address = useAddressStore();
const emit = defineEmits(["load"]);

// 容器引用
const scrollContainer = ref(null);
const handleScroll = () => {
  const container = scrollContainer.value;
  if (container.scrollTop + container.clientHeight >= container.scrollHeight) {
    console.log("触底了");
    emit("load");
  }
};

const props = defineProps({
  groupListData: Array,
  spinning: Boolean,
});
watch(
  () => props.groupListData,
  (newVal, oldVal) => {
    if (newVal && newVal.length > 0) {
      changeGroup(newVal[0]);
    }
  },
  { immediate: true }
);
const changeGroupName = ref("");
const changeGroup = (item) => {
  changeGroupName.value = item.GroupName;
};
const GroupName = ref("");
const getGroupName = () => {
  if (GroupName.value === "") {
    groupList.value = null;
  } else {
    const groupName = GroupName.value;
    getGroupSearch(groupName);
  }
};
const error = ref(null);
const groupList = ref(null);
const getGroupSearch = async (groupName) => {
  // loading.value = true;
  try {
    // 使用封装的 request 方法发起请求
    const data = await request(
      `/blockchain/getGroupSearch?TokenSymbol=${groupName}`,
      "get"
    );
    groupList.value = data.result;
    console.log(data.result, "getGroupSearch");
  } catch (err) {
    error.value = "请求失败";
  } finally {
    // loading.value = false;
  }
};
</script>
<style>
.group {
  .ant-input-affix-wrapper.ant-input-affix-wrapper-sm {
    border: 2px solid #404040;
    background-color: #404040 !important;
  }
  .ant-input.ant-input-sm {
    background-color: #404040 !important;
    color: #ededed !important;
  }
}
</style>
<style scoped lang="scss">
.group {
  .top {
    display: flex;
    justify-content: space-between;
    padding: 15px 22px;
    .search {
      width: 180px;
      height: 24px;
      border-radius: 2px;
      font-family: LilitaOne;
      margin-bottom: 13px;
    }
  }
  .list {
    overflow-y: auto;
    height: 158px;
    overflow-x: hidden;
    width: 400px;
    box-sizing: border-box;
  }
  .search-group {
    height: 1px;
    border: 1px dashed #d9d9d9;
    margin-bottom: 10px;
  }

  .list-item {
    padding: 0 18px;
    position: relative;
    width: 400px;
    height: 48px;
    box-sizing: border-box;
    // border-radius: 2px;
    // border: 2px solid #000;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
    font-family: Inter;
    font-size: 10px;
    font-weight: 900;
    letter-spacing: 0em;
    overflow: hidden;
    cursor: pointer;
    .left {
      display: flex;
    }
    .RankNumber {
      // position: absolute;
      // top: 2px;
      // left: 6px;
      width: 20px;
      font-family: LilitaOne;
      font-size: 16px;
      font-weight: 400;
      line-height: 48px;
      letter-spacing: 0em;
      text-align: center;
      color: #fff;
      text-shadow: 0 1px #000, 1px 0 #000, -1px 0 #000, 0 -1px #000;
      // z-index: 999;
    }
    .img {
      position: absolute;
      top: 10px;
      left: 40px;
      img {
        width: 25px;
      }
    }
    .name {
      position: absolute;
      top: 28px;
      left: 40px;
      color: #fff;
      text-shadow: 0 1px #000, 1px 0 #000, -1px 0 #000, 0 -1px #000;
      font-family: LilitaOne;
      font-size: 13px;
      font-weight: 400;
      letter-spacing: 0em;
    }
    .GroupTokenPerson {
      line-height: 48px;
      margin-left: 40px;
      font-family: Inter;
      font-size: 10px;
      letter-spacing: 0em;
      text-align: left;
      color: #b5b5b5;
      text-shadow: 0 1px #000, 1px 0 #000, -1px 0 #000, 0 -1px #000;
      img {
        margin: 0 5px;
      }
    }
    .svl {
      position: relative;
      font-family: Inter;
      font-size: 10px;
      font-weight: 900;
      letter-spacing: 0em;
      text-align: left;
      color: #b5b5b5;
      text-shadow: 0 1px #000, 1px 0 #000, -1px 0 #000, 0 -1px #000;
      margin-right: 6px;
      .unit {
        position: absolute;
        top: 10px;
        right: 0px;
        font-family: LilitaOne;
        font-size: 8px;
        color: #b5b5b5;
        text-shadow: none;
      }
    }
  }
  .changeGroup {
    // border: 3px solid #ffc500;
    background-color: rgba(255, 255, 255, 0.08);
    border-left: 2px solid #fff;
  }
}
</style>
