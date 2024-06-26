import React ,{ Key, useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import Collapse from '@mui/material/Collapse';
import Avatar from '@mui/material/Avatar';
import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { red } from '@mui/material/colors';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { JSX } from 'react/jsx-runtime';
import { InputAdornment, InputLabel, List, ListItem, ListItemText, OutlinedInput, TextField } from '@mui/material';
import { useGetDiscussionQuery, useLikeDiscussionMutation } from '../../Services/discussapi'
import ReplySection from "./reply"

import { Button } from '@mui/material';
import { getDiscussions, likeDiscussions} from '../../Store/reducers/discussionReducer';

import { replyDiscussion} from '../../Store/reducers/discussionReducer';
import { useAddReplyMutation } from '../../Services/discussapi'
import { AppDispatch, RootState, useAppSelector } from "../../Store/store";
import { useDispatch, useSelector } from "react-redux";

interface LikeButtonProps {
    discussionId: string;
  }
 
interface Like{
  id:string;
}
 interface Discussion {
  _id:string;
  id: string;
  title: string;
  content: string;
  user: string;
  replies: Reply[];
  likes: Like[];
}
interface Reply {
  content: string;
  user: string;
  id: string;
}

interface ExpandMoreProps extends IconButtonProps {
  expand: boolean;
}

const ExpandMore = styled((props: ExpandMoreProps) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));

const  RecipeReviewCard: () => JSX.Element=()=> {
  const [expanded, setExpanded] = React.useState(false);
  const [content ,setContent] =useState<string>("")
  const [addReply]=useAddReplyMutation();
 
  const handleExpandClick = () => {
    setExpanded(!expanded);
  };
  const dispatch=useDispatch<AppDispatch>();
  const { data: discussions, error, isLoading } = useGetDiscussionQuery();
  
  useEffect(()=>{

    const fetchDiscussions = async ()=>{
      try{
        if(discussions){
    
          // console.log("ingetdiscuss",discussions);
          const transformedDiscussions: Discussion[] = discussions.map((discussion: any) => ({
            id: discussion._id,
            title: discussion.title,
            content: discussion.content,
            user: discussion.user,
            replies: discussion.replies.map((reply: any) => ({
              content: reply.content,
              user: reply.user,
              id: reply._id
            })),
            likes: discussion.likes.length // Assuming likes is an array of user ids
          }));

          // Dispatch the getDiscussion action with transformed discussions
          dispatch(getDiscussions({ discussions: transformedDiscussions }));
      
        }else{
          console.log("error");
        }
      }catch(error:any){

        console.log("erroris",error.message);
      }
    }
    fetchDiscussions();
   },[discussions])
   //dispatch? not 

   const[likeDiscussion] = useLikeDiscussionMutation() 
   const discuss = useAppSelector((state: RootState) =>state.discuss.discussions)
const handleSubmit=async(id: string)=>{
    console.log("in handleSubmit",id)
   
     const discussion=discuss.find(discussion => discussion.id === id)
     
      try{
        //error handling
        const response =await addReply({content,discussionId:id});
        if (response.data) {
            const reply: Reply = {
              content: response.data.data.content,
              user: response.data.data.user,
              id: response.data.data._id
            };

      
                 dispatch(replyDiscussion({discussionId:id,content:reply}));
          
        }else {
            console.error('Response data is undefined', response.error);
          }

    }catch(error){console.log("error  is",error)}
}
const handleLike=async(id: string)=>{
    console.log(`in handle like  ${id}`);

   
const like= await likeDiscussion({id})
console.log(like);

  };
  const Likes=()=>{
    return (<></>);
  }
  return (
<>
    {discussions && discussions?.length > 0 ? ( <>
        {discussions.map((discussion:Discussion)=> (
            <Card sx={{ maxWidth: 345 }}>
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
              title="Shrimp and Chorizo Paella"
              subheader="September 14, 2016"
            />
          
            <CardContent>
              <Typography variant="body2" color="text.secondary">
                This impressive paella is a perfect party dish and a fun meal to cook
                together with your guests. Add 1 cup of frozen peas along with the mussels,
                if you like.
              </Typography>
            </CardContent>
            <CardActions disableSpacing>
              <IconButton  onClick={()=>handleLike(discussion.id)} aria-label="add to favorites">
                <FavoriteIcon />
              </IconButton>
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
                <List sx={{ maxHeight: 100, overflow: 'auto' }}>
                {discussion.replies.map(reply => (
                <ListItem key={reply.id}>
                  <ListItemText primary={reply.content} secondary={reply.user} />
                </ListItem>
              ))}
                  {/* Add more ListItem components as needed */}
                </List>
                <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
                <OutlinedInput
                  id="outlined-adornment-password"
                  sx={{ padding: '8px', width: '100%',height:'40px'}}
                  name="content"
                  label="Reply"
                  value={content} 
                  onChange={(e)=>setContent(e.target.value)}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={()=>handleSubmit(discussion.id)}
                        edge="end"
                      >
                     <ArrowRightIcon/>
                      </IconButton>
                    </InputAdornment>
                  }
                  
                />
              
              </CardContent>
            </Collapse>
          </Card>
        ))}

</>):(
        <p>No discussions found.</p>
      )}
   </>
  );
}
export default  RecipeReviewCard