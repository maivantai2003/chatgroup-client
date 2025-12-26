import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import groupmessageService from "../../services/groupmessageService";
export const AddGroupMessage = createAsyncThunk(
  "groupmessage/AddGroupMessage",
  async (groupMessageDto) => {
    const response = await groupmessageService.AddGroupMessage(groupMessageDto);
    return response;
  }
);
export const GetAllGroupMessage = createAsyncThunk(
  "groupmessage/GetAllGroupMessage",
  async (id,lastMessageDate,pageSize) => {
    const response = await groupmessageService.GetAllGroupMessage(id,lastMessageDate,pageSize);
    return response;
  }
);
const initialState = {
  listGroupMessage: [],
  groupmessage: null,
};

// Tạo slice
const groupmessageSlice = createSlice({
  name: "groupmessage",
  initialState,
  reducers: {
    addGroupMessageInstance:(state,action)=>{
      state.listGroupMessage.push(action.payload)
    },
    addGroupMessageRecevie:(state,action)=>{
      state.listGroupMessage.push(action.payload)
    },
    addFilesToGroupMessage:(state,action)=>{
      const { groupedMessageId, files } = action.payload;
      const message = state.listGroupMessage.find(
        (msg) => msg.groupedMessageId === groupedMessageId
      );
      if (message) {
        message.files = message.files ? [...message.files, ...files] : [...files];
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(AddGroupMessage.fulfilled, (state, action) => {
        state.listGroupMessage.push(action.payload);
      })
      .addCase(GetAllGroupMessage.fulfilled, (state, action) => {
        //state.listGroupMessage = action.payload;
        if(action.meta.arg.lastMessageDate){
          state.listGroupMessage = [...action.payload, ...state.listGroupMessage];
        }else{
          state.listGroupMessage = action.payload;
        }
      });
  },
});
export const {addGroupMessageInstance,addGroupMessageRecevie,addFilesToGroupMessage}=groupmessageSlice.actions;
export default groupmessageSlice.reducer;
