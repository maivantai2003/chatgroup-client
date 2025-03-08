import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import authService from "../../services/authService";
export const registerUser=createAsyncThunk("auth/register",async(userRegister)=>{
  const respone=await authService.register(userRegister)
  return respone
})
export const login=createAsyncThunk("auth/login",async(authRequest)=>{
  const respone=await authService.login(authRequest)
  return respone
})
const initialState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  register:null,
  userLogin:null
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
    },
  },
  extraReducers:(builder)=>{
    builder.addCase(registerUser.fulfilled,(state,action)=>{
      state.register=action.payload
    }),
    builder.addCase(login.fulfilled,(state,action)=>{
      state.userLogin=action.payload
    })
  }
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
