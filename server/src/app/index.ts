import express from 'express';

import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { User } from './user';
import bodyParser from 'body-parser';
import { GraphqlContext } from '../interfaces';
import JWTService from './services/jwt';
import cors from "cors";
import { Tweet } from './tweet';


 export async function initServer() {
    const app=express();
    app.use(bodyParser.json());
    app.use(cors())
    const graphqlserver = new ApolloServer<GraphqlContext>({
        typeDefs:`
        ${User.types}
        ${Tweet.types}
        type Query{
            ${User.queries}
            ${Tweet.queries}
        }
            type Mutation{
            ${Tweet.muatations}
            ${User.mutations}
            }
      

        `,
        resolvers:{
            Query:{
            ...User.resolvers.queries,
            ...Tweet.resolvers.queries
            
            },

            Mutation:{
              ...Tweet.resolvers.mutations,
              ...User.resolvers.mutations,
            },

            ...Tweet.resolvers.extraResolver,
            ...User.resolvers.extraResolver,
           
        
        },
     
    })
    await graphqlserver.start();
    
    app.use("/graphql",expressMiddleware(graphqlserver,
        {
            context: async ({ req, res }) => {

              try {

                const token = req.headers.authorization ? req.headers.authorization.split(' ')[1] : undefined;
                console.log(token)
                const user = token ? await JWTService.decodeToken(token) : null;
                return { user };
            } catch (error) {
                console.error('Error creating context:', error);
                throw new Error('Failed to create context');
            }
              
             
            },
          })
        
)
    return app
    
}
