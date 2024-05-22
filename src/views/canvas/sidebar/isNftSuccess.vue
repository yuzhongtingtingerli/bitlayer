<template>
  <div class="isNftSuccess" :style="`display: ${isShow ? 'block' : 'none'}`">
    <div class="info">
      <div class="logo">
        <img src="@/assets/cat_ava.png" height="100px" alt="" srcset="" />
      </div>
      <div class="info-content">
        <div class="close" @click="close">
          <img src="@/assets/close.png" height="24px" alt="" srcset="" />
        </div>
        <div class="title">
          {{
            isSuccess
              ? decodeURIComponent(groupName) + " group salute yous"
              : "Something wrong bro"
          }}
        </div>
        <div class="img">
          <img
            v-if="isSuccess"
            src="@/assets/successful.png"
            alt=""
            srcset=""
          />
          <img v-else src="@/assets/fail.png" alt="" srcset="" />
        </div>
        <div class="nftLogo">
          <img src="@/assets/nft-logo.png" height="130px" alt="" srcset="" />
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
const isSuccess = ref(false);
const groupName = ref("");
const open = (flag, ticker = "") => {
  isSuccess.value = flag;
  groupName.value = ticker;
  isShow.value = true;
};
defineExpose({ open, close });
</script>
<style scoped lang="scss">
.isNftSuccess {
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
      padding-top: 44px;
      text-transform: capitalize;
    }
    .img {
      text-align: center;
      margin-top: 40px;
      img {
        width: 40px;
      }
    }
    .nftLogo {
      text-align: center;
      margin-top: 42px;
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
