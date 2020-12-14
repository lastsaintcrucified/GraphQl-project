const Subscription = {
    comment:{
        subscribe(parent,{ postId },{ db, pubSub },info){
            const post = db.posts.find((post)=>post.id === postId && post.published);
            if(!post){
                throw new Error("POst not found");
            }
            return pubSub.asyncIterator(`Comment ${postId}`);
        }
    },
    post:{
        subscribe(parent,args,{ pubSub },info){
            return pubSub.asyncIterator("Post");
        }
    }
}

export default Subscription;