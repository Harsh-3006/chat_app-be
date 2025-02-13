import jwt from 'jsonwebtoken'
const generateTokenAndSetCookie=(userId,res)=>{
    const token=jwt.sign({userId},process.env.JWT_SECRET,{
        expiresIn:'15d'
    })
    // res.cookie("jwt",token,{
    //     maxAge:15*24*60*60*1000,
    //     httpOnly:true,
    //     sameSite:"None",
    // })
    res.cookie("jwt", token, {
        maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days
        httpOnly: true, // Prevents client-side access to cookies
        sameSite: "None", // Required for cross-origin cookies
        secure: true, // Required for HTTPS (must be true in production)
        path: "/", // Ensures the cookie is available across all routes
    });
    
    return token 
}

export default generateTokenAndSetCookie