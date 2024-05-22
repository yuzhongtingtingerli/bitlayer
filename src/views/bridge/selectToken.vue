<script setup>
import { SearchOutlined } from "@ant-design/icons-vue";
import { ref, onMounted } from "vue";
import { getTokenLogoData, getBRCListData } from "@/services/index.js";
import { getBrc20SummaryData } from "@/services/wallet.js";
const emit = defineEmits(["change"]);
/**
 * 数据部分
 */
const groupName = ref("");
const show = ref(false);
let summaryDataList = [];
const open = (address) => {
  getBrcSummary(address);
  show.value = true;
};
const close = () => {
  show.value = false;
};
const getGroupName = () => {
  groupName.value;
  summaryData.value = summaryDataList.filter((item) =>
    item.ticker.includes(groupName.value)
  );
};
const TokenLogo = ref(null);
const getTokenLogo = async () => {
  const data = await getTokenLogoData();
  TokenLogo.value = data.result;
};

const getBRCList = async () => {
  const res = await getBRCListData();
  return res.result.TokenInfo;
};
const getLogo = (ticker) => {
  if (!TokenLogo.value) return false;
  if (ticker in TokenLogo.value && TokenLogo.value[ticker] !== "null")
    return TokenLogo.value[ticker];
  return false;
};

const getTicker = (item) => {
  if (item) {
    emit("change", item);
    close();
  }
};
const getFirstLetter = (ticker) => {
  return ticker.split("")[0];
};

const summaryData = ref(null);
const getBrcSummary = async (address) => {
  // loading.value = true;
  try {
    // 使用封装的 request 方法发起请求
    const brcList = await getBRCList();
    const res = await getBrc20SummaryData(address);
    const common = res.data.detail.filter((item) =>
      brcList
        .map((item) => decodeURIComponent(item.TokenSymbol))
        .includes(decodeURIComponent(item.ticker))
    );
    summaryData.value = common;
    summaryDataList = common;
  } catch (err) {
    // error.value = "请求失败";
    console.log(err);
  } finally {
    // loading.value = false;
  }
};
onMounted(() => {
  getTokenLogo();
});
defineExpose({ open, close });
</script>

<template>
  <a-modal
    v-model:open="show"
    title=""
    :footer="null"
    :maskClosable="false"
    @ok="close"
    :closable="false"
    width="480px"
  >
    <div class="modal_style">
      <img class="head-img" src="@/assets/cat_ava.png" />
      <div class="close" @click="close">
        <img src="@/assets/close.png" height="24px" alt="" srcset="" />
      </div>
      <div class="title">Select A Token</div>
      <div class="search">
        <a-input
          v-model:value="groupName"
          placeholder="Search Name Or Paste Address"
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
      <div class="list">
        <div
          class="list-item"
          v-for="item in summaryData"
          :key="item.ticker"
          @click="getTicker(item)"
        >
          <img
            v-if="TokenLogo && getLogo(encodeURIComponent(item.ticker))"
            width="20px"
            :src="getLogo(encodeURIComponent(item.ticker))"
            alt=""
            srcset=""
          />
          <div class="logo" v-else>{{ getFirstLetter(item.ticker) }}</div>
          <span>{{ decodeURIComponent(item.ticker) }}</span>
        </div>
        <div class="list-item" @click="getTicker({ ticker: 'btc' })">
          <img width="20px" src="@/assets/miniB.png" />
          <span>btc</span>
        </div>
      </div>
    </div>
  </a-modal>
</template>

<style scoped lang="scss">
.modal_style {
  position: relative;
  .head-img {
    position: absolute;
    left: -16px;
    top: -114px;
    width: 110px;
  }
  .close {
    position: absolute;
    right: -16px;
    top: -14px;
    cursor: pointer;
  }
  .search {
    width: 100%;
    height: 40px;
    border-radius: 4px;
    font-family: LilitaOne;
    margin-bottom: 13px;
    margin-top: 16px;
  }
  .title {
    text-align: center;
    font-family: LilitaOne;
    font-size: 30px;
    font-weight: 400;
    line-height: 22px;
    letter-spacing: 0em;
  }
  .list {
    height: 320px;
    overflow-y: scroll;
    .list-item {
      padding: 0 10px;
      height: 40px;
      line-height: 40px;
      cursor: pointer;
      font-family: LilitaOne;
      font-size: 15px;
      font-weight: 400;

      .logo {
        display: inline-block;
        width: 20px;
        height: 20px;
        border-radius: 10px;
        background-color: #000;
        color: #fff;
        line-height: 18px;
        text-align: center;
        margin-right: 8px;
      }
      span {
        padding-left: 5px;
      }
    }
    .list-item:hover {
      background-color: rgba(242, 151, 0, 0.1);
    }
  }
}
</style>
<style>
.modal_style {
  .ant-input-affix-wrapper.css-dev-only-do-not-override-19yxfbp {
    background-color: #ededed;
    height: 40px;
    border: none;
    input {
      background-color: #ededed;
      font-family: LilitaOne;
      font-size: 15px;
      font-weight: 400;
    }
  }
}
</style>
