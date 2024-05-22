<template>
  <div
    class="error-info"
    :class="glass ? 'glass' : ''"
    :style="`display: ${errorShow ? 'block' : 'none'}`"
  >
    <div class="info">
      <div class="logo">
        <img src="@/assets/error_logo.png" height="300px" alt="" srcset="" />
      </div>
      <div class="msg">{{ message }}</div>
    </div>
  </div>
</template>

<script setup>
import { ref, onUnmounted } from "vue";
const errorShow = ref(false);
const message = ref("");
const glass = ref(false);
const open = (title, time = 3000) => {
  message.value = title;
  errorShow.value = true;
  if (time !== "infinite") {
    setTimeout(() => {
      errorShow.value = false;
    }, time);
  } else {
    glass.value = true;
    // 当前页禁止滚动
    document.body.style.overflow = "hidden";
  }
};

onUnmounted(() => {
  document.body.style.overflow = "initial";
});
defineExpose({ open });
</script>
<style scoped lang="scss">
.error-info {
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  position: fixed;
  left: 0;
  top: 60px;
  z-index: 9999;
  overflow: hidden;
  .info {
    position: absolute;
    bottom: 76px;
    left: 50%;
    transform: translateX(-50%);
    width: 1000px;
    height: 114px;
    line-height: 114px;
    font-family: LilitaOne;
    font-size: 20px;
    font-weight: 400;
    text-align: center;
    background-color: #fff;
    border: 1px solid #000000;
    box-shadow: 4px 4px 0px 0px #000000;
    border-radius: 10px;
    z-index: 1;
  }
  .logo {
    position: absolute;
    bottom: -76px;
    left: -71px;
    z-index: 2;
  }
  .msg {
    width: 715px;
    margin: 0 auto;
    color: #000;
    text-transform: capitalize;
  }
}
.glass {
  backdrop-filter: blur(5px);
  background-color: rgba(0, 0, 0, 0);
  z-index: 9999999;
}
</style>
