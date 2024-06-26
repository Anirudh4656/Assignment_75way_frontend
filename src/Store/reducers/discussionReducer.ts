import {createSlice} from "@reduxjs/toolkit";
import type {PayloadAction} from "@reduxjs/toolkit";

 interface Reply {
    content: string;
    user: string;
    id:string;
 }
 interface Like{
    id:string;
 }
interface Discussion {
    id: string;
    title: string;
    content: string;
    user: string;
    replies:Reply[];
    likes:Like[];
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
        getDiscussions:(
        state,
        action:PayloadAction<{discussions:Discussion[],userId?:string}>
        )=>{
            const { discussions, userId } = action.payload;
            console.log("in createslice",userId);
            console.log("in createslice",discussions);
            if (userId) {
                state.discussions = discussions.filter(discussion => discussion.user === userId);
              } else {
                state.discussions = discussions;
              }
        
              state.loading = false;
              state.error = null;
   
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

        },
        likeDiscussions:(
            state,
            action:PayloadAction<{discussionId:string,userId:string}>
        )=>{
            const {discussionId,userId}=action.payload;
            const discussion= state.discussions.find((discussion)=>discussion.id===discussionId)
         
        },
        replyDiscussion:(
            state,
            action:PayloadAction<{discussionId:string,content:Reply}>
        )=>{
            const {discussionId,content}=action.payload;
            const discussion= state.discussions.find((discussion)=>discussion.id===discussionId);
            if (discussion) {
                discussion.replies.push(content);
              }
        }
    }
})
export const {  getDiscussions, setLoading,setError,postDiscussion,likeDiscussions,replyDiscussion } = discussionSlice.actions;
export default discussionSlice.reducer;