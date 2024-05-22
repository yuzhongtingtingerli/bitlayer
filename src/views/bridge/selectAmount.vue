<script setup>
import { getTransferableInscriptionsData } from "@/services/wallet.js";

import { ref } from "vue";
const emit = defineEmits(["change"]);
const show = ref(false);
const open = (address, ticker, amountInfo) => {
  getTransferableInscriptions(address, ticker);
  if (amountInfo) {
    amount.value = amountInfo;
  }
  show.value = true;
};
const close = () => {
  show.value = false;
  amount.value = null;
};
const inscriptionsData = ref(null);
const getTransferableInscriptions = async (address, ticker) => {
  const res = await getTransferableInscriptionsData({ address, ticker });
  inscriptionsData.value = res.data.detail;
};

const amount = ref();
const getAmount = (item) => {
  if (item) {
    if (amount.value && amount.value.inscriptionId === item.inscriptionId) {
      amount.value = null;
    } else {
      amount.value = item;
    }
  }
};
const Confirm = () => {
  if (amount.value) {
    emit("change", amount.value);
    close();
  }
};
const clear = () => {
  inscriptionsData.value = null;
  amount.value = null;
};
defineExpose({ open, close, clear });
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
      <div class="title">Select Amount</div>
      <div class="active-title" v-if="amount?.data">
        {{ amount.data.amt }} {{ decodeURIComponent(amount.data.tick) }}
      </div>
      <div class="list" style="margin-top: 20px">
        <div
          class="list-item"
          :class="{ active: amount?.inscriptionId === item.inscriptionId }"
          v-for="item in inscriptionsData"
          :key="item.inscriptionId"
          @click="getAmount(item)"
        >
          <span class="tick">{{ decodeURIComponent(item.data.tick) }}</span>
          <span class="amt">{{ item.data.amt }}</span>
          <span class="inscript">
            <span>#{{ item.inscriptionNumber }}</span>
            <img class="select-img" src="@/assets/select.png" />
          </span>
        </div>
        <div class="list-item-a"></div>
        <div class="list-item-a"></div>
      </div>
      <div class="btn" @click="Confirm">Confirm</div>
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

  .title {
    text-align: center;
    font-family: LilitaOne;
    font-size: 30px;
    font-weight: 400;
    line-height: 22px;
    letter-spacing: 0em;
  }
  .active-title {
    font-family: LilitaOne;
    font-size: 30px;
    font-weight: 400;
    line-height: 22px;
    letter-spacing: 0em;
    text-align: center;
    margin-top: 32px;
  }
  .list {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    padding: 15px 36px;
    background: #ededed;
    height: 300px;
    overflow-y: auto;
    .list-item-a {
      width: 102px;
    }
    .list-item {
      cursor: pointer;
      width: 102px;
      height: 120px;
      background: #2e363e;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      border: 1px solid #2e363e;
      margin-top: 15px;
      .tick {
        font-family: LilitaOne;
        font-size: 12px;
        font-weight: 400;
        line-height: 22px;
        letter-spacing: 0em;
        color: #ffffff;
        padding: 0 6px;
      }
      .amt {
        font-family: LilitaOne;
        font-size: 20px;
        font-weight: 400;
        line-height: 22px;
        letter-spacing: 0em;
        text-align: center;
        color: #ffffff;
      }
      .inscript {
        font-family: LilitaOne;
        font-size: 12px;
        font-weight: 400;
        line-height: 22px;
        letter-spacing: 0em;
        color: #000;
        border: 1px solid #2e363e;
        background: #d9d9d9;
        display: flex;
        justify-content: space-around;
        align-items: center;
        .select-img {
          width: 12px;
        }
      }
    }
    .active {
      border: 1px solid #1a9a23;
      .inscript {
        border: 1px solid #1a9a23;
      }
    }
  }
  .btn {
    width: 180px;
    height: 48px;
    line-height: 48px;
    text-align: center;
    margin: 0 auto;
    background: #f6cb37;
    border: 2px solid rgba(0, 0, 0, 1);
    box-shadow: 4px 4px 0px 0px rgba(0, 0, 0, 1);
    font-family: LilitaOne;
    font-size: 20px;
    font-weight: 400;
    cursor: pointer;
    border-radius: 8px;
    margin: 32px auto;
  }
}
</style>
<style></style>
