import {request} from '../utils';

function getAllDataAPI(){
    return request({
        url:'/all-data',
        method:'GET'
    })
}

function getRequiredDataAPI(params){
    return request({
        url:'/query',
        method:'GET',
        params
    })
}

function insertDataAPI(data){
    return request({
        url:'/query',
        method:'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        data: JSON.stringify(data)
    }).catch(error => {
        console.error('Insert API error:', error);
        throw error;
    });
}

function updateDataAPI(data){
    console.log(data);
    return request({
        url:'/query',
        method:'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        data: JSON.stringify(data)
    }).catch(error => {
        console.error('Update API error:', error);
        throw error;
    });
}

function deleteDataAPI(params){
    console.log({
        url:'/query',
        method:'DELETE',
        ...params
    });
    return request({
        url:'/query',
        method:'DELETE',
        ...params
    })
}

export {getAllDataAPI, getRequiredDataAPI, insertDataAPI, updateDataAPI, deleteDataAPI}