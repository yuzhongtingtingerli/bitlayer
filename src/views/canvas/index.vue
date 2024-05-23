<template>
  <div class="canvas">
    <canvas ref="canvasRef"></canvas>

    <Sidebar />
    <ErrorInfo ref="errorInfoRef" />
    <Loading ref="loadingRef" />
    <MinificationMap
      v-if="scale <= 0.05 && seasonData"
      ref="minificationMapRef"
      :GroupInfo="GroupInfo"
      :seasonData="seasonData"
      @wheel="handleWheel"
    />
    <FixedDisplay :seasonData="seasonData" v-if="scale > 0.05 && seasonData" />
    <RedBook ref="redBookRef" />
    <Helmet ref="helmetRef" />
  </div>
</template>

<script setup>
import { onMounted, ref, watch } from "vue";
import { arr } from "../../utils/data";
import cut1920 from "../../assets/cut/1920.mp4";
import blackfloor from "../../assets/blackfloor.png";
import book from "../../assets/bg_book.png";
import helmet from "../../assets/bg_helmet.png";
import floor from "../../assets/new_floor.png";
import dialogBox from "../../assets/dialog_box.png";
import { computeSize, getLocation, loadImage, drawRect } from "./canvas";
import { useMouse } from "./mouse";
import { useCut } from "./cut";
import { useCat } from "./cat";
import Sidebar from "./sidebar/index.vue";
import {
  getNftGroupDetailInfoData,
  getTotalStakeInfoData,
} from "@/services/index";
import ErrorInfo from "@/components/error-info.vue";
import Loading from "./loading.vue";
import MinificationMap from "./minificationMap/index.vue";
import FixedDisplay from "./fixedDisplay.vue";
import RedBook from "./redBook.vue";
import Helmet from "./helmet.vue";
import { useAddressStore } from "@/store/address";
import { checkRuningStatus } from "@/services/api.js";

const checkRuning = async () => {
  const res = await checkRuningStatus();
  if (res.result.RunningStatus <= 4) {
    isShowError(
      "The journey will begin soon, wish you good luck ！",
      "infinite"
    );
  } else {
    isShowError(
      "Welcome to Bit party !  Join the BRC20 Group you hold and win BTPX. Good luck !",
      5000
    );
  }
};
let timer = null;
const Address = useAddressStore();
// 错误弹窗
const loadingRef = ref(null);
const onStart = async (flag) => {
  loadingRef.value?.startOrStop(flag);
};
const GroupInfo = ref(null);
const getGroupDetailInfo = async (Address = undefined) => {
  await onStart(true);
  const res = await getNftGroupDetailInfoData({ UserAddress: Address });
  if (res.result === "请求失败") {
    GroupInfo.value = [];
    return;
  }
  GroupInfo.value = res.result.GroupInfo;
  timer && cancelAnimationFrame(timer);
  res.result.GroupInfo.length && drawInit(res.result.GroupInfo);
  await onStart(false);
  await isShowError(
    "Welcome to Bit party !  Join the Bitlayer assets Group you hold and win BTPX. Good luck !",
    5000
  );

  // drawInit(arr);
};
// 获取season数据
const seasonData = ref(null);
const getTotalStakeInfo = async () => {
  const res = await getTotalStakeInfoData();
  seasonData.value = res.result;
};
watch(
  () => Address.getETHaddress,
  async (newVal, oldVal) => {
    if (newVal !== oldVal) {
      getGroupDetailInfo(Address.getETHaddress || undefined);
    }
  }
);
const errorInfoRef = ref(null);
const isShowError = (title, time = 3000) => {
  errorInfoRef.value.open(title, time);
};
const { canvasRef, scale, offsetX, offsetW, offsetY, offsetH } = useMouse();
const { drawCut, videoRef } = useCut();
const { getCat } = useCat();
let ctx;
const SizeW = 250; // 单个网格宽度
const SizeH = 150; // 单个网格高度
const minWidth = 35; // 横向网格个数
const minHeight = 35; // 纵向网格个数
let wSize = null;
let hSize = null;
let groups = null;
let bgImg = null;
let bookImg = null;
let helmetImg = null;
let floorImg = null;
let dialogBoxImg = null;
let count = 0;
function drawInit(arr) {
  const option = computeSize(arr, minWidth, minHeight);
  console.log(option);
  wSize = option.wSize;
  hSize = option.hSize;
  groups = option.groups;
  const i = Math.floor(option.groups.length / 2);
  offsetX.value = -SizeW * (option.groups[i].location.x - 3);
  offsetY.value = -SizeH * (option.groups[i].location.y - 3);
  drawGrid();
}
const handleWheel = () => {
  scale.value = 0.051;
};
const minificationMapRef = ref(null);
function drawGrid() {
  ctx.clearRect(0, 0, canvasRef?.value?.width, canvasRef?.value?.height);
  if (scale.value <= 0.05) {
    timer = window.requestAnimationFrame(drawGrid);
    return;
  }
  count++;
  const gridSizeW = SizeW * scale.value; // 单个网格宽度
  const gridSizeH = SizeH * scale.value; // 单个网格高度

  for (let i = 0; i < wSize; i++) {
    for (let j = 0; j < hSize; j++) {
      const ox = offsetX.value * scale.value + offsetW.value;
      const oy = offsetY.value * scale.value + offsetH.value;
      const x = i * gridSizeW + ox; // 横向间隔为 gridSizeW
      const y = j * gridSizeH + oy; // 纵向间隔为 gridSizeH
      // drawBoundary(j, hSize, i, wSize, x, y, gridSizeW, gridSizeH);
      ctx.drawImage(bgImg, x, y, gridSizeW, gridSizeH);
      ctx.drawImage(
        bgImg,
        x + gridSizeW / 2,
        y + gridSizeH / 2,
        gridSizeW,
        gridSizeH
      );
    }
  }
  drawGroup(groups, gridSizeW, gridSizeH);
  timer = window.requestAnimationFrame(drawGrid);
  // setInterval(drawGrid, 2000);
}
// 我再这里已经获取到每一个大兵团的中心位置了，红色标记
function drawGroup(groups, w, h) {
  groups.forEach((el) => {
    const catH = (640 / (480 / SizeW)) * scale.value;
    const infoList = [];
    el.CurrentGroupInfo.forEach((group) => {
      const x = group.location.x;
      const y = group.location.y;
      const ox = offsetX.value * scale.value + offsetW.value;
      const oy = offsetY.value * scale.value + offsetH.value;
      getLocation(x, y, el.PersonNumber).forEach((item, i) => {
        // { x, y }
        ctx.drawImage(
          floorImg,
          item.x * w + ox,
          (item.y - 0.1) * h + oy,
          w,
          h * 1.1
        );
        const x = (item.x + 0.1) * w + ox;
        const y = (item.y + 0.1) * h + oy - (catH - h);
        const isRedCat = Number(group.UserLocation) === i + 1;
        const img = getCat(isRedCat, count);
        img && ctx.drawImage(img, x, y, w * 0.88, catH * 0.88);

        // 绘制token
        ctx.font = `${14 * Math.min(scale.value, 1)}px LilitaOne`; // 设置字体大小和类型
        ctx.fillStyle = "#fff"; // 设置文字颜色
        const t1 = `${decodeURIComponent(group.GroupName)}`;
        const text1Width = ctx.measureText(t1).width;
        const text1X = x + (w * 0.68 - text1Width) / 2;
        const text1Y = y + (catH * 0.98) / 3;
        ctx.fillText(t1, text1X, text1Y); // 在指定位置绘制文字
      });
      infoList.push({ x, y, w, h, group });
      // 在指定位置绘制文字
    });
    infoList
      .sort((a, b) => {
        if (a.y === b.y) {
          return a.x - b.x; // 如果 x 相等，按照 y 的大小进行排序
        } else {
          return a.y - b.y; // 否则，按照 x 的大小进行排序
        }
      })
      .forEach(({ x, y, w, h, group }) =>
        Promise.resolve().then(() => drawGroupInfo(x, y, w, h, group, catH))
      );
  });
}
function drawGroupInfo(x, y, w, h, group, catH) {
  const ox = offsetX.value * scale.value + offsetW.value;
  const oy = offsetY.value * scale.value + offsetH.value;

  const imgw = dialogBoxImg.width * Math.min(scale.value, 1);
  const imgh = dialogBoxImg.height * Math.min(scale.value, 1);
  const imgX = x * w + ox - (imgw - w) / 2;
  const imgY = y * h + oy - 2.4 * h; // 2.4块砖的高度
  ctx.drawImage(dialogBoxImg, imgX, imgY, imgw, imgh);

  ctx.font = `${40 * Math.min(scale.value, 1)}px LilitaOne`; // 设置字体大小和类型
  ctx.fillStyle = "#000000"; // 设置文字颜色
  const t1 = `${decodeURIComponent(group.GroupName)} Group`;
  const text1Width = ctx.measureText(t1).width;
  const text1X = imgX + (imgw - text1Width) / 2;
  const text1Y = imgY + imgh / 3;
  ctx.fillText(t1, text1X, text1Y); // 在指定位置绘制文字

  ctx.font = `${28 * Math.min(scale.value, 1)}px LilitaOne`; // 设置字体大小和类型
  const t2 = `TVL: ${group.GroupSVL} BTC`;
  const text2Width = ctx.measureText(t2).width;
  const text2X = imgX + (imgw - text2Width) / 2;
  const text2Y = imgY + imgh / 1.4;
  ctx.fillText(t2, text2X, text2Y);

  const nftInfo = {};
  if (group.NftInfo && group.NftInfo.length > 0) {
    for (const info of group.NftInfo) {
      nftInfo[info.NftName] = info;
    }
    const hasHelmet = Number(nftInfo.helmet.NftNumber) > 0;
    const hasRedbook = Number(nftInfo.redbook.NftNumber) > 0;

    // 绘制书本
    if (hasRedbook) {
      const _scale = Math.min(scale.value, 1);
      const helmetImgw = (helmetImg.width / 1) * _scale;
      const bookImgw = (bookImg.width / 1) * _scale;
      const bookImgh = (bookImg.height / 1) * _scale;
      const bookImgX = hasHelmet
        ? imgX + imgw / 2 - (bookImgw + helmetImgw) / 1.2
        : imgX + imgw / 2 - bookImgw / 2;
      const bookImgY = imgY - bookImgh * 1.2;
      ctx.drawImage(bookImg, bookImgX, bookImgY, bookImgw, bookImgh);
      group.book = {
        bookImgX,
        bookImgY,
        bookImgw,
        bookImgh,
      };
      ctx.font = `${24 * _scale}px LilitaOne`; // 设置字体大小和类型
      ctx.fillStyle = "#ffffff"; // 设置文字颜色
      const t3 = `x${nftInfo.redbook.NftNumber}`;
      const text3Width = ctx.measureText(t3).width;
      const text3X = bookImgX + text3Width;
      const text3Y = bookImgY + bookImgh + 1 * _scale;
      ctx.fillText(t3, text3X, text3Y);
    }
    if (hasHelmet) {
      const _scale = Math.min(scale.value, 1);

      const bookImgw = (bookImg.width / 1) * _scale;
      const helmetImgw = (helmetImg.width / 1) * _scale;
      const helmetImgh = (helmetImg.height / 1) * _scale;
      const helmetImgX = hasRedbook
        ? imgX + imgw / 2 - (bookImgw + helmetImgw) / 2 + bookImgw * 1.2
        : imgX + imgw / 2 - helmetImgw / 2;
      const helmetImgY = imgY - helmetImgh * 1.2;
      ctx.drawImage(helmetImg, helmetImgX, helmetImgY, helmetImgw, helmetImgh);
      group.helmet = {
        helmetImgX,
        helmetImgY,
        helmetImgw,
        helmetImgh,
      };
      ctx.font = `${24 * _scale}px LilitaOne`; // 设置字体大小和类型
      ctx.fillStyle = "#ffffff"; // 设置文字颜色
      const t3 = `x${nftInfo.helmet.NftNumber}`;
      const text3Width = ctx.measureText(t3).width;
      const text3X = helmetImgX + text3Width;
      const text3Y = helmetImgY + helmetImgh + 1 * _scale;
      ctx.fillText(t3, text3X, text3Y);
    }
  }
}
const redBookRef = ref(null);
const helmetRef = ref(null);
onMounted(async () => {
  checkRuning();
  ctx = canvasRef.value.getContext("2d");
  //   await drawCut(ctx, canvasRef.value.width, canvasRef.value.height);
  await Promise.all([
    loadImage(blackfloor),
    loadImage(book),
    loadImage(helmet),
    loadImage(floor),
    loadImage(dialogBox),
  ]).then(([blackfloor, book, helmet, floor, dialogBox]) => {
    bgImg = blackfloor;
    bookImg = book;
    helmetImg = helmet;
    floorImg = floor;
    dialogBoxImg = dialogBox;
  });
  await getTotalStakeInfo();
  await getGroupDetailInfo(Address.getETHaddress || undefined);
  const arrs = [];
  groups.forEach((item, index) => {
    arrs.push(...item.CurrentGroupInfo);
  });
  canvasRef.value.addEventListener("click", (e) => {
    const { offsetX, offsetY } = e;
    const foundBook = arrs.find((item) => {
      return (
        offsetX >= item.book?.bookImgX &&
        offsetX <= item.book?.bookImgX + item.book?.bookImgw &&
        offsetY >= item.book?.bookImgY &&
        offsetY <= item.book?.bookImgY + item.book?.bookImgh
      );
    });
    if (foundBook) {
      redBookRef.value.open();
    }
    const foundHelmet = arrs.find((item) => {
      return (
        offsetX >= item.helmet?.helmetImgX &&
        offsetX <= item.helmet?.helmetImgX + item.helmet?.helmetImgw &&
        offsetY >= item.helmet?.helmetImgY &&
        offsetY <= item.helmet?.helmetImgY + item.helmet?.helmetImgh
      );
    });
    if (foundHelmet) {
      helmetRef.value.open();
    }
    // console.log(333, found);
  });
});
</script>

<style scoped>
.canvas {
  position: relative;
  background: #000;
}
video {
  width: 0px;
  opacity: 0;
  height: 0px;
}
</style>
