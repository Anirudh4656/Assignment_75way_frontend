import React from 'react'
import GetDiscussion from "../Components/Discussion/getDiscussion";
import Auth from "../Components/Auth/userAuth";
import NavBar from "./Navbar";
import CreateDiscussion from "../Components/Discussion/createDiscusiion";
import { Container, Grid } from '@mui/material';
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
   
    <NavBar />
    <Container maxWidth="xl">
    <Grid container  spacing={3}>
          <Grid item xs={12} sm={6} md={9}>
          <GetDiscussion />
          </Grid>
          <Grid item xs={12} sm={6} md={3}> 
       <CreateDiscussion />
    </Grid>
     </Grid>
    </Container>
  
    </>
  )
}

export default Home
