import {request} from '../utils';

export function getAllDataAPI(){
    return request({
        url:'/all-data',
        method:'GET'
    })
}

export function getRequiredDataAPI(params){
    return request({
        url:'/query',
        method:'GET',
        params
    })
}
