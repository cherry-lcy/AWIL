import {request} from '../utils';

function getThemesAPI(){
    return request({
        url:'/themes',
        method:'GET'
    });
}

function getSubthemesAPI(){
    return request({
        url:'/subthemes',
        method:'GET'
    });
}

function getCategoriesAPI(){
    return request({
        url:'/categories',
        method:'GET'
    })
}

export {getThemesAPI, getSubthemesAPI, getCategoriesAPI}