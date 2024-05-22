<template>
  <div class="network">
    <div class="BTCWallet">
      <div class="btn">
        <div class="img" v-if="Address.getBTCaddress">
          <img
            v-if="Address.getBTCWalletType === 'unisat'"
            src="@/assets/uniset-logo.png"
            width="28px"
            alt=""
            srcset=""
          />
          <img
            v-if="Address.getBTCWalletType === 'okx'"
            src="@/assets/okx-wallet.png"
            width="28px"
            alt=""
            srcset=""
          />
        </div>
        <div class="text" @click="connectBTCWallet">
          {{
            !Address.getBTCaddress
              ? "Connect BTC Wallet"
              : getAddress(Address.getBTCaddress)
          }}
        </div>
        <div class="isQuit" v-if="isBTCQuit" @click="btcQuit">log out</div>
      </div>
      <div class="title">BRC20 NETWORK</div>
      <div class="tips" v-if="errorMsgBTC">
        {{ errorMsgBTC }}
        <!-- <InfoCircleOutlined style="font-size: 12px; margin-left: 10px" />
        <div class="tip">You Should Do Something First</div> -->
      </div>
      <div class="content">
        <div class="brc20 change" @click="showModal">
          <div class="left">Select Token</div>
          <div class="right">
            <span>{{ token?.ticker || "Brc20" }}</span>
            <img src="@/assets/Vector.png" />
          </div>
        </div>
        <div class="amount change" v-if="token?.ticker === 'btc'">
          <div class="left">Amount</div>
          <div class="right">
            <a-input
              v-model:value="btcAmount"
              placeholder="0.00"
              size="small"
              @input="onInput"
            ></a-input>
          </div>
        </div>
        <div class="amount change" @click="showAmount" v-else>
          <div class="left">Amount</div>
          <div class="right">
            <span>{{ amountInfo?.data.amt || "0.00" }}</span>
            <img src="@/assets/Vector.png" />
          </div>
        </div>
      </div>
      <div class="transfer" v-if="handover === 'BTC'" @click="openTransfer">
        Transfer
      </div>
    </div>
    <div class="handover">
      <div class="left">
        <img
          v-show="handover === 'ETH'"
          @click="changeWallet('BTC')"
          src="@/assets/bridge_l_g.png"
          alt=""
          srcset=""
        />
        <img
          v-show="handover === 'BTC'"
          src="@/assets/bridge_l.png"
          alt=""
          srcset=""
        />
      </div>
      <div class="right">
        <img
          v-show="handover === 'ETH'"
          src="@/assets/bridge_r.png"
          alt=""
          srcset=""
        />
        <!-- @click="changeWallet('ETH')" -->
        <img
          v-show="handover === 'BTC'"
          src="@/assets/bridge_r_g.png"
          alt=""
          srcset=""
        />
      </div>
    </div>
    <div class="ETHWallet">
      <div class="btn">
        <div class="img" v-if="Address.getETHaddress">
          <img
            v-if="Address.getETHWalletType === 'eth'"
            src="@/assets/matemask.png"
            width="28px"
            alt=""
            srcset=""
          />
          <img
            v-if="Address.getETHWalletType === 'ip'"
            src="@/assets/okx-wallet.png"
            width="28px"
            alt=""
            srcset=""
          />
        </div>
        <div class="text" @click="connectETHWallet">
          {{
            Address.getETHaddress === "" || !Address.getETHaddress
              ? "Connect ETH Wallet"
              : getAddress(Address.getETHaddress)
          }}
        </div>
        <div class="isQuit" v-if="isETHQuit" @click="ethQuit">log out</div>
      </div>
      <div class="title">ERC20 NETWORK</div>
      <div class="tips" v-if="errorMsgETH">
        {{ errorMsgETH }}
        <!-- <InfoCircleOutlined style="font-size: 12px; margin-left: 10px" />
        <div class="tip">You Should Do Something First</div> -->
      </div>
      <div class="content">
        <div class="brc20 change">
          <div class="left">Will Get</div>
          <div class="right">
            {{ token?.ticker }}
          </div>
        </div>
        <div class="amount change">
          <div class="left">Amount</div>
          <div class="right">
            {{ token?.ticker === "btc" ? btcAmount : amountInfo?.data.amt }}
          </div>
        </div>
        <div
          class="address"
          v-if="TokenContractAddress"
          @click="goTokenContractAddress"
        >
          {{ token?.ticker }} eth contract address:
          {{ getAddress(TokenContractAddress) }}
          <img src="@/assets/Magnifying.png" alt="" />
        </div>
      </div>
      <div class="transfer" v-if="handover === 'ETH'">Transfer</div>
    </div>

    <selectToken ref="selectTokenRef" @change="changeToken" />
    <selectAmount ref="selectAmountRef" @change="changeAmount" />
    <transferModal ref="transferModalRef" @change="isSuccess" />
    <ErrorInfo ref="errorInfoRef" />
    <SuccessMsg ref="successMsgRef" />
    <ErrorMsg ref="errorMsgRef" />
    <ChooseWallet ref="chooseWalletRef" @change="chooseWallet" />
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { getAddress } from "@/utils/Tools";
import {
  getTVLStatusData,
  getETHContractAddressData,
  checkAddressMappingData,
  insertAddressMappingData,
} from "@/services/index.js";

import { useAddressStore } from "@/store/address";
import selectToken from "./selectToken.vue";
import selectAmount from "./selectAmount.vue";
import transferModal from "./transferModal.vue";
import ChooseWallet from "@/components/chooseWallet.vue";
import ErrorInfo from "@/components/error-info.vue";
import SuccessMsg from "@/components/success-msg.vue";
import ErrorMsg from "@/components/error-msg.vue";
import { MetaMaskSDK } from "@metamask/sdk";
const emit = defineEmits(["refresh"]);
const Address = useAddressStore();
const isBTCQuit = ref(false);
const chooseWalletRef = ref(null);
const connectBTCWallet = () => {
  if (Address.getBTCaddress) {
    isBTCQuit.value = !isBTCQuit.value;
  }
  if (!isBTCQuit.value && !Address.BTCaddress) {
    console.log(isBTCQuit.value, Address.getBTCaddress, "isBTCQuit.value");
    chooseWalletRef.value.open("btc");
    // Address.linkWallet();
  }
};
const isETHQuit = ref(false);
const connectETHWallet = async () => {
  if (Address.getETHaddress) {
    isETHQuit.value = !isETHQuit.value;
  }
  if (!isETHQuit.value && !Address.ETHaddress) {
    console.log(isETHQuit.value, Address.getBTCaddress, "isETHQuit.value");
    chooseWalletRef.value.open("eth");
    // Address.linkWallet();
  }
  // Address.linkETHWallet();
  // console.log(ethers, "ethers");
  // const provider = new ethers.providers.Web3Provider(window.ethereum);
  // console.log(provider, "provider");
  // const signer = provider.getSigner();
  // console.log(signer, "signer");
  // const address = await provider.send("eth_requestAccounts", []);
  // console.log(address, "address");
  // const MMSDK = new MetaMaskSDK({
  //   dappMetadata: {
  //     name: "JavaScript example dapp",
  //     url: window.location.href,
  //   },
  //   infuraAPIKey: process.env.INFURA_API_KEY,
  //   // Other options
  // });

  // // You can also access via window.ethereum
  // const ethereum = MMSDK.getProvider();
  // console.log(ethereum, "ethereum");
  // ethereum.request({ method: "eth_requestAccounts", params: [] });
};
const chooseWallet = async (type) => {
  if (type === "okx") {
    // Address.linkOkxwallet();
    window.localStorage.setItem("BTCWalletType", "okx");
    const flag = await Address.selectBTC();
    if (!flag) {
      const headline = "Dear!";
      const title = "Connection Wallet Error";
      const message = `Please check your OKX wallet type,make sure it have a correct EVM/BTC address`;
      errorMsgRef.value.open(headline, title, message);
    }
  } else if (type === "unisat") {
    // Address.linkWallet();
    window.localStorage.setItem("BTCWalletType", "unisat");
    Address.selectBTC();
  } else if (type === "eth") {
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
const btcQuit = () => {
  Address.clearBTCWallet();
  isBTCQuit.value = false;
};
const ethQuit = () => {
  Address.clearETHWallet();
  isETHQuit.value = false;
};
const errorMsgRef = ref(null);
// token 弹框
const selectTokenRef = ref(null);
const showModal = () => {
  selectTokenRef.value.open(Address.getBTCaddress);
};
const token = ref(null);
const changeToken = (data) => {
  token.value = data;
  selectAmountRef.value.clear();
  amountInfo.value = null;
  btcAmount.value = null;
  getETHContractAddress(data.ticker);
};
const clearNetwork = () => {
  token.value = null;
  selectAmountRef.value.clear();
  amountInfo.value = null;
  btcAmount.value = null;
};
const onInput = () => {
  const str = btcAmount.value.toString();
  const len = str.length;
  const point = str.indexOf(".");
  if (point > -1 && len - point > 3 && Number(btcAmount.value) === 0) {
    btcAmount.value = btcAmount.value.slice(0, -1);
    return;
  }
  if (point > -1 && len - point > 4) {
    // 如果不匹配，则删除最后一个字符
    btcAmount.value = btcAmount.value.slice(0, -1);
    return;
  }

  // 将字符串转换为数字并检查是否大于等于0.001
  // const number = parseFloat(btcAmount.value);
  // if (isNaN(number) || number < 0.001) {
  //   // 如果不是数字或小于0.001，则重置为0.001
  //   btcAmount.value = "0.001";
  // }
};

const TokenContractAddress = ref("");
const getETHContractAddress = async (TokenSymbol) => {
  const res = await getETHContractAddressData({ TokenSymbol });
  TokenContractAddress.value = res.result.TokenContractAddress;
};

const goTokenContractAddress = () => {
  const url = `https://etherscan.io/address/${TokenContractAddress.value}`;
  window.open(url, "_blank");
};

// amount 弹框
const selectAmountRef = ref(null);
const showAmount = () => {
  if (!token.value) return;
  selectAmountRef.value.open(
    Address.getBTCaddress,
    token.value?.ticker,
    amountInfo.value
  );
};
const amountInfo = ref(null);
const changeAmount = (data) => {
  amountInfo.value = data;
};
const successMsgRef = ref(null);
const isSuccess = (type, txid) => {
  if (type == "success") {
    successMsgRef.value.open(txid);
    token.value = null;
    amountInfo.value = null;
    emit("refresh");
  } else if (type === "error") {
    const headline = "Dear!";
    const title = txid.ErrorTitle;
    const message = txid.ErrorMessage;
    errorMsgRef.value.open(headline, title, message);
  }
};

// transfer 弹框

const transferModalRef = ref(null);
const showTransferModal = () => {
  const amt =
    token.value.ticker === "btc" ? btcAmount.value : amountInfo.value.data.amt;
  transferModalRef.value.open(
    Address.getBTCaddress,
    Address.getETHaddress,
    amountInfo?.value?.inscriptionId || "",
    token.value.ticker,
    amt,
    amountInfo?.value?.satoshi || ""
  );
};

const handover = ref("BTC");
const changeWallet = (val) => {
  handover.value = val;
};

const amount = ref(null);
const getMax = () => {
  if (!token.value) return;
  amount.value = Number(token.value.transferableBalance);
};

const getTVLStatus = async ({ StakeTokenSymbol, StakeTokenBalance }) => {
  const res = await getTVLStatusData({ StakeTokenSymbol, StakeTokenBalance });
  return res.result.TVLStatus;
};
const errorMsgBTC = ref("");
const errorMsgETH = ref("");
const errorInfoRef = ref(null);
const isShowError = (title) => {
  errorInfoRef.value.open(title);
};
const btcAmount = ref(null);
const openTransfer = async () => {
  if (!token.value) return console.log("没选token");
  if (token.value.ticker === "btc") {
    if (!btcAmount.value) return console.log("没输入金额");
    let balance = await window.unisat.getBalance();
    if (btcAmount.value * 10000 * 10000 > balance.total) {
      const headline = "Dear!";
      const title = "stake value error";
      const message = `stake balance greater than your wallet balance`;
      errorMsgRef.value.open(headline, title, message);
      return;
    }
  } else {
    if (!amountInfo.value) return console.log("没选择金额");
  }
  if (!Address.getETHaddress) {
    const headline = "Dear!";
    const title = "You should connect your eth wallet first";
    const message = `Please remember the association between your current btc
and eth addresses and make sure you don’t forget it before
the game is over`;
    errorMsgRef.value.open(headline, title, message);
    return;
  }
  const CheckMappingStatus = await checkAddressMapping();
  if (CheckMappingStatus == 2) {
    const InsertMappingStatus = await insertAddressMapping();
    if (InsertMappingStatus !== "OK") {
      isShowError(
        "The logging btc address is not matching the logging ethereum address!"
      );
      return;
    }
  } else if (CheckMappingStatus == 0) {
    isShowError(
      "Can not create mapping between bitcoin address and ethereum address！"
    );
    return;
  }
  // const amt =
  //   token.value.ticker === "btc" ? btcAmount.value : amountInfo.value.data.amt;
  // const TVLStatus = await getTVLStatus({
  //   StakeTokenSymbol: token.value.ticker,
  //   StakeTokenBalance: amt,
  // });
  // if (TVLStatus == 0) return;

  showTransferModal();
};

const checkAddressMapping = async () => {
  const res = await checkAddressMappingData({
    BtcAddress: Address.getBTCaddress,
    EthAddress: Address.getETHaddress,
  });
  return res.result.CheckMappingStatus;
};

const insertAddressMapping = async () => {
  const res = await insertAddressMappingData({
    BtcAddress: Address.getBTCaddress,
    EthAddress: Address.getETHaddress,
  });
  return res.result.InsertMappingStatus;
};

onMounted(() => {
  Address.getETHWallet();
  // Address.getBTCWallet();
  if (!Address.getBTCaddress) {
    errorMsgBTC.value = "You should connect your btc wallet first";
  } else {
    errorMsgBTC.value =
      "To send BRC-20, you have to inscribe a TRANSFER inscription first";
  }
  if (!Address.getETHaddress) {
    errorMsgETH.value = "You should connect your eth wallet first";
  } else {
    errorMsgETH.value =
      "Please remember the association between your current btc and eth addresses and make sure you don’t forget it before the game is over";
  }
});
watch(
  Address,
  (newVal, oldVal) => {
    if (!Address.getETHaddress) {
      errorMsgETH.value = "You should connect your eth wallet first";
    } else {
      errorMsgETH.value =
        "Please remember the association between your current btc and eth addresses and make sure you don’t forget it before the game is over";
    }
    if (!Address.getBTCaddress) {
      errorMsgBTC.value = "You should connect your btc wallet first";
    } else {
      errorMsgBTC.value =
        "To send BRC-20, you have to inscribe a TRANSFER inscription first";
    }
    if (newVal && oldVal && newVal.getBTCaddress && oldVal.getBTCaddress) {
      clearNetwork();
    }
  },

  { immediate: true }
);
</script>
<style>
.network {
  .ant-input.css-dev-only-do-not-override-19yxfbp {
    background: none !important;
    border: none;
    font-family: LilitaOne;
    font-size: 15px;
    font-weight: 400;
    text-align: right;
    color: #fff;
    opacity: 0.3;
  }
}
</style>
<style scoped lang="scss">
.network {
  margin-top: 40px;
  display: flex;
  justify-content: space-between;
  position: relative;

  .btn {
    position: relative;
    width: 270px;
    height: 44px;
    display: flex;
    justify-self: start;
    text-align: center;
    line-height: 44px;
    font-family: LilitaOne;
    font-size: 15px;
    font-weight: 400;
    letter-spacing: 0em;
    color: #000;
    border-radius: 8px;
    cursor: pointer;
    .img {
      width: 56px;
      border-right: 1px solid rgba(138, 91, 2, 0.5);
    }
    .text {
      flex: 1;
      text-align: center;
    }
  }
  .isQuit {
    position: absolute;
    top: 44px;
    left: 0;
    width: 270px;
    height: 44px;
    line-height: 44px;
    text-align: center;
    font-family: LilitaOne;
    font-size: 15px;
    color: #fff;
    text-transform: capitalize;
    background-image: url("@/assets/logOut.png");
    background-size: 270px 44px;
  }
  .title {
    margin-top: 16px;
    font-family: LilitaOne;
    font-size: 36px;
    font-weight: 400;
    line-height: 22px;
    letter-spacing: 0em;
    text-align: left;
  }
  .tips {
    font-family: LilitaOne;
    font-size: 12px;
    font-weight: 400;
    line-height: 14px;
    letter-spacing: 0em;
    text-align: left;
    color: #f6cb37;
    margin-top: 20px;
    position: relative;
    .tip {
      position: absolute;
      background-image: url("@/assets/rectangle.png");
      width: 290px;
      height: 75px;
      top: 16px;
      left: -80px;
      line-height: 85px;
      text-align: center;
      font-family: Inter;
      font-size: 10px;
      font-weight: 600;
      letter-spacing: 0em;
      color: #fff;
      display: none;
    }
    &:hover .tip {
      display: block;
    }
  }
  .content {
    margin-top: 33px;
    .change {
      width: 100%;
      height: 40px;
      line-height: 40px;
      background-color: rgba(255, 255, 255, 0.1);
      margin-top: 16px;
      border-radius: 4px;
      font-family: LilitaOne;
      font-size: 15px;
      font-weight: 400;
      padding: 0 18px;
      cursor: pointer;
      display: flex;
      justify-content: space-between;
      cursor: pointer;
      img {
        margin-left: 8px;
      }
      span {
        opacity: 0.3;
      }
    }
    .amount {
      display: flex;
      justify-content: space-between;
      // .right {
      //   display: flex;
      //   justify-self: start;
      //   .max {
      //     margin-left: 12px;
      //     color: #ffaa08;
      //     cursor: pointer;
      //   }
      // }
    }
    .brc20 {
    }
    .address {
      font-family: LilitaOne;
      font-size: 13px;
      font-weight: 400;
      line-height: 22px;
      letter-spacing: 0em;
      text-align: right;
      margin-bottom: 30px;
      text-decoration: underline;
      margin-top: 12px;
      cursor: pointer;
    }
  }
  .transfer {
    width: 100%;
    height: 48px;
    line-height: 48px;
    text-align: center;
    background-color: #f6cb37;
    color: #000;
    font-family: LilitaOne;
    font-size: 20px;
    font-weight: 400;
    letter-spacing: 0em;
    border-radius: 8px;
    margin-top: 30px;
    cursor: pointer;
  }
  .BTCWallet {
    width: 520px;
    padding: 28px 40px;
    background: linear-gradient(
      135deg,
      rgba(131, 196, 255, 0.1) 0%,
      rgba(255, 255, 255, 0.1) 100%
    );
    border: 1px solid #777e90;
    border-radius: 4px;
    .btn {
      position: relative;
      background-color: #ffaa08;
    }
  }

  .handover {
    width: 40px;
    position: absolute;
    top: 168px;
    left: 50%;
    transform: translateX(-50%);
    .left {
      width: 40px;
      height: 12px;
      //   background-image: url("@/assets/bridge_l.png");
      margin-bottom: 10px;
      cursor: pointer;
    }
    .left_g {
      width: 40px;
      height: 12px;
      background-image: url("@/assets/bridge_l_g.png");
      margin-bottom: 10px;
    }
    .right {
      width: 40px;
      height: 12px;
      cursor: pointer;
      //   background-image: url("@/assets/bridge_r.png");
    }
    .right_g {
      width: 40px;
      height: 12px;
      background-image: url("@/assets/bridge_r_g.png");
    }
  }
  .ETHWallet {
    width: 520px;
    padding: 28px 40px;
    background: linear-gradient(
      135deg,
      rgba(131, 196, 255, 0.1) 0%,
      rgba(255, 255, 255, 0.1) 100%
    );
    .btn {
      background-color: #bfe1ff;
    }
  }
}
</style>
