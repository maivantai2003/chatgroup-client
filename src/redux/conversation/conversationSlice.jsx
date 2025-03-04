import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import conversationService from "../../services/conversationService";

export const GetAllConversation = createAsyncThunk(
  "conversation/GetAllConversation",
  async (id) => {
    const response = await conversationService.GetAllConversation(id);
    return response;
  }
);

export const GetAllConversationById = createAsyncThunk(
  "conversation/GetAllConversationById",
  async (id) => {
    const response = await conversationService.GetAllConversationById(id);
    return response;
  }
);

export const CreateConversation = createAsyncThunk(
  "conversation/CreateConversation",
  async (conversationDto) => {
    const response = await conversationService.CreateConversation(conversationDto);
    return response;
  }
);

export const UpdateConversation = createAsyncThunk(
  "conversation/UpdateConversation",
  async ({ id, conversationDto }) => {
    const response = await conversationService.UpdateConversation(id, conversationDto);
    return response;
  }
);

const initialState = {
  listConversation: [],
  conversation: null,
};

const conversationSlice = createSlice({
  name: "conversation",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(GetAllConversation.fulfilled, (state, action) => {
      state.listConversation = action.payload;
    }),
    builder.addCase(GetAllConversationById.fulfilled, (state, action) => {
      state.conversation = action.payload;
    }),
    builder.addCase(CreateConversation.fulfilled, (state, action) => {
      state.listConversation.push(action.payload);
    }),
    builder.addCase(UpdateConversation.fulfilled, (state, action) => {
      const index = state.listConversation.findIndex(
        (conv) => conv.conversationId === action.payload.conversationId
      );
      if (index !== -1) {
        state.listConversation[index] = action.payload;
      }
    });
  },
});

export default conversationSlice.reducer;
