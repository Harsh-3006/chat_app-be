import  jwt from "jsonwebtoken";
import User from "../Model/userSchema.js";

const protectRoute=async(req,res,next)=>{
    try {
        const token=req.cookies.jwt;
        if(!token){
            return res.status(401).json({error:"no token provided"})
        }
        console.log("process.env.JWT_SECRET",process.env.JWT_SECRET)
        const decoded=jwt.verify(token,process.env.JWT_SECRET) 
        if(!decoded){
            return res.status(401).json({error:"invalid token"})
        }

        const user=await User.findById(decoded.userId).select("-password");
        if(!user){
            return res.status(404).json({error:"user not found"})
        }
        req.user=user
        next()

    } catch (error) {
        console.log("error in protectRoute",error)
        res.status(500).json({error:"Internal server error from protected",error})
    }
}



export default protectRoute