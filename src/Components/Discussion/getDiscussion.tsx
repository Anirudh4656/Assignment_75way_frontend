import React, { Key, useEffect, useState } from 'react'
import { useGetDiscussionQuery, useLikeDiscussionMutation } from '../../Services/discussapi'
import Reply from "./reply"
import { AppDispatch } from "../../Store/store";
import { useDispatch } from "react-redux";
import { Button } from '@mui/material';
import { likeDiscussions} from '../../Store/reducers/discussionReducer';

interface Discussion {
  _id: string;
  id: string;
  title: string;
  content: string;
  user: string;
  // Add other fields as necessary
}
const getDiscussion:React.FC = () => {
  const { data: discussions, error, isLoading } = useGetDiscussionQuery();
  useEffect(()=>{

    const fetchDiscussions = async ()=>{
      try{
        if(discussions){
  
          console.log("ingetdiscuss",discussions);
          // dispatch(getDiscussion(discussions));
        }else{
          console.log("error");
        }
      }catch(error:any){
        console.log("ingetdiscuss");
        console.log("erroris",error.message);
      }
    }
    fetchDiscussions();
   },[])
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
        <ul>
          {discussions.map((discussion: Discussion) => (
          
            <li key={discussion._id}>
              <h2>{discussion.title}</h2>
              <p>{discussion.content}</p>
              <Button size="small" color="primary"  onClick={()=>handleLike(discussion._id)}>
         like
        </Button> 
              {/* <Button size="small" color="primary" disabled={!user?.result} onClick={handleLike}>
          <Likes />
        </Button> */}
              <Reply  discussionId={discussion._id}/>
              {/* <p>By: {discussion.user.username}</p> */}
            </li>
          ))}
        </ul>
      ) : (
        <p>No discussions found.</p>
      )}
    </>
  )
}

export default getDiscussion