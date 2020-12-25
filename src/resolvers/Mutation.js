import bcrypt from "bcryptjs";
import getUserId from "../utils/getUserId";
import gnerateToken from "../utils/generateToken";
import hashPassword from "../utils/hashPassword";

const Mutation = {
    async createUser(parent,args,{prisma},info){
        const password = await hashPassword(args.data.password)
        const user = await prisma.mutation.createUser({
            data:{
                ...args.data,
                password
            }
        });
        return {
            user,
            token:gnerateToken(user.id)
        }

        // const emailTaken = db.users.some((user)=>{
        //     return user.email === args.data.email
        // })
        // if(emailTaken){
        //     throw new Error('Email has already been taken');
        // }
        // const user = {
        //         id:v4(),
        //         ...args.data
        //     }
        // db.users.push(user);
        // return user;
        
    },
    async logInUser(parent,{ data },{ prisma },info){
        const user = await prisma.query.user({
            where:{
                email:data.email
            }
        });
        if(!user){
            throw new Error("Email is not authenticated!")
        }

        const isMatch = await bcrypt.compare(data.password, user.password)
        if(!isMatch){
            throw new Error("Password doesn't match!");
        }

        return {
            user,
            token: gnerateToken(user.id)
        }
    },
    async deleteUser(parent,args,{prisma,request},info){
        const userId = getUserId(request)
        return prisma.mutation.deleteUser({where:{
            id: userId
        }},info)
        // const userIndex = db.users.findIndex((user)=> user.id === args.id);
        // if(userIndex === -1){
        //     throw new Error("User can't be found");
        // }
        // const deletedUsers = db.users.splice(userIndex,1);
        // db.posts = db.posts.filter((post)=>{
        //     const match = post.author === args.id;
        //     if(match){
        //         db.comments = db.comments.filter((comment)=>comment.post !== post.id)
        //     }
        //     return !match;
        // })
        // db.comments = db.comments.filter((comment)=>comment.author!==args.id);
        // return deletedUsers[0];

    },
    async updateUser(parent,args,{ prisma, request},info){
        const userId = getUserId(request)
        if(typeof args.data.password === "string"){
            args.data.password = await hashPassword(args.data.password);
        }
        return prisma.mutation.updateUser({
            where:{
                id:userId
            },
            data:args.data
        },info)
        // const {id,data} = args;
        // const user = db.users.find((user)=>user.id === id);
        // if(typeof data.email === "string"){     
        // const emailTaken = user.email === data.email;
        //     if(emailTaken){
        //         throw new Error("Email Taken");
        //     }
        //     user.email = data.email;
        // }
        // if(typeof data.name === "string"){
        //     user.name = data.name
        // }
        // if(typeof data.age !== undefined){
        //     user.age = data.age;
        // }
        // return user;
    },
    async createPost(parent,args,{ prisma, request },info){
        const userId = getUserId(request)
        return prisma.mutation.createPost({data:{
            title:args.data.title,
            body:args.data.body,
            published:args.data.published,
            author: {
                connect:{
                    id:userId
                }
            }
        }},info)
        // const userExists = db.users.some((user)=>{
        //     return user.id === args.data.author
        // })
        // if(!userExists){
        //     throw new Error('User does not exists');
        // }
        // const post = {
        //     id:v4(),
        //     ...args.data
        // }

        // db.posts.push(post);
        // if(post.published){
        //     pubSub.publish("Post",{ 
        //         post:{
        //             mutation:"CREATED",
        //             data:post
        //         } 
        //     })
        // }
        // return post
    },
    async deletePost(parent,args,{prisma, request},info){
        const userId = getUserId(request)
        const postExist = await prisma.exists.Post({
                id: args.id,
                author:{
                    id:userId
                }
        })
        if(!postExist){
            throw new Error("Post doesn't exist")
        }
        return prisma.mutation.deletePost({where:{
            id:args.id
        }},info)
        // const postIndex = db.posts.findIndex((post)=>post.id===args.id);
        // if(postIndex === -1){
        //     throw new Error("No such post has been found")
        // }
        // const deletedPosts = db.posts.splice(postIndex,1);
        // db.comments = db.comments.filter((comment)=>comment.post !== args.id);
        // pubSub.publish("Post",{
        //     post:{
        //         mutation:"DELETED",
        //         data: deletedPosts[0]
        //     }
        // })
        // return deletedPosts[0];
    },
    async updatePost(parent,args,{prisma, request},info){
        const userId = getUserId(request)
        const postExist = await prisma.exists.Post({
                id: args.id,
                author:{
                    id:userId
                }
        })
        if(!postExist){
            throw new Error("Post doesn't exist")
        }

        const isPublished = await prisma.exists.Post({id:args.id,published:true})
        if(isPublished && args.data.published === false){
            await prisma.mutation.deleteManyComments({where:{post:{id:args.id}}})
        }
        return prisma.mutation.updatePost({
            where:{
                id:args.id
            },
            data:args.data
        },info)
        // const {id,data} = args;
        // const post = db.posts.find((post)=>post.id === id);
        // const originalPost = {...post}
        // if(!post){
        //     throw new Error("Post not found");
        // }
        // if(typeof data.title === "string"){
        //     post.title = data.title
        // }
        // if(typeof data.body === "string"){
        //     post.body = data.body
        // }
        // if(typeof data.published === "boolean"){
        //     post.published = data.published

        //     if(originalPost.published && !post.published){
        //         pubSub.publish("Post",{ 
        //             post:{
        //                 mutation:"DELETED",
        //                 data:post
        //             } 
        //         })
        //     }else if(!originalPost.published && post.published){
        //         pubSub.publish("Post",{ 
        //             post:{
        //                 mutation:"CREATED",
        //                 data:post
        //             } 
        //         })
        //     }else if(post.published){
        //         pubSub.publish("Post",{ 
        //             post:{
        //                 mutation:"UPDATED",
        //                 data:post
        //             } 
        //         })
        //     }

        // }
        
        // return post;
    },
    async createComment(parent,args,{ prisma,request },info){
        const userId = getUserId(request)
        const postExist = await prisma.exists.Post({
                id: args.data.post,
                published:true
        })
        if(!postExist){
            throw new Error("Post doesn't exist")
        }
        return prisma.mutation.createComment({data:{
            text:args.data.text,
            author:{
                connect:{
                    id:userId
                }
            },
            post:{
                connect:{
                    id:args.data.post
                }
            }
        }},info)
    //     const userExists = db.users.some((user)=>{
    //         return user.id === args.data.author
    //     });
    //     const postExists = db.posts.some((post)=>{
    //         return post.id === args.data.post && post.published
    //     }); 
    //     if(!userExists || !postExists){
    //         throw new Error('Post or User does not exists')
    //     }
    //     const comment = {
    //         id:v4(),
    //         ...args.data
    //     }
    //     db.comments.push(comment);
    //     pubSub.publish(`Comment ${args.data.post}`,{
    //         comment:{
    //             mutation:"CREATED",
    //             data: comment
    //         }
    //     });
    //     return comment;
    },
    async deleteComment(parent,args,{prisma,request},info){
        const userId = getUserId(request)
        const commentExists = await prisma.exists.Comment({
            id:args.id,
            author: {
                id: userId
            }
        })
        if(!commentExists){
            throw new Error("Comment doesn't exist!")
        }
        return prisma.mutation.deleteComment({
            id:args.id
        },info)
    //     const commentIndex = db.comments.findIndex((comment)=>comment.id === args.id);
    //     if(!commentIndex){
    //         throw new Error("Comment does not exist!");
    //     }
    //     const deletedComment = db.comments.splice(commentIndex,1);
    //     pubSub.publish(`Comment ${deletedComment[0].post}`,{
    //         comment:{
    //             mutation:"DELETED",
    //             data: deletedComment[0]
    //         }
    //     })
    //     return deletedComment[0];
    },
    async updateComment(parent,args,{prisma, request},info){
        const userId = getUserId(request)
        const commentExists = await prisma.exists.Comment({
            id:args.id,
            author: {
                id: userId
            }
        })
        if(!commentExists){
            throw new Error("Comment doesn't exist!")
        }
        return prisma.mutation.updateComment({  
            id:args.id,
            data:args.data
        },info)
    //     const {id,data} = args;
    //     const comment = db.comments.find((comment)=>comment.id === id);
    //     if(!comment){
    //         throw new Error("No comment found")
    //     }
    //     if(typeof data.text === "string"){
    //         comment.text = data.text
    //         pubSub.publish(`Comment ${comment.post}`,{
    //             comment:{
    //                 mutation:"UPDATED",
    //                 data: comment
    //             }
    //         })
    //     }
    //     return comment
    }

}
export default Mutation;