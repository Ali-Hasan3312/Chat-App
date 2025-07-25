import jwt from "jsonwebtoken"
import User from "../models/user.js"



export const protectRoute = async (req,res,next)=>{
   try {
    const token = req.cookies.jwt
    if(!token){
      return  res.status(401).json({
        success: false,
        message: "Unathorized - No Token Provided"
        })
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    if(!decoded){
        return res.status(401).json({
            success: false,
            message: "Unauthorized - Invalid Token"
        })
    }
    const user = await User.findById(decoded.userId).select('-password')
    if(!user){
        return res.status(404).json({
        success: false,
        message: "User not found"
        })
    }

    req.user = user
    next()
   } catch (error) {
     console.log("Error in protectedRoute middleware", error.message);
    res.status(500).json({
      message: "Interval Server Error"
   })
}
}