<template>
  <div class="stake-success" :style="`display: ${isShow ? 'block' : 'none'}`">
    <div class="info">
      <div class="logo">
        <img src="@/assets/stand_cat.png" height="240px" alt="" srcset="" />
      </div>
      <div class="info-content">
        <div class="title1">welcome To</div>
        <div class="title2">
          {{ toUpperCase(`${group} group`) }}
        </div>
        <div class="title3">
          {{ toUpperCase("You will got score every day until the game end") }}
        </div>
        <div class="check title3">
          {{ toUpperCase("Check on B2scan:") }}
        </div>
        <div class="herf" @click="goTixd">{{ txid }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, defineExpose } from "vue";
import { toUpperCase } from "@/utils/Tools";
const isShow = ref(false);
const colse = () => {
  isShow.value = false;
};
const txid = ref("");
const group = ref("");
const open = (text, g) => {
  txid.value = text;
  group.value = g;
  isShow.value = true;
  setTimeout(() => {
    isShow.value = false;
  }, 5000);
};
const goTixd = () => {
  const url = `https://explorer.bsquared.network/tx/${txid.value}`;
  window.open(url, "_blank");
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
    width: 480px;
    height: 360px;
    z-index: 2;
  }
  .info-content {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 9;
    width: 420px;
    height: 331px;
    background: url("@/assets/dialogBox.png");
    background-size: 420px 331px;
    .title1 {
      font-family: LilitaOne;
      font-size: 20px;
      font-weight: 400;
      line-height: 22px;
      letter-spacing: 0em;
      text-align: center;
      padding-top: 61px;
    }
    .title2 {
      font-family: LilitaOne;
      font-size: 30px;
      font-weight: 400;
      text-align: center;
      margin-top: 24px;
      color: #ffc500;
      text-shadow: 0 3px #000, 3px 0 #000, -1px 0 #000, 0 -1px #000;
    }
    .title3 {
      font-family: LilitaOne;
      font-size: 15px;
      font-weight: 400;
      text-align: center;
      line-height: 22px;
      margin-top: 24px;
    }
    .img {
      text-align: center;
      margin-top: 40px;
    }
    .check {
      margin-top: 40px;
    }
    .herf {
      width: 286px;
      margin: 9px auto;
      // 换行
      word-wrap: break-word;
      word-break: break-all;
      white-space: pre-wrap;
      font-family: LilitaOne;
      font-size: 15px;
      font-weight: 400;
      line-height: 22px;
      letter-spacing: 0em;
      text-align: center;
      // 下划线
      text-decoration: underline;
      cursor: pointer;
    }
  }
  .logo {
    position: absolute;
    top: -145px;
    right: 0px;
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
