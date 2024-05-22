<template>
  <div class="error-msg" :style="`display: ${isShow ? 'block' : 'none'}`">
    <div class="info">
      <div class="logo">
        <img src="@/assets/cat_ava.png" height="100px" alt="" srcset="" />
      </div>
      <div class="info-content">
        <div class="close" @click="colse">
          <img src="@/assets/close.png" height="24px" alt="" srcset="" />
        </div>
        <div class="title1">{{ headline }}</div>
        <div class="title2">{{ title }}</div>
        <div :class="`msg ${href ? ' h190' : ''}`">
          <div>{{ message }}</div>
          <div v-if="href" class="click">
            <div>Check on B2scan:</div>
            <div class="href" @click="goHref(href)">{{ href }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps, defineExpose } from "vue";

// const props = defineProps({
//   message: String,
//   title: String,
//   headline: String,
// });
const isShow = ref(false);
const colse = () => {
  isShow.value = false;
};
const headline = ref("");
const title = ref("");
const message = ref("");
const href = ref("");
const open = (h, t, m, c = null) => {
  headline.value = h;
  title.value = t;
  message.value = m;
  if (c) {
    href.value = `https://etherscan.io/advanced-filter?fadd=${c.fadd}&tadd=${c.fadd}&tkn=${c.tkn}`;
  }
  isShow.value = true;
};
const goHref = (url) => {
  window.open(url, "_blank");
};
defineExpose({ open, close });
</script>
<style scoped lang="scss">
.error-msg {
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
    height: 320px;
    z-index: 2;
  }
  .info-content {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 9;
    width: 480px;
    height: 320px;
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
    .title2 {
      font-family: LilitaOne;
      font-size: 15px;
      font-weight: 400;
      line-height: 17px;
      letter-spacing: 0em;
      text-align: center;
      margin-top: 20px;
      text-transform: capitalize;
    }
    .msg {
      width: 420px;
      height: 160px;
      background-color: #ededed;
      margin: 20px 30px;
      border-radius: 4px;
      font-family: LilitaOne;
      font-size: 15px;
      font-weight: 400;
      line-height: 17px;
      letter-spacing: 0em;
      text-align: left;
      padding: 15px 26px;
      .click {
        margin-top: 20px;
      }
      .href {
        // 超出换行
        word-wrap: break-word;
        word-break: break-all;
        text-decoration: underline;
        cursor: pointer;
      }
    }
    .h190 {
      height: 190px;
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
