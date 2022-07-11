import { ApolloServer, gql } from "apollo-server"

const users = [
    {
        id: "1",
        firstName: "Renzo",
        lastName: "Regio"
    },
    {
        id: "2",
        firstName: "John",
        lastName: "Doe"
    }
]

const tweets = [
    {
        id: "1",
        text: "First Tweet",
        userId: "2"
    },
    {
        id: "2",
        text: "Second Tweet",
        userId: "1"
    }
]

const typeDefs = gql`
    type User {
        id: ID!
        firstName: String!
        lastName: String!
        """
        First name and last name combined
        """
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
        allMovies: [Movie!]!
    }

    type Mutation {
        postTweet(text: String!, userId: ID!): Tweet!
        deleteTweet(id: ID!): Boolean!
    }

    type Movie {
        id: Int!
        url: String!
        imdb_code: String!
        title: String!
        title_english: String!
        title_long: String!
        slug: String!
        year: Int!
        rating: Float!
        runtime: Float!
        genres: [String]!
        summary: String
        description_full: String!
        synopsis: String
        yt_trailer_code: String!
        language: String!
        background_image: String!
        background_image_original: String!
        small_cover_image: String!
        medium_cover_image: String!
        large_cover_image: String!
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
        },
        allMovies() {
            return fetch("https://yts.mx/api/v2/list_movies.json").then(r => r.json()).then(json => json.data.movies)
        }
    },
    Mutation: {
        postTweet(_, { text, userId }) {
            const user = users.find(user => user.id === userId)
            if (!user) {
                console.log("ERROR")
                return null
            }

            const tweet = { id: (tweets.length + 1).toString(), text, userId }
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
    },
    Tweet: {
        author({ userId }) {
            return users.find(user => user.id === userId)
        }
    }
}

const server = new ApolloServer({ typeDefs, resolvers })

server.listen().then(({ url }) => {
    console.log(`Running on: ${url}`)
})