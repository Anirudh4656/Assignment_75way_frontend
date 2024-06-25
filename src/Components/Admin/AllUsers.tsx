import React, { ReactNode, useState } from "react";
// import { useDispatch } from 'react-redux';
// import { AppDispatch, RootState, useAppDispatch, useAppSelector } from '../../Store/store';
import { useGetAllUserQuery,useBlockUserMutation } from '../../Services/adminapi';
import { IconButton, Menu, MenuItem, Paper, Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";
import {blockUsers} from "../../Store/reducers/adminReducers"
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../Store/store";
interface User {
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

const AllUsers:React.FC=()=>{
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [selectedUser, setSelectedUser] = useState<null | User>(null);
    const {data: getAllUsers} =useGetAllUserQuery();
    const [blockUser]=useBlockUserMutation();
    const dispatch = useDispatch<AppDispatch>();
    //backend user authentication if block condition
    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, user: User) => {
        setAnchorEl(event.currentTarget);
        // const users = useSelector((state: RootState) => state.auth.users);
        setSelectedUser(user);
      };
      const handleMenuClose = () => {
        setAnchorEl(null);
        setSelectedUser(null);
      };
    
    // const users = useAppSelector((state: RootState) => state);
    // const dispatch = useAppDispatch();
    const handleToggleUserStatus = async () => {
 
        if (selectedUser) {
            console.log(selectedUser._id);
            try {
              const response = await blockUser({userId:selectedUser._id});
              console.log(`i am in response ${JSON.stringify(response)}`);
             
              if ('data' in response && response.data) {
                dispatch(blockUsers({userId:selectedUser._id}));
              }
            } catch (error) {
              console.error('Error toggling user status:', error);
            }
          }
          handleMenuClose();
    }
    const handleDeleteUser=()=>{}
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
                    <MoreVertIcon />
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
                    {/* <MenuItem onClick={handleDeleteUser}>Delete</MenuItem> */}
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