import { IconButton, InputAdornment, List, ListItem, ListItemText, OutlinedInput } from "@mui/material";
import { useState } from "react";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import { useAddNestedReplyMutation } from "../../Services/discussapi";
import { AppDispatch, RootState } from "../../Store/store";
import { useDispatch, useSelector } from "react-redux";
import { nestedreply } from "../../Store/reducers/discussionReducer";
import FavoriteIcon from '@mui/icons-material/Favorite';
interface Like {
  _id: string;
  id: string;
  user: string;
}
interface Reply {
    id: string;
    content: string;
    user: string;
    name:string;
    replies: Reply[];
    likes: Like[];
  }
const nestedReply: React.FC<{ id: string; discussId: string }> = ({
  id,
  discussId,
}) => {
  const [content, setContent] = useState<string>("");
  const [addNestedReply] = useAddNestedReplyMutation();
  const dispatch = useDispatch<AppDispatch>();
  const findReplyById = (replies: Reply[], id: string): Reply | null => {
    console.log("findReplyById",replies,id)
    for (const reply of replies) {
      if (reply.id === id) {
        console.log("in reply ",reply);
        return reply;
      }
    //   const nestedReply = findReplyById(reply.replies, id);
  
    //   if (nestedReply) {
    //     console.log("nested reply")
    //     return nestedReply;
    //   }
    }
    return null;
  };
//6684eb95de93c2f0fbe097e7

const handleLike=()=>{

}
  const selectReplyById = (state: RootState, discussId: string, id: string) => {
    const discussion = state.discuss.discussions.find(
      (discussion: any) => discussion.id === discussId
    );
    if (discussion) {
      console.log("discussion", discussion);
      return findReplyById(discussion.replies, id);
    }
    return null;
  };
  const reply = useSelector((state: RootState) =>
    selectReplyById(state, discussId, id)
  );

  console.log("in nested comments reply discussion ", reply);

  const handleSubmit = async (id: string) => {
    console.log("in handleSubmit", id);
    try {
      console.log("content is:", content);
      const response = await addNestedReply({
        content,
        discussionId: discussId,
        replyId: id,
      });
      console.log("in handleSubmit of nestedreply", response);
      if (response.data) {
        const nestedR: Reply = {
          content: response.data.data.content,
          user: response.data.data.user,
          id: response.data.data._id,
          name: response.data.data.name,
          replies: response.data.data.replies,
          likes: response.data.data.likes,
        };
        console.log("response ", nestedreply);
        dispatch(
          nestedreply({
            discussionId: discussId,
            content: nestedR,
            replyId: id,
          })
        );
      } else {
        console.error("Response data is undefined", response.error);
      }
    } catch (error) {
      console.log("error  is", error);
    }
  };
  return (
    <>
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
              onClick={() => handleSubmit(id)}
              edge="end"
            >
              <ArrowRightIcon />
            </IconButton>
          </InputAdornment>
        }
      />
 <List sx={{ maxHeight: 100, overflow: "auto" }}>
              {reply?.replies.map((r: any) => (
                <>
                <ListItem key={r.id}>
                  <ListItemText
                   secondary={r.content}
                   primary={r.name}
                  />
                </ListItem>
                 <FavoriteIcon
                 onClick={() => handleLike()}
                 aria-label="add to favorites"
               >
                 {/* <Likes /> */}
               </FavoriteIcon>
                {/* <NestedReply id={reply.id} discussId={discuss.id}/> */}
               </>
              ))}
            </List>
    </>
  );
};

export default nestedReply;
