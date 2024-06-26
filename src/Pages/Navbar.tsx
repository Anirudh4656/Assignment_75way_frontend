import { AppBar, Button, Toolbar, Typography } from '@mui/material';
import { JwtPayload, jwtDecode } from 'jwt-decode';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
// import { makeStyles } from '@mui/styles';
// const useStyles = makeStyles((theme: Theme) =>
//   createStyles({
//     root: {
//       display: 'flex',
//       justifyContent: 'space-between',
//       alignItems: 'center', 
//       height: '53px',
//       paddingLeft: '25px',
//       backgroundColor: 'white',
//       borderTop: '1px solid #ccc',
//       position: 'relative',
//     },
//    appBar: {
//       display: 'flex',
//       flexDirection: 'row',
//       justifyContent: 'space-between',
//       alignItems: 'center',
//       fontFamily: 'Inter, sans-serif',
//       fontSize: '12px',
//       fontWeight: 400,
//       lineHeight: '14.52px',
    
//     },
//     pageMover: {
//       display: 'flex',
//       alignItems: 'center',
//       position: 'absolute',
//       left: '939px',
//       width: '195px',
//       height: '25px',
//       justifyContent: 'space-between',
//       padding: '0 10px',
//     },
//     customText: {
//       fontFamily: 'Inter, sans-serif',
//       fontSize: '12px',
//       fontWeight: 400,
//       lineHeight: '14.52px',
//       whiteSpace: 'nowrap',
//     },
//     pageText: {
//       fontSize: '10px', // Setting the font size of the "Page" text to 10px
//       fontFamily: 'Inter, sans-serif',
//       fontWeight: 400,
//       lineHeight: '14.52px',
//       whiteSpace: 'nowrap',
//     },
//     pageBox: {
//       width: '31px',
//       height: '25px',
//       border: '1px solid #ccc',
//       display: 'flex',
//       alignItems: 'center',
//       justifyContent: 'center',
//       marginLeft: '10px',
//       marginRight: '10px',
//     },
//     navigatorBoxText: {
//       fontSize: '10px', // Setting the font size of the text inside the box to 10px
//     },
//     navigatorIcon: {
//       color: '#00ADEF',
//     },
//   })
// );
// import jwtDecode from 'jwt-decode';
interface Token{
    token:string;
    name?:string;
    exp?:string;
    result?:string;
    _doc:any;
}
interface MyToken extends JwtPayload {
    user: string;
    // Define your custom token properties here
    exp: number;

    // add other properties your JWT token might have
  }
const Navbar:React.FC=()=>{
   
    const [user, setUser] = useState<MyToken| null>(null);
    console.log(`in navbar user ${JSON.stringify(user)}`);
  
    useEffect(() => {
        const token = localStorage.getItem("token");
    console.log(token);
        if (token) {
            try{
                const decodedToken = jwtDecode<MyToken>(token);
                console.log(`in decode ${JSON.stringify(decodedToken)}`);
                //check
                if (decodedToken.exp * 1000 < new Date().getTime()) {
                    logout();
                  } else {
                    setUser(decodedToken);
                  }
            }catch(error){console.error('failed todecode',error)};
        
    
        }
        console.log("in user");
  
      
      }, []);

      const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
      }
      const getDiscussion=()=>{
          
      }
    return(
        <AppBar  style={{
          display: 'flex',
          justifyContent: 'space-between',
          flexDirection:'row',
          alignItems: 'center',
          height: '53px',
          paddingLeft: '25px',
          backgroundColor: 'white',
          borderTop: '1px solid #ccc',
          position: 'relative',
        }} position="static" color="inherit">
        <Link style={{
    display: 'flex',
    alignItems: 'center',
  }} to="/">
       Home 
        </Link>
        <Toolbar style={{display: 'flex', justifyContent: 'flex-end', width: '400px'}} >
          {user ? (
            <div  style={{display: 'flex',
              justifyContent: 'space-between',
              width: '400px',
              alignItems: 'center',}}>
              <Typography  variant="h6">Anirudh</Typography>
              <Button variant="contained"  color="secondary" onClick={logout}>Logout</Button>
              <Button variant="contained"  color="secondary" onClick={getDiscussion}>Discussions</Button>
            </div>
          ) : (
            <Button component={Link} to="/auth" variant="contained" color="primary">Sign In</Button>
          )}
          
        </Toolbar>
      </AppBar>
    )
}
export default Navbar;