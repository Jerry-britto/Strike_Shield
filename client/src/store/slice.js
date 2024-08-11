import {createSlice} from "@reduxjs/toolkit";

const initialState = {
    user:[],
    products:[]
}

export const ecommSlice = createSlice({
    name:"user",
    initialState,
    reducers:{
        addUser:function(state,action){
            const user = action.payload;
            state.user.push(user)
        },
        removeUser:function(state,_){
            state.user.pop();
        },
        setProductsData:function(state,action){
            state.products = action.payload
        }
    }
})

export const {addUser,removeUser,setProductsData} = ecommSlice.actions;

export default ecommSlice.reducer;