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
    const response = await conversationService.CreateConversation(
      conversationDto
    );
    return response;
  }
);

export const UpdateConversation = createAsyncThunk(
  "conversation/UpdateConversation",
  async (conversationUpdateDto) => {
    const response = await conversationService.UpdateConversation(
      conversationUpdateDto
    );
    return response;
  }
);
export const UpdateConversationInfor = createAsyncThunk(
  "conversation/UpdateConversationInfor",
  async (conversation) => {
    const response = await conversationService.UpdateConversationInfor(
      conversation
    );
    return response;
  }
);
export const UpdateConversationGroup = createAsyncThunk(
  "conversation/UpdateConversationGroup",
  async (conversationUpdateGroupDto) => {
    const response = await conversationService.UpdateConversationGroup(
      conversationUpdateGroupDto
    );
    return response;
  }
);
const sortConversations = (list) =>
  [...list].sort(
    (a, b) => new Date(b.lastMessage || 0) - new Date(a.lastMessage || 0)
  );
const initialState = {
  listConversation: [],
  conversation: null,
};

const conversationSlice = createSlice({
  name: "conversation",
  initialState,
  reducers: {
    updateConversationInState: (state, action) => {
      const { id, userId, type, lastMessage, userSend, content } =
        action.payload;
      const index = state.listConversation.findIndex(
        (conv) => conv.id === id && conv.userId === userId && conv.type === type
      );
      if (index !== -1) {
        Object.assign(state.listConversation[index], {
          lastMessage: lastMessage,
          userSend: userSend,
          content: content,
        });
        const updatedConversation = state.listConversation.splice(index, 1)[0];
        state.listConversation.unshift(updatedConversation);
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(GetAllConversation.fulfilled, (state, action) => {
      state.listConversation = sortConversations(action.payload);
    }),
      builder.addCase(GetAllConversationById.fulfilled, (state, action) => {
        state.conversation = action.payload;
      }),
      builder.addCase(CreateConversation.fulfilled, (state, action) => {
        state.listConversation.push(action.payload);
        state.listConversation = sortConversations(state.listConversation);
      }),
      builder.addCase(UpdateConversation.fulfilled, (state, action) => {
        const index = state.listConversation.findIndex(
          (conv) =>
            conv.id === action.payload.id &&
            conv.userId === action.payload.userId &&
            conv.type === action.payload.type
        );
        if (index !== -1) {
          Object.assign(state.listConversation[index], {
            lastMessage: action.payload.lastMessage,
            userSend: action.payload.userSend,
            content: action.payload.content,
          });
          state.listConversation = sortConversations(state.listConversation);
        }
      }),
      builder.addCase(UpdateConversationGroup.fulfilled, (state, action) => {
        const updatedConversations = new Map(
          action.payload.map((conv) => [`${conv.id}-${conv.type}`, conv])
        );
        state.listConversation = state.listConversation.map((conv) =>
          updatedConversations.has(`${conv.id}-${conv.type}`)
            ? {
                ...conv,
                userSend: updatedConversations.get(`${conv.id}-${conv.type}`)
                  .userSend,
                lastMessage: new Date().toISOString(),
              }
            : conv
        );
        state.listConversation = sortConversations(state.listConversation);
      }),
      builder.addCase(UpdateConversationInfor.fulfilled, (state, action) => {});
  },
});
export const { updateConversationInState } = conversationSlice.actions;
export default conversationSlice.reducer;
