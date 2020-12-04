const Query = {
    users(parent,args,{ db },info){
      if(!args.query){
          return db.users
      }
      return db.users.filter((user)=>{
          return db.user.name.toLowerCase().includes(args.query.toLowerCase())
      })
    },
    posts(parent,args,{db},info){
      if(!args.query){
          return db.posts
      }
      return db.posts.filter((post)=>{
          const isTittleMatch =  post.title.toLowerCase().includes(args.query.toLowerCase());
          const isBodyMatch = post.body.toLowerCase().includes(args.query.toLowerCase())
          return isTittleMatch || isBodyMatch
      })
    },
    comments(parent,args,{db},info){
        if(!args.query){
            return db.comments
        }

        return db.comments.filter((comment)=>{
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
  }
  export default Query;