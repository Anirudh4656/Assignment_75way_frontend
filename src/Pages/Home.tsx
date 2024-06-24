import React from 'react'
import GetDiscussion from "../Components/Discussion/getDiscussion";
import Auth from "../Components/Auth/userAuth";
import CreateDiscussion from "../Components/Discussion/createDiscusiion";
const Home:React.FC = () => {
   interface Discussion {
    id: string;
    title: string;
    content: string;
    user: string;
    // Add other fields as necessary
  }
 
  return (
    <>
    <GetDiscussion />
    <CreateDiscussion />
  
    </>
  )
}

export default Home
