import { prismaClient } from "../clients/db";
import { Tweet } from "../tweet";

export interface CreateTweetPayload {
    content: string;
    imageURL?: string;
    userId: string;
  }
  


 class TweetService{


    public static async createTweet(data:CreateTweetPayload){

        const tweet = await prismaClient.tweet.create({
            data: {
              content: data.content,
              imageURL: data.imageURL,
              author: { connect: { id: data.userId } },
            },
          });


          
          return tweet;

    }
    


 }


 export default TweetService;