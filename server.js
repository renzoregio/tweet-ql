import { ApolloServer, gql } from "apollo-server"

const users = [
    {
        id: "1",
        firstName: "Renzo",
        lastName: "Regio"
    }
]

const tweets = [
    {
        id: "1",
        text: "First Tweet"
    },
    {
        id: "2",
        text: "Second Tweet"
    }
]

const typeDefs = gql`
    type User {
        id: ID!
        firstName: String!
        lastName: String!
        fullName: String!
    }

    type Tweet {
        id: ID!
        text: String!
        author: User
    }

    type Query {
        allTweets: [Tweet!]!
        tweet(id: ID!): Tweet
        allUsers: [User!]!
    }

    type Mutation {
        postTweet(text: String!, userId: ID!): Tweet!
        deleteTweet(id: ID!): Boolean!
    }
`

const resolvers = {
    Query: {
        allTweets() {
            return tweets;
        },
        tweet(_, { id }) {
            return tweets.find(tweet => tweet.id === id)
        },
        allUsers() {
            return users
        }
    },
    Mutation: {
        postTweet(_, { text, userId }) {
            const tweet = { id: (tweets.length + 1).toString(), text }
            tweets.push(tweet)
            return tweet
        },
        deleteTweet(_, { id }) {
            for (let i = 0; i < tweets.length; i++) {
                if (tweets[i].id === id) {
                    tweets.splice(i, 1)
                    return true
                }
            }

            return false
        }
    },
    User: {
        fullName(root) {
            return `${root.firstName} ${root.lastName}`
        }
    }
}

const server = new ApolloServer({ typeDefs, resolvers })

server.listen().then(({ url }) => {
    console.log(`Running on: ${url}`)
})