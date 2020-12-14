import {v4} from "uuid";
const Mutation = {
    createUser(parent,args,{db},info){
        const emailTaken = db.users.some((user)=>{
            return user.email === args.data.email
        })
        if(emailTaken){
            throw new Error('Email has already been taken');
        }
        const user = {
                id:v4(),
                ...args.data
            }
        db.users.push(user);
        return user;
        
    },
    deleteUser(parent,args,{db},info){
        const userIndex = db.users.findIndex((user)=> user.id === args.id);
        if(userIndex === -1){
            throw new Error("User can't be found");
        }
        const deletedUsers = db.users.splice(userIndex,1);
        db.posts = db.posts.filter((post)=>{
            const match = post.author === args.id;
            if(match){
                db.comments = db.comments.filter((comment)=>comment.post !== post.id)
            }
            return !match;
        })
        db.comments = db.comments.filter((comment)=>comment.author!==args.id);
        return deletedUsers[0];

    },
    updateUser(parent,args,{db},info){
        const {id,data} = args;
        const user = db.users.find((user)=>user.id === id);
        if(typeof data.email === "string"){     
        const emailTaken = user.email === data.email;
            if(emailTaken){
                throw new Error("Email Taken");
            }
            user.email = data.email;
        }
        if(typeof data.name === "string"){
            user.name = data.name
        }
        if(typeof data.age !== undefined){
            user.age = data.age;
        }
        return user;
    },
    createPost(parent,args,{ db, pubSub },info){
        const userExists = db.users.some((user)=>{
            return user.id === args.data.author
        })
        if(!userExists){
            throw new Error('User does not exists');
        }
        const post = {
            id:v4(),
            ...args.data
        }

        db.posts.push(post);
        if(post.published){
            pubSub.publish("Post",{ 
                post:{
                    mutation:"CREATED",
                    data:post
                } 
            })
        }
        return post
    },
    deletePost(parent,args,{db,pubSub},info){
        const postIndex = db.posts.findIndex((post)=>post.id===args.id);
        if(postIndex === -1){
            throw new Error("No such post has been found")
        }
        const deletedPosts = db.posts.splice(postIndex,1);
        db.comments = db.comments.filter((comment)=>comment.post !== args.id);
        pubSub.publish("Post",{
            post:{
                mutation:"DELETED",
                data: deletedPosts[0]
            }
        })
        return deletedPosts[0];
    },
    updatePost(parent,args,{db,pubSub},info){
        const {id,data} = args;
        const post = db.posts.find((post)=>post.id === id);
        const originalPost = {...post}
        if(!post){
            throw new Error("Post not found");
        }
        if(typeof data.title === "string"){
            post.title = data.title
        }
        if(typeof data.body === "string"){
            post.body = data.body
        }
        if(typeof data.published === "boolean"){
            post.published = data.published

            if(originalPost.published && !post.published){
                pubSub.publish("Post",{ 
                    post:{
                        mutation:"DELETED",
                        data:post
                    } 
                })
            }else if(!originalPost.published && post.published){
                pubSub.publish("Post",{ 
                    post:{
                        mutation:"CREATED",
                        data:post
                    } 
                })
            }else if(post.published){
                pubSub.publish("Post",{ 
                    post:{
                        mutation:"UPDATED",
                        data:post
                    } 
                })
            }

        }
        
        return post;
    },
    createComment(parent,args,{ db, pubSub },info){
        const userExists = db.users.some((user)=>{
            return user.id === args.data.author
        });
        const postExists = db.posts.some((post)=>{
            return post.id === args.data.post && post.published
        }); 
        if(!userExists || !postExists){
            throw new Error('Post or User does not exists')
        }
        const comment = {
            id:v4(),
            ...args.data
        }
        db.comments.push(comment);
        pubSub.publish(`Comment ${args.data.post}`,{
            comment:{
                mutation:"CREATED",
                data: comment
            }
        });
        return comment;
    },
    deleteComment(parent,args,{db,pubSub},info){
        const commentIndex = db.comments.findIndex((comment)=>comment.id === args.id);
        if(!commentIndex){
            throw new Error("Comment does not exist!");
        }
        const deletedComment = db.comments.splice(commentIndex,1);
        pubSub.publish(`Comment ${deletedComment[0].post}`,{
            comment:{
                mutation:"DELETED",
                data: deletedComment[0]
            }
        })
        return deletedComment[0];
    },
    updateComment(parent,args,{db,pubSub},info){
        const {id,data} = args;
        const comment = db.comments.find((comment)=>comment.id === id);
        if(!comment){
            throw new Error("No comment found")
        }
        if(typeof data.text === "string"){
            comment.text = data.text
            pubSub.publish(`Comment ${comment.post}`,{
                comment:{
                    mutation:"UPDATED",
                    data: comment
                }
            })
        }
        return comment
    }
}
export default Mutation;