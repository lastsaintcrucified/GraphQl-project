import {Prisma} from "prisma-binding";
import {fragmentReplacements} from "./resolvers/index";

const prisma = new Prisma({
    typeDefs:"src/generated/prisma.graphql",
    endpoint: process.env.PRISMA_ENDPOINT,
    secret: process.env.PRISMA_SECRET,
    fragmentReplacements
})


export {prisma as default}
// const createPostForUser = async (authorId,data) =>{
//     const userExist = await prisma.exists.User({id:authorId})
//     if(!userExist){
//         throw new Error("User not found")
//     }
//     const post = await prisma.mutation.createPost({
//         data:{
//             ...data,
//             author:{
//                 connect:{
//                     id:authorId
//                 }
//             }
//         }
//     },"{author{id name posts{id title body published}}}")

    

//     return post.author
// }

// createPostForUser("ckicji5fy00aj07701zj4igrn",{
//     title:"War of the world",
//     body:"Hey man wassup man khonde jao man",
//     published:true
// }).then((user)=>{
//     console.log(JSON.stringify(user,undefined,2));
// }).catch((error)=>{
//     console.log(error)
// })
// prisma.mutation.createPost({
//     data:{
//         title:"Created by prisma",
//         body:"I created this post to show that prisma can manage to connect node with graphql",
//         published:true,
//         author:{
//             connect:{
//                 id:"ckicji5fy00aj07701zj4igrn"
//             }
//         }
//     }
// },"{id title body published author{name id}}").then((data)=>{
//     console.log(JSON.stringify(data,undefined,3))
// })

// const updatePostForUser = async (postId,data) =>{
//     const postExist = await prisma.exists.Post({id:postId});
//     if(!postExist){
//         throw new Error("User Not Found!");
//     }
//     const post = await prisma.mutation.updatePost({where:{
//         id:"ckinz5gm400040870u1opzg58"
//     },
//         data:{
//             ...data
//         }
//     },"{id title body author{id name}}")
    
//     return post;
    
// }

// updatePostForUser("ckinz5gm400040870u1opzg58",{
//     published:false,
//     body:"Changed post body lorem ippsuh kthe name of our county isb mhscvsb v",
//     title:"Hey"
// }).then((post)=>{
//     console.log(JSON.stringify(post,undefined,2))
// }).catch((error)=>{
//     console.log(error)
// })