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
export const GetUser=createAsyncThunk("user/GetUser",async(userId)=>{
    const response=await userService.GetUser(userId)
    return response
})
export const UpdateUser=createAsyncThunk("user/UpdateUser",async({id,userUpdateDto})=>{
    const response=await userService.UpdateUser(id,userUpdateDto)
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
        }),
        builder.addCase(GetUser.fulfilled,(state,action)=>{
            state.user=action.payload
         })
    }
})
export default userSlice.reducer;