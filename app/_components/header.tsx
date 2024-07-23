"use client";
import React from "react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import searchImage from "@/images/search.png";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  user: string;
  isSignedIn: boolean;
  imageUrl?: string;
  onOpenRegister: () => void;
}

export const Header: React.FC<HeaderProps> = ({ user, isSignedIn, imageUrl, onOpenRegister }) => {
  return (
    <div className="flex items-center justify-between mt-2 mb-4 px-20 py-2 sticky top-0 z-10">
      {/* Input on the left with adjusted width */}
      <div className="flex flex-col flex-wrap items-left space-y-1">
        <h1 className="text-4xl font-bold" >Hello, <span>{user}</span></h1>
        <p className="text-slate-600">Code with friends, assign tasks, discuss and much more.</p>
      </div>

      {/* Avatar, username, and possibly a button on the right */}
      <div className="flex items-center space-x-4">
        {isSignedIn ? (
           <Button 
           className="bg-gray-800 text-white rounded-3xl"
         >
           Contribute!
         </Button>
        ) : (
          <Button 
            onClick={onOpenRegister} 
            className="bg-gray-800 text-white rounded-3xl"
          >
            Join the Community
          </Button>
        )}
      </div>
    </div>
  );
};
