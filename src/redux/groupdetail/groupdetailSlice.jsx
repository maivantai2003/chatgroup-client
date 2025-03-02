import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import groupdetailService from "../../services/groupdetailService";
export const GetAllGroupById=createAsyncThunk("groupdetail/CreateGroupdetail",async(groupDetailDto)=>{
    const response=await groupdetailService.CreateGroupDetail(groupDetailDto)
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
        builder.addCase(GetAllGroupById.fulfilled,(state,action)=>{
            state.listGroupDetail.push(action.payload)
        })
    }
})
export default groupdetailSlice.reducer;