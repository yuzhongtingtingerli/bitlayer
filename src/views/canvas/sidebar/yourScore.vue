<template>
  <div class="YourScore">
    <div class="left">
      <Title title="Your Score" />
      <div class="PersonalTotalScore">{{ ScoreData?.PersonalTotalScore }}</div>
      <div class="PersonalTotalTVL">
        TVL(BTC)：{{ ScoreData?.PersonalTotalTVL }}
      </div>
    </div>
    <div class="right" v-if="nftScoreData?.TotalListNumber > 0">
      <div class="books">
        <div
          class="red"
          v-if="nftScoreData.redbook && nftScoreData.redbook.NftScore > 0"
        >
          <div class="top">
            <img
              src="@/assets/available-books.png"
              width="24px"
              alt=""
              srcset=""
            />
            <div class="hover">
              <div class="num">+{{ nftScoreData.redbook.NftScore }}</div>
              <!-- <div class="description">Earn +50% more Diamonds</div> -->
            </div>
            <!-- <div class="num">{{ nftScoreData.Initiative.NftNumber }}</div> -->
          </div>
          <!-- <div class="bottom">+{{ nftScoreData.Initiative.NftScore }}</div> -->
        </div>
        <div
          class="yellow"
          v-if="nftScoreData.hemlet && nftScoreData.hemlet.NftScore > 0"
        >
          <div class="top">
            <img src="@/assets/helmet.png" width="24px" alt="" srcset="" />
            <div class="hover">
              <div class="num">+{{ nftScoreData.hemlet.NftScore }}</div>
              <!-- <div class="description">Earn +50% more Diamonds</div> -->
            </div>
            <!-- <div class="num">{{ nftScoreData.Passive.NftNumber }}</div> -->
          </div>
          <!-- <div class="bottom">+{{ nftScoreData.Passive.NftScore }}</div> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import Title from "@cps/title";
const props = defineProps({
  ScoreData: Object,
  nftScoreData: Object,
});
</script>
<style scoped lang="scss">
.YourScore {
  padding: 15px 22px;
  // height: 102px;
  border-bottom: 1px solid;
  border-image-source: linear-gradient(
    90deg,
    rgba(63, 63, 63, 0.3) 0%,
    rgba(255, 255, 255, 0.3) 46.5%,
    rgba(63, 63, 63, 0.3) 100%
  );
  border-image-slice: 1;
  display: flex;
  justify-content: space-between;
  .right {
    padding-top: 38px;
  }
  .books {
    display: flex;
    justify-content: space-between;
    .yellow {
      margin-left: 16px;
    }
    .top {
      position: relative;
      width: 30px;
      height: 30px;
      padding: 3px 3px 2px 0px;
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
      border: 1px solid;
      border-image-source: linear-gradient(
        134.57deg,
        #c0c0c0 0%,
        #23252a 110.84%
      );
      border-image-slice: 1;
      border-radius: 2px;
      cursor: pointer;
      &:hover .hover {
        display: block;
      }
      .hover {
        display: none;
        position: absolute;
        top: 34px;
        right: 0px;
        width: 160px;
        height: 58px;
        background-color: #232323;
        border-radius: 2px;
        padding-left: 11px;
        padding-top: 10px;
        .num {
          font-family: Poppins;
          font-size: 13px;
          font-weight: 700;
          line-height: 19.5px;
          text-align: left;
          color: #ffc500;
          line-height: 20px;
        }
        .description {
          font-family: Inter;
          font-size: 10px;
          font-weight: 400;
          line-height: 10px;
        }
      }
    }
  }
  .PersonalTotalScore {
    text-align: left;
    font-family: Poppins;
    font-size: 24px;
    font-weight: 700;
    line-height: 36px;
    letter-spacing: 0em;
    color: #ffc500;
    text-shadow: 0 3px #000, 3px 0 #000, -1px 0 #000, 0 -1px #000;
    margin-top: 10px;
  }
  .PersonalTotalTVL {
    font-family: Inter;
    font-size: 10px;
    line-height: 12px;
    letter-spacing: 0em;
    text-align: left;
    margin-top: 6px;
    color: #d9d9d9;
  }
}
</style>
