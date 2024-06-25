import React, { ChangeEvent, FormEvent, useState } from "react";
import { useCreateDiscussionMutation} from '../../Services/discussapi'
import { AppDispatch } from "../../Store/store";
import { useDispatch } from "react-redux";
import {postDiscussion} from "../../Store/reducers/discussionReducer";
import { Button, Paper, TextField } from "@mui/material";
interface FormState{
    title:string;
    content:string;
}
const initialState: FormState = { title:"",content:""};
const createDiscussion:React.FC=()=>{
// const user = JSON.parse(localStorage.getItem('token'));

const [postData, setPostData] = useState<FormState>(initialState);
const dispatch=useDispatch<AppDispatch>();
const[ createDiscussion]=useCreateDiscussionMutation();
const handleSubmit = async (e:FormEvent<HTMLFormElement>) => {
    e.preventDefault();
const newDiscussion = await createDiscussion(postData);
dispatch(postDiscussion({
    ...newDiscussion,
    id: "",
    title: "",
    content: "",
    user: ""
}))
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
      
         <Paper  elevation={6}>
   <form autoComplete="off" noValidate  onSubmit={handleSubmit}>
        <TextField name="title" variant="outlined" label="Title" fullWidth value={postData.title} onChange={(e) => setPostData({ ...postData, title: e.target.value })} />
        <TextField name="content" variant="outlined" label="Message" fullWidth multiline rows={4} value={postData.content} onChange={(e) => setPostData({ ...postData, content: e.target.value })} />
      
    
       <Button  variant="contained" color="primary" size="large" type="submit" fullWidth>Submit</Button>
    //     {/* <Button variant="contained" color="secondary" size="small" onClick={clear} fullWidth>Clear</Button> */}
  </form>
       </Paper>

        
    )
}

export default createDiscussion;