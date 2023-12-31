import { url } from '@/config';
import request from '../axios'
export const getList = (params) => request({
  url: url + '/component/list',
  method: 'get',
  params: params
});



export const getObj = (id) => request({
  url: url + '/component/detail',
  method: 'get',
  params: {
    id
  }
});

export const addObj = (data) => request({
  url: url + '/component/submit',
  method: 'post',
  data: data
});
export const updateObj = (data) => addObj(data)


export const delObj = (id) => request({
  url: url + '/component/remove',
  method: 'post',
  params: {
    ids: id
  }
});