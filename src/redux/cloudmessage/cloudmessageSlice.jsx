import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import cloudmessageService from "../../services/cloudmessageService";

export const CreateCloudMessage = createAsyncThunk(
  "cloudmessage/CreateCloudMessage",
  async (cloudMessageDto) => {
    const response = await cloudmessageService.CreateCloudMessage(cloudMessageDto)
    return response;
  }
);
;

const initialState = {
  listCloudMessage: [],
  cloudmessage: null,
};

const cloudmessageSlice = createSlice({
  name: "cloudmessage",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(CreateCloudMessage.fulfilled, (state, action) => {
      state.listCloudMessage.push(action.payload);
    })
  },
});

export default cloudmessageSlice.reducer;
