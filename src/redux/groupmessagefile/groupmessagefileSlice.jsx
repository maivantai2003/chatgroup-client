import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import groupmessagefileService from "../../services/groupmessagefileService";
export const GetAllGroupMessageFile = createAsyncThunk(
  "groupmessagefile/GetAllGroupMessageFile",
  async (id) => {
    const response = await groupmessagefileService.GetAllGroupMessageFile(id)
    return response;
  }
);
export const AddGroupMessageFile = createAsyncThunk(
  "groupmessagefile/AddGroupMessageFile",
  async (groupMessageFileDto) => {
    const response = await groupmessagefileService.AddGroupMessageFile(groupMessageFileDto)
    return response;
  }
);
const initialState = {
  listGroupMessageFile: [],
  groupmessageFile: null,
};

// Tạo slice
const groupmessagefileSlice = createSlice({
  name: "groupmessagefile",
  initialState,
  reducers: {
    addGroupMessageFile:(state,action)=>{
      state.listGroupMessageFile.push(action.payload)
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(GetAllGroupMessageFile.fulfilled, (state, action) => {
        state.listGroupMessageFile = action.payload;
      }).addCase(AddGroupMessageFile.fulfilled,(state,action)=>{
        state.listGroupMessageFile.push(action.payload)
      })
  },
});
export default groupmessagefileSlice.reducer;
