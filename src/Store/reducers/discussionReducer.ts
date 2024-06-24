import {createSlice} from "@reduxjs/toolkit";
import type {PayloadAction} from "@reduxjs/toolkit";

interface Discuss{
    title:string|null;
    content:string |null;
    user:string |null;
}
interface Discussion {
    id: string;
    title: string;
    content: string;
    user: string;
  }
  
interface DiscussState{
    discussions:Discussion[];
    loading:boolean;
    error:string | null;

}
const initialState:DiscussState={
  discussions:[],
  loading:false,
  error:null
}
const discussionSlice=createSlice({
    name:'discuss',
    initialState,
    reducers:{
        getDiscussion:(
        state,
        action:PayloadAction<DiscussState>
        )=>{
    return action.payload;
     state.loading=false;
     state.error=null;
   
        },
        setLoading:(
            state,
            action:PayloadAction<boolean>
        )=>{
            state.loading=action.payload
        },
        setError:(
            state,
            action:PayloadAction<string|null>
        )=>{
            state.error=action.payload;
            state.loading=false;
        },
        postDiscussion:(
            state,
            action:PayloadAction<Discussion>
        )=>{
            state.discussions.push(action.payload)

        }
    }
})
export const {  getDiscussion, setLoading,setError,postDiscussion } = discussionSlice.actions;
export default discussionSlice.reducer;