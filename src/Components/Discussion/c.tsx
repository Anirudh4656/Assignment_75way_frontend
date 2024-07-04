import React, { Key, useEffect, useState } from "react";
import { styled } from "@mui/material/styles";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import Collapse from "@mui/material/Collapse";
import Avatar from "@mui/material/Avatar";
import BlockIcon from "@mui/icons-material/Block";
import IconButton, { IconButtonProps } from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { red } from "@mui/material/colors";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import FavoriteIcon from '@mui/icons-material/Favorite';
import NestedReply from "./nestedReply"
import {
  InputAdornment,
  List,
  ListItem,
  ListItemText,
  OutlinedInput,
} from "@mui/material";
import {
  useGetDiscussionQuery,
  useLikeDiscussionMutation,
} from "../../Services/discussapi";
import { useCloseMutation } from "../../Services/adminapi";
import {
  getDiscussions,
  likeDiscussions,
  likeReply
} from "../../Store/reducers/discussionReducer";
import {
  replyDiscussion,
  closeDiscussions,
} from "../../Store/reducers/discussionReducer";
import { useAddReplyMutation, useAddReplyLikeMutation,useAddNestedReplyMutation } from "../../Services/discussapi";
import { AppDispatch, RootState, useAppSelector } from "../../Store/store";
import { useDispatch, useSelector } from "react-redux";
import { JwtPayload, jwtDecode } from "jwt-decode";
import { ThumbUpAltOutlined } from "@mui/icons-material";
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

interface Like{
  _id:string;
  id:string;
  user:string;
}
interface Reply {
  id: string;
  content: string;
  user: string;
  name:string;
  replies: Reply[];
  likes: Like[];
}
interface MyToken extends JwtPayload {
  role: any;
  user: string;
  exp: number;
  _doc: any;
  _id: string;
  id: string;
}
interface Discussion {
  _id: string;
  id: string;
  title: string;
  name:string;
  content: string;
  user: string;
  replies: Reply[];
  likes: Like[];
  isClosed: boolean;
}


interface ExpandMoreProps extends IconButtonProps {
  expand: boolean;
}

const ExpandMore = styled((props: ExpandMoreProps) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? "rotate(0deg)" : "rotate(180deg)",
  marginLeft: "auto",
  transition: theme.transitions.create("transform", {
    duration: theme.transitions.duration.shortest,
  }),
}));
interface DiscussProps {
  discuss: any; // Adjust 'any' to the actual type of 'discuss' prop
}
interface newlike {
  user: string;
}
const Cards: React.FC<DiscussProps> = ({ discuss }) => {
  const [expanded, setExpanded] = React.useState(false);
  const [user, setUser] = useState<MyToken | null>(null);
  const [content, setContent] = useState<string>("");
  const [role, setRole] = useState<boolean>(false);
  //change
  const [likediscuss, setLikediscuss] = useState<newlike[]>(discuss?.likes);
  const [replyL, setReplyL] = useState<newlike[]>(discuss?.likes);
  console.log("replyLike discuss",discuss);
  console.log("replyLike",replyL);
  const [addReply] = useAddReplyMutation();
  const { data: discussions, refetch: refetchGetDiscussions } =
    useGetDiscussionQuery();
  const [close] = useCloseMutation();
  const dispatch = useDispatch<AppDispatch>();
  const discussion = useSelector(
    (state: RootState) => state.discuss.discussions
  );

  const filterUserId = useSelector((state: RootState) => state.discuss);
  const [likeDiscussion] = useLikeDiscussionMutation();
  const [addReplyLike] = useAddReplyLikeMutation();
  useEffect(() => {
    fetchDiscussions();
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const decodedToken = jwtDecode<MyToken>(token);
        console.log(`in decode ${JSON.stringify(decodedToken)}`);
        //check
        setUser(decodedToken);
        console.log("inrole", role);
        console.log("inuser", decodedToken.role);
        if (decodedToken.role === "ADMIN") {
          setRole(true);
        }
      } catch (error) {
        console.error("failed todecode", error);
      }
    }
  }, [discussions, dispatch, refetchGetDiscussions]);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  //to correct
  //   const filteredDiscussions = filterUserId
  //     ? discussion.map((discuss)=>discuss.filter((discussion: { user: any; }) => discussion.user === filterUserId))
  //     : discussion;
  //  console.log("in filterediscussion",filteredDiscussions);
  //  console.log("in use selector replies filter",filterUserId);
  const fetchDiscussions = async () => {
    try {
      if (discussions) {
        console.log("check rendering of component",discussions);
        const transformReplies = (replies: any[]): Reply[] => {
          return replies.map((reply: any) => ({
            id: reply._id,
            content: reply.content,
            user: reply.user,
            name: reply.name,
            likes: reply.likes,
            replies: transformReplies(reply.replies || []), // Recursively transform nested replies
          }));
        };
        const transformedDiscussions: Discussion[] = discussions.data.map(
          (discussion: any) => ({
            id: discussion._id,
            title: discussion.title,
            content: discussion.content,
            name:discussion.name,
            user: discussion.user,
            replies: discussion.replies.map((reply: any) => ({
              content: reply.content,
              user: reply.user,
              id: reply._id,
              likes:reply.likes,
              name:reply.name,
              replies:transformReplies(reply.replies|| [])
            
            })),
            likes: discussion.likes.map((like:any)=>({
              reply:like.reply,
              user:like.user
            })), 
            isClosed: discussion.isClosed,
          })
        );
        console.log("check rendering of transformedDiscussion",transformedDiscussions);
        dispatch(getDiscussions({ discussions: transformedDiscussions }));
      }
    } catch (error: any) {
      console.log("erroris", error.message);
    }
  };
  console.log("in use selector of Discussion", discussion);
  const handleSubmit = async (id: string) => {
    console.log("in handleSubmit", id);
    try {
      const response = await addReply({ content, discussionId: id });
      console.log("in handleSubmit of reply", response);
      if (response.data) {
        const reply: Reply = {
          content: response.data.data.content,
          user: response.data.data.user,
          id: response.data.data._id,
          name: response.data.data.name,
          replies: response.data.data.replies,
          likes: response.data.data.likes
        };
        console.log("response ", reply);
        dispatch(replyDiscussion({ discussionId: id, content: reply }));
      } else {
        console.error("Response data is undefined", response.error);
      }
    } catch (error) {
      console.log("error  is", error);
    }
  };

  const handleReplyLike = async ({ reply, discussionId }: { reply: Reply, discussionId: string } ) => {
   console.log("in handle like", user?.id);

 
   try {
        const replylike=await addReplyLike({id:reply.id});
        console.log('in replyLike function',replylike);
        if (replylike) {
          console.log("in likes", replylike);
        } 
        if (user?.id && replylike ) {  
                const hasLikedPost = reply?.likes.some(
                  (like: any) => like.user === user.id
                );
                console.log("in handlereplyliked post", hasLikedPost);
                if (hasLikedPost) {
                  const result = reply?.likes.filter(
                    (like: any) => like.user !== user?.id
                  );
                  console.log("result of like", result); 
                  setReplyL(result ||[]);
    console.log("after setreply",replyL)
                  dispatch(likeReply({
                                replyId:reply.id,
                                discussionId: discussionId,
                                userId: user.id,
                                action: "dislike",
                              })
                            );
                            console.log("in usestae", likediscuss);
                          
        } else{
                  console.log("user liked");
                  const newLike = { user: user.id };
                  const updatedLikes = [...reply.likes, newLike];
                  console.log("Updated likes after addition:", updatedLikes);
                  setReplyL(updatedLikes ||[]);
                  console.log("after setreply",replyL)
                  dispatch(
                    likeReply({
                      replyId:reply.id,
                      discussionId,
                      userId: user.id,
                      action: "like",
                    })
                  );
         console.log("in usestae", likediscuss);
      
                }   
      
      
      }
   }catch(e){
    console.log(e);
   }


}
  const handleLike = async (id: string) => {
    //userid
    console.log("in hqndle like", user?.id);

    //check
    //why not find and filter
    const discuss = discussion.find((discussion: any) => discussion.id === id);
    // console.log("in find discussion", discuss);
    if (!discuss) {
      console.log("Discussion not found");
      return;
    }

    try {
      const like = await likeDiscussion({ id: id });
      if (like) {
        console.log("in likes", like);
      }

      if (user?.id) {
        const hasLikedPost = discuss?.likes.some(
          (like: any) => like.user === user.id
        );
        console.log("in handleliked post", hasLikedPost);
        if (hasLikedPost) {
          const result = discuss?.likes.filter(
            (like: any) => like.user !== user?.id
          );
          console.log("result", result);
          dispatch(
            likeDiscussions({
              discussionId: id,
              userId: user.id,
              action: "dislike",
            })
          );
          setLikediscuss(result || []);

          console.log("in usestae", likediscuss);
        } else {
          console.log("user liked");
          const newLike = { user: user.id };
          const updatedLikes = [...discuss.likes, newLike];
          console.log("Updated likes after addition:", updatedLikes);
          dispatch(
            likeDiscussions({
              discussionId: id,
              userId: user.id,
              action: "like",
            })
          );
          setLikediscuss([...discuss.likes, newLike]);
          console.log("in usestae", likediscuss);
        }
      }
    } catch (e) {
      console.log(e);
    }
  };
  const handleClose = async (id: string) => {
    const closed = await close({ id: id });
    console.log("in hadle clse", id, closed);
    dispatch(closeDiscussions({ id }));
  };
  const ReplyLikes =()=>{
    console.log("in ReplyLikes", user?.id);
    if (replyL.length > 0) {
      return replyL?.find((like) => like) ? (
        <>
          <FavoriteIcon />
          &nbsp;
          {replyL.length}
        </>
      ) : (
        <>
          <FavoriteBorderIcon />
          &nbsp;{replyL.length}{" "}

        </>
      );
  }
}
  const Likes = () => {
    // console.log(like.map(like)=>like);
    if (likediscuss.length > 0) {
      return likediscuss?.find((like) => like) ? (
        <>
          <ThumbUpIcon fontSize="small" />
          &nbsp;
          {likediscuss.length > 2
            ? `You and ${likediscuss.length - 1} others`
            : `${likediscuss.length} like${likediscuss.length > 1 ? "s" : ""}`}
        </>
      ) : (
        <>
          <ThumbUpAltOutlined fontSize="small" />
          &nbsp;{likediscuss.length}{" "}
          {likediscuss.length === 1 ? "Like" : "Likes"}
        </>
      );
    }

    return (
      <>
        <ThumbUpAltOutlined fontSize="small" />
        &nbsp;Like
      </>
    );
  };
  return (
    <>
      <Card sx={{ maxWidth: 345, margin: "6px 3px" }}>
        <CardHeader
          avatar={
            <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
              R
            </Avatar>
          }
          action={
            <IconButton aria-label="settings">
              <MoreVertIcon />
            </IconButton>
          }
          title={discuss.title}
          subheader={`By:${discuss?.name}`}
        />

        <CardContent>
          <Typography variant="body2" color="text.secondary">
            {discuss.content}
          </Typography>
        </CardContent>
        <CardActions disableSpacing>
          {role ? (
            <>
              {" "}
              <IconButton
                onClick={() => handleLike(discuss.id)}
                aria-label="add to favorites"
              >
                <Likes />
              </IconButton>
              <IconButton
                onClick={() => handleClose(discuss.id)}
                aria-label="add to favorites"
              >
                <BlockIcon />
              </IconButton>{" "}
            </>
          ) : (
            <IconButton
              onClick={() => handleLike(discuss.id)}
              aria-label="add to favorites"
            >
              <Likes />
            </IconButton>
          )}

          <ExpandMore
            expand={expanded}
            onClick={handleExpandClick}
            aria-expanded={expanded}
            aria-label="show more"
          >
            <ExpandMoreIcon />
          </ExpandMore>
        </CardActions>
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <CardContent>
            <Typography paragraph>Replies:</Typography>
            <List sx={{ maxHeight: 100, overflow: "auto" }}>
              {discuss.replies.map((reply: any) => (
                <>
                <ListItem key={reply.id}>
                  <ListItemText
                   secondary={reply.content}
                   primary={reply.name}
                  />
                </ListItem>
                <IconButton
              onClick={() => handleReplyLike({reply ,discussionId:discuss.id})}
              aria-label="add to favorites"
            >
              <ReplyLikes />
            </IconButton>
                 
  
              
               
                <NestedReply id={reply.id} discussId={discuss.id}/>
               </>
              ))}
            </List>

            {discuss.isClosed === true ? (
              "discussion is closed"
            ) : (
              <OutlinedInput
                id="outlined-adornment-password"
                sx={{ padding: "5px", width: "100%", height: "50px" }}
                name="content"
                label="Reply"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => handleSubmit(discuss.id)}
                      edge="end"
                    >
                      <ArrowRightIcon />
                    </IconButton>
                  </InputAdornment>
                }
              />
            )}
          </CardContent>
        </Collapse>
      </Card>
    </>
  );
};
export default Cards;
