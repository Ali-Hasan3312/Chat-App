import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    user: String,
    text: String,
    timstamp: {
        type: Date,
        default: Date.now
    }
})

const Message = mongoose.model('Message', messageSchema);
export default Message;