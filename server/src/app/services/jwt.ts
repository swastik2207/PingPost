
import JWT from "jsonwebtoken";
import { prismaClient } from "../clients/db";
import { User } from "@prisma/client";
import { JWTUser } from "../../interfaces";

const JWTSecret = "AV/2wUATkH/oLCNynL2XgQ==";
export class JWTService {
public static async generateTokenForUser(user:User){

    const payload: JWTUser = {
        id: user?.id,
        email: user?.email,
      };
    

    const token=JWT.sign(payload,JWTSecret)
    return token
}

public static decodeToken(token:string){
    console.log(token)
    //console.log(JWT.verify(token,JWTSecret))
    try{
    if(token!==null)    
    return JWT.verify(token,JWTSecret)as JWTUser
    else
    return null
    }
    catch(err){
        return null
    }
}
	
}
export default JWTService;