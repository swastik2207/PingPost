

import React from "react";
import { AiOutlineHeart } from "react-icons/ai";
import { BiMessageRounded, BiUpload } from "react-icons/bi";
import { FaRetweet } from "react-icons/fa";
import { Tweet } from "@/gql/graphql";
import { useRouter } from "next/navigation";
import Link from "next/link";
interface FeedCardProps {
    data: Tweet;
  }
const FeedCard:React.FC<FeedCardProps>=(props)=>{
    const router = useRouter();

    return(
         <div className="border border-gray-600 p-4 hover:bg-slate-900 transition-all cursor-pointer border-b-0">
            <div className="grid grid-cols-12 gap-3">
            <div className="col-span-1 ">

             <img src={props.data.author?.profileImageURL} alt="Profile Image" height={50} width={50}
              onClick={()=>router.push(`/${props.data.author?.id}`)}/>

            </div>
            <div className="col-span-11"> 

            
            <Link href={`/${props.data.author?.id}`}>
              {props.data.author?.firstName} {props.data.author?.lastName}
            </Link>
                <p>{props.data?.content}</p>
                <div>{props.data.imageURL ? (<img src={props.data.imageURL}></img>
                            ):null}
</div>
                <div className="flex justify-between mt-5 font-bold items-center pr-2 w-[90%]">
                <div>
                    <BiMessageRounded/>
                </div>

                <div>
                    <FaRetweet/>
                </div>
                <div>
                     <AiOutlineHeart/>
                </div>
                <div>
                    <BiUpload/>
                </div>
                </div>
            </div>
              

            </div>

        </div>
    )
}

export default FeedCard;