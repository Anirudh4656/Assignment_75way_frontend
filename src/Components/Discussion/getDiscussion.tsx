import React from 'react'
import { useGetDiscussionQuery } from '../../Services/discussapi'
const getDiscussion:React.FC = () => {
   interface Discussion {
    id: string;
    title: string;
    content: string;
    user: string;
    // Add other fields as necessary
  }
  const { data: discussions, error, isLoading } = useGetDiscussionQuery();
  console.log(discussions)
  return (
    <>
      <h1>getUserDiscussions</h1>
      {discussions && discussions.length > 0 ? (
        <ul>
          {discussions.map((discussion: Discussion) => (
            <li key={discussion.id}>
              <h2>{discussion.title}</h2>
              <p>{discussion.content}</p>
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
