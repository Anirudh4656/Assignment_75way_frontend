import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
interface Discussion {
    [x: string]: any;
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
          }),
          createDiscussion:builder.mutation<Discussion,{title:string,content:string}>({
            query:({title ,content})=>({
                url:'/createDiscussion',
                method:'POST',
                body:{title,content}

            })
          })
    })
})

export const {
    useGetDiscussionQuery,
    useCreateDiscussionMutation
}=discussApi;
// async onQueryStarted(arg, { dispatch, getState }) {
//     await refreshTokenIfNeeded(dispatch, getState);
// },  
// localStorage.setItem('profile', JSON.stringify({ ...action?.data }));