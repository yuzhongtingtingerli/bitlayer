import { defineConfig } from "vite";
import { nodePolyfills } from "vite-plugin-node-polyfills";
import wasm from "vite-plugin-wasm";
import Components from "unplugin-vue-components/vite";
import { AntDesignVueResolver } from "unplugin-vue-components/resolvers";
import vue from "@vitejs/plugin-vue";
import path from "path";
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    Components({
      resolvers: [
        AntDesignVueResolver({
          importStyle: false, // css in js
        }),
      ],
    }),
    nodePolyfills(),
    wasm(),
  ],
  build: {
    target: ["edge90", "chrome90", "firefox90", "safari15"],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@css": path.resolve(__dirname, "./src/assets/css"),
      "@cps": path.resolve(__dirname, "./src/components"),
      "@img": path.resolve(__dirname, "./src/assets/img"),
      "@hooks": path.resolve(__dirname, "./src/hooks"),
      "@store": path.resolve(__dirname, "./src/store"),
      "@contApi": path.resolve(__dirname, "./src/contractsApi"),
      "@tools": path.resolve(__dirname, "./src/utils/tools"),
      "vue-i18n": "vue-i18n/dist/vue-i18n.cjs.js",
    },

    // import时省略后缀
    extensions: [".js", ".ts", ".jsx", ".tsx", ".json", ".vue", ".mjs"],
  },
  server: {
    port: 3300,
    // 是否自动在浏览器打开
    open: false,
    // 是否开启 https
    https: false,
    host: "0.0.0.0",
    proxy: {
      "/api": {
        // target: "http://68.178.206.124:9334",
        // target: "http://20.39.190.226:8834",
        // target: "http://18.136.19.168:8834",
        target: "https://bitlayer.bitparty.tech:4114",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, "/"),
      },
    },
  },
});
