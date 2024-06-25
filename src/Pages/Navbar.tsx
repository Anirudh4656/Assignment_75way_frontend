import { AppBar, Button, Toolbar, Typography } from '@mui/material';
import { JwtPayload, jwtDecode } from 'jwt-decode';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
        <AppBar  position="static" color="inherit">
        <Link to="/">
       Home 
        </Link>
        <Toolbar >
          {user ? (
            <div >
              <Typography  variant="h6">{user.user}</Typography>
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