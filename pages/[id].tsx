 
import PingpostLayout from "@/components/FeedCard/Layout/PingPostLayout";
import { NextPage } from "next";
import { BsArrowLeftShort } from "react-icons/bs";
import FeedCard from "@/components/FeedCard";
import Image from "next/image";
import { useCurrentUser } from "@/hooks/user";
import { Tweet } from "@/gql/graphql";
import { useRouter } from "next/router";
import { User } from "@/gql/graphql";
import { useEffect, useMemo, useState,useCallback } from "react";
import { graphqlClient } from "@/clients/api";
import { getUserByIdQuery } from "@/graphql/query/user";
import { GetServerSideProps } from "next";
import { followUserMutation ,unfollowUserMutation} from "@/graphql/mutations/user";
import { useQueryClient } from "@tanstack/react-query";
interface ServerProps {
  userInfo?: User;
}


const UserProfilePage:NextPage<ServerProps>=(props)=>{

const {user}=useCurrentUser();
const router=useRouter();
const {id}=router.query;
console.log(id)
const  queryClient = useQueryClient();

console.log(props)

  

  


const following = useMemo(()=>{

  
  return (
    (user?.following?.findIndex(
      (el) => el?.id === id
    ) ?? -1) >= 0
  );
  
},[user?.following])


const handleFollowUser = useCallback(async () => {
  if (!props.userInfo?.id) return;
  await graphqlClient.request(followUserMutation, { to: props.userInfo?.id });
  await queryClient.invalidateQueries(["current-user"]);

return true;
}, [props.userInfo?.id]);
const handleUnFollowUser = useCallback(async () => {
  if (!props.userInfo?.id) return;
  await graphqlClient.request(unfollowUserMutation, { to: props.userInfo?.id });
  await queryClient.invalidateQueries(["current-user"]);

return true;
}, [props.userInfo?.id]);


    return(
     <PingpostLayout>
    <div >

        <nav className="border flex items-center gap-3 py-3 px-3" >
            <BsArrowLeftShort className="text-4xl "/>

            <div>
            <h1 className="text-2xl">
                {props.userInfo?.firstName} {props.userInfo?.lastName}
            </h1>
            <h1 className="text-md font-bold text-slate-500 gap-3"> {props.userInfo?.tweets?.length}  Tweets</h1>
            </div>
        </nav>
    </div>
    <div className="p-4 border-b border-slate-200">
      {props.userInfo?.profileImageURL &&(  
        <img 
      src={props.userInfo?.profileImageURL}
      alt="user Image"
      className="rounded-full"
      width={100}
      height={100}/>


      )


    }
        <h1 className="text-2xl font-bold mt-5">
              {props.userInfo?.firstName} {props.userInfo?.lastName}
        </h1>
        <div className=" flex justify-between items-center">
         <div className="flex gap-4 mt-2 text-sm text-gray-500">
        
         <span>{props.userInfo?.followers?.length} Followers</span> 
        <span>{props.userInfo?.following?.length} Followings</span> 
        </div>
         
<div>
       { user? following ? (
                    <button
                      className="bg-white text-black px-3 py-1 rounded-full text-sm"
                      onClick={handleUnFollowUser}
                       
                    >
                      Unfollow
                    </button>
                  ) : (
                    <button
                
                      className="bg-white text-black px-3 py-1 rounded-full text-sm"
                      onClick={handleFollowUser}
                    >
                      Follow
                    </button>
                  )
                :null}
              
                
                  </div>
    </div>
    </div>

    <div>
        
 {   props.userInfo?.tweets?.map((tweet) =>(
              <FeedCard data={tweet as Tweet} key={tweet?.id} />
                   )
                  )
             }


        
    </div>
     </PingpostLayout>
     )
    
}

 export const getServerSideProps: GetServerSideProps<ServerProps> = async (
  context
) => {
  const id = context.query.id as string | undefined as string;
  console.log(id)

  if (!id) return { notFound: true, props: { userInfo: undefined } };

  const userInfo = await graphqlClient.request(getUserByIdQuery, { id });

  if (!userInfo?.getUserById) return { notFound: true };

  return {
    props: {
      userInfo: userInfo.getUserById as User,
    },
  };
};

export default UserProfilePage;