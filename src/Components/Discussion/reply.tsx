import React, { FormEvent, useState } from "react"
import { replyDiscussion} from '../../Store/reducers/discussionReducer';
import { useAddReplyMutation } from '../../Services/discussapi'
import { AppDispatch, RootState, useAppSelector } from "../../Store/store";
import { useDispatch, useSelector } from "react-redux";
import { Button, TextField } from "@mui/material";
interface LikeButtonProps {
    discussionId: string;
  }
  interface Reply {
    content: string;
    user: string;
    id:string;
 }
 
  
 
  
const Reply:React.FC<LikeButtonProps>=({discussionId})=>{
const [content ,setContent] =useState<string>("")
// const [replies,setReplies]=useState<string>()
const [addReply]=useAddReplyMutation();
const dispatch=useDispatch<AppDispatch>();

//state->discuss->discussions(find method )
const discussions = useAppSelector((state: RootState) => state.discuss.discussions);
// const discussion = useAppSelector((state: RootState) =>
//     state.discuss.discussions.find(discussion => discussion.id === discussionId)
//   );

//   console.log("in discussion use selector",discussions);
    const handleSubmit=async(e:FormEvent<HTMLFormElement>)=>{
        e.preventDefault();

        try{
            //error handling
            const response =await addReply({content,discussionId});
            if (response.data) {
                // Accessing fields within response.data
                const reply: Reply = {
                  content: response.data.content,
                  user: response.data.user,
                  id: response.data._id
                };

                console.log("reply",reply);
                     dispatch(replyDiscussion({discussionId,content:reply}));
            }else {
                console.error('Response data is undefined', response.error);
              }

        }catch(error){console.log("error  is",error)}
    }
    return (
    <>
     <form autoComplete="off" noValidate  onSubmit={handleSubmit}>
        <TextField name="content" variant="outlined" label="reply" fullWidth value={content} onChange={(e)=>setContent(e.target.value)} />
       <Button  variant="contained" color="primary" size="large" type="submit" fullWidth>Submit</Button>
    //     {/* <Button variant="contained" color="secondary" size="small" onClick={clear} fullWidth>Clear</Button> */}
  </form>
     </>);
}

export default Reply;