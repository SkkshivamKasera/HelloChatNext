import { pusherServer } from "@lib/pusher"
import Chat from "@models/Chat"
import User from "@models/User"
import { connectToDB } from "@mongodb"

export const POST = async (req) => {
    try {
        await connectToDB()
        const body = await req.json()
        const { currentUserId, members, isGroup, name, groupPhoto } = body
        const query = isGroup ? { isGroup, name, groupPhoto, members: [currentUserId, ...members] } : {
            members: { $all: [currentUserId, ...members], $size: 2 }
        }
        let chat = await Chat.findOne(query)
        if (!chat) {
            chat = await Chat.create(isGroup ? query : { members: [currentUserId, ...members] })
            const updateAllMembers = chat.members.map(async (memberId) => {
                await User.findByIdAndUpdate(memberId, {
                $addToSet: { chats: chat._id }
            }, { new: true })})
            Promise.all(updateAllMembers)
            chat.members.map((member) => {
                pusherServer.trigger(member._id.toString(), "new-chat", chat)
            })
        }
        return Response.json({ success: true, chat, message: "chat created successfully" }, {
            status: 201
        })
    } catch (error) {
        return Response.json({ success: false, message: error.message }, {
            status: 500
        })
    }
}