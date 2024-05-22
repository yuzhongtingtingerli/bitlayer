<template>
  <div :class="`bjs ${currentRoute === '/rank' ? 'yellow ' : 'black '}`">
    <div class="header">
      <div class="left">
        <div class="title">
          <img
            v-if="currentRoute === '/rank'"
            src="@/assets/Union1.png"
            style="margin-right: 12px"
            width="42"
          />
          <img
            v-else
            src="@/assets/Union.png"
            style="margin-right: 12px"
            width="42"
          />
          <router-link to="/">BIT PARTY</router-link>
          <span class="handover">on bitlayer</span>
        </div>
        <div class="menu">
          <router-link :class="getCurrentRoute('/map')" to="/map"
            >Map</router-link
          >
          <router-link :class="getCurrentRoute('/rank')" to="/rank"
            >Rank</router-link
          >
          <!-- <router-link :class="getCurrentRoute('/bridge')" to="/bridge"
            >Bridge</router-link
          > -->
          <router-link :class="getCurrentRoute('/stake')" to="/stake"
            >Stake</router-link
          >
          <a href="https://docs.bitparty.tech" target="_blank">Whitepaper</a>
          <!-- <router-link to="/empty">Safe And Privacy</router-link> -->
          <router-link :class="getCurrentRoute('/withdraw')" to="/withdraw"
            >Withdraw</router-link
          >
        </div>
      </div>
      <div class="right">
        <div
          class="icon"
          v-if="
            currentRoute != '/bridge' &&
            currentRoute != '/stake' &&
            currentRoute != '/withdraw' &&
            currentRoute != '/rank'
          "
        >
          <a href="https://discord.gg/xyN9KUXpp5" target="_blank">
            <img
              v-if="currentRoute === '/rank'"
              src="@/assets/head_dog-black.png"
              alt=""
              srcset=""
            />
            <img v-else src="@/assets/head_dog.png" alt="" srcset="" />
          </a>
          <a href="https://t.me/bitparty_games" target="_blank">
            <img
              v-if="currentRoute === '/rank'"
              src="@/assets/head-f-black.png"
              alt=""
              srcset=""
            />
            <img v-else src="@/assets/head-f.png" alt="" srcset="" />
          </a>
          <a href="https://twitter.com/BitPartyTech" target="_blank">
            <img
              v-if="currentRoute === '/rank'"
              src="@/assets/head_t-black.png"
              alt=""
              srcset=""
            />
            <img v-else src="@/assets/head_t.png" alt="" srcset="" />
          </a>
        </div>
        <div
          :class="`Wallet ${currentRoute === '/rank' ? 'white' : ''}`"
          v-if="
            currentRoute != '/bridge' &&
            currentRoute != '/stake' &&
            currentRoute != '/withdraw'
          "
        >
          <div @click="connectWallet">
            <img
              v-if="Address.getETHaddress && Address.getETHWalletType === 'eth'"
              src="@/assets/matemask.png"
              width="28px"
              alt=""
              srcset=""
            />
            <img
              v-if="Address.getETHaddress && Address.getETHWalletType === 'ip'"
              src="@/assets/okx-wallet.png"
              width="28px"
              alt=""
              srcset=""
            />
            {{
              !Address.getETHaddress
                ? "Connect Wallet"
                : getAddress(Address.getETHaddress)
            }}
          </div>
          <div class="isQuit" v-if="isETHQuit" @click="ethQuit">log out</div>
        </div>
      </div>
    </div>
    <ChooseWallet ref="chooseWalletRef" @change="chooseWallet" />
    <ErrorMsg ref="errorMsgRef" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import ChooseWallet from "@/components/chooseWallet.vue";
import ErrorMsg from "@/components/error-msg.vue";
import { useAddressStore } from "@/store/address";
import { useRouter } from "vue-router";
import { getAddress } from "@/utils/Tools";
const router = useRouter();
const Address = useAddressStore();

let currentRoute = computed(() => router.currentRoute.value.path);
const getCurrentRoute = (path) => {
  if (currentRoute.value === path) return "active";
  return "";
};
const isETHQuit = ref(false);
const ethQuit = () => {
  Address.clearETHWallet();
  isETHQuit.value = false;
};
const chooseWalletRef = ref(null);
const connectWallet = async () => {
  if (Address.getETHaddress) {
    isETHQuit.value = !isETHQuit.value;
  }
  if (!isETHQuit.value && !Address.ETHaddress) {
    chooseWalletRef.value.open("eth");
    // Address.linkWallet();
  }
};
const errorMsgRef = ref(null);
const chooseWallet = async (type) => {
  if (type === "eth") {
    // Address.linkETHWallet();
    window.localStorage.setItem("ETHWalletType", "eth");
    Address.selectETH();
  } else if (type === "ip") {
    // Address.linkIPwallet();
    window.localStorage.setItem("ETHWalletType", "ip");
    const flag = await Address.selectETH();
    if (!flag) {
      const headline = "Dear!";
      const title = "Connection Wallet Error";
      const message = `Please check your OKX wallet type,make sure it have a correct EVM/BTC address`;
      errorMsgRef.value.open(headline, title, message);
    }
  }
};
onMounted(() => {
  Address.getETHWallet();
});
</script>
<style scoped lang="scss">
.yellow {
  background-color: #fccd37;
  color: #000;
  .menu {
    a {
      font-family: LilitaOne;
      font-size: 16px;
      margin-right: 38.6px;
      color: #000;
    }
    .active {
      color: #fff;
      text-shadow: 0 1px #000, 1px 0 #000, -1px 0 #000, 0 -1px #000;
    }
  }
  .title {
    a {
      color: #000;
    }
  }
}
.black {
  background: #000;
  color: #fff;
  .menu {
    a {
      font-family: LilitaOne;
      font-size: 16px;
      margin-right: 38.6px;
      color: #fff;
    }
    .active {
      color: #fccd37;
    }
  }
  .title {
    a {
      color: #fff;
    }
  }
}
.bjs {
  height: 60px;
}
.header {
  line-height: 60px;
  display: flex;
  justify-content: space-between;
  width: 1440px;
  margin: 0 auto;
  .left {
    display: flex;
    justify-self: start;
    .title {
      font-family: LuckiestGuy;
      font-size: 30px;
      width: 320px;
      text-align: center;
      margin-right: 30px;
      color: #000;
    }
    .handover {
      position: relative;
      display: inline-block;
      height: 16px;
      line-height: 16px;
      font-family: Urbanist;
      font-size: 10px;
      font-weight: 900;
      text-align: left;
      border: 1px solid #f4ba65;
      color: #f4ba65;
      margin-left: 10px;
      margin-bottom: 10px;
      padding: 0 10px;
      text-transform: capitalize;
    }
    .rank_color {
      border: 1px solid #000;
      color: #000;
    }
  }

  .right {
    display: flex;
    justify-self: start;
    .icon {
      img {
        width: 20px;
        height: 20px;
        margin-right: 20px;
      }
    }
  }
  .Wallet {
    position: relative;
    width: 180px;
    height: 40px;
    line-height: 40px;
    font-family: LilitaOne;
    font-size: 16px;
    text-align: center;
    background-color: #f6cb37;
    color: #000;
    border: 2px solid #000;
    border-radius: 4px;
    box-shadow: 2px 2px 0 #000;
    margin-top: 10px;
    cursor: pointer;
    img {
      margin-bottom: 7px;
    }
    .isQuit {
      position: absolute;
      top: 38px;
      left: 0;
      width: 176px;
      height: 44px;
      line-height: 44px;
      text-align: center;
      font-family: LilitaOne;
      font-size: 15px;
      color: #fff;
      text-transform: capitalize;
      background-image: url("@/assets/logOut.png");
      background-size: 176px 44px;
      z-index: 1;
    }
  }
  .white {
    background-color: #fff;
  }
}
</style>
