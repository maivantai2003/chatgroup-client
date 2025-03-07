import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import cloudmessageFileService from "../../services/cloudmessagefileService";
export const GetAllCloudMessageFiles = createAsyncThunk(
  "cloudmessageFile/GetAllCloudMessageFiles",
  async () => {
    const response = await cloudmessageFileService.GetAllCloudMessageFiles();
    return response;
  }
)
export const GetCloudMessageFileById = createAsyncThunk(
  "cloudmessageFile/GetCloudMessageFileById",
  async (id) => {
    const response = await cloudmessageFileService.GetCloudMessageFileById(id);
    return response;
  }
)
export const AddCloudMessageFile = createAsyncThunk(
  "cloudmessageFile/AddCloudMessageFile",
  async (cloudMessageFileDto) => {
    const response = await cloudmessageFileService.AddCloudMessageFile(cloudMessageFileDto);
    return response;
  }
)
export const UpdateCloudMessageFile = createAsyncThunk(
  "cloudmessageFile/UpdateCloudMessageFile",
  async ({ id, cloudMessageFileDto }) => {
    const response = await cloudmessageFileService.UpdateCloudMessageFile(id, cloudMessageFileDto);
    return response;
  }
);
export const DeleteCloudMessageFile = createAsyncThunk(
  "cloudmessageFile/DeleteCloudMessageFile",
  async (id) => {
    const response = await cloudmessageFileService.DeleteCloudMessageFile(id);
    return response;
  }
);

const initialState = {
  listCloudMessageFiles: [],
  cloudMessageFile: null,
  loading: false,
  error: null,
};

const cloudmessageFileSlice = createSlice({
  name: "cloudmessageFile",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(GetAllCloudMessageFiles.pending, (state) => {
        state.loading = true;
      })
      .addCase(GetAllCloudMessageFiles.fulfilled, (state, action) => {
        state.loading = false;
        state.listCloudMessageFiles = action.payload;
      })
      .addCase(GetAllCloudMessageFiles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(GetCloudMessageFileById.fulfilled, (state, action) => {
        state.cloudMessageFile = action.payload;
      })
      .addCase(AddCloudMessageFile.fulfilled, (state, action) => {
        state.listCloudMessageFiles.push(action.payload);
      })
      .addCase(UpdateCloudMessageFile.fulfilled, (state, action) => {
        const index = state.listCloudMessageFiles.findIndex(file => file.id === action.payload.id);
        if (index !== -1) {
          state.listCloudMessageFiles[index] = action.payload;
        }
      })
      .addCase(DeleteCloudMessageFile.fulfilled, (state, action) => {
        state.listCloudMessageFiles = state.listCloudMessageFiles.filter(file => file.id !== action.meta.arg);
      });
  },
});

export default cloudmessageFileSlice.reducer;
