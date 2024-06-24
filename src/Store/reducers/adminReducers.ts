import {createSlice} from "@reduxjs/toolkit";
import type {PayloadAction} from "@reduxjs/toolkit";

interface User {
    email: string;
    user:string;
    isBlocked:boolean;
 
  }

interface AuthState{
    users:User[];
    user:User[] | null;
    loading: boolean;
    error: string | null;

}
interface BlockUserPayload {
    userId: string;
  }
const initialState:AuthState={
    users:[],
    user:null,
    loading: false,
    error: null,
}
const adminSlice = createSlice({
    name:"auth",
    initialState,
    reducers:{ 
        getAllUsers:(state,
            action:PayloadAction<User[]>
        )=>{
            state.user=action.payload
        },
        blockUsers:(state,
            action:PayloadAction<BlockUserPayload>
        )=>{
            const {userId} = action.payload;
            const user =state?.users.find((u:any)=>u.id===userId);
            if(user){
                user.isBlocked=true;
            }
        }
    }
})

export const {getAllUsers,blockUsers}=adminSlice.actions;
export default adminSlice.reducer;