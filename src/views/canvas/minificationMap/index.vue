<template>
  <div class="minification_map" ref="map">
    <div class="bgImg">
      <div
        class="groups"
        v-for="group in GroupInfoData"
        :key="group.PersonNumber"
      >
        <div class="group" v-for="i in Number(group.GroupNumber)">
          <div class="person">
            <div
              class="row"
              v-for="j in group.colNumT"
              :style="`justify-content: ${group.tAlgin}`"
            >
              <div class="col" v-for="k in group.colT">
                <img src="@/assets/cat_head.png" alt="" />
              </div>
              <div class="col" v-if="Number(group.PersonNumber) === 2"></div>
            </div>
            <div
              class="row"
              v-for="j in group.colNumB"
              :style="`justify-content: ${group.bAlgin}`"
            >
              <div class="col" v-if="Number(group.PersonNumber) === 2"></div>
              <div class="col" v-for="k in group.colB">
                <img src="@/assets/cat_head.png" alt="" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="text">
      <div class="title">LFG !!! $BTPX</div>
      <div class="title">Story Just Beginning</div>
    </div>
    <div class="cat">
      <img src="@/assets/center_cat.png" alt="" />
    </div>
    <div class="footer" v-if="props.seasonData">
      <div class="top">
        <div class="t">
          TVL：{{ getMoney(props.seasonData?.TotalStakeToken) }} BTC
        </div>
        <div class="t">
          Created by：{{ props.seasonData?.Staker }} Bsquared assets holders
        </div>
        <div class="t">
          Special thanks to ：{{ getAddress(Address.getETHaddress) }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, defineProps, onMounted } from "vue";
import { useAddressStore } from "@/store/address";
import { getAddress, getMoney } from "@/utils/Tools";

const Address = useAddressStore();
const props = defineProps({
  GroupInfo: Object,
  seasonData: Object,
});
const emit = defineEmits(["wheel"]);
const GroupInfoData = ref([]);
const getGroupInfo = (GroupInfo) => {
  let groupInfo = GroupInfo.sort((a, b) => b.PersonNumber - a.PersonNumber);
  groupInfo.forEach((group) => {
    if (Number(group.PersonNumber) > 30) {
      // 总行数
      const row = Math.ceil(Number(group.PersonNumber) / 6);
      // 缺省行数
      const defRow = Number(group.PersonNumber) % 6;
      group.colNumT = defRow;
      group.colT = 5;
      group.colNumB = row - defRow;
      group.colB = 6;
      group.tAlgin = "right";
      group.bAlgin = "left";
    } else if (Number(group.PersonNumber) > 25) {
      // 总行数
      const row = Math.ceil(Number(group.PersonNumber) / 5);
      // 缺省行数
      const defRow = Number(group.PersonNumber) % 5;
      group.colNumT = row - defRow;
      group.colT = 5;
      group.colNumB = 1;
      group.colB = defRow;
      group.tAlgin = "start";
      group.bAlgin = "end";
    } else if (Number(group.PersonNumber) > 20) {
      // 总行数
      const row = Math.ceil(Number(group.PersonNumber) / 5);
      // 缺省行数
      const defRow = Number(group.PersonNumber) % 5;
      group.colNumT = defRow;
      group.colT = 5;
      group.colNumB = row - defRow;
      group.colB = 4;
      group.tAlgin = "right";
      group.bAlgin = "left";
    } else if (Number(group.PersonNumber) > 16) {
      // 总行数
      const row = Math.ceil(Number(group.PersonNumber) / 4);
      // 缺省行数
      const defRow = Number(group.PersonNumber) % 4;
      group.colNumT = 1;
      group.colT = 4 - defRow;
      group.colNumB = row - 1;
      group.colB = 4;
      group.tAlgin = "start";
      group.bAlgin = "end";
    } else if (Number(group.PersonNumber) > 12) {
      // 总行数
      const row = Math.ceil(Number(group.PersonNumber) / 4);
      // 缺省行数
      const defRow = Number(group.PersonNumber) % 4;
      group.colNumT = defRow;
      group.colT = 3;
      group.colNumB = row - defRow;
      group.colB = 4;
      group.tAlgin = "right";
      group.bAlgin = "left";
    } else if (Number(group.PersonNumber) > 9) {
      // 总行数
      const row = Math.ceil(Number(group.PersonNumber) / 3);
      // 缺省行数
      const defRow = Number(group.PersonNumber) % 3;
      console.log(row, defRow);
      group.colNumT = row - defRow;
      group.colT = 3;
      group.colNumB = 1;
      group.colB = defRow;
      group.tAlgin = "start";
      group.bAlgin = "end";
    } else if (Number(group.PersonNumber) > 6) {
      // 总行数
      const row = Math.ceil(Number(group.PersonNumber) / 3);
      // 缺省行数
      const defRow = Number(group.PersonNumber) % 3;
      group.colNumT = defRow;
      group.colT = 3;
      group.colNumB = row - defRow;
      group.colB = 2;
      group.tAlgin = "right";
      group.bAlgin = "left";
    } else if (Number(group.PersonNumber) > 4) {
      // 总行数
      const row = Math.ceil(Number(group.PersonNumber) / 2);
      // 缺省行数
      const defRow = Number(group.PersonNumber) % 2;
      group.colNumT = 1;
      group.colT = 1;
      group.colNumB = 2;
      group.colB = 2;
      group.tAlgin = "start";
      group.bAlgin = "end";
    } else if (Number(group.PersonNumber) === 4) {
      group.colNumT = 2;
      group.colT = 2;
      group.colNumB = 0;
      group.colB = 0;
      group.tAlgin = "start";
      group.bAlgin = "end";
    } else if (Number(group.PersonNumber) === 3) {
      group.colNumT = 1;
      group.colT = 2;
      group.colNumB = 1;
      group.colB = 1;
      group.tAlgin = "start";
      group.bAlgin = "end";
    } else if (Number(group.PersonNumber) === 2) {
      group.colNumT = 1;
      group.colT = 1;
      group.colNumB = 1;
      group.colB = 1;
      group.tAlgin = "start";
      group.bAlgin = "end";
    } else if (Number(group.PersonNumber) === 1) {
      group.colNumT = 1;
      group.colT = 1;
      group.colNumB = 0;
      group.colB = 0;
      group.tAlgin = "start";
      group.bAlgin = "end";
    }
  });
  GroupInfoData.value = groupInfo;
};
watch(
  props.GroupInfo,
  (newVal, oldVal) => {
    if (props.GroupInfo) {
      getGroupInfo(props.GroupInfo);
    }
  },
  { immediate: true }
);
const map = ref();
onMounted(() => {
  map.value.addEventListener("wheel", (event) => {
    if (event.deltaY < 0) {
      // 向上滚动，放大画布
      console.log("向上滚动");
      emit("wheel");
    }
  });
});
</script>
<style scoped lang="scss">
.minification_map {
  position: absolute;
  left: 0;
  top: 0;
  z-index: 999;
  width: 100%;
  height: 100%;
  background-color: rgb(0, 0, 0);
  .text {
    position: absolute;
    top: 50%;
    left: 0;
    transform: translateY(-50%);
    width: 100%;
  }
  .title {
    color: #fff;
    text-align: center;
    font-family: LilitaOne;
    font-size: 128px;
    font-weight: 400;
    line-height: 132px;
    letter-spacing: 0em;
    text-align: center;
    text-shadow: 0 3px #000, 3px 0 #000, -1px 0 #000, 0 -1px #000;
  }
  .cat {
    position: absolute;
    top: 65%;
    left: 50%;
    transform: translateX(-50%);
    img {
      width: 120px;
    }
  }
  .bgImg {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: #fff;
    .groups {
      display: flex;
      margin-bottom: 12px;
      justify-content: center;
      .group {
        display: flex;
        margin-right: 13px;
        .person {
          .row {
            display: flex;
            justify-self: start;
            .col {
              width: 13px;
              height: 14px;
            }
          }
          img {
            width: 13px;
            height: 14px;
          }
        }
      }
    }
  }
  .footer {
    position: absolute;
    bottom: 45px;
    left: 0;
    color: #fff;
    width: 100%;
    text-align: center;
    .t {
      display: inline-block;
      font-family: LilitaOne;
      font-size: 20px;
      font-weight: 400;
      line-height: 22px;
      // css首字母大写
      text-transform: capitalize;
    }
    .top {
      width: 100%;
      .t {
        margin-right: 60px;
      }
    }
  }
}
</style>
