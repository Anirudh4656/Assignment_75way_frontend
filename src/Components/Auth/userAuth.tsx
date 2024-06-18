import { Avatar, Button, Container, Grid, Paper, Typography,Theme, useTheme, Box } from '@mui/material';
import React, { useState, ChangeEvent, FormEvent } from 'react';
// import { styled } from '@mui/material/styles';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
// import useStyles from './styles';
import Input from './Input';


// const useStyle = (theme: Theme) =>  makeStyles({
//   root: {
//     backgroundColor: "lightgrey",
//     height: '100vh',
//     width: '100vw',
//     [theme.breakpoints.up('md')]: {
//       backgroundColor: 'lightblue',
//     },
//   },
// });
interface FormState {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
  }
  
  const initialState: FormState = { firstName: '', lastName: '', email: '', password: '', confirmPassword: '' };
  const UserAuth:React.FC=()=>{
    const theme=useTheme();
// const classes = useStyle(theme);
const [form,setForm]=useState<FormState>(initialState);
const [isSignUp,setIsSignUp]=useState(false);

const [showPassword,setShowPassword]=useState(false);
const handleShowPassword = () => setShowPassword(!showPassword);
const handleSubmit = (e:FormEvent<HTMLFormElement>) => {
    e.preventDefault();
//  logic for datafetching
    // if (isSignup) {
    //   dispatch(signup(form, history));
    // } else {
    //   dispatch(signin(form, history));
    // }
  };
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => setForm({ ...form, [event.target.name]: event.target.value });
  const switchMode=()=>{
    setIsSignUp((prevIsSignUp)=>!prevIsSignUp);
    setShowPassword(false);
    setForm(initialState);
  }
return(
    <Container  component="main" maxWidth="xs">
        <Paper sx={ {marginTop: theme.spacing(8), display: 'flex',flexDirection: 'column',alignItems: 'center',padding: theme.spacing(2)}}>
            <Avatar sx={ {margin: theme.spacing(1),
                    backgroundColor: theme.palette.secondary.main}}>
           <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">{ isSignUp ? 'Sign up' : 'Sign in' }</Typography>
            <Box sx={{width: '100%',marginTop: theme.spacing(3)}} >
            <form  onSubmit={handleSubmit}>
            <Grid container spacing={2}>
            { isSignUp && (
            <>
              <Input name="firstName" label="First Name" handleChange={handleChange} autoFocus half type={undefined} handleShowPassword={undefined} />
              <Input name="lastName" label="Last Name" handleChange={handleChange} half autoFocus={undefined} type={undefined} handleShowPassword={undefined} />
            </>
            )}
            <Input name="email" label="Email Address" handleChange={handleChange} type="email" half={undefined} autoFocus={undefined} handleShowPassword={undefined} />
            <Input name="password" label="Password" handleChange={handleChange} type={showPassword ? 'text' : 'password'} handleShowPassword={handleShowPassword} half={undefined} autoFocus={undefined} />
            { isSignUp && <Input name="confirmPassword" label="Repeat Password" handleChange={handleChange} type="password" half={undefined} autoFocus={undefined} handleShowPassword={undefined} /> }
          </Grid>
          <Button type="submit" sx={{margin:theme.spacing(3, 0, 2)}} fullWidth variant="contained" color="primary" >
            { isSignUp ? 'Sign Up' : 'Sign In' }
          </Button>
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Button onClick={switchMode}>
                { isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign Up" }
              </Button>
            </Grid>
          </Grid>
            </form>
            </Box>
        </Paper>
    </Container>
)
  }
  export default UserAuth;