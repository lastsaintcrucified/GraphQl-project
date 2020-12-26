import "@babel/polyfill";
import {GraphQLServer,PubSub} from "graphql-yoga";
import db from "./db.js";
import {resolvers,fragmentReplacements} from "./resolvers/index";
import prisma from './prisma.js';

const pubSub = new PubSub();

const server = new GraphQLServer({
    typeDefs:"./src/schema.graphql",
    resolvers,
    context(request){
        return {
            db,
            pubSub,
            prisma,
            request
        }
    },
    fragmentReplacements
})

server.start({port: process.env.PORT || 4000}, ()=>{
    console.log("graphQL server is up at port:4000")
})