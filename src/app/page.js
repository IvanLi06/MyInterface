import Image from "next/image";
import Websitefooter from '@/components/footer';
import Hero from "@/components/Hero";

import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
  useUser, // Add this hook
} from '@clerk/nextjs';
import Button from "@/components/button";

export default function Home() {
  return (
    <div>
      <div className = "flex justify-between items-center gap-[60px] px-[100px] py-[75px] border-b border-black">
        <div className = "flex flex-col gap-[15px]">
          <h1 className = "text-[27px] font-bold">BUILD SMARTER, OPTIMIZED WESBITES</h1>
          <p>An AI-driven tool ensures industry-standard UI/UX formatting and SEO, allowing you to focus on what truly matters — YOUR CONTENT.</p>
          <div className = "flex gap-[10px]">
            <div className="px-[20px] py-[10px] bg-black text-white rounded-[8px]">
              <SignedOut>
                <a href = "/sign-in">Log In</a>
              </SignedOut>
              <SignedIn>
                <UserButton />
              </SignedIn>
            </div>
            <div className="px-[20px] py-[10px] bg-white text-black rounded-[8px] border border-black">
              <SignedOut>
              <a href = "/sign-up">Sign Up</a>
              </SignedOut>
              <SignedIn>
                <UserButton />
              </SignedIn>
            </div>
          </div>
          <p className = "text-[12px]">By Logging in, you accept to our <u>terms & conditions</u> and <u>privacy policies</u></p>
        </div>
        <img className = "w-[500px]" src = "image.png"></img>
      </div>
      <div className = "flex flex-col items-center gap-[50px] px-[100px] py-[75px] border-b border-black">
        <div className = "flex justify-between gap-[15px] items-center">
          <h1 className = "text-[27px] w-full font-bold">BUILD SMARTER, OPTIMIZED WESBITES</h1>
          <p className = "border-r border-black px-[10px] text-right">We Use AI to standardizes text and image sizes based on  UI/UX industry standards.</p>
        </div>
        <div className="border border-black rounded-[12px] overflow-hidden flex flex-col full">
          <div className = "justify-end flex gap-[15px] px-[15px] border-b border-black w-full">
            <p>o</p>
            <p>o</p>
          </div>
          <img className="h-auto w-full" src="template.png" alt="SEO Optimizer" />
        </div>
      </div>
      <div className = "flex justify-between items-center gap-[50px] px-[100px] py-[75px] border-b border-black">
        <div className = "flex flex-col gap-[15px]">
          <h1 className = "text-[27px] font-bold">WEBSITE MOCK UP IN SECONDS</h1>
          <p>Create Low-Fidelity Proof of Concept Wireframes in a matter of minutes. Optimize and standardize it with the click of a button.</p>
          {/* <a className = "px-[20px] py-[10px] w-fit bg-white text-black rounded-[8px] border border-black" href = "#">Learn More</a> */}
        </div>
        <img className = "w-[800px] border border-black rounded-[8px]" src = "Mockup.png"></img>
      </div>
      <Websitefooter/>
    </div>
  );
}
