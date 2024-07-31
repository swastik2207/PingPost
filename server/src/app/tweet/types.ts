export const types = `#graphql


    type Tweet {
        id: ID!
        content: String!
        imageURL: String
        author: User
    }

    
    input  CreateTweetData {
        content: String!
        imageURL: String
    }
`;