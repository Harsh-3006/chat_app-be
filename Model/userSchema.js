import mongoose  from "mongoose";

const userSchema=new mongoose.Schema({
    fullname:{
        type:String,
        required:true,        
    },
    username:{    //work as email
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
        minlength:5
    },
    gender:{
        type:String,
        required:true,
        enum:["male","female"]
    },
    profilePic:{
        type:String,
        default:""
    }
}, {timestamp:true})
const User=mongoose.model("User",userSchema);

export default User