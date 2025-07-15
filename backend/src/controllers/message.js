import { uploadOnCloudinary } from "../lib/cloudinary.js";
import Message from "../models/message.js";
import User from "../models/user.js";



export const getAllMessages = async (req, res) => {
    try {
        const messages = await Message.find().sort({ timestamp: 1})
        res.status(200).json(messages);
    } catch (error) {
        console.error("Error fetching messages:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const getAllUsersForSidebar = async(req, res)=>{
    try {
        const loggedInUserId = req.user._id;
        const filteredUsers = await User.find({_id: {$ne: loggedInUserId}}).select("-password")
        res.status(201).json(filteredUsers)
    } catch (error) {
        console.error("Error in getUsers for sidebar")
        res.status(500).json({
            error: error.message
        })
    }
}

export const getMessages = async(req, res)=>{
    try {
        const { id: userToChatId}  = req.params;
        const myId = req.user._id;
        const messages = await Message.find({
            $or: [
                { senderId: myId, receiverId: userToChatId},
                { senderId: userToChatId, receiverId: myId}
            ]
        })
        res.status(200).json(messages)
    } catch (error) {
        console.error("Error in getMessages controller")
        res.status(500).json({
            error: error.message
        })    
    }
}

export const sendMessage = async (req, res)=>{
    try {
        const { text, image} = req.body;
        const {id: receiverId} = req.params;
        const senderId  = req.user._id;
        let imageUrl;
        if(image){
            // upload base64 image to cloudinary
            const uploadResponse = await uploadOnCloudinary(image)
            imageUrl = uploadResponse.url
        }
        const newMessage = await Message.create({
            senderId,
            receiverId,
            text,
            image: imageUrl
        })

        // todo: realtime functionality goes here => socket.io

        res.status(201).json(newMessage)
    } catch (error) {
    console.error("Error in send message controller",error.message)
        res.status(500).json({
            error: error.message
        })     
    }
}