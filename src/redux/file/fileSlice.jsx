import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import fileService from "../../services/fileService";
export const CreateFile=createAsyncThunk("file/CreateFile",async(fileDto)=>{
    const response=await fileService.CreateFile(fileDto)
    return response
})
export const DeleteFile=createAsyncThunk("file/DeleteFile",async(id)=>{
    const response=await fileService.DeleteFile(id)
    return response
})
const initialState={
    listFile:[],
    listFileUser:[],
    listFileGroup:[],
    listFileCloud:[],
    file:null
}
const fileSlice=createSlice({
    name:"file",
    initialState,
    reducers:{},
    extraReducers:(builder)=>{
        builder.addCase(CreateFile.fulfilled,(state,action)=>{
            state.listFile=action.payload
        }),
        builder.addCase(DeleteFile.fulfilled,(state,action)=>{
            state.listFile.pop(action.payload)
        })
    }
})
export default fileSlice.reducer;