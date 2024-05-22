<template>
  <div class="checkBook" :style="`display: ${isShow ? 'block' : 'none'}`">
    <div class="info">
      <div class="logo">
        <img src="@/assets/cat_ava.png" height="100px" alt="" srcset="" />
      </div>
      <div class="info-content">
        <div class="close" @click="close">
          <img src="@/assets/close.png" height="24px" alt="" srcset="" />
        </div>
        <div class="title2">Please Add the token smart contract address</div>

        <div class="checkList">
          <div class="id">Smart contract address</div>
          <div class="right">
            <div class="inputId">
              <a-input
                v-model:value="formValue.address"
                @input="onInput"
                size="small"
              ></a-input>
            </div>
          </div>
        </div>
        <div class="checkList">
          <div class="id">Token symbol</div>
          <div class="right">
            <div class="inputId">
              {{ formValue.token }}
            </div>
          </div>
        </div>
        <div class="failText">
          <span v-if="status === 'fail'"
            >Wrong smart contract address, check it again</span
          >
        </div>
        <div
          :class="`add-btn ${status === 'success' ? 'active' : ''}`"
          @click="handleAdd"
        >
          Add
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import Web3 from "web3";
import { ref, defineExpose } from "vue";
import { Alchemy, Network } from "alchemy-sdk";
import { addCustomerTokenData } from "@/services/index.js";
import indexAbi from "@/abi/index.json";
const emit = defineEmits(["change"]);
const formValue = ref({
  address: "",
  token: "",
});

const status = ref("");

const isShow = ref(false);
const close = () => {
  isShow.value = false;
};
const ETHaddress = ref("");
const open = (address) => {
  ETHaddress.value = address;
  formValue.value = {
    address: "",
    token: "",
  };
  isShow.value = true;
};

const onInput = async () => {
  const pattern = /^0x[a-fA-F0-9]{40}$/; // 例如，只允许字母和数字
  const flag = pattern.test(formValue.value.address);
  if (flag) {
    const name = await getToken(formValue.value.address);
    if (name) {
      formValue.value.token = name;
      status.value = "success";
    } else {
      status.value = "fail";
      formValue.value.token = "";
    }
  } else {
    status.value = "fail";
    formValue.value.token = "";
  }
};
// polygon-amoy
const getToken = async (address) => {
  const name = await getSymbol(address);
  if (name) {
    return name;
  }
  return false;
  const network =
    window.location.origin.indexOf("bitparty.tech") !== -1
      ? Network.ETH_MAINNET
      : Network.MATIC_AMOY;
  const settings = {
    apiKey: "Mx71dKeiQprWUUb09x56lllHsdsdjx7u", // Replace with your Alchemy API Key.
    network, // Replace with your network.
  };
  const alchemy = new Alchemy(settings);
  const metadata = await alchemy.core.getTokenMetadata(address);
  if (metadata.name) {
    return metadata.name;
  }
  return false;
};

const getSymbol = async (address) => {
  try {
    let web3 = new Web3(window.web3.currentProvider);
    let brc20Contract = new web3.eth.Contract(indexAbi, address);
    console.log(brc20Contract, "brc20Contract");
    try {
      const res = await brc20Contract.methods.symbol().call();
      return res;
    } catch (error) {
      console.log(error, "balance fail");
    }
  } catch (error) {
    console.log(error, "e");
  }
};

const handleAdd = async () => {
  if (status.value === "success") {
    const res = await addCustomerTokenData({
      UserAddress: ETHaddress.value,
      TokenSymbol: formValue.value.token,
      TokenContractAddress: formValue.value.address,
    });
    if (res.statusCode === 1) {
      close();
      emit("change", "success");
    } else {
      emit("change", "error");
    }
  }
};
defineExpose({ open, close });
</script>
<style>
.checkList {
  .ant-input.css-dev-only-do-not-override-eq3tly {
    background: none !important;
    border: none;
    font-family: LilitaOne;
    font-size: 15px;
    font-weight: 400;
    text-align: right;
    color: #000;
  }
}
</style>
<style scoped lang="scss">
.checkBook {
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  position: fixed;
  left: 0;
  top: 0;
  z-index: 9999;
  color: #000;
  .info {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 480px;
    height: 280px;
    z-index: 2;
  }
  .info-content {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 9;
    width: 480px;
    height: 280px;
    background-color: #fff;
    border: 3px solid #000000;
    box-shadow: 4px 4px 0px 0px #000000;

    .title2 {
      font-family: LilitaOne;
      font-size: 15px;
      font-weight: 400;
      line-height: 17px;
      letter-spacing: 0em;
      text-transform: capitalize;
      width: 400px;
      margin: 16px auto 0px;
    }

    .checkList {
      width: 420px;
      height: 40px;
      margin: 0 auto;
      padding-right: 20px;
      background-color: #ededed;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-family: LilitaOne;
      font-size: 15px;
      font-weight: 400;
      line-height: 22px;
      margin-top: 25px;
      border-radius: 4px;
      .id {
        margin-left: 20px;
        color: #b5b5b5;
      }
      .right {
        display: flex;
        justify-self: start;

        .idText {
          width: 190px;
          overflow: hidden;
        }
      }
    }
    .failText {
      font-family: LilitaOne;
      font-size: 10px;
      font-weight: 400;
      line-height: 11.43px;
      text-align: left;
      color: #ff4d00;
      margin-top: 5px;
      margin-left: 28px;
    }
    .add-btn {
      width: 180px;
      height: 48px;
      border-radius: 8px;
      border: 2px solid #000;
      font-family: LilitaOne;
      font-size: 20px;
      font-weight: 400;
      line-height: 42px;
      text-align: center;
      box-shadow: 4px 4px 0px 0px #000000;
      margin: 30px auto 0;

      background: #d9d9d9;
      cursor: pointer;
    }
    .active {
      background: #ffc500;
    }
  }
  .logo {
    position: absolute;
    top: -90px;
    left: 18px;
    z-index: 1;
  }
  .close {
    position: absolute;
    top: 8px;
    right: 8px;
    cursor: pointer;
  }
}
</style>
