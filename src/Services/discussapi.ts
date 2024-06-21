import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
interface Discussion {
    id: string;
    title: string;
    content: string;
    user: string;  }

export const discussApi=createApi({
    reducerPath:"discussApi",
    baseQuery:fetchBaseQuery({baseUrl:'http://localhost:5000/api'}),
    endpoints:(builder)=>({
          getDiscussion:builder.query<Discussion,void>({
         query:()=>'/getDiscussion'
          })
    })
})

export const {
    useGetDiscussionQuery
}=discussApi;
// async onQueryStarted(arg, { dispatch, getState }) {
//     await refreshTokenIfNeeded(dispatch, getState);
// },  