import Chat from "@models/Chat"
import User from "@models/User"
import { connectToDB } from "@mongodb"

export const GET = async (req, {params}) => {
    try{
        await connectToDB()
        const currentUserId = params.userID
        const query = params.query
        const searchedChat = await Chat.find({
            members: currentUserId,
            name: { $regex: query, $options: "i" }
        }).populate({
            path: "members",
            model: User,
        })
        .populate({
            path: "messages",
            model: Message,
            populate: {
                path: "sender seenBy",
                model: User
            }
        })
        return Response.json({ success: true, chats: searchedChat }, { status: 200 })
    }catch(error){
        return Response.json({ success: false, message: error.message }, { status: 500 })
    }
}