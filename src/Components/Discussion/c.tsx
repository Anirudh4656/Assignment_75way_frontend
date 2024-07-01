import React ,{ Key, useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import Collapse from '@mui/material/Collapse';
import Avatar from '@mui/material/Avatar';
import BlockIcon from '@mui/icons-material/Block';
import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { red } from '@mui/material/colors';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { InputAdornment, List, ListItem, ListItemText, OutlinedInput } from '@mui/material';
import { useGetDiscussionQuery, useLikeDiscussionMutation } from '../../Services/discussapi'
import { useCloseMutation } from '../../Services/adminapi';
import { Button } from '@mui/material';
import { getDiscussions, likeDiscussions} from '../../Store/reducers/discussionReducer';
import { replyDiscussion} from '../../Store/reducers/discussionReducer';
import { useAddReplyMutation } from '../../Services/discussapi'
import { AppDispatch, RootState, useAppSelector } from "../../Store/store";
import { useDispatch, useSelector } from "react-redux";
import { JwtPayload, jwtDecode } from 'jwt-decode';
import { ThumbUpAltOutlined } from '@mui/icons-material';

interface Like{
  _id:string;
  id:string;
  user:string;
}
interface MyToken extends JwtPayload {
  role: any;
  user: string;
  exp: number;
  _doc:any;
  _id:string;
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
interface DiscussProps {
  discuss: any; // Adjust 'any' to the actual type of 'discuss' prop
}
const  Cards:React.FC<DiscussProps>=({discuss})=> { 
  const [expanded, setExpanded] = React.useState(false);
  const [user, setUser] = useState<MyToken| null>(null);
  const [content ,setContent] =useState<string>("")
  const [role,setRole] =useState<boolean>(true);
  const [like,setLike] =useState<Like[]>([]);
  const [addReply]=useAddReplyMutation();
  const { data: discussions, error, isLoading } = useGetDiscussionQuery();
  const [close]=useCloseMutation();
  const dispatch=useDispatch<AppDispatch>();
  const discussion = useSelector((state: RootState) => state.discuss.discussions);
  console.log("in use selector of Discussion",discussion);
  const filterUserId = useSelector((state: RootState) => state.discuss);
  // console.log("in use selector replies filter",filterUserId);
  //why discussions
  useEffect(()=>{
    // console.log("in use selector replies filter",filterUserId);

    fetchDiscussions();
    const token = localStorage.getItem('token');

if (token) {
  try{
      const decodedToken = jwtDecode<MyToken>(token);
      console.log(`in decode ${JSON.stringify(decodedToken)}`);
      //check
    
          setUser(decodedToken);
          console.log("inuser",decodedToken);
          if(decodedToken.role==="ADMIN"){
            setRole(true);
          }
          
          
        
  }catch(error){console.error('failed todecode',error)}; }
   },[discussions,dispatch])
  const handleExpandClick = () => {
    setExpanded(!expanded);
  };
 
 

  // const id="66727439a71b6be5966a5507"


//to correct
  const filteredDiscussions = filterUserId
    ? discussion.filter((discussion: { user: any; }) => discussion.user === filterUserId)
    : discussion; 
//  console.log("in filterediscussion",filteredDiscussions);
//  console.log("in use selector replies filter",filterUserId);
   const fetchDiscussions = async ()=>{
    try{
      if(discussions){
  
        console.log("check rendering of component");
        const transformedDiscussions: Discussion[] = discussions.data.map((discussion: any) => ({
          id: discussion._id,
          title: discussion.title,
          content: discussion.content,
          user: discussion.user,
          replies: discussion.replies.map((reply: any) => ({
            content: reply.content,
            user: reply.user,
            id: reply._id
          })),
          likes: discussion.likes // Assuming likes is an array of user ids
        }));

        // Dispatch the getDiscussion action with transformed discussions
        dispatch(getDiscussions({ discussions: transformedDiscussions }));
    
      }
    }catch(error:any){

      console.log("erroris",error.message);
    }
  }
   const[likeDiscussion] = useLikeDiscussionMutation() 

const handleSubmit=async(id: string)=>{
    console.log("in handleSubmit",id)
      try{
        //error handling
        const response =await addReply({content,discussionId:id});
     
        if (response.data) {
            const reply: Reply = {
              content: response.data.data.content,
              user: response.data.data.user,
              id: response.data.data._id
            };

            console.log("response ",reply)  
                 dispatch(replyDiscussion({discussionId:id,content:reply}));
          
        }else {
            console.error('Response data is undefined', response.error);
          }

    }catch(error){console.log("error  is",error)}
}



const handleLike=async(id: string)=>{
  console.log("in hqndle like",id)
  const i="6681574b289dd33719346837";
  //check
  //why not find and filter
  const discuss=discussion.find((discussion)=>discussion.id===id)
  console.log("in find discussion",discuss);
  const hasLikedPost = discuss?.likes.some((l)=>l.user===i);
    console.log("in handleliked post",hasLikedPost);

   try{
 
    const like= await likeDiscussion({id:id});
    if(like.data){
      //
      // const user=like.data.data._id;
      console.log("in like",like.data.data);
      console.log("in like user",user);
      dispatch(likeDiscussions({discussionId:id ,userId:like.data.data._id}));
      if (hasLikedPost){
const result=discuss?.likes.filter((like) => like.id !==user?.id )
console.log("result",result);
        // setLike(result);
        console.log("in set like",like);
      } else {
        // setLike([...discuss?.likes, user?.id]);
      }
    }

   }catch(e){console.log(e)}



  };
 const handleClose=async(id: string)=>{
  // const closed= await close({id:id});
  // console.log("in hadle clse",closed);
 }
  const Likes = () => {
    // console.log(like.map(like)=>like)
    if (like.length > 0) {
      return like?.find((like) => like === user.id)
        ? (
          <><ThumbUpIcon fontSize="small" />&nbsp;{like.length > 2 ? `You and ${like.length - 1} others` : `${like.length} like${like.length > 1 ? 's' : ''}` }</>
        ) : (
          <><ThumbUpAltOutlined fontSize="small" />&nbsp;{like.length} {like.length === 1 ? 'Like' : 'Likes'}</>
        );
    }

    return <><ThumbUpAltOutlined fontSize="small" />&nbsp;Like</>;
  };
  return (
       <>
            <Card sx={{ maxWidth: 345,margin:"6px 3px"  }}>
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
              subheader={`By:${discuss?.user}`}
            />
          
            <CardContent>
              <Typography variant="body2" color="text.secondary">
               {discuss.content}
              </Typography>
            </CardContent>
            <CardActions disableSpacing>
              {role ? (  <> <IconButton  onClick={()=>handleLike(discuss.id)} aria-label="add to favorites">
              <Likes />
               
              </IconButton>
              <IconButton  onClick={()=>handleClose(discuss.id)} aria-label="add to favorites">
                
                <BlockIcon />
              </IconButton> </>):( <IconButton  onClick={()=>handleLike(discuss.id)} aria-label="add to favorites">
              <Likes />
               
              </IconButton>)}
           
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
                {discuss.replies.map((reply:any) => (
                <ListItem key={reply.id}>
                  <ListItemText primary={reply.content} secondary={reply.user} />
                </ListItem>
              ))}
                 
                </List>
                <OutlinedInput
                  id="outlined-adornment-password"
                  sx={{ padding: '5px', width: '100%',height:'50px'}}
                  name="content"
                  label="Reply"
                  value={content} 
                  onChange={(e)=>setContent(e.target.value)}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={()=>handleSubmit(discuss.id)}
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
     </>)
  
}
export default  Cards