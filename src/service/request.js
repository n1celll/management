import axios from 'axios'
import cookie from "../utils/cookie"
const request = axios.create({
    baseURL: process.env.VUE_APP_API_URL ,
    // baseURL: "http://127.0.0.1:8000/api/v1/",
    // 设置请求超时
    timeout: '12000'
});

// 添加请求拦截器

request.interceptors.request.use(function (config) {
    // 在发送请求之前做些什么
    config.headers.Authorization = cookie.getCookie('token')
    return config;
  }, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
  });

export default request