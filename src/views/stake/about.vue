<template>
  <div class="about">
    <div class="title">
      <div class="pr">Stake Bitlayer Assets</div>
      <div>To Earn $BTPX</div>
    </div>
    <div class="content">
      If you have a suitable Bitlayer Assets, you can participate in our stake.
      Through this action, we just want to find some fans of community assets,
      give btpx to everyone, and invite everyone to join our journey.
    </div>
    <div class="bg"></div>
  </div>
</template>

<script setup></script>
<style scoped lang="scss">
.about {
  height: 403px;
  position: relative;
  .title {
    font-family: LilitaOne;
    font-size: 60px;
    font-weight: 400;
    letter-spacing: 0em;
    text-align: left;
    padding-top: 120px;
    .pr {
      position: relative;
    }

    .scale2 {
      transform: scale(0.5);
      position: absolute;
      top: -10px;
      left: 184px;
    }
  }
  .pr10 {
    padding-right: 10px;
  }
  .content {
    position: relative;
    font-family: LilitaOne;
    font-size: 18px;
    font-weight: 400;
    letter-spacing: 0em;
    text-align: left;
    width: 734px;
    margin-top: 12px;
    line-height: 34px;
    .scale2 {
      transform: scale(0.5);
      position: absolute;
      top: -4px;
      left: 178px;
    }
  }
  .bg {
    position: absolute;
    width: 437px;
    height: 396.1px;
    top: 52px;
    right: 32px;
    z-index: 0;
    background-image: url("@/assets/about_bg.png");
  }
}
</style>
