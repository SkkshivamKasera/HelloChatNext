"use client"
import { PersonOutline } from '@mui/icons-material'
import { useSession } from 'next-auth/react'
import { useForm } from "react-hook-form"
import React, { useEffect, useState } from 'react'
import { CldUploadButton } from 'next-cloudinary'
import Loader from '@components/Loader'
import toast from 'react-hot-toast'
import axios from 'axios'

const Profile = () => {
    const { data: session } = useSession()
    const user = session?.user

    const [loading, setLoading] = useState(true)

    const {
        register,
        watch,
        setValue,
        reset,
        handleSubmit,
        formState: { errors }
    } = useForm()

    const uploadPhoto = (result) => {
        setValue("profileImage", result?.info?.secure_url)
    }

    const updateProfile = async (formData) => {
        setLoading(true)
        try {
            console.log("data")
            const { data } = await axios.put(`/api/user/${user?._id}/update`, {
                username: formData.username,
                profileImage: formData.profileImage
            }, {
                headers: {
                    "Content-Type": "application/json"
                },
                withCredentials: true
            })
            console.log(data)
            toast.success(data.message)
        } catch (error) {
            if (error.response) {
                toast.error(error.response.data.message)
            } else {
                toast.error(error.message)
            }
        }
        setLoading(false)
        window.location.reload()
    }

    useEffect(() => {
        if (user) {
            reset({
                username: user?.username,
                profileImage: user?.profileImage
            })
        }
        setLoading(false)
    }, [user])

    return (
        loading ? <Loader /> : (
            <div className='profile-page'>
                <h1 className='text-heading3-bold'>Edit Your Profile</h1>
                <form className='edit-profile' onSubmit={handleSubmit(updateProfile)}>
                    <div className='input'>
                        <input
                            {...register("username", {
                                required: "username is required",
                                validate: (value) => {
                                    if (value.length < 3) {
                                        return "username must be atleast 3 charaters long"
                                    }
                                }
                            })}
                            type='text'
                            placeholder='Username'
                            className='input-field'
                        />
                        <PersonOutline sx={{ color: "#737373" }} />
                    </div>
                    { errors?.username && (
                        <p className='text-red-500'>{ errors.username.message }</p>
                    ) }
                    <div className='flex items-center justify-between'>
                        <img
                            src={watch("profileImage") || user?.profileImage || "/assets/person.jpg"}
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
                    <button className='btn' type='submit'>save changes</button>
                </form>
            </div>
        )
    )
}

export default Profile
