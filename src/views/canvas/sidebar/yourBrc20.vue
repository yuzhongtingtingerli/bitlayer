<template>
  <div>
    <div class="YourBrc20">
      <div class="top">
        <Title title="Your Assets" />
        <!-- <div class="books" @click="getRedBook">
          <img
            src="@/assets/available-books.png"
            width="28px"
            alt=""
            srcset=""
          />
        </div> -->
      </div>
      <!-- <div class="token">
        <div class="title">Token <span></span></div>
        <div class="add" @click="handleAdd">+ Add Token</div>
      </div> -->
      <div class="list-empty" v-if="YourBrc.length === 0">
        <img src="@/assets/empty1.png" width="60px" />
        <span>Empty</span>
      </div>
      <div class="list scroll-write-wrap" v-else>
        <div class="list-item" v-for="item in YourBrc" :key="item.ticker">
          <div class="left">
            <div class="img">
              <img
                v-if="TokenLogo && getLogo(encodeURIComponent(item.ticker))"
                width="20px"
                :src="getLogo(encodeURIComponent(item.ticker))"
                alt=""
                srcset=""
              />
              <div class="logo" v-else>{{ getFirstLetter(item.ticker) }}</div>
            </div>
            <div class="name">{{ decodeURIComponent(item.ticker) }}</div>
          </div>
          <div class="score">{{ getMoney(item.balance) }}</div>
        </div>
      </div>
    </div>
    <CheckBook ref="checkBookRef" @change="changeGroup" />
    <SelectGroup ref="selectGroupRef" @change="isSuccess" />
    <IsNftSuccess ref="isNftSuccessRef" />
    <AddToken ref="addTokenRef" @change="addSuccess" />
  </div>
</template>

<script setup>
import Web3 from "web3";
import { ref, watch, onMounted } from "vue";
import Title from "@cps/title";
import indexAbi from "@/abi/index.json";
import { getMoney } from "@/utils/Tools.js";
import { getTokenLogoData, getTokenContractData } from "@/services/index.js";
import { Alchemy, Network } from "alchemy-sdk";
import CheckBook from "./checkBook.vue";
import SelectGroup from "./selectGroup.vue";
import IsNftSuccess from "./isNftSuccess.vue";
import AddToken from "./addToken.vue";
import { useAddressStore } from "@/store/address";

const Address = useAddressStore();
const emit = defineEmits(["change"]);
const YourBrc = ref([]);

const btcBalance = async () => {
  const web3 = new Web3(window.ethereum);
  const balance = await web3.eth.getBalance(Address.getETHaddress);
  return decimal(balance, "BTC");
};

const getTokenContract = async () => {
  if (!Address.getETHaddress) return;
  const res = await getTokenContractData({
    UserAddress: Address.getETHaddress,
  });
  const tokenInfo = res.result.TokenInfo.map((item) => {
    const obj = {
      ticker: "",
      address: "",
    };
    for (const key in item) {
      if (Object.hasOwnProperty.call(item, key)) {
        const element = item[key];
        obj.ticker = key;
        obj.address = element;
      }
    }
    return {
      ...item,
      ...obj,
    };
  });
  const addressList = tokenInfo.map((item) => item.address);
  // const balancesData = await balancesList(Address.getETHaddress, addressList);
  const balancesData = [];
  for (let i = 0; i < addressList.length; i++) {
    const item = addressList[i];
    const balance = await getBalance(item);
    balancesData.push({
      contractAddress: item,
      balance,
    });
  }
  const btcB = await btcBalance();
  const btc = {
    address: "BTC",
    balance: btcB,
    ticker: "BTC",
  };

  YourBrc.value = [
    btc,
    ...tokenInfo.map((item) => {
      return {
        ...item,
        balance: getBalanceData(balancesData, item.address),
      };
    }),
  ];
};

const getBalanceData = (balancesData, address) => {
  return balancesData.filter((item) => item.contractAddress === address)[0]
    ?.balance;
};

const getBalance = async (address) => {
  try {
    let web3 = new Web3(window.web3.currentProvider);
    let brc20Contract = new web3.eth.Contract(indexAbi, address);
    try {
      const res = await brc20Contract.methods
        .balanceOf(Address.getETHaddress)
        .call();
      return decimal(res, address);
    } catch (error) {
      const ETHWalletType = window.localStorage.getItem("ETHWalletType");
      if (ETHWalletType === "ip") {
        web3.setProvider(okxwallet);
      }
      try {
        const res = await brc20Contract.methods
          .balanceOf(Address.getETHaddress)
          .call();
        return decimal(res, address);
      } catch (error) {
        console.log(error, "balance fail----");
        return 0;
      }
    }
  } catch (error) {
    console.log(error, "e");
    return 0;
  }
};

const balancesList = async (address, ary) => {
  const network =
    window.location.origin.indexOf("bitparty.tech") !== -1
      ? Network.MATIC_MAINNET
      : Network.MATIC_AMOY;
  const settings = {
    apiKey: "Mx71dKeiQprWUUb09x56lllHsdsdjx7u", // Replace with your Alchemy API Key.
    network, // Replace with your network.
  };
  const alchemy = new Alchemy(settings);
  const balances = await alchemy.core.getTokenBalances(address, [...ary]);
  console.log(balances, "balances");
  const balancesData = balances.tokenBalances.map((item) => {
    return {
      ...item,
      balance: decimal(item.tokenBalance),
    };
  });
  return balancesData;
};

const decimal = (hex, address = "") => {
  let decimal = parseInt(hex); // 不指定进制，默认按照十进制转换
  let num =
    address === "0xE544e8a38aDD9B1ABF21922090445Ba93f74B9E5" ||
    address === "0x681202351a488040Fa4FdCc24188AfB582c9DD62"
      ? 6
      : 18;
  return decimal / 10 ** num;
};

const TokenLogo = ref(null);
const getTokenLogo = async () => {
  const data = await getTokenLogoData();
  TokenLogo.value = {
    BTC: "https://static.oklink.com/cdn/assets/imgs/MjAxOTc/1254C5731DCE6B41F928F1FC529E8505.jpg",
    ...data.result,
  };
};
const getLogo = (ticker) => {
  if (ticker in TokenLogo.value && TokenLogo.value[ticker] !== "null")
    return TokenLogo.value[ticker];
  return false;
};
const getFirstLetter = (ticker) => {
  return ticker.split("")[0];
};

const checkBookRef = ref(null);
const getRedBook = () => {
  checkBookRef.value.open();
};
const selectGroupRef = ref(null);
const changeGroup = (inscriptionID) => {
  selectGroupRef.value.open(
    inscriptionID,
    Address.getBTCaddress,
    Address.getETHaddress
  );
};
const isNftSuccessRef = ref(null);
const isSuccess = (flag, tiker) => {
  isNftSuccessRef.value.open(flag, tiker);
  emit("change");
};

const addSuccess = (type) => {
  if (type === "success") {
    getTokenContract();
  }
};

const addTokenRef = ref(null);
const handleAdd = () => {
  addTokenRef.value.open(Address.getETHaddress);
};

watch(
  Address,
  () => {
    if (Address.getETHaddress) {
      getTokenContract();
    }
  },
  { immediate: true }
);
onMounted(() => {
  getTokenLogo();
});
</script>
<style scoped lang="scss">
.YourBrc20 {
  padding: 15px 22px 10px;
  border-bottom: 1px solid;
  border-image-source: linear-gradient(
    90deg,
    rgba(63, 63, 63, 0.3) 0%,
    rgba(255, 255, 255, 0.3) 46.5%,
    rgba(63, 63, 63, 0.3) 100%
  );
  border-image-slice: 1;
  .top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .books {
      width: 44px;
      height: 34px;
      padding: 3px 8px 3px 8px;
      gap: 2px;
      border-radius: 2px 0px 0px 0px;
      opacity: 0px;
      border: 1px solid #000000;
      box-shadow: 2px 2px 0px 0px #000000;
      cursor: pointer;
    }
  }
  .token {
    display: flex;
    justify-content: space-between;
    align-items: center;
    line-height: 22px;
    margin-top: 10px;
    .title {
      font-size: 13px;
      font-weight: 900;
      position: relative;
      span {
        content: "";
        position: absolute;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
        width: 17px;
        height: 4px;
        border-radius: 2px;
        background-color: #000000;
      }
    }
    .add {
      font-size: 13px;
      font-weight: 900;
      color: #ffc500;
      cursor: pointer;
    }
  }
  .list-empty {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    font-family: LilitaOne;
    font-size: 15px;
    color: rgba(181, 181, 181, 0.5);
    padding: 48px 0;
  }
  .list {
    height: 106px;
    padding-top: 16px;
    padding-right: 7px;
    overflow-y: scroll;
    // margin-bottom: 10px;
    .list-item {
      margin-bottom: 10px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 20px;
      .left {
        display: flex;
        justify-self: start;
        font-size: 13px;
        font-family: LilitaOne;
        font-weight: 400;
        .img {
          width: 20px;
          margin-right: 6px;
          img {
            display: inline-block;
            vertical-align: middle;
          }
          .logo {
            width: 20px;
            height: 20px;
            border-radius: 10px;
            background-color: #000;
            color: #fff;
            line-height: 18px;
            text-align: center;
          }
        }
      }
      .score {
        font-family: Inter;
        font-size: 10px;
        font-weight: 700;
        color: #b5b5b5;
      }
    }
  }
}
</style>
