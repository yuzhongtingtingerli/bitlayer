<template>
  <div class="myRecord">
    <div class="title">
      <div class="left">My Record</div>
      <div class="right" v-if="Address.getBTCaddress">
        <img
          src="@/assets/uniset-logo.png"
          width="32px"
          style="margin-right: 16px"
          alt=""
          srcset=""
        />
        {{ getAddress(Address.getBTCaddress) }}
      </div>
    </div>
    <div
      v-if="myRecord?.length > 0 && Address.getBTCaddress"
      class="information"
    >
      <div
        class="list-item"
        v-for="item in myRecord"
        :key="item.BridgeTokenTime"
      >
        <div class="left">
          <div :class="`sent active`">
            Sent {{ getMoney(item.BridgeTokenBalance) }}
            {{ decodeURIComponent(item.BridgeTokenSymbol) }}
          </div>
          <div class="wait">
            <div
              :class="`point ${
                item.BridgeWorkFlow == '1' ? 'flash' : 'active'
              }`"
            >
              <div></div>
              <div></div>
              <div></div>
            </div>
            <span :class="`${item.BridgeWorkFlow != '1' ? 'active' : ''}`">
              Wait The BTC Network Confirm</span
            >
          </div>
          <div class="tokens">
            <div
              :class="`point  ${
                item.BridgeWorkFlow == '2' || item.BridgeWorkFlow == '3'
                  ? 'flash'
                  : item.BridgeWorkFlow == '4'
                  ? 'active'
                  : ''
              }`"
            >
              <div></div>
              <div></div>
              <div></div>
            </div>
            <span :class="`${item.BridgeWorkFlow == '4' ? 'active' : ''}`"
              >Bitparty Smactcontract Sent Your ERC20 Tokens</span
            >
          </div>
        </div>
        <div
          :class="`status ${getStatusColor(item.BridgeTokenStatus)}`"
          @click="handleStatus(item)"
        >
          {{ item.BridgeTokenStatus }}
        </div>
      </div>
    </div>
    <div v-else class="information noInformation">No Information</div>
    <a-pagination
      v-if="myRecord?.length > 0 && total > 4 && Address.getBTCaddress"
      v-model:current="current"
      :pageSize="4"
      :total="total"
      size="small"
      @change="handleChange"
      :showSizeChanger="false"
    />
  </div>
  <bitpartyAddress ref="bitpartyAddressRef" @change="isSuccess" />
  <StakeSuccess ref="stakeSuccessRef" />
</template>

<script setup>
import { ref, watch, onMounted } from "vue";
import { useRouter } from "vue-router";
import { getMoney, getAddress } from "@/utils/Tools.js";
import { getBridgeListData } from "@/services/index";
import StakeSuccess from "@/components/stake-success.vue";
import { useAddressStore } from "@/store/address";
import bitpartyAddress from "./bitpartyAddress.vue";
const Address = useAddressStore();
const current = ref(1);
const total = ref(0);
const myRecord = ref(null);
const handleChange = (page, pageSize) => {
  current.value = page;
  getBridgeList();
};
const stakeSuccessRef = ref(null);
const isSuccess = (txid) => {
  stakeSuccessRef.value.open(txid, TokenSymbol.value);
  getBridgeList();
};
const getBridgeList = async () => {
  if (!Address.getBTCaddress) return;
  const res = await getBridgeListData({
    BridgeType: 1,
    UserAddress: Address.getBTCaddress,
    Offset: current.value,
    Limit: 4,
  });
  myRecord.value = res.result.BridgeInfo;
  total.value = res.result.TotalListNumber;
};
const refreshBridgeList = () => {
  myRecord.value = null;
  current.value = 1;
  total.value = 0;
  getBridgeList();
};
const bitpartyAddressRef = ref(null);
const router = useRouter();
const handleStatus = (item) => {
  if (item.BridgeTokenStatus === "Go Stake") {
    router.push({ path: "/stake" });
  }
};
const getStatusColor = (status) => {
  let color = "white";
  switch (status) {
    case "pending":
      color = "white";
      break;
    case "Failed":
      color = "red";
      break;
    case "Go Stake":
      color = "green";
      break;
    default:
      color = "white";
      break;
  }
  return color;
};
watch(
  Address,
  (newVal, oldVal) => {
    console.log(newVal, oldVal, Address.getBTCaddress, "Address.getBTCaddress");
    getBridgeList();
  },
  { immediate: true }
);

onMounted(() => {
  // 每15分钟执行一次
  setInterval(() => {
    getBridgeList();
  }, 1000 * 60 * 15);
});
defineExpose({ refreshBridgeList });
</script>

<style>
.myRecord .ant-pagination.ant-pagination-mini {
  margin-top: 16px auto;
}
.ant-pagination {
  text-align: center !important;
}
.ant-pagination.ant-pagination-mini.css-dev-only-do-not-override-19yxfbp {
}
.ant-pagination-item-ellipsis {
  color: #fff !important;
}
</style>
<style scoped lang="scss">
.myRecord {
  margin-top: 32px;
  .title {
    display: flex;
    justify-self: start;
    width: 388px;
    height: 70px;
    line-height: 70px;
    text-align: center;
    background: linear-gradient(
      135deg,
      rgba(131, 196, 255, 0.1) 0%,
      rgba(255, 255, 255, 0.1) 100%
    );
    .left {
      font-family: LilitaOne;
      font-size: 32px;
      font-weight: 400;
      letter-spacing: 0em;
      margin-right: 27px;
      margin-left: 40px;
    }
    .right {
      font-family: LilitaOne;
      font-size: 13px;
      font-weight: 400;
    }
  }
  .information {
    height: 284px;
    margin-top: 22px;
    background: linear-gradient(
      135deg,
      rgba(131, 196, 255, 0.1) 0%,
      rgba(255, 255, 255, 0.1) 100%
    );
    padding-top: 18px;
    padding-right: 30px;
    padding-left: 60px;
    .list-item {
      height: 30px;
      line-height: 30px;
      display: flex;
      justify-content: space-between;
      font-family: LilitaOne;
      font-size: 15px;
      font-weight: 400;
      letter-spacing: 0em;
      margin-bottom: 38px;

      .left {
        display: flex;
        justify-self: start;
        align-items: center;
        .wait {
          margin-left: 15px;
        }
        .point {
          margin-right: 8px;
          display: inline-flex;
          div {
            background-color: #fff;
            width: 10px;
            height: 10px;
            border-radius: 50%;
            margin: 4px;
          }
        }
        .tokens {
          margin-left: 15px;
        }
        .active {
          color: #ffaa08;
        }
        .point.active {
          div {
            background-color: #ffaa08;
          }
        }
        .flash {
          font-size: 0;
          color: #ffaa08;
        }
        .flash > div {
          display: inline-block;
          float: none;
          background-color: #ffaa08;
          border: 0 solid currentColor;
        }

        .flash {
          width: 54px;
        }
        .flash > div:nth-child(1) {
          animation-delay: -200ms;
        }

        .flash > div:nth-child(2) {
          animation-delay: -100ms;
        }

        .flash > div:nth-child(3) {
          animation-delay: 0ms;
        }

        .flash > div {
          width: 10px;
          height: 10px;
          margin: 4px;
          border-radius: 100%;
          animation: ball-pulse 1s ease infinite;
        }
        @keyframes ball-pulse {
          0%,
          60%,
          100% {
            opacity: 1;
            transform: scale(1);
          }

          30% {
            opacity: 0.1;
            transform: scale(0.01);
          }
        }
      }
      .status {
        width: 100px;
        border-radius: 4px;
        text-align: center;
        color: #000;
        cursor: pointer;
      }
      .white {
        background-color: #fff;
      }
      .red {
        background-color: #ff4d00;
      }
      .green {
        background-color: #a3dc00;
      }
    }
    .list-item:nth-child(4) {
      margin-bottom: 0;
    }
  }
  .noInformation {
    line-height: 284px;
    text-align: center;
    font-family: LilitaOne;
    font-size: 20px;
    font-weight: 400;
    letter-spacing: 0em;
  }
}
</style>
