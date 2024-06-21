import { configureStore } from "@reduxjs/toolkit";
import authReducers  from "./reducers/authReducers";
import { userApi } from "../Services/api";
import discussionReducer from "./reducers/discussionReducer";
import { discussApi } from "../Services/discussapi";
export const store= configureStore({
    reducer:{
        auth:authReducers,
        [userApi.reducerPath]:userApi.reducer,
        discuss:discussionReducer,
        [discussApi.reducerPath]:discussApi.reducer,
    },
    //return
    middleware:(getDefaultMiddleware)=>getDefaultMiddleware().concat(userApi.middleware,discussApi.middleware)
})
export type RootState= ReturnType<typeof store.getState>;
export type AppDispatch= typeof store.dispatch;


// Optional: Setting up listeners if you're using RTK Query's cache invalidation or other features
// import { setupListeners } from '@reduxjs/toolkit/query';
// setupListeners(store.dispatch);