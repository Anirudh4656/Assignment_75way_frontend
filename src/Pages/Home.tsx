import React from 'react'
import GetDiscussion from "../Components/Discussion/getDiscussion";
import Auth from "../Components/Auth/userAuth";
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
    {/* <Auth /> */}
    
    <Auth />
    </>
  )
}

export default Home
