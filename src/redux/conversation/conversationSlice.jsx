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
  async (conversationUpdateDto) => {
    const response = await conversationService.UpdateConversation(conversationUpdateDto);
    return response;
  }
);
export const UpdateConversationInfor=createAsyncThunk("conversation/UpdateConversationInfor",async(conversation)=>{
  const response=await conversationService.UpdateConversationInfor(conversation)
  return response
})
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
      state.listConversation = action.payload.sort(
        (a, b) => new Date(b.lastMessage || 0) - new Date(a.lastMessage || 0)
      );
    }),
    builder.addCase(GetAllConversationById.fulfilled, (state, action) => {
      state.conversation = action.payload;
    }),
    builder.addCase(CreateConversation.fulfilled, (state, action) => {
      state.listConversation.push(action.payload);
      state.listConversation.sort(
        (a, b) => new Date(b.lastMessage || 0) - new Date(a.lastMessage || 0)
      );
    }),
    builder.addCase(UpdateConversation.fulfilled, (state, action) => {
      const index = state.listConversation.findIndex(
        (conv) => conv.id === action.payload.id &&
        conv.userId === action.payload.userId &&
        conv.type === action.payload.type
      );
      if (index !== -1) {
        Object.assign(state.listConversation[index], {
          lastMessage: action.payload.lastMessage,
          userSend: action.payload.userSend,
          content: action.payload.content,
        });
        state.listConversation.sort(
          (a, b) => new Date(b.lastMessage || 0) - new Date(a.lastMessage || 0)
        );
      }
    });
  },
});

export default conversationSlice.reducer;
