"use client";
import React from "react";
import loginbg from "@/app/Assets/login-bg-1.jpg";
import Image from "next/image";
import logo from "@/app/Assets/images/logo.png";

const layout = ({ children }) => {
  return (
    <div
      style={{
        backgroundImage: `url(${loginbg.src})`, // Use loginbg.src to get the image URL
        backgroundSize: "cover", // Ensure the background image covers the entire div
        backgroundRepeat: "no-repeat",

        // Prevent the image from repeating
      }}
      className="flex h-dvh bg items-center justify-center  px-4 sm:px-6 lg:px-8"
    >
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-xl dark:bg-secondary">
        <div className="flex mb-6 flex-col items-center justify-center">
          <Image
            src={logo}
            width={75}
            height={75}
            alt="Srilanka Goverment Embelm"
          />
          <div className="text-3xl">Railway Department</div>
        </div>
        {children}
      </div>
    </div>
  );
};

export default layout;
