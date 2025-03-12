import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import groupService from "../../services/groupService";
export const GetAllGroupById=createAsyncThunk("group/GetAllGroupById",async(userId)=>{
    const response=await groupService.GetAllGroupById(userId)
    return response
})
export const CreateGroup=createAsyncThunk("group/CreateGroup",async(groupDto)=>{
    const response=await groupService.CreateGroup(groupDto)
    return response
})
export const GetGroupById=createAsyncThunk("group/GetGroupById",async(id)=>{
    const response=await groupService.GetGroupById(id)
    return response
})
export const UpdateGroup=createAsyncThunk("group/UpdateGroup",async(conversation)=>{
    const response=await groupService.UpdateGroup(conversation)
    return response
})
const initialState={
    listGroup:[],
    listGroupUser:[],
    group:null
}
const groupSlice=createSlice({
    name:"group",
    initialState,
    reducers:{},
    extraReducers:(builder)=>{
        builder.addCase(GetAllGroupById.fulfilled,(state,action)=>{
            state.listGroupUser=action.payload
        }),
        builder.addCase(CreateGroup.fulfilled,(state,action)=>{
            state.listGroup.push(action.payload)
        }),
        builder.addCase(GetGroupById.fulfilled,(state,action)=>{
            state.group=action.payload
        }),
        builder.addCase(UpdateGroup.fulfilled,(state,action)=>{
            const updateGroup=action.payload
            const index=state.listGroup.findIndex(x=>x.groupId===updateGroup.groupId)
            if(index!==-1){
                state.listGroup[index]=updateGroup
            }
        })
    }
})
export default groupSlice.reducer;