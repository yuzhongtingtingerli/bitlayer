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
        <div class="title1">Check Bitlayer lucky helmet</div>
        <div class="title2">
          Please check the token ID of the Bitlayer lucky helmet you own in your
          wallet and paste it in the box below to see if it is available
        </div>

        <div class="img">
          <img
            v-if="status === 'pass'"
            src="@/assets/helmet2.png"
            width="88px"
            alt=""
          />
          <img v-else src="@/assets/helmet3.png" width="88px" alt="" />
        </div>
        <div class="checkList">
          <div class="id">Token ID:</div>
          <div class="right">
            <div class="inputId">
              <a-input
                v-if="status === ''"
                v-model:value="tokenID"
                placeholder="Bilayer Lucky Helmet #114"
                size="small"
              ></a-input>
              <div class="idText" v-else @click="clearStatus">
                {{ tokenID }}
              </div>
            </div>
            <div
              :class="`check ${tokenID ? '' : 'checkFail'}`"
              @click="checkTokenID"
              v-if="status === ''"
            >
              Check
            </div>
            <div class="check" v-else>
              <img
                v-if="status === 'fail'"
                src="@/assets/fail.png"
                alt=""
                srcset=""
              />
              <img
                v-if="status === 'pass'"
                src="@/assets/successful.png"
                alt=""
                srcset=""
              />
            </div>
          </div>
        </div>
        <div class="failText">
          <span v-if="status === 'fail'"
            >It’s used or input the wrong token id. Plz check it again.</span
          >
        </div>
        <div
          :class="`useIt ${status === 'pass' ? 'pass' : 'fail'}`"
          @click="useIt"
        >
          Use It
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import Web3 from "web3";
import helmetAbi from "@/abi/helmet.json";
import { ref, defineExpose } from "vue";
import { useAddressStore } from "@/store/address";
const Address = useAddressStore();

let stakeAddress;
let provider;
if (window.location.origin.indexOf("bitparty.tech") !== -1) {
  stakeAddress = "0x260ac1a14a89fd24c72b84092629f14964556299";
  provider = window["ethereum"] || window.web3.currentProvider;
} else {
  stakeAddress = "0x260ac1a14a89fd24c72b84092629f14964556299";
  provider = "https://rpc.bitlayer.org";
}
const emit = defineEmits(["change"]);
const isShow = ref(false);
const close = () => {
  isShow.value = false;
};
const open = () => {
  tokenID.value = "";
  status.value = "";
  isShow.value = true;
};

const tokenID = ref("");
const status = ref("");
const checkTokenID = async () => {
  if (!tokenID.value) return;
  let web3 = new Web3(provider);
  let contract = new web3.eth.Contract(helmetAbi, stakeAddress);
  console.log(contract, "contract");
  const ETHWalletType = window.localStorage.getItem("ETHWalletType");
  if (ETHWalletType === "ip") {
    web3.setProvider(okxwallet);
  }
  try {
    const res = await contract.methods.ownerOf(tokenID.value).call();
    if (res.toLowerCase() === Address.ETHaddress.toLowerCase()) {
      status.value = "pass";
    } else {
      status.value = "fail";
    }
    console.log(res, Address.ETHaddress, "res, Address.ETHaddress");
    console.log(
      res.toLowerCase(),
      Address.ETHaddress.toLowerCase(),
      "toLowerCase"
    );
    // status.value = "pass";
  } catch (error) {
    console.log(error, "eee");
    status.value = "fail";
  }
  // if (statusCode === 1) {
  //   status.value = "pass";
  // } else {
  //   status.value = "fail";
  // }
};
const clearStatus = () => {
  status.value = "";
};
const useIt = () => {
  if (status.value === "pass") {
    close();
    emit("change", tokenID.value);
  }
};
defineExpose({ open, close });
</script>
<style>
.checkList {
  .ant-input.css-dev-only-do-not-override-19yxfbp {
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
    height: 410px;
    z-index: 2;
  }
  .info-content {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 9;
    width: 480px;
    height: 410px;
    background-color: #fff;
    border: 3px solid #000000;
    box-shadow: 4px 4px 0px 0px #000000;
    .title1 {
      font-family: LilitaOne;
      font-size: 30px;
      font-weight: 400;
      line-height: 22px;
      letter-spacing: 0em;
      text-align: center;
      padding-top: 25px;
    }
    .title2 {
      font-family: LilitaOne;
      font-size: 15px;
      font-weight: 400;
      line-height: 17px;
      letter-spacing: 0em;
      text-align: center;
      text-transform: capitalize;
      width: 400px;
      margin: 16px auto 0px;
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
      margin: 10px auto 0;
      cursor: pointer;

      img {
        width: 32px;
        height: 32px;
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
    .img {
      text-align: center;
      margin: 22px auto;
    }
    .checkList {
      width: 420px;
      height: 48px;
      margin: 0 auto;
      background-color: #ededed;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-family: LilitaOne;
      font-size: 15px;
      font-weight: 400;
      line-height: 22px;
      .id {
        margin-left: 20px;
      }
      .right {
        display: flex;
        justify-self: start;
        .check {
          margin-right: 8px;
          margin-left: 18px;
          color: #ffaa08;
          cursor: pointer;
          img {
            width: 24px;
            cursor: auto;
          }
        }
        .checkFail {
          color: #b5b5b5;
        }
        .idText {
          width: 190px;
          overflow: hidden;
        }
      }
    }
    .useIt {
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
      margin: 0px auto;
    }
    .pass {
      background: #ffaa08;
      cursor: pointer;
    }
    .fail {
      background: #b5b5b5;
    }
    .failText {
      width: 420px;
      height: 24px;
      margin: 0 auto;
      font-family: LilitaOne;
      font-size: 10px;
      font-weight: 400;
      line-height: 24px;
      text-align: left;
      color: #ff4d00;
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
