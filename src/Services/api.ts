import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
interface User {
    _id: string;
    user: string;
    email: string;
    password:string;
    isAdmin: boolean;
    blocked: boolean;
  }

export const userApi= createApi({
    reducerPath:"api",
    baseQuery:fetchBaseQuery(
        {baseUrl: 'http://localhost:5000/api' }),
        endpoints:(builder)=>({
            loginUser: builder.mutation<User, { email: string; password: string }>({
                query: ({ email, password }) => ({
                  url: '/signin',
                  method: 'POST',
                  body: { email, password },
                }),
              }),
              registerUser: builder.mutation<User, { username: string; email: string; password: string }>({
                query: ({ username, email, password }) => ({
                  url: '/signup',
                  method: 'POST',
                  body: { username, email, password },
                })
              }),
        })
    
})






export const { 

    useLoginUserMutation,
    useRegisterUserMutation,

  } = userApi;