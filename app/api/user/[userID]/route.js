import Chat from "@models/Chat"
import Message from "@models/Message"
import User from "@models/User"
import { connectToDB } from "@mongodb"

export const GET = async (req, { params }) => {
    try{
        await connectToDB()
        const allChats = await Chat.find({ members: params.userID })
            .sort({lastMessageAt: -1})
            .populate({
                path: "members",
                model: "users",
            })
            .populate({
                path: "messages",
                model: Message,
                populate: {
                    path: "sender seenBy",
                    model: User
                }
            })
        return Response.json({ success: true, chats: allChats }, { status: 200 })
    }catch(error){
        return Response.json({ success: false, message: error.message }, { status: 500 })
    }
}