<script setup>
import { SearchOutlined } from "@ant-design/icons-vue";
import { ref, onMounted } from "vue";
import {
  getNftGroupListData,
  doUseNftPostData,
  doUseHamletPostData,
} from "@/services/index.js";
const emit = defineEmits(["change"]);
/**
 * 数据部分
 */
const groupName = ref("");
const isShow = ref(false);
const inscriptionID = ref("");
const BTCaddress = ref("");
const ETHaddress = ref("");
const groupType = ref("");
const open = (type, id, Eaddress, Baddress = "") => {
  groupType.value = type;
  ETHaddress.value = Eaddress;
  BTCaddress.value = Baddress;
  inscriptionID.value = id;
  getNftGroupList();
  isShow.value = true;
};
const close = () => {
  isShow.value = false;
};
const getGroupName = () => {
  nftList.value = nftAllList.value.filter((item) =>
    item.ticker.includes(groupName.value)
  );
};
const nftList = ref(null);
const nftAllList = ref(null);
const getNftGroupList = async () => {
  const res = await getNftGroupListData();
  const nftAry = [];
  for (const key in res.result) {
    if (Object.hasOwnProperty.call(res.result, key)) {
      const element = res.result[key];
      nftAry.push({
        ticker: key,
        logo: element,
      });
    }
  }
  nftList.value = nftAry;
  nftAllList.value = nftAry;
};
const ticker = ref("");
const getTicker = (item) => {
  if (item) {
    ticker.value = item;
  }
};
const doUseNft = async (addressB, addressE, id) => {
  try {
    const { statusCode } = await doUseNftPostData({
      BTCAddress: addressB,
      ETHAddress: addressE,
      UsedGroup: ticker.value,
      InscriptionID: id,
    });
    if (statusCode === 1) {
      emit("change", true, ticker.value);
      close();
    } else {
      emit("change", false);
      close();
    }
  } catch (error) {
    emit("change", false);
    close();
  }
};

const doUseHamlet = async (addressE, id) => {
  try {
    const { statusCode } = await doUseHamletPostData({
      ETHAddress: addressE,
      UsedGroup: ticker.value,
      TokenID: id,
    });
    if (statusCode === 1) {
      emit("change", true, ticker.value);
      close();
    } else {
      emit("change", false);
      close();
    }
  } catch (error) {
    emit("change", false);
    close();
  }
};
const confirm = () => {
  if (groupType.value === "book") {
    doUseNft(BTCaddress.value, ETHaddress.value, inscriptionID.value);
  } else {
    doUseHamlet(ETHaddress.value, inscriptionID.value);
  }
};

onMounted(() => {});
defineExpose({ open, close });
</script>

<template>
  <div class="selectGroup" :style="`display: ${isShow ? 'block' : 'none'}`">
    <div class="info">
      <div class="logo">
        <img src="@/assets/cat_ava.png" height="100px" alt="" srcset="" />
      </div>
      <div class="info-content">
        <div class="close" @click="close">
          <img src="@/assets/close.png" height="24px" alt="" srcset="" />
        </div>
        <div class="title1">Select Group</div>
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
            v-for="item in nftList"
            :key="item.ticker"
            @click="getTicker(item.ticker)"
            :class="`list-item ${ticker === item.ticker ? 'active' : ''}`"
          >
            <img width="20px" :src="item.logo" />
            <span>{{ decodeURIComponent(item.ticker) }}</span>
          </div>
        </div>
        <div class="confirm" @click="confirm">Confirm</div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.selectGroup {
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  position: fixed;
  left: 0;
  top: 0;
  z-index: 9999;
  color: #000;
  .logo {
    position: absolute;
    top: -90px;
    left: 18px;
    z-index: 1;
  }
  .close {
    position: absolute;
    top: 8px;
    right: 8px;
    cursor: pointer;
  }
  .info {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 480px;
    height: 480px;
    z-index: 2;
  }
  .info-content {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 9;
    width: 480px;
    height: 480px;
    background-color: #fff;
    border: 3px solid #000000;
    box-shadow: 4px 4px 0px 0px #000000;
    .title1 {
      font-family: LilitaOne;
      font-size: 30px;
      font-weight: 400;
      line-height: 22px;
      letter-spacing: 0em;
      text-align: center;
      padding-top: 25px;
    }
    .search {
      height: 40px;
      border-radius: 4px;
      font-family: LilitaOne;
      margin: 16px 30px 13px;
    }
    .list {
      height: 280px;
      overflow-y: scroll;
      .list-item {
        margin: 0 30px;
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
      .active {
        background-color: rgba(242, 151, 0, 0.1);
      }
    }
    .confirm {
      position: absolute;
      bottom: 20px;
      left: 50%;
      transform: translateX(-50%);
      width: 180px;
      height: 48px;
      border-radius: 8px;
      border: 2px solid #000;
      font-family: LilitaOne;
      font-size: 20px;
      font-weight: 400;
      line-height: 42px;
      text-align: center;
      box-shadow: 4px 4px 0px 0px #000000;
      background: #f6cb37;
      cursor: pointer;
    }
  }
}
</style>
<style>
.selectGroup {
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
