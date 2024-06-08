// api.js

import axios from "axios";
function getBaseUrl() {
  try {
    let protocol = window.location.protocol;
    let host = window.location.host;
    return `${protocol}//${host}/api`;
  } catch (e) {
    return "";
  }
}
// http://68.178.206.124:3434
// https://www.bitparty.tech:4000
console.log("https://bitlayer.bitparty.tech:4114-0608-01");
const BASEURL =
  process.env.NODE_ENV === "development"
    ? getBaseUrl()
    : "https://bitlayer.bitparty.tech:4114";
// 创建一个 axios 实例
const apiInstance = axios.create({});

// 请求拦截器
apiInstance.interceptors.request.use(
  (config) => {
    // 在请求发送之前做些什么
    // 例如，可以在请求头中添加 token
    // config.headers['Authorization'] = 'Bearer ' + getToken();
    return config;
  },
  (error) => {
    // 对请求错误做些什么
    return Promise.reject(error);
  }
);

// 响应拦截器
apiInstance.interceptors.response.use(
  (response) => {
    // 对响应数据做些什么
    return response;
  },
  (error) => {
    // 对响应错误做些什么
    return Promise.reject(error);
  }
);

// 封装请求方法
export const request = async (url, method = "get", data = null) => {
  try {
    const response = await apiInstance.request({
      url: BASEURL + url,
      method,
      data,
    });

    return response.data;
  } catch (error) {
    // 处理请求错误
    throw error;
  }
};

export const requestPost = async (url, method = "post", data = null) => {
  try {
    const response = await apiInstance.request({
      url: BASEURL + url,
      method,
      data,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    return response.data;
  } catch (error) {
    // 处理请求错误
    throw error;
  }
};

const apikey = import.meta.env.VITE_OPEN_API;

export const requestWallet = async (url, method = "get", data = null) => {
  try {
    const response = await apiInstance.request({
      url,
      method,
      data,
      headers: {
        Accept: "*/*",
        "Content-Type": "application/json",
        Authorization: `Bearer ${apikey}`,
      },
    });

    return response.data;
  } catch (error) {
    // 处理请求错误
    throw error;
  }
};

export const requestM = async (url, method = "get", data = null) => {
  try {
    const response = await apiInstance.request({
      url: url,
      method,
      data,
    });

    return response.data;
  } catch (error) {
    // 处理请求错误
    throw error;
  }
};
