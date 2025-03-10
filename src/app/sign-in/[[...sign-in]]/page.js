import React from 'react'
import { Container, Box, Typography, AppBar, Toolbar, Button } from '@mui/material'
import { SignIn, } from '@clerk/nextjs'



export default function SignInPage(){
    return (
        <div className = "flex gap-[50px] w-full justify-center p-[50px] items-center">
            <SignIn />
            <div className="border border-black rounded-[12px] overflow-hidden flex flex-col full">
                <div className = "justify-end flex gap-[15px] px-[15px] border-b border-black w-full">
                    <p>o</p>
                    <p>o</p>
                </div>
                <img className="h-auto w-[700px]" src="template.png" alt="SEO Optimizer" />
            </div>
        </div>
    )
}