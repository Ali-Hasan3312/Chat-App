import Message from "../models/message.js";



const getAllMessages = async (req, res) => {
    try {
        const messages = await Message.find().sort({ timestamp: 1})
        res.status(200).json(messages);
    } catch (error) {
        console.error("Error fetching messages:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export {getAllMessages}