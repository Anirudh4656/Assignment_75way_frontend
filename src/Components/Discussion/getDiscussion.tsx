import React, { Key, useEffect, useState } from 'react'
import { useGetDiscussionQuery, useLikeDiscussionMutation } from '../../Services/discussapi'
import ReplySection from "./reply"
import { AppDispatch } from "../../Store/store";
import { useDispatch } from "react-redux";
import { Button, List, ListItem, ListItemText, TextField } from '@mui/material';
import { getDiscussions, likeDiscussions} from '../../Store/reducers/discussionReducer';
 interface Reply {
  content: string;
  user: string;
  id: string;
}
interface Like{
  id:string;
}
 interface Discussion {
  _id:string;
  id: string;
  title: string;
  content: string;
  user: string;
  replies: Reply[];
  likes: Like[];
}
//isAdmin to show close button and can close it 
const getDiscussion:React.FC = () => {
  const { data: discussions, error, isLoading } = useGetDiscussionQuery();
  useEffect(()=>{

    const fetchDiscussions = async ()=>{
      try{
        if(discussions){
    
          // console.log("ingetdiscuss",discussions);
          const transformedDiscussions: Discussion[] = discussions.map((discussion: any) => ({
            id: discussion._id,
            title: discussion.title,
            content: discussion.content,
            user: discussion.user,
            replies: discussion.replies.map((reply: any) => ({
              content: reply.content,
              user: reply.user,
              id: reply._id
            })),
            likes: discussion.likes.length // Assuming likes is an array of user ids
          }));

          // Dispatch the getDiscussion action with transformed discussions
          dispatch(getDiscussions({ discussions: transformedDiscussions }));
      
        }else{
          console.log("error");
        }
      }catch(error:any){

        console.log("erroris",error.message);
      }
    }
    fetchDiscussions();
   },[discussions])
   //dispatch? not 
   const dispatch=useDispatch<AppDispatch>();

   const[likeDiscussion] = useLikeDiscussionMutation() 
  


  const handleLike=async(id: string)=>{
    console.log(`in handle like  ${id}`);

   
const like= await likeDiscussion({id})
console.log(like);

  };
  const Likes=()=>{
    return (<></>);
  }
  return (
    <>
  
      <h1>getUserDiscussions</h1>
      {discussions && discussions.length > 0 ? (
        // <ul>
        //   {discussions.map((discussion: Discussion) => (
          
        //     <li key={discussion._id}>
        //       <h2>{discussion.title}</h2>
        //       <p>{discussion.content}</p>
        //       <Button size="small" color="primary"  onClick={()=>handleLike(discussion._id)}>
        //  like
        // </Button> 
        //       {/* <Button size="small" color="primary" disabled={!user?.result} onClick={handleLike}>
        //   <Likes />
        // </Button> */}
        //       <ReplySection  discussionId={discussion._id}/>
        //       {/* <p>By: {discussion.user.username}</p> */}
        //     </li>
        //   ))}
        // </ul>
        <List>
        {discussions.map((discussion:Discussion)=> (
          <ListItem key={discussion.id}>
            <ListItemText primary={discussion.title} secondary={discussion.content} />
            <Button onClick={() => handleLike(discussion.id)}>Like </Button>
            <ReplySection  discussionId={discussion._id}/>
            <List>
              {discussion.replies.map(reply => (
                <ListItem key={reply.id}>
                  <ListItemText primary={reply.content} secondary={reply.user} />
                </ListItem>
              ))}
            </List>
          </ListItem>
        ))}
      </List>
      ) : (
        <p>No discussions found.</p>
      )}
    </>
  )
}

export default getDiscussion