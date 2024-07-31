
import { prismaClient } from "../clients/db";






class UserService {

  public static getUserById(id: string) {
    return prismaClient.user.findUnique({ where: { id } });
  }

   public static async  followUser(from: string, to: string) {
  
     return await prismaClient.follows.create({
       data: {
       follower: { connect: { id: from } },
       following: { connect: { id: to } },
     }
       });
   }

  public static async unfollowUser(from: string, to: string) {
    return await prismaClient.follows.delete({
           where: { followerId_followingId: { followerId: from, followingId: to } },
    });
  }
}

export default UserService;