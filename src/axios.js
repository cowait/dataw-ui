// import { Loading } from 'element-ui';
import { checkUrl } from '@/utils/utils'
import { MessageBox } from 'element-ui'

import axios from 'axios';

window.$glob = {
  url: '',
  params: {},
  query: {},
  header: {}
};

function getGlobParams () {
  var query = window.location.search.substring(1);
  query = query.split("&");
  query.forEach(ele => {
    var pair = ele.split("=");
    window.$glob.params[pair[0]] = pair[1]
  })
}

getGlobParams();
axios.defaults.timeout = 30000;
//返回其他状态吗
axios.defaults.validateStatus = function (status) {
  return status >= 200 && status <= 500; // 默认的
};
//跨域请求，允许保存cookie
// let loadingInstance = '';
// axios.defaults.withCredentials = true;
axios.interceptors.request.use(config => {
  if (!checkUrl(config.url)) config.url = window.$glob.url + config.url;
  let header = window.$glob.header || {};
  //传递全局header
  config.headers = Object.assign(config.headers, header);
  //传递全局参数
  let data = window.$glob.params || {}
  let key;
  if (['get', 'delete'].includes(config.method)) {
    key = "params"
  } else if (['post', 'put'].includes(config.method)) {
    key = "data"
  }
  if (typeof (config[key]) === 'object') {
    config[key] = Object.assign(config[key] || {}, data)
  }
  if (config.headers.proxy) {
    let headers = {}
    for (let ele in config.headers) {
      if (typeof (config.headers[ele]) !== 'object') headers[ele] = config.headers[ele]
    }
    let form = {
      url: config.url,
      method: config.method,
      headers: headers
    }
    form[key] = config[key]
    config.url = window.$website.url + '/visual/proxy'
    config.method = 'post';
    config.data = form
  }
  return config
}, error => {
  return Promise.reject(error)
});
//HTTPrequest拦截
axios.interceptors.response.use(res => {
  const status = Number(res.status) || 200
  // 后台定义 424 针对令牌过去的特殊响应码
  if (status === 401) {
    MessageBox.confirm('令牌状态已过期，请点击重新登录', '系统提示', {
      confirmButtonText: '重新登录',
      cancelButtonText: '取消',
      type: 'warning'
    }
    ).then(() => {
      window.location.href = res.data
    }).catch(() => {
    });
    return
  }

  return res;
}, error => {
  // loadingInstance.close();
  return Promise.reject(new Error(error));
})

export default axios;
