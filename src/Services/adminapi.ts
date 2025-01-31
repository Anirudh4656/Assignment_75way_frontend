import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
interface User {
    map(arg0: (getAllUser: User) => import("react/jsx-runtime").JSX.Element): import("react").ReactNode;
    length: number;
    data: any;
    accessToken(accessToken: any): unknown;
    _id: string;
    user: string;
    email: string;
    password:string;
    username:string;
    isAdmin: boolean;
    blocked: boolean;
  }
  interface admin {
    username: string;
    role:"ADMIN"|"USER";
    email: string;
    blocked: boolean;
    id: boolean
  }

          
  interface BlockUserPayload {
    userId: string;
  }
  const token= localStorage.getItem('token');
export const adminApi=createApi({
    reducerPath:"adminApi",
    baseQuery:fetchBaseQuery({baseUrl:'http://localhost:5000/api/admin'}),
    endpoints:(builder)=>({
          getAllUser:builder.query<User[],void>({
         query:()=>({
          url:'/users',
          headers: {
            'Authorization': `Bearer ${token}`
        }  })
          }) ,

          blockUser:builder.mutation<User,BlockUserPayload>({
            query:({userId})=>({
                  url:`/users/block/${userId}`,
                method: 'PUT',
                headers: {
                  'Authorization': `Bearer ${token}`
              } 
            })
              
          }),
          deleteUser:builder.mutation<User,BlockUserPayload>({
            query:({userId})=>({
                  url:`/users/delete/${userId}`,
                method: 'DELETE',
                headers: {
                  'Authorization': `Bearer ${token}`
              } 
            })
              
          }),
          close:builder.mutation<User,{id:string}>({
            query:({id})=>({
              url:`/discussions/close/${id}`,
            method: 'PATCH',
            headers: {
              'Authorization': `Bearer ${token}`
          } 
        })
          })
            
    })
})

export  const { useGetAllUserQuery,useBlockUserMutation,useDeleteUserMutation,useCloseMutation} = adminApi;