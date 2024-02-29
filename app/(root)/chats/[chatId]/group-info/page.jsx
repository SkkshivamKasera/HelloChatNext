"use client"
import { GroupOutlined, PersonOutline } from '@mui/icons-material'
import { useForm } from "react-hook-form"
import { useEffect, useState } from 'react'
import { CldUploadButton } from 'next-cloudinary'
import Loader from '@components/Loader'
import toast from 'react-hot-toast'
import axios from 'axios'
import { useParams, useRouter } from 'next/navigation'

const GroupInfo = () => {

    const [loading, setLoading] = useState(true)
    const [chat, setChat] = useState({})

    const { chatId } = useParams()

    const {
        register,
        watch,
        setValue,
        reset,
        handleSubmit,
        formState: { errors }
    } = useForm()

    const router = useRouter()

    const getChatDetails = async () => {
      try{
        const { data } = await axios.get(`/api/chats/${chatId}`, { withCredentials: true })
        setChat(data?.chat)
        reset({
          name: data?.chat?.name, 
          groupPhoto: data?.chat?.groupPhoto
        })
      }catch(error){
        if(error.response){
          toast.error(error.response.data.message)
        }else{
          toast.error(error.message)
        }
      }
      setLoading(false)
    }

    const uploadPhoto = (result) => {
        setValue("groupPhoto", result?.info?.secure_url)
    }

    const updateGroupChat = async (formData) => {
        setLoading(true)
        try {
            const { data } = await axios.put(`/api/chats/${chatId}/update`, {
                name: formData.name,
                groupPhoto: formData.groupPhoto
            }, {
                headers: {
                    "Content-Type": "application/json"
                },
                withCredentials: true
            })
            toast.success(data.message)
        } catch (error) {
            if (error.response) {
                toast.error(error.response.data.message)
            } else {
                toast.error(error.message)
            }
        }
        setLoading(false)
        router.push(`/chats/${chatId}`)
    }

    useEffect(() => {
      if(chatId){
        getChatDetails()
      }
    }, [chatId])

    return (
        loading ? <Loader /> : (
            <div className='profile-page'>
                <h1 className='text-heading3-bold'>Edit Group Info</h1>
                <form className='edit-profile' onSubmit={handleSubmit(updateGroupChat)}>
                    <div className='input'>
                        <input
                            {...register("name", {
                                required: "name is required",
                                validate: (value) => {
                                    if (value.length < 3) {
                                        return "name must be atleast 3 charaters long"
                                    }
                                }
                            })}
                            type='text'
                            placeholder='group name'
                            className='input-field'
                        />
                        <GroupOutlined sx={{ color: "#737373" }} />
                    </div>
                    { errors?.name && (
                        <p className='text-red-500'>{ errors.name.message }</p>
                    ) }
                    <div className='flex items-center justify-between'>
                        <img
                            src={watch("groupPhoto") || "/assets/group.png"}
                            alt='profile'
                            className='w-40 h-40 rounded-full object-cover object-center'
                        />
                        <CldUploadButton
                            options={{ maxFiles: 1, resourceType: "image" }}
                            onUpload={uploadPhoto}
                            uploadPreset='av4d66di'
                        >
                            <p className='text-body-bold'>Upload new photo</p>
                        </CldUploadButton>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      {
                        chat?.members?.map((member, index) => (
                          <p key={index} className='selected-contact'>{member?.username}</p>
                        ))
                      }
                    </div>
                    <button className='btn' type='submit'>save changes</button>
                </form>
            </div>
        )
    )
}

export default GroupInfo