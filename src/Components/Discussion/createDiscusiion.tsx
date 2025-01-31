import React, {FormEvent, useState } from "react";
import { useCreateDiscussionMutation} from '../../Services/discussapi'
import { AppDispatch, RootState, useAppSelector } from "../../Store/store";
import { useDispatch, useSelector } from "react-redux";
import {postDiscussion} from "../../Store/reducers/discussionReducer";
import { Button, Paper, TextField } from "@mui/material";
interface FormState{
    title:string;
    content:string;
}
interface Like{
    _id:string;
    id:string;
    user:string;
  }
  interface Reply {
    id: string;
    content: string;
    user: string;
    name:string;
    replies: Reply[];
    likes: Like[];
  }
interface Discussion {
    id: string;
    title: string;
    content: string;
    name:string;
    user: string;
    likes:Like[];
    replies:Reply[];
    isClosed:boolean
  }
  
const initialState: FormState = { title:"",content:""};
const createDiscussion:React.FC=()=>{
const [postData, setPostData] = useState<FormState>(initialState);
const dispatch=useDispatch<AppDispatch>();
const[ createDiscussion]=useCreateDiscussionMutation();
const discussion = useAppSelector((state: RootState) => state.discuss.discussions);
console.log("in new discussionsdsdssd",discussion)
const handleSubmit = async (e:FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try{
         const newDiscussion = await createDiscussion(postData);
if (newDiscussion.data) {
    // Accessing fields within response.data
    console.log("in new discussion",newDiscussion)
    const newDiscuss: Discussion = {
        content: newDiscussion.data.data.content,
        id: newDiscussion.data.data._id,
        title: newDiscussion.data.data.title,
        user: newDiscussion.data.data.user,
        likes:newDiscussion.data.data.likes,
        name:newDiscussion.data.data.name,
        replies:newDiscussion.data.data.replies,
        isClosed:newDiscussion.data.data.isClosed
    };
    console.log("in new discussion",newDiscussion)
dispatch(postDiscussion(newDiscuss));
setPostData(initialState)
   

    }  } catch(error){console.log(error)}

// console.log(newDiscussion.data);
//userid ?
// dispatch(postDiscussion(newDiscussion));
    // dispatch(postDiscussion(newDiscussion));
//     if (currentId === 0) {
//       dispatch(createPost({ ...postData, name: user?.result?.name }, history));
//       clear();
//     } else {
//       dispatch(updatePost(currentId, { ...postData, name: user?.result?.name }));
//       clear();
//     }
//   };
}
    return(
      
         <Paper style={{   margin: '10px 0'}} elevation={6}>
         <form style={{ display: 'flex',flexWrap: 'wrap', justifyContent: 'center'}}autoComplete="off" noValidate  onSubmit={handleSubmit}>
        <TextField name="title" variant="outlined" label="Title" fullWidth value={postData.title} onChange={(e) => setPostData({ ...postData, title: e.target.value })} />
        <TextField name="content" variant="outlined" label="Message" fullWidth multiline rows={4} value={postData.content} onChange={(e) => setPostData({ ...postData, content: e.target.value })} />
      
    
       <Button  variant="contained" color="primary" size="large" type="submit" fullWidth>Submit</Button>
    //     {/* <Button variant="contained" color="secondary" size="small" onClick={clear} fullWidth>Clear</Button> */}
  </form>
       </Paper>

        
    )
}

export default createDiscussion;