import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import userService from "../../services/userService";
export const GetAllUser=createAsyncThunk("user/GetAllUser",async(userId)=>{
    const response=await userService.GetAllUser(userId)
    return response
})
export const GetUserById=createAsyncThunk("user/GetUserById",async(numberPhone)=>{
    const response=await userService.GetUserById(numberPhone)
    return response
})
const initialState={
    listUser:[],
    user:null
}
const userSlice=createSlice({
    name:"user",
    initialState,
    reducers:{},
    extraReducers:(builder)=>{
        builder.addCase(GetAllUser.fulfilled,(state,action)=>{
            state.listUser=action.payload
        }),
        builder.addCase(GetUserById.fulfilled,(state,action)=>{
           state.user=action.payload
        })
    }
})
export default userSlice.reducer;