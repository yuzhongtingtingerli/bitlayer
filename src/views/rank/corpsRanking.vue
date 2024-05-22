<template>
  <div class="corps-ranking">
    <div class="title">Groups Ranking</div>
    <div class="search">
      <a-input
        v-model:value="groupName"
        @keyup.enter="getName"
        placeholder="Bsquared assets"
        size="small"
      >
        <template #suffix>
          <a-tooltip title="Extra information">
            <SearchOutlined
              style="color: rgba(0, 0, 0, 0.45)"
              @click="getName"
            />
          </a-tooltip>
        </template>
      </a-input>
    </div>
    <div
      class="list scroll-write-wrap"
      ref="scrollContainer"
      @scroll="handleScroll"
    >
      <div class="list_item" v-if="groupList">
        <div class="RankNumber">{{ groupList.GroupRank }}</div>
        <div class="bg"></div>
        <div class="img">
          <img src="@/assets/cat_ava.png" alt="" srcset="" />
        </div>
        <div class="name">{{ decodeURIComponent(groupList.GroupName) }}</div>
        <div class="left">
          <div class="left_img">
            <img width="20px" src="@/assets/Frame.png" alt="" srcset="" />
          </div>
          <div class="content">
            {{ groupList.GroupOwners }}
          </div>
        </div>
        <div class="right">
          <div class="svl">
            {{ getMoney(groupList.GroupSVL) }}
            <div class="unit">TVL(BTC)</div>
          </div>
        </div>
      </div>
      <div class="search-group" v-if="groupList"></div>
      <div
        v-for="item in groupListData"
        :key="item.GroupRankNumber"
        @click="getGroupName(item.GroupName)"
        :class="`list_item ${GroupName === item.GroupName ? 'active' : ''}`"
      >
        <div class="RankNumber">{{ item.GroupRankNumber }}</div>
        <div class="bg"></div>
        <div class="img">
          <img src="@/assets/cat_ava.png" alt="" srcset="" />
        </div>
        <div class="name">{{ decodeURIComponent(item.GroupName) }}</div>
        <div class="left">
          <div class="left_img">
            <img width="20px" src="@/assets/Frame.png" alt="" srcset="" />
          </div>
          <div class="content">
            {{ item.GroupTokenPerson }}
          </div>
        </div>
        <div class="right">
          <div class="svl">
            {{ getMoney(item.GroupSVL) }}
            <div class="unit">TVL(BTC)</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { SearchOutlined } from "@ant-design/icons-vue";
import { ref, defineProps } from "vue";
import { getGroupSearchData } from "@/services/index.js";
import { getMoney } from "@/utils/Tools.js";
const groupName = ref("");
const getName = () => {
  if (groupName.value === "") {
    groupList.value = null;
  } else {
    const name = groupName.value;
    getGroupSearch(name);
  }
};

const groupList = ref(null);
const getGroupSearch = async (groupName) => {
  const data = await getGroupSearchData(groupName);
  groupList.value = data.result;
};
const porps = defineProps({
  groupListData: Array,
  GroupName: String,
  groupListTotal: Number,
  spinning: Boolean,
});
const emit = defineEmits(["group-search", "group-list"]);
const getGroupName = (GroupName) => {
  emit("group-search", GroupName);
};

// 容器引用
const scrollContainer = ref(null);

// 滚动处理函数
const handleScroll = () => {
  if (porps.spinning || porps.groupListTotal <= porps.groupListData?.length)
    return;
  // debugger;
  const container = scrollContainer.value;
  if (container.scrollTop + container.clientHeight >= container.scrollHeight) {
    console.log("触底了");
    emit("group-list");
  }
};
</script>
<style>
.ant-input.ant-input-sm.css-dev-only-do-not-override-19yxfbp {
  font-family: LilitaOne !important;
}
</style>
<style scoped lang="scss">
.corps-ranking {
  width: 294px;
  margin-left: 20px;
  .title {
    padding-top: 20px;
    padding-bottom: 17px;
    font-weight: 400;
    font-size: 20px;
    font-family: LilitaOne;
  }
  .search {
    height: 24px;
    width: 280px;
    border-radius: 2px;
    font-family: LilitaOne;
  }
  .list {
    margin-top: 18px;
    height: 588px;
    overflow-y: scroll;
    .list_item.active {
      border: 2px solid #fccd37;
      border-radius: 4px;
    }
    .search-group {
      height: 1px;
      width: 280px;
      border: 1px dashed #d9d9d9;
      margin-bottom: 10px;
    }
    .list_item {
      position: relative;
      height: 48px;
      width: 280px;
      background-color: #fff;
      margin-bottom: 12px;
      border-radius: 2px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      // padding: 10px 0;
      // text-shadow: 2px 2px 0px #000;
      text-shadow: 0 1px #000, 1px 0 #000, -1px 0 #000, 0 -1px #000;
      // -webkit-text-stroke: 1px #000;
      font-weight: 900;
      padding-right: 20px;
      padding-left: 6px;
      font-family: Inter;
      cursor: pointer;
      .RankNumber {
        position: absolute;
        top: 2px;
        left: 6px;
        font-family: LilitaOne;
        font-size: 16px;
        font-weight: 400;
        line-height: 22px;
        letter-spacing: 0em;
        text-align: left;
        color: #fff;
        text-shadow: 0 1px #000, 1px 0 #000, -1px 0 #000, 0 -1px #000;
        z-index: 999;
      }
      .img {
        position: absolute;
        top: 10px;
        left: 20px;
        img {
          width: 25px;
        }
      }
      .name {
        position: absolute;
        top: 28px;
        left: 20px;
        color: #fff;
        text-shadow: 0 1px #000, 1px 0 #000, -1px 0 #000, 0 -1px #000;
        font-family: LilitaOne;
        font-size: 13px;
        font-weight: 400;
        letter-spacing: 0em;
      }
      .left {
        display: flex;
        justify-self: start;
        align-items: center;
      }
      .svl {
        position: relative;
        .unit {
          position: absolute;
          top: 14px;
          right: 0px;
          font-family: LilitaOne;
          font-size: 8px;
          font-weight: 400;
          color: #000;
          text-shadow: none;
        }
      }
    }
  }
}
</style>
