import {createSlice} from "@reduxjs/toolkit";
import type {PayloadAction} from "@reduxjs/toolkit";

interface User {
    email: string;
    user:string;
    isBlocked:boolean;
   id:string;
  }

interface AuthState{
    users:User[];
    user:User[] | null;
    loading: boolean;
    error: string | null;

}
interface BlockUserPayload {
    userId: string;
    blocked:boolean;
  }
const initialState:AuthState={
    users:[],
    user:null,
    loading: false,
    error: null,
}
const adminSlice = createSlice({
    name:"admin",
    initialState,
    reducers:{ 
        setUsers:(state,
            action:PayloadAction<User[]>
        )=>{ 
            state.users=action.payload
        },
        blockUsers:(state,
            action:PayloadAction<BlockUserPayload>
        )=>{
            const {userId,blocked} = action.payload;
            // const user =state?.users.map((u:any)=>u.id===userId);
            // if(user){
            //     user._id === id ? { ...user, blocked: blocked } : user
            // }
            state.users = state.users.map((user:any) =>
                user.id === userId ? { ...user, blocked: blocked } : user
                 );
        },
        deleteUsers:(state,
            action:PayloadAction<{userId:string}>
        )=>{
            const {userId} = action.payload;
  state.users = state.users.filter(user => user.id !== userId);
           
        }
    }
})

export const {setUsers,blockUsers,deleteUsers}=adminSlice.actions;
export default adminSlice.reducer;