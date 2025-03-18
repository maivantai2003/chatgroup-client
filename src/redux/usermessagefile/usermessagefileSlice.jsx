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
const initialState = {
  listUserMessageFile: [],
  usermessageFile: null,
};
const usermessagefileSlice = createSlice({
  name: "usermessagefile",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
      builder.addCase(GetAllUserMessageFile.fulfilled, (state, action) => {
        state.listUserMessageFile = action.payload;
      });
  },
});
export default usermessagefileSlice.reducer;
