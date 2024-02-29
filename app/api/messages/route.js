import { pusherServer } from "@lib/pusher"
import Chat from "@models/Chat"
import Message from "@models/Message"
import User from "@models/User"
import { connectToDB } from "@mongodb"

export const POST = async (req) => {
    try {
        await connectToDB()
        const body = await req.json()
        const { chatId, currentUserId, text, photo } = body
        const currentUser = await User.findById(currentUserId)
        const newMessage = await Message.create({
            chat: chatId,
            sender: currentUser,
            text,
            photo,
            seenBy: currentUserId
        })
        const updatedChat = await Chat.findByIdAndUpdate(chatId, {
            $push: { messages: newMessage._id },
            $set: { lastMessageAt: newMessage.createdAt }
        }, { new: true })
        .populate({
            path: "messages",
            model: Message,
            populate: {
                path: "sender seenBy",
                model: User
            }
        })
        .populate({
            path: "members",
            model: User
        })
        await pusherServer.trigger(chatId, "new-message", newMessage)
        const lastMessage = updatedChat.messages[updatedChat.messages.length - 1]
        updatedChat.members.forEach(async (member) => {
            try{
                await pusherServer.trigger(member._id.toString(), "update-chat", {
                    id: chatId,
                    messages: [lastMessage]
                })
            }catch(error){
                return Response.json({ success: false, message: error.message }, {
                    status: 500
                })
            }
        })
        return Response.json({ success: true, message: newMessage, chat: updatedChat, message: "message send successfully" }, {
            status: 201
        })
    } catch (error) {
        return Response.json({ success: false, message: error.message }, {
            status: 500
        })
    }
}