import Chat from "@models/Chat"
import { connectToDB } from "@mongodb"

export const PUT = async (req, { params }) => {
    try{
        await connectToDB()
        const body = await req.json()
        const { chatId } = params
        const { name, groupPhoto } = body
        const updatedGroupChat = await Chat.findByIdAndUpdate(chatId, {
            name, groupPhoto
        }, { new: true })
        return Response.json({ success: true, chat: updatedGroupChat, message: "group updated successfully" }, {
            status: 200
        })
    }catch(error){
        return Response.json({ success: false, message: error.message }, {
            status: 500
        })
    }
}