import { ref, onMounted, onUnmounted } from "vue";

export function useMouse() {
  const canvasRef = ref(null);
  const scale = ref(0.8); // 缩放比例
  const offsetX = ref(0); // 水平偏移量
  const offsetY = ref(0); // 垂直偏移量
  const minScale = 0.05; // 最小缩放比例
  const maxScale = 3.0; // 最大缩放比例
  let isDragging = false; // 是否正在拖拽
  let lastMouseX = 0; // 上次鼠标的X坐标
  let lastMouseY = 0; // 上次鼠标的Y坐标

  let offsetW = ref(0);
  let offsetH = ref(0);

  // 处理鼠标拖拽事件
  function mousedown(event) {
    isDragging = true;
    lastMouseX = event.clientX;
    lastMouseY = event.clientY;
  }
  function mousemove(event) {
    if (isDragging) {
      var deltaX = event.clientX - lastMouseX;
      var deltaY = event.clientY - lastMouseY;
      offsetX.value += deltaX;
      offsetY.value += deltaY;
      lastMouseX = event.clientX;
      lastMouseY = event.clientY;
    }
  }
  function mouseup(event) {
    isDragging = false;
  }
  function mouseleave(event) {
    isDragging = false;
  }
  function wheel(event) {
    let zoomSpeed = 0.01; // 缩放速度

    if (event.deltaY < 0) {
      // 向上滚动，放大画布
      scale.value += zoomSpeed;
    } else {
      // 向下滚动，缩小画布（最小缩放为0.5）
      scale.value = Math.max(scale.value - zoomSpeed, minScale);
    }
    scale.value = Math.min(scale.value, maxScale);

    offsetW.value = (window.innerWidth - window.innerWidth * scale.value) / 2;
    offsetH.value = (window.innerHeight - window.innerHeight * scale.value) / 2;
    event.preventDefault(); // 阻止页面滚动
  }

  function name(params) {}

  onMounted(() => {
    const canvas = canvasRef.value;
    var windowWidth =
      window.innerWidth ||
      document.documentElement.clientWidth ||
      document.body.clientWidth;

    // 获取浏览器窗口高度
    var windowHeight =
      window.innerHeight ||
      document.documentElement.clientHeight ||
      document.body.clientHeight;

    canvas.width = windowWidth;
    canvas.height = windowHeight - 60;

    canvas.addEventListener("mousedown", mousedown);
    canvas.addEventListener("mousemove", mousemove);
    canvas.addEventListener("mouseup", mouseup);
    canvas.addEventListener("mouseleave", mouseleave);
    canvas.addEventListener("wheel", wheel);
    window.onresize = () => {
      var windowWidth =
        window.innerWidth ||
        document.documentElement.clientWidth ||
        document.body.clientWidth;

      // 获取浏览器窗口高度
      var windowHeight =
        window.innerHeight ||
        document.documentElement.clientHeight ||
        document.body.clientHeight;

      canvas.width = windowWidth;
      canvas.height = windowHeight - 60;
    };
  });
  onUnmounted(() => {
    const canvas = canvasRef.value;
    canvas?.removeEventListener("mousedown", mousedown);
    canvas?.removeEventListener("mousemove", mousemove);
    canvas?.removeEventListener("mouseup", mouseup);
    canvas?.removeEventListener("mouseleave", mouseleave);
    canvas?.removeEventListener("wheel", wheel);
  });

  return { canvasRef, scale, offsetX, offsetW, offsetY, offsetH };
}
