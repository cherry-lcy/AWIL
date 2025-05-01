import axios from 'axios';
import {getToken, clearToken} from './token';
import router from '../../router';

const request = axios.create({
    baseURL: "http://localhost:5000",
    timeout: 5000,
})

request.interceptors.request.use((config)=>{
    const token = getToken();
    if(token){
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error)=>{
    return Promise.reject(error);
})

request.interceptors.response.use((res)=>{
    return res.data;
}, (error)=>{
    if(error.response.status === 403){
        clearToken();
        router.navigate('/');
        window.location.reload();
    }
    return Promise.reject(error);
})

export {request};