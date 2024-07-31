


import axios from "axios";
import { prismaClient } from "../clients/db";
import JWTService from "../services/jwt";
import { User } from "@prisma/client";
import { GraphqlContext } from "../../interfaces";
import { Tweet } from "../tweet";
import UserService from "../services/user";
import {redisClient} from "../clients/redis";
interface GoogleTokenResult{

    iss: string,
    azp: string,
    aud: string,
    sub: string,
    email: string,
    email_verified:string ,
    nbf: string,
    name: string,
    picture: string,
    given_name: string,
    family_name: string,
    iat: string,
    exp:string,
    jti: string,
    alg: string,
    kid: string,
    typ:string

}
const queries={
    verifyGoogleToken:async(parent:any,{token}:{token:string})=>{
        const googletoken=token;
        const googleOauthURL=new URL("https://oauth2.googleapis.com/tokeninfo")
        googleOauthURL.searchParams.set("id_token",googletoken);

        const {data}=await axios.get<GoogleTokenResult>(googleOauthURL.toString(),{
            responseType:"json",
        })


        const checkForUser=await prismaClient.user.findUnique({
            where:{email:data.email},

        })
        

    console.log("5555");
        if(!checkForUser){
            await prismaClient.user.create({
                data:{
                    
                    firstName:data.given_name,
                    lastName:data.family_name,
                    email:data.email,
                    profileImageURL:data.picture
                },
                
            })
        }
        const userDb=await prismaClient.user.findUnique({
            where:{email:data.email},

        })
    
       // console.log(userDb.)
       if (!userDb) throw new Error("User with email not found");

        const usertoken=await JWTService.generateTokenForUser(userDb)
        return usertoken;

    }
,
    getCurrentUser: async(parent:any,args:any,ctx:GraphqlContext)=>{
        console.log(ctx);
         const id=ctx.user?.id as string;
         if(!id)return null;
         const user = await prismaClient.user.findUnique({where:{id}})
         return user;
     }
     ,

     getUserById:async(parent:any,{id}:{id:string},ctx:GraphqlContext)=>{
return UserService.getUserById(id);


     }
}


const extraResolver={
    User:{
        tweets:(parent:User)=>prismaClient.tweet.findMany({where:{authorId:parent.id}}),
        followers: async (parent:User)=>{
            const result=await prismaClient.follows.findMany({where:
                {following:{id:parent.id}},
                include:{
                    follower:true,
                    following:true
                }
            });
    
            return result.map(el=>el.follower)

        },
        following:async(parent:User)=>{
            
           const result=await prismaClient.follows.findMany({where:
            {follower:{id:parent.id}},
            include:{
                follower:true,
                following:true
            }
        });

        return result.map(el=>el.following)
        },
        recommendedUsers: async (parent: User, _: any, ctx: GraphqlContext) => {
            if (!ctx.user) return [];
             const cachedValue = await redisClient.get(
               `RECOMMENDED_USERS:${ctx.user.id}`
             );
      
             if (cachedValue) {
              console.log("Cache Found");
               return JSON.parse(cachedValue as string);
             }
      
            const myFollowings = await prismaClient.follows.findMany({
              where: {
                follower: { id: ctx.user.id as string},
              },
              include: {
                following: {
                  include: { followers: { include: { following: true } } },
                },
              },
            });
      
            const users: User[] = [];
      
            for (const followings of myFollowings) {
              for (const followingOfFollowedUser of followings.following.followers) {
                if (
                  followingOfFollowedUser.following.id !== ctx.user.id &&
                  myFollowings.findIndex(
                    (e) => e?.followingId === followingOfFollowedUser.following.id
                  ) < 0
                ) {
                  users.push(followingOfFollowedUser.following);
                }
              }
            }
      
             console.log("Cache Not Found");
             await redisClient.set(
              `RECOMMENDED_USERS:${ctx.user.id}`,
               JSON.stringify(users)
             );
      
            return users;
          },
        

    }
}

const mutations={
    followUser:async(parent:any,{to}:{to:string},ctx:GraphqlContext)=>{
        if(!ctx.user)throw new Error("unauthenticated");
        await redisClient.del(`RECOMMENDED_USERS:${ctx.user.id}`);
        await UserService.followUser(ctx.user.id as string,to);
        return true;
    },

    unfollowUser:async(parent:any,{to}:{to:string},ctx:GraphqlContext)=>{
        if(!ctx.user)throw new Error("unauthenticated");
        await redisClient.del(`RECOMMENDED_USERS:${ctx.user.id}`);
        await UserService.unfollowUser(ctx.user.id as string,to);
        return true;
    }
}
export const resolvers={queries,extraResolver,mutations} ;