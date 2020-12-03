import {GraphQLServer} from "graphql-yoga";
import {v4} from "uuid";


const users = [
    {
        id:"1",
        name:"Byson",
        email:"byson@gmail.com",
        age:25
    },
    {
        id:"2",
        name:"Tyson",
        email:"tyson@gmail.com"
    },
    {
        id:"3",
        name:"Lyson",
        email:"lyson@gmail.com",
        age:44
    }
];

const posts = [
    {
        id:"a1",
        title:"Fb post",
        body:"Lorem Ipsum loret Lorem Ipsum loretLorem Ipsum loretLorem Ipsum loret ",
        published:true,
        author:"1"
    },
    {
        id:"a2",
        title:"tweeter post",
        body:"Lorem Ipsum loret Lorem Ipsum loretLorem Ipsum loretLorem Ipsum loret ",
        published:false,
        author:"2"
    },
    {
        id:"a3",
        title:"youtube post",
        body:"Lorem Ipsum loret Lorem Ipsum loretLorem Ipsum loretLorem Ipsum loret ",
        published:true,
        author:"1"
    }
]

const comments = [
    {
        id:"c1",
        text:"The name of country is Bangladesh",
        author:"2",
        post:"a1"
    },
    {
        id:"c2",
        text:"Assalamu Alaikum",
        author:"1",
        post:"a2"
    },
    {
        id:"c3",
        text:"Wa Alaikum Assalam",
        author:"3",
        post:"a1"
    },
    {
        id:"c4",
        text: "Alhamdulillah",
        author:"2",
        post:"a3"
    }
]

const typeDefs = `
    type Query {
        users(query: String): [User!]!
        me: User!
        posts(query: String): [Post!]!
        comments(query: String): [Comment!]!
    }

    type User {
        id: ID!
        name: String!
        email: String!
        age: Int
        posts: [Post!]!
        comments:[Comment!]!
    }

    type Mutation {
        createUser(name:String!, email:String!,age:Int):User!
        createPost(title:String!, body:String!, published:Boolean!,author:ID! ):Post!
        createComment(text:String!,author:ID!,post:ID!):Comment!
    }

    type Post {
        id:ID!
        title: String!
        body: String!
        published: Boolean!
        comments:[Comment]!
        author: User!
    }

    type Comment {
        id: ID!
        text: String!
        author: User!
    }
`

const resolvers = {
    Query: {
      users(parent,args,ctx,info){
        if(!args.query){
            return users
        }
        return users.filter((user)=>{
            return user.name.toLowerCase().includes(args.query.toLowerCase())
        })
      },
      posts(parent,args,ctx,info){
        if(!args.query){
            return posts
        }
        return posts.filter((post)=>{
            const isTittleMatch =  post.title.toLowerCase().includes(args.query.toLowerCase());
            const isBodyMatch = post.body.toLowerCase().includes(args.query.toLowerCase())
            return isTittleMatch || isBodyMatch
        })
      },
      comments(parent,args,ctx,info){
          if(!args.query){
              return comments
          }

          return comments.filter((comment)=>{
            return comment.text.toLowerCase().includes(args.query.toLowerCase())
          })
      },
      me(parent,args,ctx,info){
          return {
              id: "12hdfghf",
              name: 'xYz',
              email: 'ldfhjsdf@gmail.com',
              age: 18
          }
      }
    },
    Mutation:{
        createUser(parent,args,ctx,info){
            const emailTaken = users.some((user)=>{
                return user.email === args.email
            })
            if(emailTaken){
                throw new Error('Email has already been taken');
            }
            const user = {
                    id:v4(),
                    name:args.name,
                    email:args.email,
                    age:args.age
                }
            users.push(user);
            return user;
            
        },
        createPost(parent,args,ctx,info){
            const userExists = users.some((user)=>{
                return user.id === args.author
            })
            if(!userExists){
                throw new Error('User does not exists');
            }
            const post = {
                id:v4(),
                title:args.title,
                body:args.body,
                published:args.published,
                author:args.author
            }

            posts.push(post);
            return post
        },
        createComment(parent,args,ctx,info){
            const userExists = users.some((user)=>{
                return user.id === args.author
            });

            const postExists = posts.some((post)=>{
                return post.id === args.post && post.published
            });

            

            if(!userExists){
                throw new Error('User does not exists')
            }else if(!postExists){
                throw new Error('Post does not exists')
            }else if(!isPublished){
                throw new Error('Post has not been published yet!')
            }

            const comment = {
                id:v4(),
                text:args.text,
                author:args.author,
                post:args.post
            }

            comments.push(comment);

            return comment;

        }
    },
    User:{
        posts(parent,args,ctx,info){
            return posts.filter((post)=>{
                return post.author === parent.id
            })
        },
        comments(parent,args,ctx,info){
            return comments.filter((comment)=>{
                return comment.author === parent.id
            })
        }
    },
    Post:{
        author(parent,args,ctx,info){
            return users.find((user)=>{
                return user.id === parent.author
            })
        },
        comments(parent,args,ctx,info){
            return comments.filter((comment)=>{
                return parent.id === comment.post
            })
        }
    },
    Comment:{
        author(parent,args,ctx,info){
            return users.find((user)=>{
                return user.id===parent.author
            })
        }
    }
}

const server = new GraphQLServer({
    typeDefs,
    resolvers
})

server.start(()=>{
    console.log("graphQL server is up at port:4000")
})