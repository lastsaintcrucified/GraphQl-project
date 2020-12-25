import getUserId from "../utils/getUserId";

const Query = {
    users(parent,args,{ prisma }, info){
        const opArgs = {}
        if(args.query){
            opArgs.where = {
                OR:[{
                    name_contains: args.query
                }]
            }
        }
       return prisma.query.users(opArgs, info)

    //   if(!args.query){
    //       return db.users
    //   }
    //   return db.users.filter((user)=>{
    //       return db.user.name.toLowerCase().includes(args.query.toLowerCase())
    //   })
    },
    posts(parent,args,{prisma},info){
        const opArgs = {
            where:{
                published:true
            }
        }
        if(args.query){
            opArgs.where.OR = [{
                title_contains: args.query
            },{
                body_contains: args.query
            }]
        }
        return prisma.query.posts(opArgs, info)

    //   if(!args.query){
    //       return db.posts
    //   }
    //   return db.posts.filter((post)=>{
    //       const isTittleMatch =  post.title.toLowerCase().includes(args.query.toLowerCase());
    //       const isBodyMatch = post.body.toLowerCase().includes(args.query.toLowerCase())
    //       return isTittleMatch || isBodyMatch
    //   })
    },
    comments(parent,args,{prisma},info){
        const opArgs = {}
        if(args.query){
            opArgs.where = {
                text_contains: args.query                
            }
        }
        return prisma.query.comments(opArgs, info)
        // if(!args.query){
        //     return db.comments
        // }

        // return db.comments.filter((comment)=>{
        //   return comment.text.toLowerCase().includes(args.query.toLowerCase())
        // })
    },
    async me(parent,args,{ prisma, request},info){
        const userId = getUserId(request);
        return prisma.query.user({
            where:{
                id:userId
            }
        })
    },
    async post(parent,args,{prisma,request},info){
        const userId = getUserId(request, false)
        const posts = await prisma.query.posts({
            where:{
                id:args.id,
                OR:[{
                    published:true
                },{
                    author:{
                        id:userId
                    }
                }]
            }
        },info)

        if(posts.length===0){
            throw new Error("Post not found")
        }

        return posts[0]
    },
    async myPosts(parent,args,{prisma,request},info){
        const userId = getUserId(request)
        const opArgs = {
            where:{
                author:{
                    id:userId
                }
            }
        }
        if(args.query){
            opArgs.where.OR = [{
                title_contains: args.query
            },{
                body_contains: args.query
            }]
        }
        return prisma.query.posts(opArgs,info)

    }
  }
  export default Query;