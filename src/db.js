let users = [
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

let posts = [
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

let comments = [
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

const db = {
    users,
    posts,
    comments
}

export default db;