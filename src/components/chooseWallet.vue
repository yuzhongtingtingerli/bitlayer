<template>
  <div class="chooseWallet" :style="`display: ${isShow ? 'block' : 'none'}`">
    <div class="info">
      <div class="logo">
        <img src="@/assets/cat_ava.png" height="100px" alt="" srcset="" />
      </div>
      <div class="info-content">
        <div class="close" @click="close">
          <img src="@/assets/close.png" height="24px" alt="" srcset="" />
        </div>
        <div class="title">
          choose {{ walletType === "btc" ? "BTC" : "ETH" }} wallet
        </div>
        <div class="select">
          <template v-if="walletType === 'btc'">
            <div class="list" @click="linkWallet('unisat')">
              <img
                src="@/assets/uniset-logo.png"
                width="32px"
                alt=""
                srcset=""
              />
              <span>unisat</span>
            </div>
            <div class="list" @click="linkWallet('okx')">
              <img
                src="@/assets/okx-wallet.png"
                width="32px"
                alt=""
                srcset=""
              />
              <span>okx wallet</span>
            </div>
          </template>
          <template v-else>
            <div class="list" @click="linkWallet('eth')">
              <img src="@/assets/matemask.png" width="32px" alt="" srcset="" />
              <span>matamask</span>
            </div>
            <div class="list" @click="linkWallet('ip')">
              <img
                src="@/assets/okx-wallet.png"
                width="32px"
                alt=""
                srcset=""
              />
              <span>okx wallet </span>
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, defineExpose } from "vue";
const emit = defineEmits(["change"]);
const isShow = ref(false);
const close = () => {
  isShow.value = false;
};
const walletType = ref("");
const open = (type) => {
  walletType.value = type;
  isShow.value = true;
};
const linkWallet = (type) => {
  emit("change", type);
  close();
};
defineExpose({ open, close });
</script>
<style scoped lang="scss">
.chooseWallet {
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  position: fixed;
  left: 0;
  top: 0;
  z-index: 9999;
  color: #000;
  .info {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 480px;
    height: 400px;
    z-index: 2;
  }
  .info-content {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 9;
    width: 480px;
    height: 400px;
    background-color: #fff;
    border: 3px solid #000000;
    box-shadow: 4px 4px 0px 0px #000000;
    .title {
      font-family: LilitaOne;
      font-size: 30px;
      font-weight: 400;
      line-height: 22px;
      letter-spacing: 0em;
      text-align: center;
      padding-top: 25px;
      text-transform: capitalize;
    }
    .select {
      margin-top: 100px;
      .list {
        margin: 0 30px;
        height: 63px;
        background-color: #ededed;
        display: flex;
        align-items: center;
        padding: 0 20px;
        margin-bottom: 16px;
        cursor: pointer;
        span {
          text-transform: capitalize;
          font-family: LilitaOne;
          font-size: 15px;
          font-weight: 400;
          line-height: 22px;
          text-align: left;
          margin-left: 18px;
        }
      }
    }
  }
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
}
</style>
