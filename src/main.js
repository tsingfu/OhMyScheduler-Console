import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui'
import { Message } from 'element-ui';
import './styles.scss'
import './plugins/element.js'


// axios 负责统一拦截处理 ResultDTO，fly 负责处理不需要拦截的请求
import axios from 'axios';
import flyio from 'flyio';
import router from "./router";
import store from "./store";
import common from "./common";

Vue.use(ElementUI);
// let baseURL = "http://139.224.83.134:7700";
let baseURL = process.env.VUE_APP_BASE_URL;

let timeout = 5000;

Vue.prototype.common = common;
/* ******* axios config ******* */
Vue.prototype.axios = axios;
axios.defaults.baseURL = baseURL;
axios.defaults.timeout = timeout;
/* ******* fly.io config ******* */
Vue.prototype.flyio = flyio;
flyio.config.baseURL = baseURL;
flyio.config.timeout = timeout;

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');

// 请求返回拦截，封装公共处理逻辑
axios.interceptors.response.use((response) => {
  if (response.data.success === true) {
    return response.data.data;
  }
  Message.warning("错误信息：" + response.data.message);
  return Promise.reject(response.data.msg);
}, (error) => {
  Message.error(error.toString());
  return Promise.reject(error);
});

export default baseURL;
