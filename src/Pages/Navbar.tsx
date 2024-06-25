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
    // Define your custom token properties here
    exp: number;
     _doc:any;
    // add other properties your JWT token might have
  }
const Navbar:React.FC=()=>{
   
    const [user, setUser] = useState<MyToken| null>(null);
    useEffect(() => {
        const token = localStorage.getItem("token");
    
        if (token) {
            try{
                const decodedToken = jwtDecode<MyToken>(token);
                console.log(`in decode ${JSON.stringify(decodedToken)}`);
                if (decodedToken.exp * 1000 < new Date().getTime()) {
                    logout();
                  } else {
                    setUser(decodedToken);
                  }
            }catch(error){console.error('failed todecode',error)}
        
      
    
        //   if (decodedToken.exp * 1000 < new Date().getTime()) logout();
        }
        console.log("in user");
  
      
      }, [location]);

      const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
      }
    return(
        <AppBar  position="static" color="inherit">
        <Link to="/">
       Home 
        </Link>
        <Toolbar >
          {/* {user?.result ? (
            <div >
            
              <Typography  variant="h6">{user?.result}</Typography>
              <Button variant="contained"  color="secondary" onClick={logout}>Logout</Button>
            </div>
          ) : (
            <Button component={Link} to="/auth" variant="contained" color="primary">Sign In</Button>
          )} */}
        </Toolbar>
      </AppBar>
    )
}
export default Navbar;