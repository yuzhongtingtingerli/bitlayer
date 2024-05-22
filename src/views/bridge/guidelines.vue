<template>
  <div class="guidelines">
    <div class="bgimg"></div>
    <div class="content">
      <div class="title">Guidelines</div>

      <div class="step">
        step 1. Connect BTC and ETH wallet,In order to facilitate the recording
        of the ledger,
        <p>
          after 1 BTC address is associated with 1 ETH address, it cannot be
          changed before the end of the game.
        </p>
        <p>Please treat it with caution.</p>
      </div>
      <div class="step">
        step 2. Select the amount of BRC20 you want to stake, Confirm it, and
        wait 30mins.
      </div>
      <div class="step">
        step 3. After success you will get the same name ERC20 in your wallet.
      </div>
      <div class="step">
        step 4. Confirm stake with your eth wallet, you will successful complete
        the stake and join BRC20 group.
      </div>
    </div>
  </div>
</template>
<script setup>
import {
  ref,
  reactive,
  toRefs,
  onBeforeMount,
  onMounted,
  watchEffect,
  computed,
} from "vue";
import { useStore } from "vuex";
import { useRoute, useRouter } from "vue-router";
/**
 * 仓库
 */
const store = useStore();
/**
 * 路由对象
 */
const route = useRoute();
/**
 * 路由实例
 */
const router = useRouter();
//console.log('1-开始创建组件-setup')
/**
 * 数据部分
 */
const data = reactive({});
onBeforeMount(() => {
  //console.log('2.组件挂载页面之前执行----onBeforeMount')
});
onMounted(() => {
  //console.log('3.-组件挂载到页面之后执行-------onMounted')
});
watchEffect(() => {});
// 使用toRefs解构
// let { } = { ...toRefs(data) }
defineExpose({
  ...toRefs(data),
});
</script>
<style scoped lang="scss">
.guidelines {
  position: relative;
  // margin-left: 166px;
  width: 100%;
  .content {
    position: relative;
    .title {
      font-family: LilitaOne;
      font-size: 40px;
      font-weight: 400;
      letter-spacing: 0em;
      text-align: left;
      padding-top: 36px;
      margin-bottom: 30px;
    }
    .step {
      font-family: LilitaOne;
      font-size: 15px;
      font-weight: 400;
      line-height: 30px;
      letter-spacing: 0em;
      text-align: left;
      p {
        padding: 0 54px;
        margin: 0;
      }
    }
  }
  .bgimg {
    position: absolute;
    right: -54px;
    top: 55px;
    width: 487px;
    height: 213px;
    background-image: url("@/assets/bridge_bg.png");
  }
}
</style>
