import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth/authSlice"
import friendReducer from "./friend/friendSlice"
import groupReducer from "./group/groupSlice"
import groupdetailReducer from "./groupdetail/groupdetailSlice"
import userReducer from "./user/userSlice"
import conversationReducer from "./conversation/conversationSlice"
import cloudmessageReducer from "./cloudmessage/cloudmessageSlice"
import cloudmessagefileReducer from "./cloudmessagefile/cloudmessagefileSlice"
import fileReducer from "./file/fileSlice"
import usermessageReducer from "./usermessage/usermessageSlice"
import groupmessageReducer from "./groupmessage/groupmessageSlice"
const store=configureStore({
    reducer:{
        auth:authReducer,
        friend:friendReducer,
        group:groupReducer,
        groupdetail:groupdetailReducer,
        user:userReducer,
        conversation:conversationReducer,
        cloudmessage:cloudmessageReducer,
        cloudmessagefile:cloudmessagefileReducer,
        file:fileReducer,
        usermessage:usermessageReducer,
        groupmessage:groupmessageReducer
        
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
          serializableCheck:false
        }),
      devTools: true,
})
export default store;