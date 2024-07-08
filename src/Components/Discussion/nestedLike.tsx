import React, { useState } from "react";
import {
  IconButton,
  InputAdornment,
  ListItem,
  ListItemText,
} from "@mui/material";
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
}
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { likeReply } from "../../Store/reducers/discussionReducer";
import { AppDispatch } from "../../Store/store";
import { useDispatch } from "react-redux";
import { useAddReplyLikeMutation } from "../../Services/discussapi";
const nestedLike: React.FC<{
  r: Reply;
  user: string | undefined;
  discussionId: string;
}> = ({ r, user, discussionId }) => {
  console.log("in nestedLike r", r);
  const [replyL, setReplyL] = useState<newlike[]>(r?.likes);
  const dispatch = useDispatch<AppDispatch>();
  const [addReplyLike] = useAddReplyLikeMutation();
  const handleLike = async ({
    reply,
    discussionId,
    user,
  }: {
    reply: Reply;
    discussionId: string;
    user: string | undefined;
  }) => {
    try {
      //reply
      const replylike = await addReplyLike({ id: reply.id });
      console.log("im handle nested like debugging step2", reply);
      console.log("in  nested replyLike function", replylike);
      if (replylike) {
        console.log("in nested  likes", replylike);
      }
      if (user && replylike) {
        const hasLikedPost = reply?.likes.some(
          (like: any) => like.user === user
        );
        console.log("in handlereplyliked post", hasLikedPost);
        if (hasLikedPost) {
          const result = reply?.likes.filter((like: any) => like.user !== user);
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
          console.log("in usestae", replyL);
        } else {
          console.log("user liked");
          const newLike = { user: user };
          const updatedLikes = [...reply.likes, newLike];
          console.log("Updated likes after addition:", updatedLikes);
          setReplyL(updatedLikes || []);
          console.log("in usestae after addition", replyL);
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
    if (replyL?.length > 0) {
      return replyL?.find((like) => like) ? (
        <>
          <FavoriteIcon />
          &nbsp;
          {replyL.length}
        </>
      ) : (
        <>
          <FavoriteBorderIcon />
          &nbsp;{replyL?.length}{" "}
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
      <ListItem key={r.id}>
        <ListItemText secondary={r.content} primary={r.name} />
      </ListItem>
      <IconButton
        onClick={() => handleLike({ reply: r, discussionId, user })}
        aria-label="add to favorites"
      >
        <ReplyLikes />
      </IconButton>
    </>
  );
};

export default nestedLike;
