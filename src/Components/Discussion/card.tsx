import React ,{ Key, useEffect, useState } from 'react';
import { JSX } from 'react/jsx-runtime';
import { useGetDiscussionQuery } from '../../Services/discussapi'
import { getDiscussions} from '../../Store/reducers/discussionReducer';
import { useAddReplyMutation } from '../../Services/discussapi'
import { AppDispatch, RootState, useAppSelector } from "../../Store/store";
import { useDispatch, useSelector } from "react-redux";
import { JwtPayload, jwtDecode } from 'jwt-decode';
import Cards from './c';

interface Like{
  id:string;
}
interface MyToken extends JwtPayload {
  role: any;
  user: string;
  exp: number;
  _doc:any;
  _id:string;

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

const  RecipeReviewCard: () => JSX.Element=()=> {
  const [user, setUser] = useState<MyToken| null>(null);
  const [role,setRole] =useState<boolean>(false);
  const [addReply]=useAddReplyMutation();
  const { data: discussions, error, isLoading } = useGetDiscussionQuery();
  const dispatch=useDispatch<AppDispatch>();

  useEffect(()=>{

    fetchDiscussions();
    const token = localStorage.getItem('token');

if (token) {
  try{
      const decodedToken = jwtDecode<MyToken>(token);
      console.log(`in decode ${JSON.stringify(decodedToken.role)}`);
      //check
    
          setUser(decodedToken);
          if(decodedToken.role==="ADMIN"){
            setRole(true);
          }
          
          
        
  }catch(error){console.error('failed todecode',error)}; }
   },[discussions,dispatch])
  
  const discussion = useSelector((state: RootState) => state.discuss.discussions);
  const filterUserId = useSelector((state: RootState) => state.discuss.filterUserId);

  const result=discussion.filter(discuss =>  {return discuss.user===filterUserId } )
  console.log("result",filterUserId,"than ",result)

  const filteredDiscussions = filterUserId
    ? discussion.filter(discuss =>  {return discuss.user===filterUserId } )
    : discussion; 
 console.log("in filtereddis",filteredDiscussions)
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

        dispatch(getDiscussions({ discussions: transformedDiscussions }));
    
      }
    }catch(error:any){

      console.log("erroris",error.message);
    }
  }


  return (
<>
    {filteredDiscussions && filteredDiscussions?.length > 0 ? ( <>
        {filteredDiscussions.map((discussion:any)=> (
         <Cards  discuss={discussion} /> ))}

</>):(
        <p>No discussions found.</p>
      )}
   </>
  );
}
export default  RecipeReviewCard

