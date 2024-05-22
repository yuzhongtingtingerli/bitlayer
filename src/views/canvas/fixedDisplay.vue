<template>
  <div class="fixedDisplay" v-if="props.seasonData">
    <div>TVL：{{ getMoney(props.seasonData?.TotalStakeToken) }} BTC</div>
    <div>
      Created by：{{ props.seasonData?.Staker }} Bsquared assets holders
    </div>
    <div>
      Will release：{{ getMoney(props.seasonData?.WillRelease) }}
      <span>$btpx</span>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from "vue";
import { getMoney } from "@/utils/Tools";
const props = defineProps({
  seasonData: Object,
});
</script>
<style scoped lang="scss">
.fixedDisplay {
  position: absolute;
  bottom: 30px;
  left: 46px;
  color: #fff;
  font-family: LilitaOne;
  font-size: 14px;
  font-weight: 400;
  line-height: 22px;
  letter-spacing: 0em;
  z-index: 99;
  span {
    color: #ffaa08;
  }
}
</style>
