<template>
  <div class="bjs">
    <div class="bg">
      <div class="left1"></div>
      <div class="left2"></div>
      <div class="right1"></div>
      <div class="right1_bg"></div>
      <div class="right2"></div>
    </div>
    <div class="main w1400">
      <div class="left3">
        <div class="title">
          <img class="bitlayer" src="@/assets/bitlayer.png" height="100px" />
          <img class="middle" src="@/assets/home_logo.png" height="24px" />
          <span>BIT PARTY</span>
        </div>
        <div class="description">the first Token Rally</div>
        <div class="list">
          <div class="list-item">
            <div class="top" @click="unfolding(1)">
              <div :class="`text ${active === 1 ? 'active' : ''}`">
                Powered By BTC、token、Smart Contract、Bitlayer Assets
              </div>
              <div class="right" v-if="active === 1">
                <img src="@/assets/Vector.png" alt="" srcset="" />
              </div>
              <div class="right" v-else>
                <img src="@/assets/right_logo.png" height="11px" />
              </div>
            </div>
            <div class="content" v-if="active === 1">
              <div>
                Learn BTC：<a target="_blank" href="https://bitcoin.org/"
                  >bitcoin.org</a
                >
              </div>
              <div>
                Learn token：<a
                  target="_blank"
                  href="https://domo-2.gitbook.io/brc-20-experiment/"
                  >domo-2.gitbook.io/brc-20-experiment/</a
                >
              </div>
              <div>
                Learn smartcontract：<a
                  target="_blank"
                  href="https://ethereum.org/en/smart-contracts"
                  >ethereum.org/en/smart-contracts</a
                >
              </div>
              <div>
                Learn Bitlayer Assets：<a
                  target="_blank"
                  href="https://eips.ethereum.org/EIPS/eip-20"
                  >https://eips.ethereum.org/EIPS/eip-20</a
                >
              </div>
            </div>
          </div>
          <div class="list-item">
            <div class="top" @click="unfolding(2)">
              <div :class="`text ${active === 2 ? 'active' : ''}`">
                Stake Pool By Temporary Address Stream
              </div>
              <div class="right" v-if="active === 2">
                <img src="@/assets/Vector.png" alt="" srcset="" />
              </div>
              <div class="right" v-else>
                <img src="@/assets/right_logo.png" height="11px" />
              </div>
            </div>
            <div class="content" v-if="active === 2">
              Learn temporary address stream ：
            </div>
          </div>
          <div class="list-item">
            <div class="top" @click="unfolding(3)">
              <div :class="`text ${active === 3 ? 'active' : ''}`">
                Code Audit By -
              </div>
              <div class="right" v-if="active === 3">
                <img src="@/assets/Vector.png" alt="" srcset="" />
              </div>
              <div class="right" v-else>
                <img src="@/assets/right_logo.png" height="11px" />
              </div>
            </div>
            <div class="content" v-if="active === 3">
              <div>The code has been audited and there are no problems</div>
              <div>
                Codesite：<a
                  target="_blank"
                  href="https://www.github.com/bitparty"
                  >www.github.com/bitparty code</a
                >
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="bottom">
      <Footer />
    </div>
    <ErrorInfo ref="errorInfoRef" />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import Footer from "@/views/footer.vue";
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
  const res = await checkRuningStatus();
  if (res.result.RunningStatus <= 1) {
    isShowError();
  }
};
onMounted(() => {
  checkRuning();
});
const active = ref(0);
const unfolding = (index) => {
  if (active.value === index) {
    active.value = 0;
  } else {
    active.value = index;
  }
};
</script>
<style scoped lang="scss">
.bjs {
  background-color: #000;
}
.bg {
  width: 1440px;
  margin: 0 auto;
  position: relative;
  height: 0px;
  .left1 {
    height: 114px;
    width: 119px;
    position: absolute;
    top: 98px;
    left: 0px;
    background-image: url("@/assets/left1.png");
    animation: updown2 6s ease infinite;
  }
  .left2 {
    height: 40px;
    width: 51px;
    position: absolute;
    top: 115px;
    left: 127px;
    background-image: url("@/assets/left2.png");
  }
  .right1 {
    height: 521px;
    width: 595px;
    top: 153px;
    right: 53px;
    position: absolute;
    background-image: url("@/assets/blackCatScene.gif");
    background-size: 595px 521px;
    animation: updown 4s ease infinite;
    z-index: 2;
  }
  .right1_bg {
    height: 724px;
    width: 666px;
    top: 180px;
    right: 40px;
    position: absolute;
    z-index: 1;
    background: radial-gradient(
        38.96% 38.96% at 49.96% 40.87%,
        rgba(0, 10, 255, 0.3) 0%,
        rgba(255, 255, 255, 0) 100%,
        rgba(0, 255, 255, 0) 100%
      )
      /* warning: gradient uses a rotation that is not supported by CSS and may not behave as expected */;
  }
  .right2 {
    height: 114px;
    width: 77px;
    position: absolute;
    top: 462px;
    right: 0px;
    background-image: url("@/assets/right2.png");
    animation: updown2 6s ease infinite;
  }
  /* 定义动画 */
  @keyframes updown {
    0% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-50px);
    }
    100% {
      transform: translateY(0);
    }
  }
  @keyframes updown2 {
    0% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-20px);
    }
    100% {
      transform: translateY(0);
    }
  }
}
.main {
  position: relative;
  height: 812px;

  .left3 {
    position: absolute;
    top: 196px;
    left: 98px;
    color: #fff;
    .title {
      font-family: LuckiestGuy;
      font-size: 65px;
      font-weight: 400;
      // line-height: 30px;
      letter-spacing: 0em;
      text-align: left;
      .bitlayer {
        margin-bottom: 20px;
      }
      .middle {
        margin-left: 8px;
        margin-right: 20px;
      }
    }
    .description {
      margin-top: 15px;
      font-family: LilitaOne;
      font-size: 30px;
      font-weight: 400;
      line-height: 22px;
      letter-spacing: 0em;
      text-align: left;
      text-transform: capitalize;
    }
    .active {
      color: #feac14;
    }
    .list {
      margin-top: 60px;
      .list-item {
        padding-left: 20px;
        padding-right: 40px;
        width: 500px;
        border-radius: 4px;
        margin-bottom: 16px;
        font-family: LilitaOne;
        font-size: 14px;
        font-weight: 400;
        letter-spacing: 0em;
        text-align: left;
        background: linear-gradient(
          135deg,
          rgba(131, 196, 255, 0.2) 0%,
          rgba(255, 255, 255, 0.2) 100%
        );
        .top {
          display: flex;
          justify-content: space-between;
          height: 60px;
          line-height: 60px;
          cursor: pointer;
        }

        .content {
          font-family: LilitaOne;
          font-size: 14px;
          font-weight: 400;
          line-height: 22px;
          letter-spacing: 0em;
          text-align: left;
          padding-bottom: 30px;
          a {
            color: #fff;
          }
        }
      }
    }
  }
}
.bottom {
  border-top: 1px solid #333;
}
</style>
