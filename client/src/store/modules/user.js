import {createSlice} from '@reduxjs/toolkit';
import {request, setToken as _setToken, getToken, clearToken} from '../../utils';

const userStore = createSlice({
    name: "user",
    initialState:{
        id: "",
        token: getToken() || "",
    },
    reducers:{
        setUser(status, action){
            status.id = action.payload.id;
            status.token = action.payload.token;
            _setToken(action.payload.token);
        },
        setToken(status, action){
            status.token = action.payload.token;
            _setToken(action.payload.token);
        },
        clearUser(status){
            status.id = "";
            status.token = "";
            clearToken();
        }
    }
})

const {setUser, setToken, clearUser} = userStore.actions;

const userReducer = userStore.reducer;

const fetchLogin = (loginForm)=>{
    return async (dispatch)=>{
        const res = await request.post('/v1/authentication', loginForm);

        if(res.status === 200){
            dispatch(setUser(res.data))
            return { success: true };
        }
        else{
            return { success: false, message: res.message };
        }
    }
}

export {fetchLogin, setUser, clearUser, setToken};

export default userReducer;