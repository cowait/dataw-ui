import { url } from '@/config';
import request from '../axios';
export const getList = (params) => {
  return request({
    url: url + '/db/list',
    method: 'get',
    params
  })
}

export const getDetail = (id) => {
  return request({
    url: url + '/db/detail',
    method: 'get',
    params: {
      id
    }
  })
}

export const remove = (id) => {
  return request({
    url: url + '/db/remove',
    method: 'post',
    params: {
      id,
    }
  })
}

export const add = (row) => {
  return request({
    url: url + '/db/submit',
    method: 'post',
    data: row
  })
}

export const update = (row) => {
  return request({
    url: url + '/db/submit',
    method: 'post',
    data: row
  })
}
export const dynamicSql = (data) => {
  return request({
    url: url + '/db/dynamic-query',
    method: 'post',
    data: data
  })
}

export const dynamicJava = (data) => {
  return request({
    url: url + '/java/dynamic-query',
    method: 'post',
    data: data
  })
}

export const dbTest = (data) => {
  return request({
    url: url + '/db/db-test',
    method: 'post',
    data: data
  })
}
