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
            <div class="contract">
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
            </div>
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

let stakeAddress;
let withdrawList;
let btcType;
if (window.location.origin.indexOf("bitparty.tech") !== -1) {
  stakeAddress = "0xD23A65e1666F7179A6fedaF58F5da3421ce59c74";
  withdrawList = [
    "0x4200000000000000000000000000000000000006",
    "0xE544e8a38aDD9B1ABF21922090445Ba93f74B9E5",
    "0x681202351a488040Fa4FdCc24188AfB582c9DD62",
    "0xD48d3A551757ac47655fCe25BDE1B0B6b1Cb2a5A",
    "0xc3ee2Df14B1Bc526c24ED802f1873d49664a0d5c",
    "0xC2Fe4f673455Ef92299770a09CDB5E8756A525D5",
    "0xa0f4470B714677AEEcE0d20074c540b3Cf6a477E",
    "0x7eBFcE05E418C380a2b6EB0F65995cA04ef4bc00",
    "0x7537C1F80c9E157ED7AFD93a494be3e1f04f1462",
  ];
  btcType = "BTC";
} else {
  stakeAddress = "0x0a0295F0f9CB507025222D24c51AD595239B05C4";
  withdrawList = [
    "0xE703b28382b2A0C55C11ebc7AE11933380BfDc5A",
    "0xa9135F1096d5D92716114b302B29430fa0812534",
    "0x6385be4f5D62Af9266664958F05A4F2F0f0a08B0",
  ];
  btcType = "nati";
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
const getAssetInfo = async (address) => {
  spinning.value = true;
  let info = {};
  assetInfo.value = null;
  assetList.value = null;
  try {
    const res = await getAssetListData({
      EthAddress: address,
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
  const provider = window["ethereum"] || window.web3.currentProvider;
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
  const provider = window["ethereum"] || window.web3.currentProvider;
  let web3 = new Web3(provider);
  let contract = new web3.eth.Contract(stakeAbi, stakeAddress);
  const ETHWalletType = window.localStorage.getItem("ETHWalletType");
  if (ETHWalletType === "ip") {
    web3.setProvider(okxwallet);
  }
  try {
    const res = await contract.methods
      .withdrawERC20All([...withdrawList])
      .send({ from: Address.ETHaddress });
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
