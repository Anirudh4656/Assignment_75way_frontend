import {
  Avatar,
  Button,
  Container,
  Grid,
  Paper,
  Typography,
  Theme,
  useTheme,
  Box,
} from "@mui/material";
import React, { useState, ChangeEvent, FormEvent } from "react";
import Input from "./Input";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../Store/store";
import {
  setError,
  setLoading,
  setUser,
} from "../../Store/reducers/authReducers";
import {
  useLoginUserMutation,
  useRegisterUserMutation,
} from "../../Services/api";
import { useNavigate } from "react-router-dom";
interface FormState {
  username: string;
  email: string;
  password: string;
}

const initialState: FormState = { username: "", email: "", password: "" };

const UserAuth: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  // const classes = useStyle(theme);
  const [form, setForm] = useState<FormState>(initialState);
  const [isSignUp, setIsSignUp] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const handleShowPassword = () => setShowPassword(!showPassword);
  //isloading?
  const [registerUser, { isLoading }] = useRegisterUserMutation();
  const [loginUser] = useLoginUserMutation();

  const handleChange = (event: ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [event.target.name]: event.target.value });
  const switchMode = () => {
    setForm(initialState);
    setIsSignUp((prevIsSignUp) => !prevIsSignUp);
    setShowPassword(false);
  };
  const dispatch = useDispatch<AppDispatch>();
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (isSignUp) {
        dispatch(setLoading(true));
        const userRegister = await registerUser(form).unwrap();
        if (userRegister) {
          setIsSignUp(false);
          setForm(initialState);
          dispatch(setUser(userRegister));
        }
      } else {
        dispatch(setLoading(true));
        const userLogin = await loginUser(form).unwrap();
        localStorage.setItem("token", userLogin.data.accessToken);
        dispatch(setUser(userLogin));
        navigate("/");
      }
    } catch (error: any) {
      dispatch(setError(error.toString()));
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Paper
        sx={{
          marginTop: theme.spacing(8),
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: theme.spacing(2),
        }}
      >
        <Avatar
          sx={{
            margin: theme.spacing(1),
            backgroundColor: theme.palette.secondary.main,
          }}
        >
          {/* <LockOutlinedIcon /> */}
        </Avatar>
        <Typography component="h1" variant="h5">
          {isSignUp ? "Sign up" : "Sign in"}
        </Typography>
        <Box sx={{ width: "100%", marginTop: theme.spacing(3) }}>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              {isSignUp && (
                <>
                  <Input
                    name="username"
                    label="username"
                    handleChange={handleChange}
                    autoFocus
                    half={undefined}
                    type={undefined}
                    handleShowPassword={undefined}
                  />
                  {/* <Input name="lastName" label="Last Name" handleChange={handleChange} half autoFocus={undefined} type={undefined} handleShowPassword={undefined} /> */}
                </>
              )}
              <Input
                name="email"
                label="Email Address"
                handleChange={handleChange}
                type="email"
                half={undefined}
                autoFocus={undefined}
                handleShowPassword={undefined}
              />
              <Input
                name="password"
                label="Password"
                handleChange={handleChange}
                type={showPassword ? "text" : "password"}
                handleShowPassword={handleShowPassword}
                half={undefined}
                autoFocus={undefined}
              />
              {/* { isSignUp && <Input name="confirmPassword" label="Repeat Password" handleChange={handleChange} type="password" half={undefined} autoFocus={undefined} handleShowPassword={undefined} /> } */}
            </Grid>
            <Button
              type="submit"
              sx={{ margin: theme.spacing(3, 0, 2) }}
              fullWidth
              variant="contained"
              color="primary"
            >
              {isSignUp ? "Sign Up" : "Sign In"}
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Button onClick={switchMode}>
                  {isSignUp
                    ? "Already have an account? Sign in"
                    : "Don't have an account? Sign Up"}
                </Button>
              </Grid>
            </Grid>
          </form>
        </Box>
      </Paper>
    </Container>
  );
};
export default UserAuth;
// const handleReplyLike = async ({ reply, discussionId }: { reply: Reply, discussionId: string } ) => {
//   //userid
//   console.log("in hqndle like", user?.id);

//   //check
//   //why not find and filter

//   try {
//     const replylike=await addReplyLike({reply.id});
//     console.log('in replyLike function',replylike);
//     if (replylike) {
//       console.log("in likes", replylike);
//     }

//     if (user?.id) {
//       const hasLikedPost = reply?.likes.some(
//         (like: any) => like.user === user.id
//       );
//       console.log("in handlereplyliked post", hasLikedPost);
//       if (hasLikedPost) {
//         const result = reply?.likes.filter(
//           (like: any) => like.user !== user?.id
//         );
//         console.log("result", result);
//         dispatch(
//           likeReply({
//             replyId:reply.id,
//             discussionId: discussionId,
//             userId: user.id,
//             action: "dislike",
//           })
//         );
//         // setLikediscuss(result || []);

//         console.log("in usestae", likediscuss);
//       } else {
//         console.log("user liked");
//         const newLike = { user: user.id };
//         const updatedLikes = [...reply.likes, newLike];
//         console.log("Updated likes after addition:", updatedLikes);
//         dispatch(
//           likeDiscussions({
//             discussionId,
//             userId: user.id,
//             action: "like",
//           })
//         );
//         // setLikediscuss([...replies.likes, newLike]);
//         console.log("in usestae", likediscuss);
//       }
//     }
//   } catch (e) {
//     console.log(e);
//   }
// };
