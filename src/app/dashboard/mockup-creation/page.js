"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation'; 
import Hero from "@/components/MockupCreation"; 
import EmptyEle from "@/components/EmptyEle";

export default function MockupCreationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const buttonName = searchParams.get('name');
  
  const [generatedElements, setGeneratedElements] = useState([]);
  const [showHero, setShowHero] = useState(true);
  const [deletedElements, setDeletedElements] = useState([]);
  const [history, setHistory] = useState([]); // To store history for undo

  const handleGeneratedElement = (content) => {
    setGeneratedElements((prev) => {
      const newState = [...prev, content];
      // Push the current state to history before the update
      setHistory((prevHistory) => [...prevHistory, prev]);
      return newState;
    });
  };

  const deleteElement = (index) => {
    const updatedElements = [...generatedElements];
    const deletedElement = updatedElements.splice(index, 1)[0];
    setGeneratedElements(updatedElements);
    setDeletedElements((prev) => [...prev, deletedElement]);

    // Save the current state to history for undo functionality
    setHistory((prevHistory) => [...prevHistory, [...updatedElements]]);
  };

  const undoDelete = () => {
    if (history.length > 0) {
      const previousState = history.pop(); // Get the previous state from history
      setGeneratedElements(previousState); // Restore the state
      setHistory([...history]); // Update the history after undo
    }
  };

  // Function to combine all generated elements into one HTML string
  const getCombinedElementsHTML = () => {
    return ` 
      <html lang="en"> 
        <head> 
            <meta charset="UTF-8"> 
            <meta name="viewport" content="width=device-width, initial-scale=1.0"> 
            <title>Created with MyInterface</title> 
            <style> 
                body { 
                    width: 100%; 
                    margin: 0; 
                    box-sizing: border-box; 
                } 
                body * { 
                    margin: 0; 
                    font-family: Arial, Helvetica, sans-serif; 
                    box-sizing: border-box; 
                } 
            </style> 
        </head> 
        <body> 
          ${generatedElements.map(content => `<div>${content}</div>`).join('')} 
        </body> 
      </html> 
    `; 
  };

  // Function to handle the copy action
  const handleCopy = () => {
    const combinedHTML = getCombinedElementsHTML(); // Get combined HTML as a string

    // Use the Clipboard API to copy the content to the clipboard
    navigator.clipboard.writeText(combinedHTML)
      .then(() => {
        alert('Elements copied to clipboard!');
      })
      .catch((err) => {
        console.error('Failed to copy: ', err);
      });
  };

  const handleUndo = (e) => {
    if (e.ctrlKey && e.key === 'z') {
      // If there are deleted elements, restore the last one
      if (deletedElements.length > 0) {
        const lastDeleted = deletedElements.pop();
        setDeletedElements([...deletedElements]);
        setGeneratedElements((prev) => [...prev, lastDeleted]);
      }
    }
  };

  // Handle key press events to toggle Hero visibility
  const handleKeyDown = (event) => {
    // Check for Tab key to toggle Hero visibility
    if (event.key === "Tab") {
      event.preventDefault(); // Prevent default behavior of Tab key (focus change)
      setShowHero((prev) => !prev); // Toggle visibility of the Hero component
    }
  };

  useEffect(() => {
    // Add event listener for keydown to handle undo and Tab visibility toggle
    if (typeof window !== "undefined") {
      window.addEventListener('keydown', handleKeyDown);
      window.addEventListener('keydown', handleUndo);

      return () => {
        window.removeEventListener('keydown', handleKeyDown);
        window.removeEventListener('keydown', handleUndo);
      };
    }
  }, [deletedElements]);

  return (
    <div className="flex relative justify-between">
      <div className="flex-1 flex flex-col gap-[0px]">
        <div className="flex justify-between p-[25px]">
          <button 
            onClick={() => router.push('/dashboard')} 
            className="cursor-pointer"
          >
            <u>Back</u> 
          </button>
          <button
            onClick={handleCopy}
            className="text-black px-[10px] py-[10px] rounded-[8px]"
          >
            <u>Copy Site to Clipboard</u>
          </button>
        </div>
        <div>
          {Array.isArray(generatedElements) && generatedElements.length > 0 ? (
            generatedElements.map((content, index) => (
              <EmptyEle 
                key={index} 
                content={content} 
                onDelete={() => deleteElement(index)} 
              />
            ))
          ) : (
            <div className="flex justify-center items-center h-[50vh]">
              <p className="animate-dots">Create Element To Start</p>
            </div>
          )}
        </div>

        {showHero && (
          <Hero 
            onGeneratedElement={handleGeneratedElement} 
            generatedElements={generatedElements} 
          />
        )}
      </div>
    </div>
  );
}
