'use client'

import { useUser } from '@clerk/nextjs';
import Hero from "@/components/Hero";
import Standardize from "@/components/Standardize";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../../firebase';

export default function DashboardPage() {
  const [buttons, setButtons] = useState([]);
  const { user } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      const fetchButtons = async () => {
        const userRef = doc(db, 'users', user.id);
        try {
          const userDoc = await getDoc(userRef);
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setButtons(Object.keys(userData.buttons || {})); // Get button names from Firestore
          }
        } catch (error) {
          console.error('Error fetching buttons:', error);
        }
      };
      fetchButtons();
    }
  }, [user]); // Runs whenever `user` changes

  const addButton = async () => {
    const newButtonName = prompt("New File Name");
    if (!newButtonName || !user) return;
  
    const userRef = doc(db, 'users', user.id);
  
    try {
      const userDoc = await getDoc(userRef);
      let updatedButtons = {};
  
      if (userDoc.exists()) {
        const userData = userDoc.data();
        updatedButtons = { ...(userData.buttons || {}), [newButtonName]: "[]" }; // Add button as key with empty value
      } else {
        updatedButtons = { [newButtonName]: "" }; // Create new object if user doesn't exist
      }
  
      await setDoc(userRef, { buttons: updatedButtons }, { merge: true }); // Update Firestore
      setButtons(Object.keys(updatedButtons)); // Update local state with button names
    } catch (error) {
      console.error("Error adding button:", error);
    }
  };

  const deleteButton = async (buttonName) => {
    if (!user) return; // Ensure user is signed in
    console.log('signed in');
  
    const userRef = doc(db, 'users', user.id);
  
    try {
      console.log('in try block');
      const userDoc = await getDoc(userRef);
  
      if (!userDoc.exists()) return; // If no document exists, exit
      console.log('after doc exist');
  
      const userData = userDoc.data();
      const buttons = userData.buttons || {}; // Get existing buttons object
  
      if (!buttons[buttonName]) return; // If the button does not exist, exit
      console.log('after if button exist');
  
      // Create a new object without the deleted button
      const updatedButtons = { ...buttons };
      delete updatedButtons[buttonName];
  
      // Update Firestore by setting the `buttons` field to the updated object
      await setDoc(userRef, { buttons: updatedButtons });
  
      // Update local state
      setButtons(Object.keys(updatedButtons));
  
      console.log(`${buttonName} deleted successfully.`);
    } catch (error) {
      console.error("Error deleting button:", error);
    }
  };

  const handleButtonClick = (buttonName) => {
    // Redirect to the mockup page with buttonName as a query parameter
    router.push(`/dashboard/mockup-creation?name=${encodeURIComponent(buttonName)}`);
  };

  return (
    <div>
      <div className="flex h-[100vh]">
        <div className="w-[25%] flex  flex-col border-r border-black p-[25px] gap-[15px]">
          <h1 className="font-space-mono font-normal text-[21px] leading-[31.1px] tracking-normal">Browse</h1>
          {buttons.map((button, index) => (
            <div key={index} className="cursor-pointer flex py-[10px] items-center justify-between border-b border-gray">
                <div onClick={() => handleButtonClick(button)}
                className="flex items-center gap-[10px] text-black w-full"
                >
                {button}
                <p>(Local)</p>
                <i className="fa-solid fa-arrow-right"></i>
                </div>
                <div
                onClick={() => deleteButton(button)} // Ensure this is correctly set
                >
                             <i className="fas fa-trash"></i>
                </div>
            </div>
            ))}
            <p className="text-center">Cloud Storage Coming Soon</p>
          <div 
            onClick={addButton} 
            className="bg-black text-white px-9 py-4 rounded cursor-pointer flex items-center justify-center"
          >
            +
          </div>
        </div>
        <div className="p-[25px] gap-[25px] flex w-[75%]">
          <Hero />
          <Standardize />
        </div>
      </div>
    </div>
  );
}