"use client"
import axios from 'axios'
import { useSession } from 'next-auth/react'
import React, { Fragment, useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast'
import Loader from './Loader'
import Link from 'next/link'
import { AddPhotoAlternate } from '@mui/icons-material'
import { CldUploadButton } from 'next-cloudinary'
import MessageBox from './MessageBox'
import { pusherClient } from '@lib/pusher'

const ChatDetails = ({ chatId }) => {

    const buttonRef = useRef(null)

    const [loading, setLoading] = useState(true)
    const [chat, setChat] = useState({})
    const [otherMembers, setOtherMembers] = useState([])
    const [text, setText] = useState("")

    const { data: session } = useSession()
    const currentUser = session?.user

    const getChatDetails = async () => {
        try {
            const { data } = await axios.get(`/api/chats/${chatId}`, { withCredentials: true })
            setChat(data.chat)
            setOtherMembers(data?.chat?.members.filter((member) => member._id !== currentUser._id))
        } catch (error) {
            if (error.response) {
                toast.error(error.response.data.message)
            } else {
                toast.error(error.message)
            }
        }
        setLoading(false)
    }

    const sendPhoto = async (result) => {
        try{
            const { data } = await axios.post(`/api/messages`, {
                chatId, currentUserId: currentUser._id, photo: result?.info?.secure_url
            }, { headers: { "Content-Type": "application/json" }, withCredentials: true })
            toast.success(data.message)
        }catch(error){
            if(error.response){
                toast.error(error.response.data.message)
            }else{
                toast.error(error.message)
            }
        }
    }

    const sendText = async () => {
        try {
            const { data } = await axios.post(`/api/messages`, {
                chatId, currentUserId: currentUser._id, text
            }, { headers: { "Content-Type": "application/json" }, withCredentials: true })
            setText("")
            toast.success(data.message)
        } catch (error) {
            if (error.response) {
                toast.error(error.response.data.message)
            } else {
                toast.error(error.message)
            }
        }
    }

    useEffect(() => {
        if (currentUser && chatId) {
            getChatDetails()
        }
    }, [currentUser, chatId])

    useEffect(() => {
        if(chatId){
            const handleMessage = async (newMessage) => {
                setChat((prevChat) => {
                    return {
                        ...prevChat,
                        messages: [...prevChat.messages, newMessage]
                    }
                })
            }
            pusherClient.subscribe(chatId)
            pusherClient.bind("new-message", handleMessage)
            return () => {
                pusherClient.unsubscribe(chatId)
                pusherClient.unbind("new-message", handleMessage)
            }
        }
    }, [chatId])

    useEffect(() => {
        buttonRef?.current?.scrollIntoView({
            behavior: "smooth",
        })
    }, [chat?.messages])

    return (
        loading ? (
            <Loader />
        ) : (
            <div className="chat-details">
                <div className='chat-header'>
                    {
                        chat?.isGroup ? (
                            <Fragment>
                                <Link href={`/chats/${chatId}/group-info`}>
                                    <img src={chat?.groupPhoto || "/assets/group.png"} alt='group-photo' className='profilePhoto' />
                                </Link>
                                <div className='text'>
                                    <p>{chat?.name} • {chat?.members?.length} members</p>
                                </div>
                            </Fragment>
                        ) : (
                            <Fragment>
                                <img src={otherMembers[0].profileImage || "/assets/person.jpg"} alt='profile-photo' className='profilePhoto' />
                                <div className="text">
                                    <p>{otherMembers[0].username}</p>
                                </div>
                            </Fragment>
                        )
                    }
                </div>
                <div className="chat-body">
                    {
                        chat?.messages?.map((message, index) => (
                            <MessageBox key={index} message={message} currentUser={currentUser} />
                        ))
                    }
                    <div ref={buttonRef} />
                </div>
                <div className='send-message'>
                    <div className='prepare-message'>
                        <CldUploadButton
                            options={{ maxFiles: 1, resourceType: "image" }}
                            onUpload={sendPhoto}
                            uploadPreset='av4d66di'
                        >
                            <AddPhotoAlternate sx={{ fontSize: "35px", color: "#737373", cursor: "pointer", "&:hover": { color: "red" } }} />
                        </CldUploadButton>
                        <input
                            className='input-field'
                            type='text'
                            placeholder='Write a message...'
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            required
                        />
                    </div>
                    <div onClick={sendText}>
                        <img src='/assets/send.jpg' alt='send' className='send-icon' />
                    </div>
                </div>
            </div>
        )
    )
}

export default ChatDetails
