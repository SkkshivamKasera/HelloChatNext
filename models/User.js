import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    profileImage: {
        type: String,
        default: ""
    },
    chats: {
        type: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Chat"
            }
        ],
        default: []
    },
}, { timestamps: true })

const User = mongoose.models.users || mongoose.model("users", UserSchema)

export default User