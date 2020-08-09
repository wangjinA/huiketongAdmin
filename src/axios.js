import Axios from 'axios'
import Vue from 'vue'
const server = Axios.create({
  baseURL: '/api',
  headers: {
    'content-type': 'application/json'
  }
})
server.interceptors.request.use( (config) =>{
  config.headers.token = localStorage.getItem('token')
  return config;
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error);
});

Vue.prototype.$post = server.post
Vue.prototype.$get = server.get