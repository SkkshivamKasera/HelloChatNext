"use client"
import React, { Fragment, useEffect, useState } from 'react'
import Loader from './Loader'
import { useSession } from 'next-auth/react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { CheckCircle, RadioButtonUnchecked } from '@mui/icons-material'
import { useRouter } from 'next/navigation'

const Contacts = () => {

  const router = useRouter()

  const [loading, setLoading] = useState(true)
  const [contacts, setContacts] = useState([])
  const [search, setSearch] = useState("")
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [name, setName] = useState("")

  const isGroup = selectedContacts.length > 1;

  const { data: session } = useSession()
  const currentUser = session?.user

  const getContacts = async () => {
    try {
      const url = search !== "" ? `/api/user/search/${search}` : "/api/user"
      const { data } = await axios.get(url, { withCredentials: true })
      const users = data?.users
      setContacts(users.filter((contact) => contact._id !== currentUser._id))
      setLoading(false)
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message)
      } else {
        toast.error(error.message)
      }
    }
  }

  const handleSelect = (contact) => {
    if (selectedContacts.includes(contact)) {
      setSelectedContacts((prevSelectedContacts) =>
        prevSelectedContacts.filter((item) => item !== contact)
      );
    } else {
      setSelectedContacts((prevSelectedContacts) => [
        ...prevSelectedContacts,
        contact,
      ]);
    }
  };

  const createChat = async () => {
    try {
      const { data } = await axios.post("/api/chats", {
        currentUserId: currentUser._id,
        members: selectedContacts.map((contact) => contact._id),
        isGroup,
        name
      }, {
        headers: {
          "Content-Type": "application/json"
        },
        withCredentials: true
      })
      const chat = data.chat
      toast.success(data.message)
      router.push(`/chats/${chat._id}`)
    }catch(error){
      if(error.response){
        toast.error(error.response.data.message)
      }else{
        toast.error(error.message)
      }
    }
  }

  useEffect(() => {
    if (currentUser) {
      getContacts()
    }
  }, [currentUser, search])

  return (
    loading ? (
      <Loader />
    ) : (
      <div className='create-chat-container'>
        <input
          placeholder='Search contact...'
          className='input-search'
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="contact-bar">
          <div className="contact-list">
            <div className="text-body-bold">Select or Deselect</div>
            <div className='flex flex-col flex-1 gap-5 overflow-y-scroll custom-scrollbar'>
              {
                contacts && contacts.map((user, index) => (
                  <div
                    key={index}
                    className='contact'
                    onClick={() => handleSelect(user)}
                  >
                    {selectedContacts.find((item) => item === user) ? (
                      <CheckCircle sx={{ color: "red" }} />
                    ) : (
                      <RadioButtonUnchecked />
                    )}
                    <img
                      src={user.profileImage || "/assets/person.jpg"}
                      alt="profile"
                      className="profilePhoto"
                    />
                    <p className="text-base-bold">{user.username}</p>
                  </div>
                ))
              }
            </div>
          </div>
          <div className="create-chat">
            {
              isGroup && (
                <Fragment>
                  <div className="flex flex-col gap-3">
                    <p className='text-body-bold'>Group Chat Name</p>
                    <input
                      placeholder='Enter group chat name...'
                      className='input-group-name'
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                  <div className='flex flex-col gap-3'>
                    <p className='text-body-bold'>Members</p>
                    <div className='flex flex-wrap gap-3'>
                      {
                        selectedContacts.map((contact, index) => (
                          <p className='selected-contact' key={index}>
                            {contact.username}
                          </p>
                        ))
                      }
                    </div>
                  </div>
                </Fragment>
              )
            }
            <button disabled={selectedContacts.length === 0} className='btn' onClick={createChat}>FIND AND START A NEW CHAT</button>
          </div>
        </div>
      </div>
    )
  )
}

export default Contacts