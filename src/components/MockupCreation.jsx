'use client';

import React, { useState, useEffect, useRef } from "react";
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { useUser } from '@clerk/clerk-react'; // Import Clerk's useUser hook
import { useSearchParams } from 'next/navigation'; // Import useSearchParams

const Hero = ({ onGeneratedElement, generatedElements }) => {
  const [inputText, setInputText] = useState(""); 
  const [result, setResult] = useState(""); 
  const [animatedResult, setAnimatedResult] = useState(""); 
  const [loading, setLoading] = useState(false);
  const { user } = useUser();

  const searchParams = useSearchParams();

  const inputRef = useRef(null);

  useEffect(() => {
    setResult("");
    setAnimatedResult(""); 
  }, [inputText]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleScrape = async () => {
    try {
      setLoading(true);
      setResult(""); // Clear previous result before fetching new one
      setAnimatedResult(""); // Clear previous animation
  
      // Send the input text to the API endpoint for processing
      const response = await fetch("/api/MockupCreation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ sentences: inputText.split(". ") }), // Split input into sentences
      });
  
      const data = await response.json();
      setResult(data.result); // Set result from API response
  
      // Animate text after result is set
      animateText(data.result);
  
      // Call onGeneratedElement prop to send the new result to the parent
      onGeneratedElement(data.result);
  
      if (user) {
        const buttonName = searchParams.get('name'); // Get the button name from URL
        if (!buttonName) return; // Ensure there's a valid button name
  
        // Reference to the user's document in Firestore
        const userRef = doc(db, 'users', user.id);
        const userDoc = await getDoc(userRef);
  
        let updatedButtons = {};
        if (userDoc.exists()) {
          const userData = userDoc.data();
          updatedButtons = userData.buttons || {}; // Keep existing buttons
  
          // If buttonName exists, append the new result instead of replacing
          if (updatedButtons[buttonName]) {
            updatedButtons[buttonName] += `${data.result}`;
          } else {
            updatedButtons[buttonName] = data.result;
          }
        } else {
          // If user doesn't exist, create a new entry
          updatedButtons = { [buttonName]: data.result };
        }
  
        // Update Firestore document without overwriting existing data
        await setDoc(userRef, { buttons: updatedButtons }, { merge: true });
  
        console.log("Button updated successfully:", updatedButtons);
      }
    } catch (error) {
      console.error("Scraping error:", error);
      setResult("Error occurred while processing the input.");
    } finally {
      setLoading(false);
    }
  };  

  const animateText = (text) => {
    if (!text) return;

    let index = -1;
    const intervalId = setInterval(() => {
      if (index < text.length - 1) {
        setAnimatedResult((prev) => prev + text[index]);
        index++;
      } else {
        clearInterval(intervalId);
      }
    }, 10);
  };

  const handleRegenerate = () => {
    // Remove the last element and regenerate a new one
    setResult(""); 
    setAnimatedResult(""); 
    handleScrape(); // Calls the same scrape function to regenerate
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault(); 
      handleScrape();
    }
  };

  return (
    <div className="bg-white fixed bottom-10 right-10 w-full max-w-[600px] mx-auto border border-black rounded-[12px] opacity-95">
      <div className="flex justify-between p-4 border-b border-black">
        <p className="text-lg font-semibold">Mockup Creator</p>
        <div className="flex gap-2">
          <p>o</p>
          <p>o</p>
        </div>
      </div>

      <div className="flex flex-col p-4 gap-4">
        <div className="bg-black text-white rounded-lg p-4 h-[100px] overflow-y-auto overflow-x-auto hide-scrollbar">
          {result ? (
            <pre className="whitespace-pre-wrap">{animatedResult}</pre>
          ) : (
            <p className="text-gray-400 animate-dots">Awaiting input</p>
          )}
        </div>

        <div className="flex items-center border border-black rounded-lg overflow-hidden">
          <input
            ref={inputRef}
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Enter text to create mockup"
            className="flex-grow p-3 text-black"
            onKeyDown={handleKeyDown}
          />
          <button
            onClick={handleScrape}
            disabled={loading}
            className="w-12 h-12 bg-black text-white flex items-center justify-center"
          >
            {loading ? "..." : "+"}
          </button>
        </div>

        {/* Regenerate Button */}
      </div>
    </div>
  );
};

export default Hero;
