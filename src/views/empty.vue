<template>
  <div class="empty">
    <ErrorInfo ref="errorInfoRef" />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import ErrorInfo from "@/components/error-info.vue";
const errorInfoRef = ref(null);
const isShowError = () => {
  errorInfoRef.value.open(
    "The journey will begin soon, wish you good luck ！",
    "infinite"
  );
};
onMounted(() => {
  isShowError();
});
</script>
<style scoped lang="scss">
.empty {
  position: absolute;
  top: 60px;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba($color: #000000, $alpha: 0.5);
}
</style>
