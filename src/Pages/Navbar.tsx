import { AppBar, Button, Toolbar, Typography } from '@mui/material';
import { JwtPayload, jwtDecode } from 'jwt-decode';
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { getDiscussions, setFilterUserId } from '../Store/reducers/discussionReducer';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../Store/store';


interface MyToken extends JwtPayload {
    id: any;
    user: string;
    exp: number;
    _doc:any;
    _id:string;
  
  }
const Navbar:React.FC=()=>{
   
    const [user, setUser] = useState<MyToken| null>(null);
    console.log(`in navbar user ${JSON.stringify(user)}`);
    const dispatch=useDispatch<AppDispatch>();
    const navigate = useNavigate();
    // ??
    const location = useLocation();
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
          }}, [location]);

 const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
        navigate('/auth');
      }
      const homepage = () => {
       
        navigate('/');
      }
 const getDiscussion=()=>{
  //??
          console.log('in getDi555scussion',user);
          if(user){
            console.log('in getDiscussion user',user)
          dispatch(setFilterUserId(user.id));}
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
        <Button onClick={homepage} variant="contained" >Home</Button>
        <Toolbar style={{display: 'flex', justifyContent: 'flex-end', width: '400px'}} >
          {user ? (
            <div  style={{display: 'flex',
              justifyContent: 'space-between',
              width: '400px',
              alignItems: 'center',}}>
              <Typography  variant="h6">{user.user}</Typography>
              <Button variant="contained"  color="secondary" onClick={logout}>Logout</Button>
              {/* <Button variant="contained"  color="secondary" onClick={getDiscussion}>Discussions</Button> */}
            </div>
          ) : (
            <Button component={Link} to="/auth" variant="contained" color="primary">Sign In</Button>
          )}
          
        </Toolbar>
      </AppBar>
    )
}
export default Navbar;