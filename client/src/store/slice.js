import {createSlice} from "@reduxjs/toolkit";

const initialState = {
    user:[],
    role:""
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
    }
})

export const {addUser,removeUser} = ecommSlice.actions;

export default ecommSlice.reducer;