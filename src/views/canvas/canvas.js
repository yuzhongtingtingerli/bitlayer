const LOCATION = {
  0: (x, y) => ({ x, y }),
  1: (x, y) => ({ x: x + 1, y }),
  2: (x, y) => ({ x: x + 0.5, y: y + 0.5 }),
  3: (x, y) => ({ x: x + 0.5, y: y - 0.5 }),
  4: (x, y) => ({ x: x - 0.5, y: y - 0.5 }),
  5: (x, y) => ({ x, y: y - 1 }),
  6: (x, y) => ({ x: x + 0.5, y: y - 1.5 }),
  7: (x, y) => ({ x: x + 1, y: y - 1 }),
  8: (x, y) => ({ x: x + 1.5, y: y - 0.5 }),
  9: (x, y) => ({ x: x + 2, y: y }),
  10: (x, y) => ({ x: x + 1.5, y: y + 0.5 }),
  11: (x, y) => ({ x: x + 1, y: y + 1 }),
  12: (x, y) => ({ x: x + 0.5, y: y + 1.5 }),
  13: (x, y) => ({ x, y: y + 1 }),
  14: (x, y) => ({ x: x - 0.5, y: y + 0.5 }),
  15: (x, y) => ({ x: x - 1, y }),
  16: (x, y) => ({ x: x - 1.5, y: y - 0.5 }),
  17: (x, y) => ({ x: x - 1, y: y - 1 }),
  18: (x, y) => ({ x: x - 0.5, y: y - 1.5 }),
  19: (x, y) => ({ x, y: y - 2 }),
  20: (x, y) => ({ x: x + 0.5, y: y - 2.5 }),
  21: (x, y) => ({ x: x + 1, y: y - 2 }),
  22: (x, y) => ({ x: x + 1.5, y: y - 1.5 }),
  23: (x, y) => ({ x: x + 2, y: y - 1 }),
  24: (x, y) => ({ x: x + 2.5, y: y - 0.5 }),
  25: (x, y) => ({ x: x + 3, y }),
  26: (x, y) => ({ x: x + 2.5, y: y + 0.5 }),
  27: (x, y) => ({ x: x + 2, y: y + 1 }),
  28: (x, y) => ({ x: x + 1.5, y: y + 1.5 }),
  29: (x, y) => ({ x: x + 1, y: y + 2 }),
  30: (x, y) => ({ x: x + 0.5, y: y + 2.5 }),
  31: (x, y) => ({ x, y: y + 2 }),
  32: (x, y) => ({ x: x - 0.5, y: y + 1.5 }),
  33: (x, y) => ({ x: x - 1, y: y + 1 }),
  34: (x, y) => ({ x: x - 1.5, y: y + 0.5 }),
  35: (x, y) => ({ x: x - 2, y }),
};
export function getLocation(x, y, PersonNumber) {
  const arr = [];
  for (let i = 0; i < PersonNumber; i++) {
    arr.push(LOCATION[i](x, y));
  }
  arr.sort(function (a, b) {
    if (a.y === b.y) {
      return a.x - b.x; // 如果 x 相等，按照 y 的大小进行排序
    } else {
      return a.y - b.y; // 否则，按照 x 的大小进行排序
    }
  });
  // arr.sort(function (a, b) {
  //   if (a.x === b.x) {
  //     return a.y - b.y; // 如果 x 相等，按照 y 的大小进行排序
  //   } else {
  //     return a.x - b.x; // 否则，按照 x 的大小进行排序
  //   }
  // });
  return arr;
}
// 绘制菱形函数
export function drawRhomb(ctx, x, y, w, h) {
  // 开始绘制路径
  ctx.beginPath();

  // 绘制菱形的四个顶点
  ctx.moveTo(x, y - h / 2); // 上顶点
  ctx.lineTo(x + w / 2, y); // 右顶点
  ctx.lineTo(x, y + h / 2); // 下顶点
  ctx.lineTo(x - w / 2, y); // 左顶点

  // 闭合路径
  ctx.closePath();

  // 设置菱形的填充颜色和描边颜色
  ctx.strokeStyle = "#ffffff"; // 描边颜色为黑色

  // 填充并描边菱形
  ctx.stroke();
}

export function drawRect(ctx, x, y, w, h) {
  // 开始绘制路径
  ctx.beginPath();

  // 绘制矩形的四个顶点
  ctx.moveTo(x, y); // 上顶点
  ctx.lineTo(x + w, y); // 右顶点
  ctx.lineTo(x + w, y + h); // 下顶点
  ctx.lineTo(x, y + h); // 左顶点

  // 闭合路径
  ctx.closePath();

  // 设置矩形的填充颜色和描边颜色
  ctx.strokeStyle = "#ffffff"; // 描边颜色

  // 填充并描边矩形
  ctx.stroke();
}

export function drawBorder(
  ctx,
  offsetX,
  offsetY,
  gridWidth,
  gridHeight,
  gridSizeX,
  gridSizeY
) {
  // 开始绘制路径
  ctx.beginPath();
  // 四个顶点
  ctx.moveTo(0 + offsetX - gridSizeX / 2, 0 + offsetY - gridSizeY / 2);
  ctx.lineTo(gridWidth + offsetX, 0 + offsetY - gridSizeY / 2);
  ctx.lineTo(gridWidth + offsetX, gridHeight + offsetY);
  ctx.lineTo(0 + offsetX - gridSizeX / 2, gridHeight + offsetY);

  // 闭合路径
  ctx.closePath();
  ctx.strokeStyle = "#000000"; // 描边颜色为黑色
  ctx.stroke();
}

export function computeSize(arr, minWidth, minHeight) {
  const { wSize, hSize } = transitionLocation(arr, minWidth, minHeight);
  console.log(wSize, hSize);

  return {
    groups: arr,
    wSize,
    hSize,
  };
}
function transitionLocation(groups, wSize, hSize) {
  let minLimit = 0,
    maxLimit = 0,
    h = hSize,
    w = wSize;
  let wt = Math.max(Math.ceil(wSize / 2), 0);
  let ht = Math.max(Math.ceil(hSize / 2), 0);
  // 第一个军团的中心位置
  // 中心中心中心中心中心中心中心中心
  let count = wt / 2;
  for (let i = 0; i < groups.length; i++) {
    const group = groups[i];
    count = count + Number(group.RectSize) / 2 + 1;
    group.location = {
      x: 2 * wt - count,
      y: 2 * ht - count
    };
    
    let cx = group.location.x;
    let cy = group.location.y;
    for (let j = 0; j < group.CurrentGroupInfo.length; j++) {
      const item = group.CurrentGroupInfo[j];
      let x, y;
      if (j === 0) {
        x = cx - 0.5;
        y = cy - 0.5;
      } else if (j % 2 !== 0) {
        // 奇数向左
        x = cx - (Number(group.RectSize) / 2 + 1) * Math.ceil(j / 2);
        y = cy + (Number(group.RectSize) / 2 + 1) * Math.ceil(j / 2);
      } else {
        // 偶数向右
        x = cx + (Number(group.RectSize) / 2 + 1) * Math.ceil(j / 2);
        y = cy - (Number(group.RectSize) / 2 + 1) * Math.ceil(j / 2);
      }
      const min = Math.min(x, y);
      const max = Math.max(x, y);
      if (min < 5) {
        minLimit = Math.max(minLimit, min);
      }
      if (max >= wSize - 5) {
        maxLimit = Math.max(maxLimit, max - (wSize - 5));
      }
      // console.log(x, y, minLimit, maxLimit);

      item.location = { x, y };
    }
  }
  return {
    wSize: wSize + Math.max(minLimit, maxLimit),
    hSize: hSize + Math.max(minLimit, maxLimit),
  };
}
export function loadImage(src) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = function () {
      resolve(image);
    };
    // 设置图片源
    image.src = src;
  });
}