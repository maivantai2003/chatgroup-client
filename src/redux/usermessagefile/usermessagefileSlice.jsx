import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import usermessagefileService from "../../services/usermessagefileService";
export const GetAllUserMessageFile = createAsyncThunk(
  "usermessagefile/GetAllUserMessageFile",
  async ({ senderId, receiverId }) => {
    const response = await usermessagefileService.GetAllUserMessageFile(
      senderId,
      receiverId
    );
    return response;
  }
);
export const AddUserMessageFile = createAsyncThunk(
  "usermessagefile/AddUserMessageFile",
  async (userMessageFileDto) => {
    const response = await usermessagefileService.AddUserMessageFile(userMessageFileDto)
    return response;
  }
);
const initialState = {
  listUserMessageFile: [],
  usermessageFile: null,
};
const usermessagefileSlice = createSlice({
  name: "usermessagefile",
  initialState,
  reducers: {
    addUserMessageFile:(state,action)=>{
      state.listUserMessageFile.push(action.payload)
    },
    addMultipleUserMessageFiles: (state, action) => {
      state.listUserMessageFile = [...state.listUserMessageFile, ...action.payload];
    },
  },
  extraReducers: (builder) => {
      builder.addCase(GetAllUserMessageFile.fulfilled, (state, action) => {
        state.listUserMessageFile = action.payload;
      }).addCase(AddUserMessageFile.fulfilled,(state,action)=>{
        state.listUserMessageFile.push(action.payload)
      })
  },
});
export const {addUserMessageFile,addMultipleUserMessageFiles}=usermessagefileSlice.actions;
export default usermessagefileSlice.reducer;
