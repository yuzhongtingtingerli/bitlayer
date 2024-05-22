<template>
  <div class="loading" :style="`display: ${isShow ? 'block' : 'none'}`">
    <div class="img">
      <img src="@/assets/loading.gif" alt="" srcset="" />
      <div class="num">{{ num < 100 ? num : 100 }}%</div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
const num = ref(0);
const countdown = () => {
  // 倒计时 5秒完成1-100的进度
  new Promise((resolve, reject) => {
    let timer = setInterval(() => {
      num.value++;
      if (num.value >= 100) {
        clearInterval(timer);
        resolve();
      }
    }, 50);
  });
};
const isShow = ref(false);
const startOrStop = (flag) => {
  if (flag) {
    num.value = 0;
    isShow.value = true;
    countdown();
  } else {
    // num.value = 0;
    isShow.value = false;
  }
};
defineExpose({ startOrStop });
// onMounted(() => {
//   countdown();
// });
</script>
<style scoped lang="scss">
.loading {
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  z-index: 99999;
  background-color: #000;
  .img {
    position: relative;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    height: 260px;
    width: 160px;
    .num {
      position: absolute;
      color: #fff;
      bottom: 80px;
      left: 0;
      font-family: LilitaOne;
      font-size: 16px;
      font-weight: 400;
      line-height: 22px;
      width: 160px;
      text-align: center;
    }
  }
  img {
    height: 260px;
    width: 160px;
  }
}
</style>
