
// import cut_00000 from "../../assets/cut/cut_00000.png";
// import cut_00001 from "../../assets/cut/cut_00001.png";
// import cut_00002 from "../../assets/cut/cut_00002.png";
// import cut_00003 from "../../assets/cut/cut_00003.png";
// import cut_00004 from "../../assets/cut/cut_00004.png";
// import cut_00005 from "../../assets/cut/cut_00005.png";
// import cut_00006 from "../../assets/cut/cut_00006.png";
// import cut_00007 from "../../assets/cut/cut_00007.png";
// import cut_00008 from "../../assets/cut/cut_00008.png";
// import cut_00009 from "../../assets/cut/cut_00009.png";
// import cut_00010 from "../../assets/cut/cut_00010.png";
// import cut_00011 from "../../assets/cut/cut_00011.png";
// import cut_00012 from "../../assets/cut/cut_00012.png";
// import cut_00013 from "../../assets/cut/cut_00013.png";
// import cut_00014 from "../../assets/cut/cut_00014.png";
// import cut_00015 from "../../assets/cut/cut_00015.png";
// import cut_00016 from "../../assets/cut/cut_00016.png";
// import cut_00017 from "../../assets/cut/cut_00017.png";
// import cut_00018 from "../../assets/cut/cut_00018.png";
// import cut_00019 from "../../assets/cut/cut_00019.png";
// import cut_00020 from "../../assets/cut/cut_00020.png";
// import cut_00021 from "../../assets/cut/cut_00021.png";
// import cut_00022 from "../../assets/cut/cut_00022.png";
// import cut_00023 from "../../assets/cut/cut_00023.png";
// import cut_00024 from "../../assets/cut/cut_00024.png";
// import cut_00025 from "../../assets/cut/cut_00025.png";
// import cut_00026 from "../../assets/cut/cut_00026.png";
// import cut_00027 from "../../assets/cut/cut_00027.png";
// import cut_00028 from "../../assets/cut/cut_00028.png";
// import cut_00029 from "../../assets/cut/cut_00029.png";
// import cut_00030 from "../../assets/cut/cut_00030.png";
// import cut_00031 from "../../assets/cut/cut_00031.png";
// import cut_00032 from "../../assets/cut/cut_00032.png";
// import cut_00033 from "../../assets/cut/cut_00033.png";
// import cut_00034 from "../../assets/cut/cut_00034.png";
// import cut_00035 from "../../assets/cut/cut_00035.png";


import { onMounted, ref } from "vue";
const videoRef = ref(null);
export function useCut() {
    let _ctx, _w, _h
    function drawCut(ctx, w, h) {
       return new Promise(( resolve, reject )=>{
            _ctx = ctx
            _w = w
            _h = h
            try {
                const video = videoRef.value;
                video.addEventListener('play', play)
                video.addEventListener('ended', resolve)
            }finally {
                setTimeout(resolve, 3000);
            }
       })
    }
    function play() {
        const video = videoRef.value;
        (function loop() {
            if (!video.paused && !video.ended) {
                _ctx.drawImage(video, 0, 0, _w, _h);
                setTimeout(loop, 30); // 绘制频率，30fps
            }
        })();
    }
    return {videoRef, drawCut }
}
