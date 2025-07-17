import { uploadOnCloudinary } from "../lib/cloudinary.js";
import { generateToken } from "../lib/utils.js";
import User from "../models/user.js";
import bcrypt from "bcryptjs"


export const signup = async(req, res)=>{
  const { email, fullName, password } = req.body;
  try {
    if(!email || !fullName || !password){
      return res.status(401).json({ message: "All fields are required" });
    }
    if(password.length < 6){
        return res.status(400).json({ message: "Password must be at least 6 characters" });
    }
    const user = await User.findOne({email})
    
    if (user){
      console.log("User :",user);
      
        return res.status(400).json({ message: "Email already exists" });
    }
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new User({
      email,
      fullName,
      password: hashedPassword
    });

    if(newUser){
      generateToken(newUser._id, res)
      await newUser.save()
      res.status(201).json({
        _id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        profilePic: newUser.profilePic
      })
    } else {
      res.status(400).json({
        success: false,
        message: "Invalid user data"
      })
    }
  } catch (error) {
    console.log("Error in signup controller", error.message);
    res.status(500).json({
      message: "Interval Server Error"
    })
    
  }
}

export const login = async(req, res)=>{
  const { email, password} = req.body;
  console.log("Request reveived");
  
  try {
    if(!email || !password){
      res.status(401).json({
        success: false,
        message: "Email or password is required"
      })
    }
    const user = await User.findOne({ email })
    if(!user){
      res.status(400).json({
        success: false,
        message: "Invalid email"
      })
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password)
    if(!isPasswordCorrect){
      res.status(401).json({
        success: false, 
        message: "Invalid password"
      })
    }

    generateToken(user._id, res)
    res.status(201).json({
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        profilePic: user.profilePic
      })
  } catch (error) {
    console.log("Error in login controller", error.message);
    res.status(500).json({
      message: "Interval Server Error"
    })
  }

}

export const logout = (req, res)=>{
    try {
      res.cookie("jwt", "", { maxAge: 0})
      res.status(201).json({
        success: true,
        message: "Logged out successfull"
      })
    } catch (error) {
       console.log("Error in logout controller", error.message);
    res.status(500).json({
      message: "Interval Server Error"
    })
    }
}

export const updateProfile = async(req, res)=>{
  try {
    const  profilePic  = req.file;
    const userId = req.user._id
    if(!profilePic){
      return res.status(401).json({
        success: false,
        message: "please upload the profile pic"
      })
    }
    let image;
    const cloud_image = await uploadOnCloudinary(req.file?.path)
   if(!cloud_image) {
       return res.status(400).json({
        success: false,
        message: "failed to upload on cloudinary"
       })
   }
   if (cloud_image?.url) {
     image = cloud_image.url;
   }
   const updatedUser = await User.findByIdAndUpdate(
    userId,
    {profilePic: image},
    {new: true}
   )

   res.status(201).json({
    success: true,
    message: "user updated successfully",
    updatedUser
   })
  } catch (error) {
    console.log("Error in profile update controller");
    return res.status(500).json({ message: error.message });
  }
}

export const checkAuth = async(req, res)=>{
  try {
    return res.status(201).json(req.user)
  } catch (error) {
    console.log("Error in checkAuth controller");
    return res.status(500).json({ message: "Internal server error" });  
  }
}