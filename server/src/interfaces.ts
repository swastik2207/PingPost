export interface JWTUser{
    id:String;
    email:String;
}

export interface GraphqlContext{

    user?:JWTUser;


}