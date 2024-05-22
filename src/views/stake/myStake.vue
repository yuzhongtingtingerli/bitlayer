<template>
  <div class="myStake">
    <div class="top">
      <div class="title">MY STAKE</div>
      <div class="wallet">
        <div @click="connectETHWallet">
          <img
            v-if="Address.ETHaddress && Address.getETHWalletType === 'eth'"
            src="@/assets/matemask.png"
            width="28px"
            style="margin-right: 12px"
            alt=""
            srcset=""
          />
          <img
            v-if="Address.ETHaddress && Address.getETHWalletType === 'ip'"
            src="@/assets/okx-wallet.png"
            width="28px"
            style="margin-right: 12px"
            alt=""
            srcset=""
          />
          {{
            Address.ETHaddress
              ? getAddress(Address.ETHaddress)
              : "Connect ETH Wallet"
          }}
        </div>

        <div class="isQuit" v-if="isETHQuit" @click="ethQuit">log out</div>
      </div>
    </div>
    <div class="nocontent" v-if="!Address.ETHaddress">
      <div class="img"><img src="@/assets/empty.png" width="80px" /></div>
      <div class="text">
        Please connect your wallet, check the white paper know the rules
      </div>
    </div>
    <div class="content" v-else>
      <MyTokenList :address="Address.ETHaddress" />
      <MyStakeList :address="Address.ETHaddress" />
    </div>
    <ChooseWallet ref="chooseWalletRef" @change="chooseWallet" />
    <ErrorMsg ref="errorMsgRef" />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import MyTokenList from "./myTokenList.vue";
import MyStakeList from "./myStakeList.vue";
import ChooseWallet from "@/components/chooseWallet.vue";
import ErrorMsg from "@/components/error-msg.vue";
import { getAddress } from "@/utils/Tools";
import { useAddressStore } from "@/store/address";

const Address = useAddressStore();
const chooseWalletRef = ref(null);
const connectETHWallet = async () => {
  if (Address.getETHaddress) {
    isETHQuit.value = !isETHQuit.value;
  }
  if (!isETHQuit.value && !Address.ETHaddress) {
    chooseWalletRef.value.open("eth");
    // Address.linkWallet();
  }
};
const isETHQuit = ref(false);
const ethQuit = () => {
  Address.clearETHWallet();
  isETHQuit.value = false;
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
.myStake {
  padding-top: 60px;
  .top {
    display: flex;
    justify-content: space-between;
    .title {
      font-family: LilitaOne;
      font-size: 40px;
      font-weight: 400;
      line-height: 46px;
    }
    .wallet {
      position: relative;
      font-family: LilitaOne;
      font-size: 18px;
      font-weight: 400;
      width: 240px;
      height: 60px;
      line-height: 60px;
      text-align: center;
      background: linear-gradient(
        135deg,
        rgba(131, 196, 255, 0.1) 0%,
        rgba(255, 255, 255, 0.1) 100%
      );
      cursor: pointer;
      .isQuit {
        position: absolute;
        top: 62px;
        left: 0;
        width: 240px;
        height: 44px;
        line-height: 44px;
        text-align: center;
        font-family: LilitaOne;
        font-size: 15px;
        color: #fff;
        text-transform: capitalize;
        background-image: url("@/assets/logOut.png");
        background-size: 240px 44px;
        z-index: 1;
      }
    }
  }
  .nocontent {
    margin-top: 20px;
    height: 300px;
    text-align: center;
    font-family: LilitaOne;
    font-size: 15px;
    font-weight: 400;
    color: #ffffff;
    opacity: 0.5;
    background: linear-gradient(
      135deg,
      rgba(131, 196, 255, 0.1) 0%,
      rgba(255, 255, 255, 0.1) 100%
    );
    padding-top: 44px;
  }
  .content {
    margin-top: 20px;
    height: 400px;
    display: flex;
    justify-content: space-between;
    // background: linear-gradient(
    //   135deg,
    //   rgba(131, 196, 255, 0.1) 0%,
    //   rgba(255, 255, 255, 0.1) 100%
    // );
  }
}
</style>
