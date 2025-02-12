import express from "express"
import protectRoute from "../Middleware/protectRoute.js"
import User from "../Model/userSchema.js"

const router=express.Router()

//get users for sidebar
router.get("/hello",protectRoute,async(req,res)=>{
    try {
        const loggedInUser=req.user._id
        const alluser=await User.find({_id:{$ne:loggedInUser}}).select("-password")
        res.status(200).json(alluser)
    } catch (error) {
        console.log(error)
        res.status(500).json({error:"Internal server error from userroute",error})
    }
})


export default router