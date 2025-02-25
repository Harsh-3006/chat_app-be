import express from "express";
import bcryptjs from 'bcryptjs'
const router=express.Router()
import User from "../Model/userSchema.js";
import generateTokenAndSetCookie from "../utils/generateToken.js";
import jwt from 'jsonwebtoken'


//signup
router.post("/signup",async (req,res)=>{
    try {
        const {fullname,username,password,cpassword,gender}=req.body
        if(!fullname||!username||!password||!cpassword||!gender){
            return res.status(400).json({error:"All fields are reuired"})
        }
        if(cpassword!==password){
            return res.status(400).json({error:"Password doesn't match"})
        }
        const usercheck=await User.findOne({username})
        if(usercheck){
            return res.status(400).json({error:"Username already exist"})
        }

        const boyProfilePic=`https://avatar.iran.liara.run/public/boy?username=${username}`
        const girlProfilePic=`https://avatar.iran.liara.run/public/girl?username=${username}`

        //hashpassword
        const hashpassword=await bcryptjs.hash(password,10)
        const newUser=new User({
            fullname,
            username,
            password:hashpassword,
            gender,
            profilePic:gender==='male'?boyProfilePic:girlProfilePic,
            // auth:tokenjhj
        })
        
        //genereate jwt token
        const token=generateTokenAndSetCookie(newUser._id,res)
        // const token=jwt.sign(newUser._id,process.env.JWT_SECRET)
        await newUser.save()

        
        res.status(201).json({
            _id:newUser._id,
            fullname:newUser.fullname,
            username:newUser.username,
            profilePic:newUser.profilePic,
            auth:token
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({error:"Internal server error from user signup",error})
    }
})


//signin
router.post("/signin",async(req,res)=>{
    try {
        const {username,password} =req.body
       
        const user=await User.findOne({username})
    
        if(!user){
            return res.status(404).json({error:"User not found"})
        }
      
        const comparepassword=await bcryptjs.compareSync(password,user?.password||"")
        
        if(!comparepassword){
            return res.status(400).json({error:"Invalid password or username"})
        }

        const token=generateTokenAndSetCookie(user._id,res)
        // jwt
        res.status(200).json({
            _id:user._id,
            fullname:user.fullname,
            username:user.username,
            profilePic:user.profilePic,
            auth:token
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({error:"Internal server error from user signin",error})
    }
})

router.post('/signout',async(req,res)=>{
    try {
        res.cookie('jwt',"",{maxAge:0})
        res.status(200).json({message:"Logged out successfully"})
    } catch (error) {
        console.log(error)
        res.status(500).json({error:"Internal server error"})
    }
})
export default router