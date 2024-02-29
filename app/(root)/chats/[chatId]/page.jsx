"use client"
import ChatDetails from "@components/ChatDetails"
import ChatList from "@components/ChatList"
import axios from "axios"
import { useSession } from "next-auth/react"
import { useParams } from "next/navigation"
import { useEffect } from "react"
import toast from "react-hot-toast"


const ChatPage = () => {

  const { chatId } = useParams()

  const { data: session } = useSession()
  const currentUser = session?.user

  const seenMessages = async () => {
    try{
      const { data } = await axios.post(`/api/chats/${chatId}`, {
        currentUserId: currentUser._id
      }, {
        headers: {
          "Content-Type": "application/json"
        }, 
        withCredentials: true
      })
    }catch(error){
      if(error.response){
        toast.error(error.response.data.message)
      }else{
        toast.error(error.message)
      }
    }
  }

  useEffect(() => {
    if(currentUser && chatId){
      seenMessages()
    }
  }, [currentUser, chatId])

  return (
    <div className="main-container">
      <div className="w-1/3 max-lg:hidden">
        <ChatList currentChatId={chatId} />
      </div>
      <div className="w-2/3 max-lg:w-full">
        <ChatDetails chatId={chatId} />
      </div>
    </div>
  )
}

export default ChatPage
