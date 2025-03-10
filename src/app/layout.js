"use client"; // Mark this as a Client Component

import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
  useUser, // Add this hook
} from '@clerk/nextjs';
import { useRouter } from 'next/navigation'; // Use `next/navigation` for App Router
import { useEffect } from 'react'; // Add this hook
import { usePathname } from 'next/navigation';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import './globals.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <head>
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&display=swap"
          />
        </head>
        <body>
          <Header />
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}

function Header() {
  const { isSignedIn, user } = useUser();
  const router = useRouter();
  const pathname = usePathname(); // Get the current route

  useEffect(() => {
    const createUserDocument = async () => {
      if (isSignedIn && user) {
        const userRef = doc(db, 'users', user.id); // User document reference by user ID
        const userDoc = await getDoc(userRef); // Check if the document exists

        if (!userDoc.exists()) {
          // If the user document doesn't exist, create it
          await setDoc(userRef, {
            // empty for now later we will populate it with button info
          });
        }
      }
    };
    if (isSignedIn) {
      createUserDocument(); // Call the function to create user document
    }
    if (isSignedIn && pathname === "/") {
      router.push("/dashboard"); // Redirect to dashboard only from the home page
    }
  }, [isSignedIn, pathname, router]);

  return (
    <div className="flex justify-between px-[50px] py-[25px] border-b border-black items-center">
      <p>MyInterface</p>
      <div className="flex gap-[25px] items-center">
        <a href="#">About</a>
        <a href="#">Contact</a>
          <SignedOut>
            <a className="px-[20px] py-[10px] bg-black text-white rounded-[8px]" href = "/sign-in">Log In</a>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
      </div>
    </div>
  );
}