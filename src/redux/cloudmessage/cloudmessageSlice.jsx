import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import cloudmessageService from "../../services/cloudmessageService";

export const CreateCloudMessage = createAsyncThunk(
  "cloudmessage/CreateCloudMessage",
  async (cloudMessageDto) => {
    const response = await cloudmessageService.CreateCloudMessage(cloudMessageDto)
    return response;
  }
);
export const GetCloudMessagesById=createAsyncThunk(
  "cloudmessage/GetCloudMessagesById",
  async (id)=>{
    const response=await cloudmessageService.GetCloudMessagesById(id)
    return response
  }
)
;

const initialState = {
  listCloudMessage: [],
  cloudmessage: null,
};

const cloudmessageSlice = createSlice({
  name: "cloudmessage",
  initialState,
  reducers: {
    addCloudMessage:(state,action)=>{
      state.listCloudMessage.push(action.payload);
    },
    addFilesToCloudMessage: (state, action) => {
      const { cloudMessageId, files } = action.payload;
      const message = state.listCloudMessage.find(
        (msg) => msg.cloudMessageId === cloudMessageId
      );
      if (message) {
        message.files = message.files ? [...message.files, ...files] : [...files];
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(CreateCloudMessage.fulfilled, (state, action) => {
      state.listCloudMessage.push(action.payload);
    }),
    builder.addCase(GetCloudMessagesById.fulfilled, (state, action) => {
      state.listCloudMessage=action.payload
    })
  },
});
export const {addCloudMessage,addFilesToCloudMessage}=cloudmessageSlice.actions;
export default cloudmessageSlice.reducer;
