"use client";

import React, { useState, useEffect } from "react";
import { Navbar } from "./_components/navbar";
import { Header } from "./_components/header";
import { Register } from "@/app/_components/register";
import { socket } from "../lib/socket"; // Ensure this path is correct

interface HomeProps {}

const Home: React.FC<HomeProps> = () => {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [transport, setTransport] = useState<string>("N/A");
  const [isRegisterOpen, setIsRegisterOpen] = useState<boolean>(false);
  const [user, setUser] = useState<string>("user");
  const [isSignedIn, setIsSignedIn] = useState<boolean>(false);
  const [imageUrl, setImageUrl] = useState<string>("https://github.com/shadcn.png");
  const [buttonState, setButtonState] = useState<boolean>(false); // Add state for button

  useEffect(() => {
    function onConnect() {
      setIsConnected(true);
      setTransport(socket.io.engine.transport.name);
      socket.io.engine.on("upgrade", (transport) => {
        setTransport(transport.name);
      });
    }

    function onDisconnect() {
      setIsConnected(false);
      setTransport("N/A");
    }

    if (socket.connected) {
      onConnect();
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);

    socket.on("buttonState", (state) => {
      setButtonState(state); // Listen for button state changes from the server
    });

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("buttonState"); // Clean up the button state listener
    };
  }, []);

  const openRegister = () => setIsRegisterOpen(true);
  const closeRegister = () => setIsRegisterOpen(false);

  const toggleButton = () => {
    const newState = !buttonState;
    setButtonState(newState);
    socket.emit("buttonPress", newState); // Emit button state changes to the server
  };

  return (
    <div className="flex h-screen flex-col lg:flex-row relative">
      <Navbar />
      <div className="flex-1 ml-20">
        <Header
          user={user}
          isSignedIn={isSignedIn}
          imageUrl={imageUrl}
          onOpenRegister={openRegister}
        />
        <div className="flex flex-col lg:flex-row lg:h-screen space-y-2 lg:space-y-0 lg:space-x-2 mr-2">
          <div className="p-4 rounded-lg w-full lg:w-auto lg:flex-1 border-r border-gray-300">
            <h3 className="text-xl font-semibold mb-2">First Column</h3>
            <p className="text-gray-700">Here Goes the Editor.</p>
            <p>Status: {isConnected ? "connected" : "disconnected"}</p>
            <p>Transport: {transport}</p>
            <button 
              onClick={toggleButton} 
              className={`p-2 rounded-lg ${buttonState ? 'bg-green-500' : 'bg-red-500'}`}
            >
              {buttonState ? "Button Pressed" : "Button Not Pressed"}
            </button>
          </div>
          <div className="p-4 rounded-lg xl:w-1/3 lg:w-1/3 md:w-1/2">
            <h3 className="text-xl font-semibold mb-2">Second Column</h3>
            <p className="text-gray-700">Here Goes the Chat</p>
          </div>
        </div>
      </div>
      {isRegisterOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Register
            onClose={closeRegister}
            setIsSignedIn={setIsSignedIn}
            setUsername={setUser}
          />
          <button
            onClick={closeRegister}
            className="absolute top-4 right-4 bg-white p-2 rounded-full shadow-md"
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
};

export default Home;
