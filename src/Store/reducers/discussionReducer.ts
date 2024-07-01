import {createSlice} from "@reduxjs/toolkit";
import type {PayloadAction} from "@reduxjs/toolkit";

 interface Reply {
    content: string;
    user: string;
    id:string;
 }
 interface Like{
  _id:string;
  id:string;
  user:string;
}
interface Discussion {
    id: string;
    title: string;
    content: string;
    user: string;
    replies:Reply[];
    likes:Like[];
    isClosed:boolean
  }
  
interface DiscussState{
    discussions:Discussion[];
    loading:boolean;
    error:string | null;
    filterUserId:string | null

}
const initialState:DiscussState={
  discussions:[],
  loading:false,
  error:null,
  filterUserId:null
}
const discussionSlice=createSlice({
    name:'discuss',
    initialState,
    reducers:{
        getDiscussions:(
        state,
        action:PayloadAction<{discussions:Discussion[]}>
        )=>{
            const { discussions} = action.payload;
           
                state.discussions = discussions;
        
              state.loading = false;
              state.error = null;
              state.filterUserId=null;
   
        },
        setFilterUserId: (state, action: PayloadAction<string | null>) => {
            console.log("action payload",action.payload);
            state.filterUserId = action.payload;
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

            return {
                ...state,
                discussions: [...state.discussions, action.payload],
              };

        },
        likeDiscussions:(
            state,
            action:PayloadAction<{discussionId:string,userId:string,action: 'like' | 'dislike'}>
        )=>{

          const { discussionId, userId, action: likeAction } = action.payload;
            console.log("in dispatch reply discussion",discussionId);
            const discussion = state.discussions.find(d => d.id === discussionId);
  
            if (discussion) {
              if (likeAction === 'like') {
                discussion.likes.push({
                  user: userId,
                  _id: "",
                  id: ""
                });
              } else if (likeAction === 'dislike') {
                discussion.likes = discussion.likes.filter(like => like.user !== userId);
              }
            }
      
        },
        closeDiscussions:(
          state,
          action:PayloadAction<{id:string}>
      )=>{

          const { id} = action.payload;
          console.log("in dispatch reply discussion",id);
          const discussion = state.discussions.find(d => d.id === id);
          if (discussion) {
            console.log("indiscussion",discussion)
            //shi krna h
            // discussion.isClosed = true;
            } 
          },
        replyDiscussion:(
            state,
            action:PayloadAction<{discussionId:string,content:Reply}>
        )=>{
            const {discussionId,content}=action.payload;
            console.log("in dispatch reply discussion",discussionId,"f",content);
            const discussio= state.discussions.find((discussion:Discussion)=>discussion.id===discussionId);
         console.log("discussio",discussio);
            if(discussio) {
             
                discussio.replies = [...discussio.replies, content];

              }
        }
    }
})
export const {  getDiscussions,  closeDiscussions,  setFilterUserId,setLoading,setError,postDiscussion,likeDiscussions,replyDiscussion } = discussionSlice.actions;
export default discussionSlice.reducer;