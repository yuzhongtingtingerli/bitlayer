<template>
  <div class="withdraw">
    <a-spin :spinning="spinning">
      <div class="title">
        <span v-if="!Address.ETHaddress">Season3 Withdraw now !</span>
        <span v-else-if="!assetList">Sorry for u !</span>
        <span v-else-if="assetList">Salute u !</span>
      </div>
      <div class="img">
        <img src="@/assets/withdraw-logo.png" width="195px" />
      </div>
      <div class="list">
        <div class="msg">
          <div class="small-title">you will receive:</div>
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
        <div class="content">
          <div class="unconnectedWallet" v-if="!Address.ETHaddress">
            Please log in to your staking wallet firtst
          </div>
          <div class="unconnectedWallet" v-else-if="!assetList">
            This wallet address does not participate in Season3 activities
          </div>
          <div v-else-if="assetInfo" class="connectedWallet">
            <!-- <div class="contract">
              <div
                v-if="assetInfo['Contract1']"
                :class="`contract-item ${contract === 1 ? 'activeC' : ''}`"
                @click="chooseContract(1)"
              >
                Contract 1
              </div>
              <div
                v-if="assetInfo['Contract2']"
                :class="`contract-item ${contract === 2 ? 'activeC' : ''}`"
                @click="chooseContract(2)"
              >
                Contract 2
              </div>
            </div> -->
            <div class="list" v-if="assetList">
              <div
                class="list-item"
                v-for="list in assetList.StakeInfo"
                :key="list.StakeTokenSymbol"
              >
                <div class="symbol">
                  {{ decodeURIComponent(list.StakeTokenSymbol) }}
                </div>
                <div class="balance">
                  {{ getMoney(list.TotalTokenBalance) }}
                </div>
                <div v-if="getTxHash(list.TxHash) === 1"></div>
                <div class="pending" v-if="getTxHash(list.TxHash) === 2">
                  Pending
                </div>
                <div
                  v-if="getTxHash(list.TxHash) === 3"
                  @click="goTxHash(list.TxHash)"
                >
                  Transaction Hash:
                  <span class="tx-hash">{{ getAddress(list.TxHash) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="btn">
          <div
            :class="`withdraw-btn ${
              assetList?.BTCEnable === '1' ? 'active' : ''
            }`"
            @click="goWithdrawBTC"
          >
            Withdraw BTC
          </div>
          <div
            :class="`withdraw-btn ${
              assetList?.ERCEnable === '1' ? 'active' : ''
            }`"
            @click="goWithdrawERC20"
          >
            Withdraw ERC20
          </div>
        </div>

        <div class="info">You will get What you hv staked assets.</div>
      </div>
    </a-spin>
    <SuccessInfo ref="successInfoRef" />
    <ChooseWallet ref="chooseWalletRef" @change="chooseWallet" />
    <ErrorMsg ref="errorMsgRef" />
    <ErrorInfo ref="errorInfoRef" />
  </div>
</template>

<script setup>
import Web3 from "web3";
import { ethers } from "ethers";
import stakeAbi from "@/abi/stake.json";
import { ref, onMounted, watch } from "vue";
import SuccessInfo from "@/components/success-info.vue";
import ChooseWallet from "@/components/chooseWallet.vue";
import ErrorMsg from "@/components/error-msg.vue";
import { getAssetListData, doWithdrawData } from "@/services/index";
import { getMoney, getAddress } from "@/utils/Tools.js";
import { useAddressStore } from "@/store/address";
const Address = useAddressStore();

import { checkRuningStatus } from "@/services/api.js";
import ErrorInfo from "@/components/error-info.vue";
const errorInfoRef = ref(null);
const isShowError = () => {
  errorInfoRef.value.open(
    "The journey will begin soon, wish you good luck ！",
    "infinite"
  );
};
const checkRuning = async () => {
  // if (window.location.origin.indexOf("www.bitparty.tech") !== -1) {
  //   isShowError(
  //     "The journey will begin soon, wish you good luck ！",
  //     "infinite"
  //   );
  //   return;
  // }
  const res = await checkRuningStatus();
  if (res.result.RunningStatus <= 1) {
    isShowError();
  }
};
// ETH:0xef63d4e178b3180beec9b0e143e0f37f4c93f4c2
// USDT:0xfe9f969faf8ad72a83b761138bf25de87eff9dd2
// USDC:0x9827431e8b77e87c9894bd50b055d6be56be0030
// WBTC:0xff204e2681a6fa0e2c3fade68a1b28fb90e4fc5f
// bitUSD:0x07373d112edc4570b46996ad1187bc4ac9fb5ed0
// CBD:0x2729868df87d062020e4a4867ff507fb52ee697c
// BONE:0x68879ca2af24941fc3b6eb89fdb26a98aa001fc1
// CBD:0x2729868df87d062020e4a4867ff507fb52ee697c,最小440000，精度18位
// BONE:0x68879ca2af24941fc3b6eb89fdb26a98aa001fc1,最小5500，精度18位
// stBTC:  最小转账数量:0.001  合约地址:0xf6718b2701d4a6498ef77d7c152b2137ab28b8a3  精度位数:18
// enzoBTC:  最小转账数量:0.001  合约地址:0xe277aed3ff3eb9824edc52fe7703df0c5ed8b313  精度位数:18
// enzoUSDT:  最小转账数量:70  合约地址:0xf6fa83e30c7d3978f86141016ee9471d77f48ae0  精度位数:6
// enzoUSDC:  最小转账数量:70  合约地址:0xbb0cb5c5e49d5c3903932d07831fb8c1bb1651d2  精度位数:6
// enzoETH:  最小转账数量:0.02  合约地址:0xab7f136bbb18808f0c981d0307d3360ca92ad171  精度位数:18
let stakeAddress;
// let withdrawList;
let btcType;
let provider;
if (window.location.origin.indexOf("bitparty.tech") !== -1) {
  stakeAddress = "0xb002b938d63fe8762f2a0eff9e49a8e20a0078e8";
  // withdrawList = [
  //   "0xff204e2681a6fa0e2c3fade68a1b28fb90e4fc5f",
  //   "0xfe9f969faf8ad72a83b761138bf25de87eff9dd2",
  //   "0x9827431e8b77e87c9894bd50b055d6be56be0030",
  //   "0xef63d4e178b3180beec9b0e143e0f37f4c93f4c2",
  //   "0x07373d112edc4570b46996ad1187bc4ac9fb5ed0",
  //   "0x2729868df87d062020e4a4867ff507fb52ee697c",
  //   "0x68879ca2af24941fc3b6eb89fdb26a98aa001fc1",
  //   "0xf6718b2701d4a6498ef77d7c152b2137ab28b8a3",
  //   "0xe277aed3ff3eb9824edc52fe7703df0c5ed8b313",
  //   "0xf6fa83e30c7d3978f86141016ee9471d77f48ae0",
  //   "0xbb0cb5c5e49d5c3903932d07831fb8c1bb1651d2",
  //   "0xab7f136bbb18808f0c981d0307d3360ca92ad171",
  // ];
  btcType = "BTC";
  provider = window["ethereum"] || window.web3.currentProvider;
} else {
  stakeAddress = "0xb002b938d63fe8762f2a0eff9e49a8e20a0078e8";
  // stakeAddress = "0x0a0295F0f9CB507025222D24c51AD595239B05C4";
  // withdrawList = [
  //   "0xE703b28382b2A0C55C11ebc7AE11933380BfDc5A",
  //   "0xa9135F1096d5D92716114b302B29430fa0812534",
  //   "0x6385be4f5D62Af9266664958F05A4F2F0f0a08B0",
  // ];
  // btcType = "nati";
  btcType = "BTC";
  provider = window["ethereum"] || window.web3.currentProvider;
}
const spinning = ref(false);
const contract = ref(1);
const chooseContract = (val) => {
  contract.value = val;
  getAssetList(val);
};

const chooseWalletRef = ref(null);
const connectETHWallet = async () => {
  if (Address.getETHaddress) {
    isETHQuit.value = !isETHQuit.value;
  }
  if (!isETHQuit.value && !Address.ETHaddress) {
    chooseWalletRef.value.open("eth");
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

const assetInfo = ref(null);
const assetList = ref(null);
const withdraw = ref("");
const getAssetInfo = async (address) => {
  spinning.value = true;
  let info = {};
  assetInfo.value = null;
  assetList.value = null;
  try {
    const res = await getAssetListData({
      EthAddress: address,
      // EthAddress: "0xfe70de65e28776f9f838ce724e0859298f2bf9d5",
    });

    if (res.result.AssetsInfo.length > 0) {
      for (const item of res.result.AssetsInfo) {
        info[item.ContractName] = item;
      }
      if (res.result.AssetsInfo.length === 1) {
        let contractNum;
        contractNum =
          res.result.AssetsInfo[0].ContractName === "Contract1" ? 1 : 2;
        contract.value = contractNum;
        assetList.value = res.result.AssetsInfo[0];
        withdraw.value = res.result.AssetsInfo[0].StakeInfo.filter(
          (item) => item.StakeTokenSymbol !== btcType
        ).map((item) => item.TokenContract);
      } else {
        assetList.value = info["Contract1"];
      }
    }
    assetInfo.value = { ...info };
    spinning.value = false;
  } catch (error) {
    spinning.value = false;
  }
};

const getAssetList = async (c) => {
  assetList.value = null;
  spinning.value = true;
  try {
    const res = await getAssetListData({
      EthAddress: Address.ETHaddress,
      ContractType: c,
    });
    if (res.result.AssetsInfo.length > 0) {
      assetList.value = res.result.AssetsInfo[0];
    }
    spinning.value = false;
  } catch (error) {
    spinning.value = false;
  }
};

const getTxHash = (txHash) => {
  if (txHash === "null") return 1;
  if (txHash === "pending") return 2;
  return 3;
};

const goTxHash = (txHash) => {
  let url;
  if (window.location.origin.indexOf("bitparty.tech") !== -1) {
    url = `https://www.btrscan.com/tx/${txHash}`;
  } else {
    url = `https://amoy.polygonscan.com/tx/${txHash}`;
  }
  window.open(url, "_blank");
};

const successInfoRef = ref(null);

const goWithdrawBTC = async () => {
  if (assetList.value.BTCEnable === "0") return;
  let txHash;
  if (contract.value === 2) {
    txHash = await withdrawnative();
    if (txHash) {
      successInfoRef.value.open(txHash, 1);
    }
  } else {
    txHash = "pending";
  }
  if (txHash) {
    const withdraw = {
      StakeAddress: Address.ETHaddress,
      StakeSymbol: JSON.stringify([btcType]),
      StakeTokenStatus: contract.value === 2 ? 1 : 2,
      Txhash: txHash,
    };
    doWithdraw(withdraw);
  }
};

const goWithdrawERC20 = async () => {
  // withdrawERC20All();
  // return;
  if (assetList.value.ERCEnable === "0") return;
  let txHash;
  if (contract.value === 2) {
    txHash = await withdrawERC20All();
    if (txHash) {
      successInfoRef.value.open(txHash, 1);
    }
  } else {
    txHash = "pending";
  }
  if (txHash) {
    const withdraw = {
      StakeAddress: Address.ETHaddress,
      StakeSymbol: JSON.stringify(
        assetList.value.StakeInfo.map((item) => item.StakeTokenSymbol).filter(
          (item) => item !== btcType
        )
      ),
      StakeTokenStatus: contract.value === 2 ? 1 : 2,
      Txhash: txHash,
    };
    doWithdraw(withdraw);
  }
};

const doWithdraw = async ({
  StakeAddress,
  StakeSymbol,
  StakeTokenStatus,
  Txhash,
}) => {
  const res = await doWithdrawData({
    StakeAddress,
    StakeSymbol,
    StakeTokenStatus,
    Txhash,
  });
  if (res.status === "OK") {
    if (contract.value === 1) {
      successInfoRef.value.open("", 2);
    }
    getAssetList(contract.value);
  }
};

const withdrawnative = async () => {
  spinning.value = true;
  // const provider = window["ethereum"] || window.web3.currentProvider;
  let web3 = new Web3(provider);
  let contract = new web3.eth.Contract(stakeAbi, stakeAddress);
  const ETHWalletType = window.localStorage.getItem("ETHWalletType");
  if (ETHWalletType === "ip") {
    web3.setProvider(okxwallet);
  }
  try {
    const res = await contract.methods
      .withdrawNative()
      .send({ from: Address.ETHaddress });
    spinning.value = false;
    return res.transactionHash;
  } catch (error) {
    spinning.value = false;
    console.log(error, "error");
    return false;
  }
};

const withdrawERC20All = async () => {
  spinning.value = true;
  // const provider = window["ethereum"] || window.web3.currentProvider;
  let web3 = new Web3(provider);
  let contract = new web3.eth.Contract(stakeAbi, stakeAddress);

  // const maxFeePerGas = Web3.utils.toHex(web3.utils.toWei("20", "gwei")); // 设置最大费用每加密基
  // const maxPriorityFeePerGas = Web3.utils.toHex(web3.utils.toWei("1", "gwei")); // 设置最高优先级费用每加密基
  // console.log(maxFeePerGas, "maxFeePerGas");
  // console.log(maxPriorityFeePerGas, "maxPriorityFeePerGas");
  const ETHWalletType = window.localStorage.getItem("ETHWalletType");
  if (ETHWalletType === "ip") {
    web3.setProvider(okxwallet);
  }
  try {
    console.log([...withdraw.value], "withdrawERC20All");
    const res = await contract.methods
      .withdrawERC20All([...withdraw.value])
      .send({
        from: Address.ETHaddress,
        // maxFeePerGas,
        // maxPriorityFeePerGas,
      });
    console.log(res, "withdrawERC20All-res");
    spinning.value = false;
    return res.transactionHash;
  } catch (error) {
    console.log(error, "error");
    spinning.value = false;
    return false;
  }
};

watch(
  Address,
  (newVal, oldVal) => {
    if (Address.ETHaddress) {
      getAssetInfo(Address.ETHaddress);
    }
  },
  { immediate: true }
);
onMounted(() => {
  checkRuning();
  Address.getETHWallet();
});
</script>
<style>
.withdraw .ant-spin-nested-loading .ant-spin-container {
  position: fixed;
  width: 100%;
  height: 100%;
}
.withdraw .ant-spin-nested-loading {
  position: fixed;
  width: 100%;
  height: 100%;
}
</style>
<style scoped lang="scss">
.withdraw {
  .title {
    font-family: LilitaOne;
    font-size: 65px;
    font-weight: 400;
    line-height: 30px;
    text-align: center;
    color: #fff;
    margin-top: 30px;
    text-transform: capitalize;
  }
  .img {
    text-align: center;
    margin-top: 44px;
  }
  .list {
    width: 640px;
    margin: 0 auto;
    color: #fff;
    .msg {
      display: flex;
      justify-content: space-between;
      text-transform: capitalize;
      font-family: LilitaOne;
      font-size: 20px;
      font-weight: 400;
      line-height: 30px;
      text-align: left;
      margin-bottom: 16px;
      .wallet {
        position: relative;
        font-family: LilitaOne;
        font-size: 15px;
        font-weight: 400;
        width: 155px;
        height: 40px;
        line-height: 40px;
        text-align: center;
        background: #8cc8ff;
        border-radius: 4px;
        color: #000;
        cursor: pointer;
        .isQuit {
          position: absolute;
          top: 42px;
          left: 0;
          width: 155px;
          height: 44px;
          line-height: 44px;
          text-align: center;
          font-family: LilitaOne;
          font-size: 15px;
          color: #fff;
          text-transform: capitalize;
          background-image: url("@/assets/logOut.png");
          background-size: 155px 44px;
          z-index: 1;
        }
      }
    }
    .content {
      height: 168px;
      background: linear-gradient(
        135deg,
        rgba(131, 196, 255, 0.1) 0%,
        rgba(255, 255, 255, 0.1) 100%
      );
      .unconnectedWallet {
        text-align: center;
        line-height: 168px;
        text-transform: capitalize;
        font-family: LilitaOne;
        font-size: 15px;
        font-weight: 400;
      }
      .connectedWallet {
        padding-top: 5px;
        padding-bottom: 10px;
        height: 168px;
        .contract {
          margin: 0 20px;
          display: flex;
          font-family: LilitaOne;
          font-size: 15px;
          font-weight: 400;
          line-height: 22px;
          text-align: left;
          margin-bottom: 14px;
          .contract-item {
            margin-right: 18px;
            color: #777e90;
            cursor: pointer;
          }
          .activeC {
            color: #fff;
          }
        }
      }
      .list {
        margin: 0 20px;
        overflow-y: scroll;
        height: 114px;
        .list-item {
          display: flex;
          justify-content: start;
          font-family: LilitaOne;
          font-size: 15px;
          font-weight: 400;
          line-height: 22px;
          text-align: left;
          margin-bottom: 10px;
          div {
            margin-right: 45px;
          }
          .pending {
            color: #777e90;
          }
          .tx-hash {
            text-decoration: underline !important;
            cursor: pointer !important;
          }
        }
      }
    }
    .btn {
      width: 435px;
      margin: 54px auto 16px;
      display: flex;
      justify-content: space-between;
    }
    .withdraw-btn {
      width: 180px;
      height: 48px;
      border-radius: 8px;
      border: 2px;
      background: #c0c0c0;
      font-family: LilitaOne;
      font-size: 20px;
      font-weight: 400;
      line-height: 48px;
      text-align: center;
      color: #000;
    }
    .active {
      cursor: pointer;
      background-color: #f6cb37;
    }
    .info {
      width: 402px;
      height: 50px;
      font-family: LilitaOne;
      font-size: 15px;
      font-weight: 400;
      text-align: left;
      border-left: 2px solid #f6cb37;
      padding-left: 10px;
      text-transform: capitalize;
    }
  }
}
</style>
