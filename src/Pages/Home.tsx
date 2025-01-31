import React from 'react'
import NavBar from "./Navbar";
import CreateDiscussion from "../Components/Discussion/createDiscusiion";
import { Container, Grid } from '@mui/material';
import RecipeReviewCard from "../Components/Discussion/card"
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
    <NavBar/>
    <Container maxWidth="xl">
    <Grid container  spacing={3}>
          <Grid  item xs={12} sm={6} md={9} sx={{display:"flex",flexWrap:'wrap'}}>
          <RecipeReviewCard/>
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