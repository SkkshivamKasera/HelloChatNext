import User from "@models/User"
import { connectToDB } from "@mongodb"

export const PUT = async (req, { params }) => {
    try{
        await connectToDB()
        const { userID } = params
        console.log(userID)
        const body = await req.json()
        const { username, profileImage } = body
        const updatedUser = await User.findByIdAndUpdate(userID, {
            username,
            profileImage
        }, { new: true })
        return Response.json({ success: true, user: updatedUser, message: "profile updated successfully" }, {
            status: 200
        })
    }catch(error){
        console.log(error)
        return Response.json({ success: false, message: error.message }, {
            status: 500
        })
    }
}