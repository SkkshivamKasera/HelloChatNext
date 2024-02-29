"use client"
import { useSession } from 'next-auth/react'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import Loader from './Loader'
import axios from 'axios'
import ChatBox from './ChatBox'
import { pusherClient } from '@lib/pusher'

const ChatList = ({ currentChatId }) => {

  const [loading, setLoading] = useState(true)
  const [chats, setChats] = useState([])
  const [search, setSearch] = useState("")

  const { data: session } = useSession()
  const currentUser = session?.user

  const getAllChats = async () => {
    try {
      const { data } = await axios.get(search !== "" ? `/api/user/${currentUser._id}/search/${search}` : `/api/user/${currentUser._id}`, { withCredentials: true })
      setChats(data.chats)
      setLoading(false)
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message)
      } else {
        toast.error(error.message)
      }
    }
  }

  useEffect(() => {
    if (currentUser) {
      getAllChats()
    }
  }, [currentUser, search])

  useEffect(() => {
    const handleChatUpdate = async (updatedChat) => {
      setChats((allChats) => allChats.map((chat) => {
        if (chat._id === updatedChat.id) {
          return { ...chat, messages: updatedChat.messages }
        } else {
          return chat
        }
      }))
    }

    const handleNewChat = (newChat) => {
      setChats(allChats => [...allChats, newChat])
    }

    if (currentUser) {
      pusherClient.subscribe(currentUser._id)
      pusherClient.bind("update-chat", handleChatUpdate)
      pusherClient.bind("new-chat", handleNewChat)
    }

    return () => {
      if (currentUser) {
        pusherClient.unsubscribe(currentUser._id)
        pusherClient.unbind("update-chat", handleChatUpdate)
        pusherClient.unbind("new-chat", handleNewChat)
      }
    }
  }, [currentUser])

  return (
    loading ? (
      <Loader />
    ) : (
      <div className='chat-list'>
        <input
          placeholder='search chat...'
          className='input-search'
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="chats">
          {
            chats?.map((chat, index) => (
              <ChatBox
                key={index}
                chat={chat}
                index={index}
                currentUser={currentUser}
                currentChatId={currentChatId}
              />
            ))
          }
        </div>
      </div>
    )
  )
}

export default ChatList
