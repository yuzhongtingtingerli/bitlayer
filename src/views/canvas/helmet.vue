<template>
  <div class="stake-success" :style="`display: ${isShow ? 'block' : 'none'}`">
    <div class="info">
      <div class="logo">
        <img src="@/assets/stand_cat.png" height="240px" alt="" srcset="" />
      </div>
      <div class="info-content">
        <div class="close" @click="close">
          <img src="@/assets/close.png" height="24px" alt="" srcset="" />
        </div>
        <div class="title1">Bitlayer lucky helmet</div>
        <div class="content">
          <div class="img">
            <img src="@/assets/helmet2.png" width="70px" alt="" />
          </div>
          <div class="text">
            It allows the used Group to gain 10 points per address, while the
            person using it can gain 500 points themselves.
          </div>
        </div>
        <div class="getIt" @click="getIt">get it</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, defineExpose } from "vue";
const isShow = ref(false);
const close = () => {
  isShow.value = false;
};
const open = () => {
  isShow.value = true;
};
const getIt = () => {
  const url = `https://www.okx.com/zh-hans/web3/marketplace/nft/collection/bitlayer/bitlayer-lucky-helmet`;
  window.open(url, "_blank");
  close();
};
defineExpose({ open, close });
</script>
<style scoped lang="scss">
.stake-success {
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
    width: 420px;
    height: 240px;
    z-index: 2;
  }
  .info-content {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 9;
    width: 420px;
    height: 240px;
    background: url("@/assets/redBook.png");
    background-size: 420px 240px;
    .title1 {
      font-family: LilitaOne;
      font-size: 30px;
      font-weight: 400;
      line-height: 22px;
      text-align: center;
      padding-top: 51px;
      text-transform: capitalize;
    }
    .content {
      display: flex;
      justify-self: start;
      align-items: center;
      margin-top: 18px;
      .img {
        margin-left: 12px;
      }
      .text {
        width: 273px;
        font-family: LilitaOne;
        font-size: 13px;
        font-weight: 400;
        line-height: 22px;
        text-align: left;
        text-transform: capitalize;
        margin-left: 26px;
      }
    }
    .getIt {
      text-align: center;
      font-family: LilitaOne;
      font-size: 16px;
      font-weight: 400;
      line-height: 22px;
      color: #f6cb37;
      text-shadow: 0 1px #000, 1px 0 #000, -1px 0 #000, 0 -1px #000;
      margin-top: 40px;
      text-transform: capitalize;
      cursor: pointer;
    }
  }
  .logo {
    position: absolute;
    top: -145px;
    right: -60px;
    z-index: 1;
  }
  .close {
    position: absolute;
    top: 28px;
    right: 8px;
    cursor: pointer;
  }
}
</style>
