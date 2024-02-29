"use client"
import { EmailOutlined, LockOutlined, PersonOutline } from '@mui/icons-material'
import axios from 'axios'
import Link from 'next/link'
import React, { Fragment } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { signIn } from "next-auth/react"
import { useRouter } from 'next/navigation'

const Form = ({ type }) => {

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors }
    } = useForm()

    const router = useRouter()

    const onSubmit = async (formData) => {
        try{
            if(type === "register"){
                const { data } = await axios.post("/api/auth/register", {
                    username: formData.username,
                    email: formData.email,
                    password: formData.password
                }, {
                    headers: {
                        "Content-Type": "application/json"
                    },
                    withCredentials: true
                })
                toast.success(data.message)
                router.push("/")
            }
            if(type === "login"){
                const res = await signIn("credentials", {
                    ...formData,
                    redirect: false
                })
                if(res.ok){
                    console.log(res)
                    router.push("/chats")
                }
                if(res.error){
                    toast.error("something went wrong")
                }
            }
        }catch(error){
            if(error.response){
                toast.error(error.response.data.message)
            }else{
                toast.error(error.message)
            }
        }
    }

    return (
        <div className='auth'>
            <div className='content'>
                <img src='/assets/logo.png' alt='logo' className='logo' />
                <form className='form' onSubmit={handleSubmit(onSubmit)}>
                    {
                        type === "register" && (
                            <div>
                                <div className='input'>
                                    <input
                                        defaultValue={""}
                                        {...register("username", {
                                            required: "username is required", validate: (value) => {
                                                if (value.length < 3) {
                                                    return "username must be at least 3 charates long"
                                                }
                                            }
                                        })}
                                        type='text'
                                        placeholder='Username'
                                        className='input-field'
                                    />
                                    <PersonOutline sx={{ color: "#737373" }} />
                                </div>
                                {errors.username && (
                                    <p className='text-red-500'>{errors.username.message}</p>
                                )}
                            </div>
                        )
                    }
                    <div>
                        <div className='input'>
                            <input
                                defaultValue={""}
                                {...register("email", { required: "email is required" })}
                                type='email'
                                placeholder='Email'
                                className='input-field'
                            />
                            <EmailOutlined sx={{ color: "#737373" }} />
                        </div>
                        {errors.email && (
                            <p className='text-red-500'>{errors.email.message}</p>
                        )}
                    </div>
                    <div>
                        <div className='input'>
                            <input
                                defaultValue={""}
                                {...register("password", {
                                    required: "password is required", validate: (value) => {
                                        if (value.length < 5 || !value.match(/[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]/)) {
                                            return "password must be at least 5 charates long and contain at least one special charater"
                                        }
                                    }
                                })}
                                type='password'
                                placeholder='Password'
                                className='input-field' />
                            <LockOutlined sx={{ color: "#737373" }} />
                        </div>
                        {errors.password && (
                            <p className='text-red-500'>{errors.password.message}</p>
                        )}
                    </div>
                    <button className='button' type='submit'>
                        {type === "register" ? "Join Free" : "Let's Chat"}
                    </button>
                </form>
                {
                    type === "register" ? (
                        <Link href={"/"} className='link'>
                            <p className='text-center'>Already have an account? Sign In Here</p>
                        </Link>
                    ) : (
                        <Link href={"/register"} className='link'>
                            <p className='text-center'>Don't have an account? Register Here</p>
                        </Link>
                    )
                }
            </div>
        </div>
    )
}

export default Form
