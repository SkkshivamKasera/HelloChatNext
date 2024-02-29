import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema({
    chat: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "chats"
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users"
    },
    text: {
        type: String,
        default: ""
    },
    photo: {
        type: String,
        default: ""
    },
    seenBy: {
        type: [ { type: mongoose.Schema.Types.ObjectId, ref: "users" } ],
        default: []
    }
}, { timestamps: true })

const Message = mongoose.models.messages || mongoose.model("messages", MessageSchema)

export default Message