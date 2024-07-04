import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
interface Discussion {
    [x: string]: any;
    id: string;
    title: string;
    content: string;
    user: string; 
  isClosed:boolean };
    const token= localStorage.getItem('token');
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
                body:{title,content},
                headers: {
                  'Authorization': `Bearer ${token}`
              }

            })
          }),
          likeDiscussion:builder.mutation<Discussion,{id:string}>({
            query:({id})=>({
                url:`/likeDiscussion/${id}`,
                method:'PATCH',
                body:{id},
                headers: {
                  'Authorization': `Bearer ${token}`
              }

            })
          }),
          addReplyLike:builder.mutation<Discussion,{id:string}>({
            query:({id})=>({
              url:`/likeReply/${id}`,
              method:'PATCH',
              body:{id},
              headers: {
                'Authorization': `Bearer ${token}`
            }
            })
          }),
          addReply:builder.mutation<Discussion,{discussionId:string,content:string}>({
            query:({discussionId,content })=>({
                url:`/replyDiscussion/${discussionId}`,
                method:"PATCH",
                body:{discussionId,content},
                headers: {
                  'Authorization': `Bearer ${token}`
              }
            }) 
          }),
          addNestedReply:builder.mutation<Discussion,{content:string,replyId:string,discussionId:string}>({
            query:({content,replyId,discussionId})=>({
              url:'/nestedReply',
              method:"PATCH",
              body:{discussionId,content,replyId},
              headers: {
                'Authorization': `Bearer ${token}`
            }
          }) 

          })
    })
})

export const {
    useGetDiscussionQuery,
    useCreateDiscussionMutation,
    useLikeDiscussionMutation,
    useAddReplyMutation,
    useAddNestedReplyMutation,
    useAddReplyLikeMutation
}=discussApi;
// async onQueryStarted(arg, { dispatch, getState }) {
//     await refreshTokenIfNeeded(dispatch, getState);
// },  
// localStorage.setItem('profile', JSON.stringify({ ...action?.data }));