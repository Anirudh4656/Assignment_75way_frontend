import React, { ReactNode, useState } from "react";
import { useGetAllUserQuery,useBlockUserMutation, useDeleteUserMutation } from '../../Services/adminapi';
import { Button, IconButton, Menu, MenuItem, Paper, Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";
import {blockUsers,deleteUsers} from "../../Store/reducers/adminReducers"
import {MoreVert} from '@mui/icons-material';
import { useDispatch } from "react-redux";
import { AppDispatch, RootState, useAppSelector } from "../../Store/store";
import BlockIcon from '@mui/icons-material/Block';
import DeleteIcon from '@mui/icons-material/Delete';

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
  interface Token{
    token:string;
    name?:string;
    exp?:string;
    result?:string;
    _doc:any;
}
interface Props {
  a: any; 
  Toggled:any;// Adjust 'any' to the actual type of 'discuss' prop
}
const AllUsers:React.FC<Props>=({a,Toggled})=>{
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [selectedUser, setSelectedUser] = useState<User | null >(null);
    const {data: getAllUsers} =useGetAllUserQuery();
    const [blockUser]=useBlockUserMutation();
    // const [isUserToggled, setIsUserToggled] = useState(true);
    const [deleteUser]=useDeleteUserMutation();
    const dispatch = useDispatch<AppDispatch>();
 
    //backend user authentication if block condition
   //why state update 
   

      const handleToggleUserStatus = async (a:any) => {
        if (a) {
                console.log('in handleToggleStatus',a.id);
                try {
                  const response = await blockUser({userId:a.id});
                  console.log(`i am in response ${JSON.stringify(response)}`);
                 
                  if ('data' in response && response.data) {
                    Toggled((prev: any) => !prev);
                    //toogle in backend
                    dispatch(blockUsers({userId:a.id ,isBlocked:a.isBlocked}));
                  }
               
              }catch(error){
                console.log("error is",error);
              }  
             
        }  }
    const handleDeleteUser=async(a:any)=>{
      if (a) {
        console.log('in handleToggleUserStatus',a.id);
        try {
          const response = await deleteUser({userId:a.id});
          console.log(`i am in delteresponse ${JSON.stringify(response)}`); 
          if ('data' in response && response.data) {
            //toogle in backend
            dispatch(deleteUsers({userId:a.id }));
          }
    
      }catch(error){
        console.log("error is",error);
      }  
     
    }}
    return(

      <TableRow key={a._id} >
      <TableCell >{a.username}</TableCell>
      <TableCell >{a.email}</TableCell> 
      <TableCell >
               
                    <Button onClick={()=>handleToggleUserStatus(a)}>
                      {a?.isBlocked ? "unblock" : <BlockIcon/>}
                    </Button>
                    <Button onClick={()=>handleDeleteUser(a)}><DeleteIcon/></Button>
                  
 </TableCell> 
       </TableRow>
     
      )   }
         
       
    

export default AllUsers;
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