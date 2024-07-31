 import { Tweet } from "@prisma/client";
import { GraphqlContext } from "../../interfaces";
import { CreateTweetPayload } from "../services/tweet";
import TweetService from "../services/tweet";
import { prismaClient } from "../clients/db";
import { redisClient } from "../clients/redis";



const queries={
  getAllTweets:async()=>{
    const cachedTweets = await redisClient.get("ALL_TWEETS");
    if (cachedTweets) return JSON.parse(cachedTweets);
   const tweets=await prismaClient.tweet.findMany({orderBy:{createdAt:"desc"}})
   redisClient.set("ALL_TWEETS",JSON.stringify(tweets));
   return tweets
  }
   
}

const mutations = {
    createTweet: async (
      parent: any,
      { payload }: { payload: CreateTweetPayload },
      ctx: GraphqlContext
    ) => {
      const rateLimit = await redisClient.get(`RATE_LIMIT_TWEET:${ctx.user?.id}`)
      if(rateLimit)throw new Error("Please wait ...");
      if (!ctx.user) throw new Error("You are not authenticated");
      const tweet = await TweetService.createTweet({
        ...payload,
        userId:  ctx.user.id as string,
      });
     await redisClient.setex(`RATE_LIMIT_TWEET:${ctx.user?.id}`,10,1) ;
     await redisClient.del("ALL_TWEETS");
      return tweet;
    },
  };
 
  const extraResolver={
    Tweet:{
      author:(parent:Tweet)=>prismaClient.user.findUnique({where:{id:parent.authorId}})
    }
  }
  
export const resolvers={mutations,extraResolver,queries};

