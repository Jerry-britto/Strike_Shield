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
        setRole:function(state,action){
            state.role = action.payload;
        },
        removeRole:function(state,_){
            state.role = ""
        }
    }
})

export const {addUser,removeUser,setRole,removeRole} = ecommSlice.actions;

export default ecommSlice.reducer;