import {createSlice} from "@reduxjs/toolkit";
import type {PayloadAction} from "@reduxjs/toolkit";

interface User {
    id: string;
    username:string,
    email:string;
    role:"ADMIN"|"USER";
    isBlocked:boolean;
  }

interface AuthState{
    users:User[];
    loading: boolean;
    error: string | null;

}
interface BlockUserPayload {
    userId: string;
    isBlocked:boolean;
  }
const initialState:AuthState={
    users:[],
    loading: false,
    error: null,
}

const adminSlice = createSlice({
    name:"admin",
    initialState,
    reducers:{ 
        setUsers:(state,
            action:PayloadAction<{user:User[]}>
        )=>{ 
            const { user} = action.payload;
            console.log("in setuser reducer",user)
            state.users=user
        },
        blockUsers:(state,
            action:PayloadAction<BlockUserPayload>
        )=>{
            const {userId,isBlocked} = action.payload;
            // const user =state?.users.map((u:any)=>u.id===userId);
            // if(user){
            //     user._id === id ? { ...user, blocked: blocked } : user
            // }
            state.users = state.users.map((user:any) =>
                user.id === userId ? { ...user, isBlocked: isBlocked } : user
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