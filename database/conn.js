import mongoose  from "mongoose";
const conn=()=>{
    mongoose.connect(process.env.MONGODB_CONN)
    .then(()=>{
        console.log("Connected to mongodb")
    }).catch((error)=>{
        console.log(error)
    })
}

export default conn