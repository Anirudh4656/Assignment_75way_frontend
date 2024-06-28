import React, { ReactNode, useState } from "react";
import { useGetAllUserQuery,useBlockUserMutation, useDeleteUserMutation } from '../../Services/adminapi';
import { IconButton, Menu, MenuItem, Paper, Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";
import {blockUsers,deleteUsers} from "../../Store/reducers/adminReducers"
import {MoreVert} from '@mui/icons-material';
import { useDispatch } from "react-redux";
import { AppDispatch, RootState, useAppSelector } from "../../Store/store";
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
  interface Token{
    token:string;
    name?:string;
    exp?:string;
    result?:string;
    _doc:any;
}
const AllUsers:React.FC=()=>{
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [selectedUser, setSelectedUser] = useState<User | null >(null);
    const {data: getAllUsers} =useGetAllUserQuery();
    const [blockUser]=useBlockUserMutation();
    const [deleteUser]=useDeleteUserMutation();
    const dispatch = useDispatch<AppDispatch>();
 
    //backend user authentication if block condition
   //why state update 
    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, user: User) => {
        setAnchorEl(event.currentTarget);
        setSelectedUser(user);
      };
      const handleMenuClose = () => {
        setAnchorEl(null);
        setSelectedUser(null);
      };

    const handleToggleUserStatus = async () => {
    if (selectedUser) {
            console.log('in handleToggleUserStatus',selectedUser);
            try {
              const response = await blockUser({userId:selectedUser._id});
              console.log(`i am in response ${JSON.stringify(response)}`);
             
              if ('data' in response && response.data) {
                //toogle in backend
                dispatch(blockUsers({userId:selectedUser._id ,blocked:selectedUser.blocked}));
              }
              handleMenuClose();
          }catch(error){
            console.log("error is",error);
          }  
         
    }  }
    const handleDeleteUser=async()=>{
      if (selectedUser) {
        console.log('in handleToggleUserStatus',selectedUser);
        try {
          const response = await deleteUser({userId:selectedUser._id});
          console.log(`i am in delteresponse ${JSON.stringify(response)}`);
         
          if ('data' in response && response.data) {
            //toogle in backend
            dispatch(deleteUsers({userId:selectedUser._id }));
          }
          handleMenuClose();
      }catch(error){
        console.log("error is",error);
      }  
      handleMenuClose();

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
          {getAllUsers && getAllUsers.length > 0 ? (
            getAllUsers.map((getAllUser:User) => (
 
      <TableRow key={getAllUser._id} >
      <TableCell >{getAllUser.username}</TableCell>
      <TableCell >{getAllUser.email}</TableCell> 
      <TableCell >
                  <IconButton
                    aria-controls="action-menu"
                    aria-haspopup="true"
                    onClick={(event) => handleMenuOpen(event, getAllUser)}
                  >
                    <MoreVert/>
                    <Menu
                    id="action-menu"
                    anchorEl={anchorEl}
                    keepMounted
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                  >
                    <MenuItem onClick={handleToggleUserStatus}>
                      {selectedUser?.blocked ? 'Enable' : 'Disable'}
                    </MenuItem>
                    <MenuItem onClick={handleDeleteUser}>Delete</MenuItem>
                  </Menu>
                  </IconButton>
 </TableCell> 
       </TableRow>
) )
           ) : 
           (
        <p>No discussions found.</p>
      )}
          </TableBody>
   
      </Table>
      </Paper>
       
    )
}
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