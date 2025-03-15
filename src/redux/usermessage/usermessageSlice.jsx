import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import usermessageService from "../../services/usermessageService";
export const CreateUserMessage = createAsyncThunk(
  "usermessage/CreateUserMessage",
  async (userMessageDto) => {
    const response = await usermessageService.CreateUserMessage(userMessageDto);
    return response;
  }
);
export const GetAllUserMessage = createAsyncThunk(
  "usermessage/GetAllUserMessage",
  async ({ senderId, receiverId }) => {
    const response = await usermessageService.GetAllUserMessage(
      senderId,
      receiverId
    );
    return response;
  }
);
const initialState = {
  listUserMessage: [],
  usermessage: null,
};
const usermessageSlice = createSlice({
  name: "usermessage",
  initialState,
  reducers: {
    addUserMessage: (state, action) => {
      state.listUserMessage.push(action.payload);
    },
    receiveUserMessage: (state, action) => {
      state.listUserMessage.push(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(CreateUserMessage.fulfilled, (state, action) => {
      state.listUserMessage.push(action.payload);
    }),
      builder.addCase(GetAllUserMessage.fulfilled, (state, action) => {
        state.listUserMessage = action.payload;
      });
  },
});
export const {addUserMessage,receiveUserMessage}=usermessageSlice.actions
export default usermessageSlice.reducer;
