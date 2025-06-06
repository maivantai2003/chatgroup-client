import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import groupdetailService from "../../services/groupdetailService";
export const CreateGroupDetail=createAsyncThunk("groupdetail/CreateGroupdetail",async(groupDetailDto)=>{
    const response=await groupdetailService.CreateGroupDetail(groupDetailDto)
    return response
})
export const DeleteGroupDetail=createAsyncThunk("groupdetail/DeleteGroupdetail",async(id)=>{
    const response=await groupdetailService.DeleteGroupDetail(id)
    return response
})
const initialState={
    listGroupDetail:[],
    groupdetail:null
}
const groupdetailSlice=createSlice({
    name:"groupdetail",
    initialState,
    reducers:{},
    extraReducers:(builder)=>{
        builder.addCase(CreateGroupDetail.fulfilled,(state,action)=>{
            state.listGroupDetail.push(action.payload)
        })

    }
})
export default groupdetailSlice.reducer;