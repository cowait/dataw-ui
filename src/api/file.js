import {url} from '@/config';
import request from '../axios';

export const getList = (type) => {
    return request({
        url: url + '/file/list',
        method: 'get',
        params: {
            type
        }
    })
}

export const getPage = (page) => {
    return request({
        url: url + '/file/page',
        method: 'get',
        params: page
    })
}

export const remove = (url) => {
    return request({
        url: url + '/file/remove',
        method: 'post',
        params: {
            url,
        }
    })
}



