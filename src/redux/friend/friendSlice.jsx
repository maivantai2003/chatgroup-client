import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import friendService from "../../services/friendService";
export const GetAllFriendById = createAsyncThunk(
  "friend/GetAllFriendById",
  async (userId) => {
    const response = await friendService.GetAllFriendById(userId);
    return response;
  }
);
export const GetFriendRequest = createAsyncThunk(
  "friend/GetFriendRequest",
  async (friendId) => {
    const response = await friendService.GetFriendRequest(friendId);
    return response;
  }
);
export const UpdateFriend = createAsyncThunk(
  "friend/UpdateFriend",
  async ({ id, friendDto }) => {
    const response = await friendService.UpdateFriend(id, friendDto);
    return response;
  }
);
export const AddFriend = createAsyncThunk(
  "friend/AddFriend",
  async (friendDto) => {
    const response = await friendService.AddFriend(friendDto);
    return response;
  }
);
const initialState = {
  listFriend: [],
  listFriendRequest: [],
  friend: null,
};
const friendSlice = createSlice({
  name: "friend",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(GetAllFriendById.fulfilled, (state, action) => {
      state.listFriend = action.payload;
    }),
      builder.addCase(GetFriendRequest.fulfilled, (state, action) => {
        state.listFriendRequest = action.payload;
      }),
      builder.addCase(UpdateFriend.fulfilled, (state, action) => {
        const { id, status } = action.payload;
        const index = state.listFriendRequest.findIndex(
          (friend) => friend.id === id
        );

        if (index !== -1) {
          const updatedFriend = {
            ...state.listFriendRequest[index],
            status: 1,
          };
          state.listFriendRequest.splice(index, 1);

          if (status === 1) {
            state.listFriend.push(updatedFriend);
          }
        }
      })
      // builder.addCase(AddFriend.fulfilled,(state,action)=>{
      //   state.listFriendRequest.push(action.payload)
      // })
  },
});
export default friendSlice.reducer;
