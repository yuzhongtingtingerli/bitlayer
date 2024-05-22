<template>
  <div class="title">{{ title }}</div>
</template>

<script setup>
import { defineProps } from "vue";
/**
 * 数据部分
 */
const porps = defineProps({
  title: String,
});
</script>
<style scoped lang="scss">
.title {
  font-size: 20px;
  font-family: LilitaOne;
  text-align: left;
}
</style>
