<template>
  <div class="footer w">
    <div class="title">
      <img src="@/assets/Union.png" style="margin-right: 12px" width="42" />
      BIT PARTY
      <span>Bitparty.Tech 2024</span>
    </div>
    <div class="right">MAKE BTC FUN AGAIN</div>
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
.footer {
  height: 328px;
  line-height: 328px;
  display: flex;
  justify-content: space-between;
  .title {
    margin-left: 130px;
    color: #fff;
    font-family: LuckiestGuy;
    font-size: 30px;
    font-weight: 400;
    span {
      font-family: Inter;
      font-size: 14px;
      font-weight: 400;
      color: rgba(255, 255, 255, 0.3);
      margin-left: 17px;
    }
  }
  .right {
    font-family: LuckiestGuy;
    font-size: 30px;
    font-weight: 400;
    color: #fff;
    margin-right: 172px;
  }
}
</style>
