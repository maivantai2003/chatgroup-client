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
  async (id) => {
    const response = await groupmessageService.GetAllGroupMessage(id);
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
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(AddGroupMessage.fulfilled, (state, action) => {
        state.listGroupMessage.push(action.payload);
      })
      .addCase(GetAllGroupMessage.fulfilled, (state, action) => {
        state.listGroupMessage = action.payload;
      });
  },
});
export const {addGroupMessageInstance,addGroupMessageRecevie}=groupmessageSlice.actions;
export default groupmessageSlice.reducer;
