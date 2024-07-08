import { IconButton, ListItem, ListItemText } from '@mui/material'
import React, { useState } from 'react'
import { likeReply } from '../../Store/reducers/discussionReducer';
import { AppDispatch, RootState } from "../../Store/store";
import { useDispatch, useSelector } from "react-redux";
import {
    useAddReplyMutation,
    useAddReplyLikeMutation,
  } from "../../Services/discussapi";
interface Like {
    _id: string;
    id: string;
    user: string;
  }
  interface Reply {
    id: string;
    content: string;
    user: string;
    name: string;
    replies: Reply[];
    likes: Like[];
  }
  interface newlike {
    user: string;
  }import FavoriteIcon from "@mui/icons-material/Favorite";
  import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
const discussreplylike:React.FC<{reply:Reply,discussionId: string,  user: string | undefined}> = ( {user, discussionId,reply}   ) => {
    const [addReplyLike] = useAddReplyLikeMutation();
    const [replyL, setReplyL] = useState<newlike[]>(reply?.likes);

    console.log("in discussion reply like",replyL);
    const dispatch = useDispatch<AppDispatch>();
    const handleReplyLike = async ({
        reply,
        discussionId,
      }: {
        reply: Reply;
        discussionId: string;
      }) => {
        console.log("in handle like", user);
    
        try {
          const replylike = await addReplyLike({ id: reply.id });
          console.log("in replyLike function", replylike);
          if (replylike) {
            console.log("in likes", replylike);
          }
          if (user && replylike) {
            const hasLikedPost = reply?.likes.some(
              (like: any) => like.user === user
            );
            console.log("in handlereplyliked post", hasLikedPost);
            if (hasLikedPost) {
              const result = reply?.likes.filter(
                (like: any) => like.user !== user
              );
              console.log("result of like", result);
              setReplyL(result || []);
              console.log("after setreply", replyL);
              dispatch(
                likeReply({
                  replyId: reply.id,
                  discussionId: discussionId,
                  userId: user,
                  action: "dislike",
                })
              );
        
            } else {
              console.log("user liked");
              const newLike = { user: user};
              const updatedLikes = [...reply.likes, newLike];
              console.log("Updated likes after addition:", updatedLikes);
              setReplyL(updatedLikes || []);
              console.log("after setreply", replyL);
              dispatch(
                likeReply({
                  replyId: reply.id,
                  discussionId,
                  userId: user,
                  action: "like",
                })
              );

            }
          }
        } catch (e) {
          console.log(e);
        }
      };


      const ReplyLikes = () => {
        console.log("in ReplyLikes", user);
        if (replyL.length > 0) {
          return replyL?.find((like) => like.user===user) ? (
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
        return (
          <>
            <FavoriteBorderIcon />
          </>
        );
      };
  return (
    <>
    <ListItem key={reply.id}>
                    <ListItemText
                      secondary={reply.content}
                      primary={reply.name}
                    />
                  </ListItem>
                  <IconButton
                    onClick={() =>
                      handleReplyLike({ reply, discussionId: discussionId })
                    }
                    aria-label="add to favorites"
                  >
                    <ReplyLikes  />
                  </IconButton>
    
    </>
  )
}

export default discussreplylike
