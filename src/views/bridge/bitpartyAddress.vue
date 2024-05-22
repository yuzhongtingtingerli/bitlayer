<script setup>
import Web3 from "web3";
import { ref, onMounted } from "vue";
import { getAddress, getFloorNum } from "@/utils/Tools";
import erc20Abi from "@/abi/erc20.json";
import stakeAbi from "@/abi/stake.json";
import indexAbi from "@/abi/index.json";
import walletList from "@/abi/wallet.json";
import Big from "big.js";
const emit = defineEmits(["change"]);

const record = ref();
const show = ref(false);
const balance = ref(0);
const spinning = ref(false);
const ETHaddress = ref("");
const gasPrice = ref("");
const tipInfo = ref("make sure you have enough bsquared network gas.");
const open = async (symbol, address) => {
  record.value = symbol;
  balance.value = 0;
  ETHaddress.value = address;
  // const a = await getBalance(symbol.address);
  // console.log(a, "a");
  // const gas = await getGasPrice();
  // gasPrice.value = (gas * symbol.TokenStakeBalance).toFixed(8);
  show.value = true;
};

const btcBalance = async () => {
  const web3 = new Web3(window.ethereum);
  const balance = await web3.eth.getBalance(ETHaddress.value);
  return decimal(balance, "BTC");
};

const getBalance = async (address) => {
  const provider = window["ethereum"] || window.web3.currentProvider;
  let web3 = new Web3(provider);
  let brc20Contract = new web3.eth.Contract(indexAbi, address);
  try {
    const balance = await brc20Contract.methods
      .balanceOf(ETHaddress.value)
      .call();
    return decimal(balance, address);
  } catch (error) {
    const ETHWalletType = window.localStorage.getItem("ETHWalletType");
    if (ETHWalletType === "ip") {
      web3.setProvider(okxwallet);
    }
    try {
      const res = await brc20Contract.methods
        .balanceOf(ETHaddress.value)
        .call();
      return decimal(res, address);
    } catch (error) {
      console.log(error, "balance fail----");
      return 0;
    }
  }
};

const maximum = async () => {
  balance.value = await maxNum();
};

const maxNum = async () => {
  if (record.value.TokenSymbol === "BTC") {
    return await btcBalance();
  } else {
    return await getBalance(record.value.address);
  }
};

const decimal = (balance, address) => {
  let decimal = parseInt(balance); // 不指定进制，默认按照十进制转换
  let num =
    address === "0xE544e8a38aDD9B1ABF21922090445Ba93f74B9E5" ||
    address === "0x681202351a488040Fa4FdCc24188AfB582c9DD62"
      ? 6
      : 18;
  const money = decimal / 10 ** num;
  return getFloorNum(money);
};

const onInput = () => {
  const str = balance.value.toString();
  const len = str.length;
  const point = str.indexOf(".");
  if (point > -1 && len - point > 6 && Number(balance.value) === 0) {
    balance.value = balance.value.slice(0, -1);
    return;
  }
  if (point > -1 && len - point > 7) {
    // 如果不匹配，则删除最后一个字符
    balance.value = balance.value.slice(0, -1);
    return;
  }
};

// const getGasPrice = async () => {
//   const provider = window["ethereum"] || window.web3.currentProvider;
//   let web3 = new Web3(provider);
//   const gasPrice = await web3.eth.getGasPrice();
//   const balance = web3.utils.fromWei(gasPrice, "ether");
//   console.log(balance, "balance");
//   return balance;
// };

const close = () => {
  show.value = false;
};
const Confirm = async () => {
  if (balance.value === 0) return;
  const min = walletList[record.value.address];
  const max = await maxNum();
  if (min) {
    if (balance.value < min) {
      return (tipInfo.value = `Please confirm the staking amount should be more than  ${min}`);
    } else if (balance.value > max) {
      return (tipInfo.value =
        "Please confirm the staking amount should be less than the maximum value of the account");
    } else {
      tipInfo.value = "make sure you have enough bsquared network gas.";
    }
  }
  spinning.value = true;
  goStake();
};

const setendtime60 = async () => {
  let stakeAddress;
  if (window.location.origin.indexOf("bitparty.tech") !== -1) {
    stakeAddress = "0xD23A65e1666F7179A6fedaF58F5da3421ce59c74";
  } else {
    stakeAddress = "0x0a0295F0f9CB507025222D24c51AD595239B05C4";
  }
  const provider = window["ethereum"] || window.web3.currentProvider;
  let web3 = new Web3(provider);
  let contract = new web3.eth.Contract(stakeAbi, stakeAddress);
  const ETHWalletType = window.localStorage.getItem("ETHWalletType");
  if (ETHWalletType === "ip") {
    web3.setProvider(okxwallet);
  }
  // 40000
  const currentTimestampInSeconds = Math.round(Date.now() / 1000);
  const unlockTime = currentTimestampInSeconds + 60;
  const res = await contract.methods
    .setEndTime(unlockTime)
    .send({ from: ETHaddress.value });
  console.log(res, "res");
};

const setendtime40000 = async () => {
  let stakeAddress;
  if (window.location.origin.indexOf("bitparty.tech") !== -1) {
    stakeAddress = "0xD23A65e1666F7179A6fedaF58F5da3421ce59c74";
  } else {
    stakeAddress = "0x0a0295F0f9CB507025222D24c51AD595239B05C4";
  }
  const provider = window["ethereum"] || window.web3.currentProvider;
  let web3 = new Web3(provider);
  let contract = new web3.eth.Contract(stakeAbi, stakeAddress);
  const ETHWalletType = window.localStorage.getItem("ETHWalletType");
  if (ETHWalletType === "ip") {
    web3.setProvider(okxwallet);
  }
  // 40000
  const currentTimestampInSeconds = Math.round(Date.now() / 1000);
  const unlockTime = currentTimestampInSeconds + 40000;
  const res = await contract.methods
    .setEndTime(unlockTime)
    .send({ from: ETHaddress.value });
  console.log(res, "res");
};

const withdarw20 = async () => {
  let stakeAddress;
  if (window.location.origin.indexOf("bitparty.tech") !== -1) {
    stakeAddress = "0xD23A65e1666F7179A6fedaF58F5da3421ce59c74";
  } else {
    stakeAddress = "0x0a0295F0f9CB507025222D24c51AD595239B05C4";
  }
  const provider = window["ethereum"] || window.web3.currentProvider;
  let web3 = new Web3(provider);
  let contract = new web3.eth.Contract(stakeAbi, stakeAddress);
  const ETHWalletType = window.localStorage.getItem("ETHWalletType");
  if (ETHWalletType === "ip") {
    web3.setProvider(okxwallet);
  }
  const res = await contract.methods
    .withdrawERC20(record.value.address)
    .send({ from: ETHaddress.value });
  console.log(res, "res");
};

const withdrawnative = async () => {
  let stakeAddress;
  if (window.location.origin.indexOf("bitparty.tech") !== -1) {
    stakeAddress = "0xD23A65e1666F7179A6fedaF58F5da3421ce59c74";
  } else {
    stakeAddress = "0x0a0295F0f9CB507025222D24c51AD595239B05C4";
  }
  const provider = window["ethereum"] || window.web3.currentProvider;
  let web3 = new Web3(provider);
  let contract = new web3.eth.Contract(stakeAbi, stakeAddress);
  const ETHWalletType = window.localStorage.getItem("ETHWalletType");
  if (ETHWalletType === "ip") {
    web3.setProvider(okxwallet);
  }
  const res = await contract.methods
    .withdrawNative()
    .send({ from: ETHaddress.value });
  console.log(res, "res");
};

const addWhitelist = async () => {
  let stakeAddress;
  if (window.location.origin.indexOf("bitparty.tech") !== -1) {
    stakeAddress = "0xD23A65e1666F7179A6fedaF58F5da3421ce59c74";
  } else {
    stakeAddress = "0x0a0295F0f9CB507025222D24c51AD595239B05C4";
  }
  const provider = window["ethereum"] || window.web3.currentProvider;
  let web3 = new Web3(provider);
  let contract = new web3.eth.Contract(stakeAbi, stakeAddress);
  const ETHWalletType = window.localStorage.getItem("ETHWalletType");
  if (ETHWalletType === "ip") {
    web3.setProvider(okxwallet);
  }
  const res = await contract.methods
    .addWhitelist(record.value.address)
    .send({ from: ETHaddress.value });
  console.log(res, "res");
};

const delWhitelist = async () => {
  let stakeAddress;
  if (window.location.origin.indexOf("bitparty.tech") !== -1) {
    stakeAddress = "0xD23A65e1666F7179A6fedaF58F5da3421ce59c74";
  } else {
    stakeAddress = "0x0a0295F0f9CB507025222D24c51AD595239B05C4";
  }
  const provider = window["ethereum"] || window.web3.currentProvider;
  let web3 = new Web3(provider);
  let contract = new web3.eth.Contract(stakeAbi, stakeAddress);
  const ETHWalletType = window.localStorage.getItem("ETHWalletType");
  if (ETHWalletType === "ip") {
    web3.setProvider(okxwallet);
  }
  const res = await contract.methods
    .delWhitelist(record.value.address)
    .send({ from: ETHaddress.value });
  console.log(res, "res");
};

const withdrawERC20All = async () => {
  let stakeAddress;
  if (window.location.origin.indexOf("bitparty.tech") !== -1) {
    stakeAddress = "0xD23A65e1666F7179A6fedaF58F5da3421ce59c74";
  } else {
    stakeAddress = "0x0a0295F0f9CB507025222D24c51AD595239B05C4";
  }
  const provider = window["ethereum"] || window.web3.currentProvider;
  let web3 = new Web3(provider);
  let contract = new web3.eth.Contract(stakeAbi, stakeAddress);
  const ETHWalletType = window.localStorage.getItem("ETHWalletType");
  if (ETHWalletType === "ip") {
    web3.setProvider(okxwallet);
  }
  const res = await contract.methods
    .withdrawERC20All([
      "0xE703b28382b2A0C55C11ebc7AE11933380BfDc5A",
      "0xa9135F1096d5D92716114b302B29430fa0812534",
      "0x6385be4f5D62Af9266664958F05A4F2F0f0a08B0",
    ])
    .send({ from: ETHaddress.value });
  console.log(res, "res");
};

const goStake = async () => {
  let stakeAddress;
  if (window.location.origin.indexOf("bitparty.tech") !== -1) {
    stakeAddress = "0xD23A65e1666F7179A6fedaF58F5da3421ce59c74";
  } else {
    stakeAddress = "0x0a0295F0f9CB507025222D24c51AD595239B05C4";
  }
  try {
    const provider = window["ethereum"] || window.web3.currentProvider;
    let web3 = new Web3(provider);
    let contract = new web3.eth.Contract(stakeAbi, stakeAddress);
    let fromAddresses = [];
    const ETHWalletType = window.localStorage.getItem("ETHWalletType");
    if (ETHWalletType === "eth") {
      fromAddresses = await web3.eth.getAccounts();
    } else if (ETHWalletType === "ip") {
      fromAddresses = await okxwallet.request({
        method: "eth_requestAccounts",
      });
      web3.setProvider(okxwallet);
    }
    let num =
      record.value.address === "0xE544e8a38aDD9B1ABF21922090445Ba93f74B9E5" ||
      record.value.address === "0x681202351a488040Fa4FdCc24188AfB582c9DD62"
        ? 6
        : 18;
    let num1 = new Big(balance.value);
    let num2 = new Big("10").pow(num);
    let amount = Number(num1.times(num2).toFixed(6));

    if (record.value.TokenSymbol === "BTC") {
      const c = web3.utils.toWei(balance.value.toString(), "ether");
      const res = await contract.methods.stakeNative().send({
        from: fromAddresses[0],
        value: c,
      });
      close();
      spinning.value = false;
      emit("change", "success", res.transactionHash);
    } else {
      let brc20Contract = new web3.eth.Contract(erc20Abi, record.value.address);
      // debugger;
      brc20Contract.methods
        .approve(stakeAddress, amount)
        .send({ from: fromAddresses[0] })
        .then(async (r) => {
          console.log("approve res", r);
          try {
            const res = await contract.methods
              .stakeERC20(record.value.address, amount)
              .send({ from: fromAddresses[0] });
            close();
            spinning.value = false;
            emit("change", "success", res.transactionHash);
          } catch (error) {
            console.log(error, "stakeerror");
            emit("change", "error", error);
            close();
            spinning.value = false;
          }
        })
        .catch((error) => {
          console.log(error, "approveerror");
          emit("change", "error", error);
          close();
          spinning.value = false;
        });
    }
  } catch (error) {
    console.log(error, "Contracterror");
    emit("change", "error", error);
    close();
    spinning.value = false;
  }
};
onMounted(() => {});
defineExpose({ open, close });
</script>

<template>
  <a-modal
    v-model:open="show"
    title=""
    :footer="null"
    :maskClosable="false"
    @ok="close"
    :closable="false"
    width="480px"
  >
    <a-spin :spinning="spinning">
      <div class="modal_style">
        <img class="head-img" src="@/assets/cat_ava.png" />
        <div class="close" @click="close">
          <img src="@/assets/close.png" height="24px" alt="" srcset="" />
        </div>
        <div class="title">stake To Smart contract</div>
        <div class="desc">This is the last step</div>
        <div class="sats">
          <div class="txt">From {{ getAddress(ETHaddress) }}</div>
          <div class="txt">To</div>
          <div class="txt">
            {{ decodeURIComponent(record.TokenSymbol) }} Group
          </div>
        </div>
        <div class="sats">
          <div class="txt input_style">
            Amount
            <a-input
              class="amount"
              v-model:value="balance"
              @input="onInput"
              size="small"
            ></a-input>
          </div>
          <div class="txt">
            {{ decodeURIComponent(record.TokenSymbol) }}
            <span class="max" @click="maximum">Maximum</span>
          </div>
        </div>
        <div class="warn">
          <div class="tip">{{ tipInfo }}</div>
          <!-- <div class="gas">Gas : {{ gasPrice }} M-btc</div> -->
        </div>

        <div class="btn" @click="Confirm">Confirm</div>
        <!-- <div class="btn" @click="setendtime60">setendtime60</div>
        <div class="btn" @click="setendtime40000">setendtime40000</div>
        <div class="btn" @click="withdarw20">withdarw20</div>
        <div class="btn" @click="withdrawnative">withdrawnative</div>
        <div class="btn" @click="addWhitelist">addWhitelist</div>
        <div class="btn" @click="delWhitelist">delWhitelist</div>
        <div class="btn" @click="withdrawERC20All">withdrawERC20All</div> -->
      </div>
    </a-spin>
  </a-modal>
</template>

<style scoped lang="scss">
.modal_style {
  position: relative;
  .head-img {
    position: absolute;
    left: -16px;
    top: -114px;
    width: 110px;
  }
  .close {
    position: absolute;
    right: -16px;
    top: -14px;
    cursor: pointer;
  }

  .title {
    text-align: center;
    font-family: LilitaOne;
    font-size: 30px;
    font-weight: 400;
    line-height: 22px;
    text-transform: capitalize;
  }
  .desc {
    text-align: center;
    font-family: LilitaOne;
    font-size: 15px;
    margin-top: 20px;
    padding-bottom: 10px;
    text-transform: capitalize;
  }
  .sats {
    font-family: LilitaOne;
    background: #ededed;
    height: 40px;
    padding: 0 22px;
    margin-top: 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 15px;
    .amount {
      color: rgba(0, 0, 0, 0.2);
      margin-left: 10px;
    }
    .max {
      color: #ffaa08;
      margin-left: 10px;
      cursor: pointer;
    }
    .input_style {
      display: flex;
    }
  }
  .warn {
    font-family: LilitaOne;
    margin-top: 8px;
    display: flex;
    justify-content: space-between;
    .tip {
      color: #ff4d00;
      font-size: 10px;
    }
    .gas {
      font-family: LilitaOne;
      font-size: 14px;
      font-weight: 400;
      line-height: 16px;
    }
  }
  .btn {
    width: 180px;
    height: 48px;
    line-height: 48px;
    text-align: center;
    margin: 0 auto;
    background: #f6cb37;
    border: 2px solid rgba(0, 0, 0, 1);
    box-shadow: 4px 4px 0px 0px rgba(0, 0, 0, 1);
    font-family: LilitaOne;
    font-size: 20px;
    font-weight: 400;
    border-radius: 8px;
    margin-top: 42px;
    cursor: pointer;
  }
}
</style>

<style>
.input_style .ant-input.ant-input-sm.css-dev-only-do-not-override-19yxfbp {
  background-color: #ededed;
  border: none;
  input {
    background-color: #ededed;
    font-family: LilitaOne;
    font-size: 15px;
    font-weight: 400;
  }
}
</style>
