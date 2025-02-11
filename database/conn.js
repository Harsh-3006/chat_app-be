import mongoose  from "mongoose";
const conn=()=>{
    mongoose.connect('mongodb://localhost:27017/Chatting-app')
    .then(()=>{
        console.log("Connected to mongodb")
    }).catch((error)=>{
        console.log(error)
    })
}

export default conn