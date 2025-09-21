import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { newPaper } from "../../services/newPaper";

export const GetNewPapers = createAsyncThunk("newpaper/GetNewPapers", async () => {
  const response = await newPaper.GetNewPaper();
  return response;
});

const initialState = {
  listNewPaper: [],
};
const newPaperSlice = createSlice({
  name: "newpaper",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(GetNewPapers.fulfilled, (state, action) => {
      state.listNewPaper = action.payload;
    })
  }
})
export default newPaperSlice.reducer;