import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth/authSlice"
import friendReducer from "./friend/friendSlice"
import groupReducer from "./group/groupSlice"
import groupdetailReducer from "./groupdetail/groupdetailSlice"
import userReducer from "./user/userSlice"
import conversationReducer from "./conversation/conversationSlice"
const store=configureStore({
    reducer:{
        auth:authReducer,
        friend:friendReducer,
        group:groupReducer,
        groupdetail:groupdetailReducer,
        user:userReducer,
        conversation:conversationReducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
          serializableCheck:false
        }),
      devTools: true,
})
export default store;