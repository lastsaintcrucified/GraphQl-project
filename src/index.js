import {GraphQLServer,PubSub} from "graphql-yoga";
import db from "./db.js";
import Query from "../src/resolvers/Query";
import Mutation from "../src/resolvers/Mutation";
import Subscription from "../src/resolvers/Subscription";
import User from "../src/resolvers/User";
import Post from "../src/resolvers/Post";
import Comment from "../src/resolvers/Comment";
import './prisma.js';

const pubSub = new PubSub();

const server = new GraphQLServer({
    typeDefs:"./src/schema.graphql",
    resolvers:{
        Query,
        Mutation,
        Subscription,
        User,
        Post,
        Comment
    },
    context:{
        db,
        pubSub
    }
})

server.start(()=>{
    console.log("graphQL server is up at port:4000")
})