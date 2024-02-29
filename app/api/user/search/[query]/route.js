import User from "@models/User"
import { connectToDB } from "@mongodb"

export const GET = async (req, { params }) => {
    try{
        await connectToDB()
        const { query } = params
        const searchedContacts = await User.find({
            $or: [
                { username: { $regex: query, $options: "i" } },
                { email: { $regex: query, $options: "i" } }
            ]
        })
        return Response.json({ success: true, users: searchedContacts }, {
            status: 200
        })
    }catch(error){
        return Response.json({ success: false, message: error.message }, {
            status: 500
        })
    }
}