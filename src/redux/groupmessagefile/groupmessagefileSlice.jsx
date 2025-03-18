import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import groupmessagefileService from "../../services/groupmessagefileService";
export const GetAllGroupMessageFile = createAsyncThunk(
  "groupmessagefile/GetAllGroupMessageFile",
  async (id) => {
    const response = await groupmessagefileService.GetAllGroupMessageFile(id)
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
  },
  extraReducers: (builder) => {
    builder
      .addCase(GetAllGroupMessageFile.fulfilled, (state, action) => {
        state.listGroupMessageFile = action.payload;
      });
  },
});
export default groupmessagefileSlice.reducer;
