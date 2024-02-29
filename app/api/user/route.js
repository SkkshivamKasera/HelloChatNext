import User from "@models/User"
import { connectToDB } from "@mongodb"

export const GET = async (req) => {
    try{
        await connectToDB()
        const allUsers = await User.find()
        return Response.json({ success: true, users: allUsers }, {
            status: 200
        })
    }catch(error){
        return Response.json({ success: false, message: error.message }, {
            status: 500
        })
    }
}