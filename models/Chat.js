import mongoose from "mongoose"

const ChatSchema = new mongoose.Schema({
    members: {
        type: [ { type: mongoose.Schema.Types.ObjectId, ref: "users" } ],
        default: []
    },
    messages: {
        type: [ { type: mongoose.Schema.Types.ObjectId, ref: "messages" } ],
        default: []
    },
    isGroup: {
        type: Boolean,
        default: false
    },
    name: {
        type: String,
        default: ""
    },
    groupPhoto: {
        type: String,
        default: ""
    },
    lastMessageAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true })

const Chat = mongoose.models.chats || mongoose.model("chats", ChatSchema)

export default Chat