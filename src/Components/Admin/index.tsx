import React, { ReactNode, useEffect, useState } from "react";
import { useGetAllUserQuery,useBlockUserMutation, useDeleteUserMutation } from '../../Services/adminapi';
import { Button, IconButton, Menu, MenuItem, Paper, Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";
import {blockUsers,deleteUsers,setUsers} from "../../Store/reducers/adminReducers"
import {MoreVert} from '@mui/icons-material';
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState, useAppSelector } from "../../Store/store";
import DeleteIcon from '@mui/icons-material/Delete';
import BlockIcon from '@mui/icons-material/Block';
interface User{
    username: string;
    length: number;
    data: any;
    accessToken(accessToken: any): unknown;
    _id: string;
    user: string;
    email: string;
    password:string;
    isAdmin: boolean;
    blocked: boolean;
  }
  interface U {
    id: string;
    username: string;
    role: string;
    blocked: boolean;
  }
  interface Token{
    token:string;
    name?:string;
    exp?:string;
    result?:string;
    _doc:any;
}
interface admin {
  username: string;
  role:"ADMIN"|"USER";
  email: string;
  blocked: boolean;
  id: boolean;
  user:string;
   isBlocked:boolean
}
 interface IUser{
  id: string;
  username:string,
  email:string;
  role:"ADMIN"|"USER";
  isBlocked:boolean;
}

const index:React.FC=()=>{
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const {data: getAllUsers} =useGetAllUserQuery();
    const [blockUser]=useBlockUserMutation();
    const [deleteUser]=useDeleteUserMutation();
    const dispatch = useDispatch<AppDispatch>();
    const admin = useSelector((state: RootState) => state.admin.users);
    console.log("admmin",admin);
    //backend user authentication if block condition
   //why state update 
  
   useEffect(()=>{ 
      fetchDiscussions();
    
   },[])

   const fetchDiscussions = async ()=>{
    try{
      if(getAllUsers){
  
        console.log("check rendering of component");

   const transformedUsers: IUser[] = getAllUsers.data.map((user: any) => ({
          id: user._id,
          username: user.username,
          role:user.role,
          email: user.email,
          isBlocked: user.isBlocked
   
        }));

        dispatch(setUsers({ user: transformedUsers }));
    console.log("allusers",transformedUsers);
      }
    }catch(error:any){

      console.log("erroris",error.message);
    }  }
   
 

    const handleToggleUserStatus = async (getUser:any) => {
    if (getUser) {
            console.log('in handleToggleStatus',getUser.id);
            try {
              const response = await blockUser({userId:getUser.id});
              console.log(`i am in response ${JSON.stringify(response)}`);
             
              if ('data' in response && response.data) {
                //toogle in backend
                dispatch(blockUsers({userId:getUser.id ,isBlocked:getUser.isBlocked}));
              }
           
          }catch(error){
            console.log("error is",error);
          }  
         
    }  }
    const handleDeleteUser=async(getUser:any)=>{
      if (getUser) {
        console.log('in handleToggleUserStatus',getUser.id);
        try {
          const response = await deleteUser({userId:getUser.id});
          console.log(`i am in delteresponse ${JSON.stringify(response)}`);
         
          if ('data' in response && response.data) {
            //toogle in backend
            dispatch(deleteUsers({userId:getUser.id }));
          }
    
      }catch(error){
        console.log("error is",error);
      }  
     
    }}
    
    return(
        <Paper>
             <Table  aria-label="users table">
             <TableHead>
            <TableRow>
              <TableCell >Name</TableCell>
              <TableCell >Email Address</TableCell>
              <TableCell >Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
          {admin && admin.length > 0 ? (
            admin.map((getUser:any) => (
 
      <TableRow key={getUser._id} >
      <TableCell >{getUser.username}</TableCell>
      <TableCell >{getUser.email}</TableCell> 
      <TableCell >
               
                    <Button onClick={()=>handleToggleUserStatus(getUser)}>
                      {getUser?.isBlocked ? "unblock" : <BlockIcon/>}
                    </Button>
                    <Button onClick={()=>handleDeleteUser(getUser)}><DeleteIcon/></Button>
                  
 </TableCell> 
       </TableRow>
) )
           ) : 
           (
        <p>No Users Found.</p>
      )}
          </TableBody>
   
      </Table>
      </Paper>
       
    )
  }

export default index;
// updateUserStatus: (state, action: PayloadAction<{ id: string; blocked: boolean }>) => {
//   const { id, blocked } = action.payload;
//   state.users = state.users.map(user =>
//     user._id === id ? { ...user, blocked: blocked } : user
//   );
// },
// deleteUser: (state, action: PayloadAction<string>) => {
//   const userId = action.payload;
//   state.users = state.users.filter(user => user._id !== userId);
// },