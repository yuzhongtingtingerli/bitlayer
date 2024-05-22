const rcwModules = import.meta.glob("../../assets/red-cat-walk/*.png", {
  eager: true,
});
const rcws = [];
for (const path in rcwModules) {
  rcws.push(rcwModules[path].default);
}

const bcwModules = import.meta.glob("../../assets/black-cat-walk/*.png", {
  eager: true,
});
const bcws = [];
for (const path in bcwModules) {
  bcws.push(bcwModules[path].default);
}

const bcsModules = import.meta.glob("../../assets/black-cat-standby/*.png", {
  eager: true,
});
const bcss = [];
for (const path in bcsModules) {
  bcss.push(bcsModules[path].default);
}

const rcsModules = import.meta.glob("../../assets/red-cat-standby/*.png", {
  eager: true,
});
const rcss = [];
for (const path in rcsModules) {
  rcss.push(rcsModules[path].default);
}

import { loadImage } from "./canvas";
import { onMounted } from "vue";

export function useCat() {
  let redCatWalks = []; // 红猫走路
  let blackCatWalks = []; // 黑猫走路

  let blackCatStandbys = []; // 黑猫待机
  let redCatStandbys = []; // 红猫待机
  function getCat(isRedCat, count) {
    if (blackCatStandbys.length && redCatStandbys.length) {
      count++;
      return isRedCat
        ? redCatStandbys[count % redCatStandbys.length]
        : blackCatStandbys[count % blackCatStandbys.length];
    }
  }
  onMounted(async () => {
    blackCatStandbys = await Promise.all(bcss.map((el) => loadImage(el)));
    redCatStandbys = await Promise.all(rcss.map((el) => loadImage(el)));
    // redCatWalks = await Promise.all(rcws.map((el) => loadImage(el)));
    // blackCatWalks = await Promise.all(bcws.map((el) => loadImage(el)));
  });
  return { getCat };
}
