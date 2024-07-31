
import { Inter } from "next/font/google";
import { SlSocialVkontakte } from "react-icons/sl";
import React, { useCallback, useDebugValue, useState } from "react";
import { ReactNode } from "react";
import { IoMdHome } from "react-icons/io";
import { BiHash, BiImage, BiImageAlt, BiUser } from "react-icons/bi";
import { BsBell, BsBookmark, BsEnvelope } from "react-icons/bs";
import FeedCard from "@/components/FeedCard";
import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import toast from "react-hot-toast";
import { graphqlClient } from "@/clients/api";
import { verifyUserGoogleTokenQuery } from "@/graphql/query/user";
import { Token } from "graphql";
import { useCurrentUser } from "@/hooks/user";
import { headers } from "next/headers";
import { useQueryClient } from "@tanstack/react-query";
import { getAllTweets, useCreateTweet } from "@/hooks/tweet";
import { useRouter } from "next/navigation";
import Link from "next/link";


const inter = Inter({ subsets: ["latin"] });
interface SideButton{
  id:Number,
  title:String,
  icon: React.ReactNode,
  link:String
}

interface TwitterlayoutProps {
  children: React.ReactNode;
}


 // Adjust the type based on what `verifyGoogleToken` returns
interface GoogleTokenResult{
  verifyGoogleToken:string;
}

const PingpostLayout:React.FC<TwitterlayoutProps>=(props)=>{



const router=useRouter()

  const queryClient = useQueryClient();
  const {user}=useCurrentUser()
  const {tweets=[]}=getAllTweets()
  const [content,setContent]=useState("");


 
 
console.log(graphqlClient)

interface SideButton{
  id:Number,
  title:String,
  icon: React.ReactNode,
  link:String
}


const sideBarMenu:SideButton[]=[
  {
    id:1,
    title:"Home",
    icon:<IoMdHome/>,
    link:"/"
  },
  {
    id:2,
    title:"Explore",
    icon:<BiHash/>,
    link:"/"

  },
  {
    id:3,
    title:"Notification",
    icon: <BsBell/>,
    link:"/"
  },
  {
    id:4,
    title:"Messages",
    icon:<BsEnvelope/>,
    link:"/"
  },
  {
    id:5,
    title:"BookMark",
    icon:<BsBookmark/>,
    link:"/"
  },
  {
    id:6,
    title:"Profile",
    icon:<BiUser/>,
    link:`/${user?.id}`
    
  }
]





  const handleLoginWithGoogle=useCallback(async(cred:CredentialResponse)=>{
    const googletoken=cred.credential;
    if(!googletoken){
      toast.error(`Google token not Found`)

    }

try{
     const { verifyGoogleToken } = await graphqlClient.request(
        verifyUserGoogleTokenQuery,
       { token: googletoken||" " }
     );

     toast.success("Verified Success");
      console.log(verifyGoogleToken);
      if(verifyGoogleToken)
      window.localStorage.setItem("__PingPost_token",verifyGoogleToken)
      await queryClient.invalidateQueries(["current-user"]);
    }
    catch(e){
      console.log(500 , e)
    }



  },[user])
  


  return (


<div className="grid grid-cols-12 h-screen w-screen px-56">
  <div className="col-span-3 pl-16 px-15  justify-start pt-8">
  
  <SlSocialVkontakte className="text-6xl text-black bg-white h-fit  hover:bg-gray-200  p-2 cursor-pointer transition-all rounded-full"/>
  <div className="mt-7 text-xl font-semibold pr-4">
    <ul>
    {
    sideBarMenu.map((item)=>(

      <li
      className="flex justify-start items-start gap-2 text-white  p-2 w-fit rounded-px-4 hover:bg-gray-800 rounded-full cursor-pointer"  
      key={item.id} 
      onClick={()=>router.push(`${item.link}`)}>
        <span>
          {item.icon}
        </span>
        <span>
          {item.title}
        </span>
        
      </li>
 
    ))
  }  
</ul>
<div className="mt-5 pr-10">

<button className="text-white rounded-full hover:opacity-50 bg-blue-600 w-full  font-lg">Post</button>

</div>
</div>

  
  </div>

  
 
  <div className="col-span-6  border-r-[1px] border-l-[1px] border-gray-600">
 {props.children} 
  </div>
  <div className="col-span-3 p-5">
  {!user ? (
            <div className="p-5 bg-slate-700 rounded-lg">
              <h1 className="my-2 text-2xl">New to Twitter?</h1>
              <GoogleLogin onSuccess={handleLoginWithGoogle} />
            </div>
          ) : (
            <div className="px-4 py-3 bg-slate-800 rounded-lg">
              <h1 className="my-2 text-2xl mb-5">Users you may know</h1>
              {user?.recommendedUsers?.map((el) => (
                <div className="flex items-center gap-3 mt-2" key={el?.id}>
                  {el?.profileImageURL && (
                    <img
                      src={el?.profileImageURL}
                      alt="user-image"
                      className="rounded-full"
                      width={60}
                      height={60}
                    />
                  )}
                  <div>
                    <div className="text-lg">
                      {el?.firstName} {el?.lastName}
                    </div>
                    <Link
                      href={`/${el?.id}`}
                      className="bg-white text-black text-sm px-5 py-1 w-full rounded-lg"
                    >
                      View
                    </Link>
                  </div>
                </div>
              ))}
              <div className="px-12">
              <button className="bg-white text-black items-center p-3"
              onClick={async()=>{
                window.localStorage.setItem("__PingPost_token","");
                await queryClient.invalidateQueries(["current-user"]);

              }}>LogOut</button>
              </div>
            </div>
          )}

  

</div>
    
</div>
  


  );
}
export default PingpostLayout;