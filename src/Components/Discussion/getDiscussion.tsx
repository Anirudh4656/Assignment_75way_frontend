import React from 'react'
import { useGetDiscussionQuery, useLikeDiscussionMutation } from '../../Services/discussapi'
import Reply from "./reply"
import { AppDispatch } from "../../Store/store";
import { useDispatch } from "react-redux";
import { Button } from '@mui/material';
import { likeDiscussion } from '../../Store/reducers/discussionReducer';
interface Discussion {
  id: string;
  title: string;
  content: string;
  user: string;
  // Add other fields as necessary
}
const getDiscussion:React.FC = () => {

    //dispatch? not
  const { data: discussions, error, isLoading } = useGetDiscussionQuery();
  const[likeDiscussion] = useLikeDiscussionMutation()
  console.log(discussions);
  const handleLike=()=>{};
  const Likes=()=>{
    return (<></>);
  }
  return (
    <>
  
      <h1>getUserDiscussions</h1>
      {discussions && discussions.length > 0 ? (
        <ul>
          {discussions.map((discussion: Discussion) => (
            <li key={discussion.id}>
              <h2>{discussion.title}</h2>
              <p>{discussion.content}</p>
              <Button size="small" color="primary"  onClick={handleLike}>
         like
        </Button> 
              {/* <Button size="small" color="primary" disabled={!user?.result} onClick={handleLike}>
          <Likes />
        </Button> */}
              <Reply  discussionId={discussion.id}  />
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
