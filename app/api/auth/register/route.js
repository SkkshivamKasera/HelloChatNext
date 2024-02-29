import User from "@models/User"
import { connectToDB } from "@mongodb"
import { genSalt, hash } from "bcryptjs"

export const POST = async (req, res) => {
    try{
        await connectToDB()
        const body = await req.json()
        const { username, email, password } = body
        const user = await User.findOne({ email })
        if(user){
            return Response.json({ success: false, message: "user already exists" }, {
                status: 400
            })
        }
        const salt = await genSalt(10)
        const hashPass = await hash(password, salt)
        const newUser = await User.create({
            username, email, password: hashPass
        })
        return Response.json({ success: true, user: newUser, message: "user created successfully" }, {
            status: 201
        })
    }catch(error){
        return Response.json({ success: false, message: error.message }, {
            status: 500
        })
    }
}