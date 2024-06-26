import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../Store/store';
import { RootState } from '../Store/store'; // Import your RootState type from your Redux store
import { useState } from 'react';
import { JwtPayload, jwtDecode } from 'jwt-decode';

interface ProtectedProps {
  auth: boolean;
  children: React.ReactNode;
}
interface MyToken extends JwtPayload {
    // Define your custom token properties here
    exp: number;
     _doc:any;
     role:"USER"|"ADMIN"
    // add other properties your JWT token might have
  }
const Protected:React.FC<ProtectedProps> = ({auth,  children }) => {  
  const authStatus = useAppSelector((state: RootState) => state.auth.isAuthenticated);
  const [isAdmin,setIsAdmin]=useState<boolean>(false);
  const navigate = useNavigate();
  const [loader, setLoader] = useState<boolean>(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log(token);
        if (token) {
            try{
                const decodedToken = jwtDecode<MyToken>(token);
                console.log(`in decode ${JSON.stringify(decodedToken)}`);
                if(decodedToken.role==="USER"){
                    setIsAdmin(true);
                }
    
            }catch(error){console.error('failed todecode',error)};
        
        }
      if (authStatus){
        if (isAdmin !== auth) {
          navigate("/");
        } 
      } else {
        navigate("/admin");
      }
      setLoader(false);

  }, [authStatus, isAdmin,navigate]);

  

  // Render children only if user is authenticated
 return(
    <>
   {children}
  </>
 )

} 

export default Protected;