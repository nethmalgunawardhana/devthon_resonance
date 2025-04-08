"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { FaFacebookF  } from "react-icons/fa";
import { TiSocialLinkedin } from "react-icons/ti";
import { IoLogoWhatsapp } from "react-icons/io";
import { MdEmail } from "react-icons/md";
import { FaCopy } from "react-icons/fa6";

const FundingSection = () => {
  const [copied, setCopied] = useState(false);

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); 
    }).catch((err) => {
      console.error("Failed to copy: ", err);
    });
  };

  return (
    <div className="w-full max-w-x5">
      <div className="bg-white p-5 rounded-lg border border-gray-200 mb-4">
        <div className="mb-3">
          <h3 className="text-sm mb-1 text-[#1D2026]">Total Funding</h3>
          <div className="flex items-baseline">
            <div className="text-xl font-medium text-[#1D2026]">$6,842</div>
            <div className="text-sm text-gray-500 ml-2">Funding Goal of $8000</div>
          </div>
        </div>
        
        <div className="mb-4">
          <div className="bg-gray-100 h-1 rounded-full overflow-hidden">
            <div className="bg-green-500 h-full w-4/5"></div>
          </div>
          <div className="flex justify-between mt-2">
            <div className="text-green-600 text-xs font-medium">100% CROWDFUNDED</div>
          </div>
        </div>
        
        <div className="flex items-center mb-4">
          <Image src="/Users.svg" alt="People" width={24} height={24} className="rounded-full mr-2" />
          <span className="text-sm text-gray-500">Funders</span>
          <span className="ml-auto text-sm font-medium text-gray-500">29</span>
        </div>
        
        <button
  onClick={() => window.location.href = "https://buy.stripe.com/test_cN2dTTf5Z5cX5BC6oo"}
  className="w-full bg-[#770C0C] text-white py-3 rounded-md font-medium mb-3
             hover:bg-[#770C0C]/80 transition duration-200 ease-in-out"
>
  Fund This Research
</button>

        
        {/* <button className="w-full  text-[#770C0C]  bg-[#FFEEE8] py-3 rounded-md font-medium mb-3">
          Request To Collaborate
        </button> */}
        
        <button className="w-full bg-gray-50 text-center font-semibold rounded-md text-sm text-gray-600 py-3
          border border-gray-200 hover:bg-gray-100 hover:text-gray-800 active:bg-gray-200 active:scale-95 transition">
          View Fund Transactions
        </button>
      </div>
      
      <div className="mb-6">
        <p className="text-sm text-[#1D2026] mb-3">Share this research:</p>
        <div className="flex space-x-3">
        <button
              className="flex items-center text-sm text-gray-600 border border-gray-200 rounded px-3 py-1
              hover:bg-gray-100 hover:text-gray-800 active:bg-gray-200 active:scale-95 transition"
              onClick={handleCopyUrl}
            >
              <FaCopy className="h-4 w-4 text-gray-600 mr-2" />
              {copied ? "Copied!" : "Copy URL"}
            </button>
          <button className="w-8 h-8 flex items-center justify-center border border-gray-200 rounded
            hover:bg-gray-100 hover:text-gray-800 active:bg-gray-200 active:scale-95 transition"
            onClick={() => {
              const emailShareUrl = `mailto:?subject=Check out this research&body=${encodeURIComponent(
                "Check out this research: " + window.location.href
              )}`;
              window.open(emailShareUrl, "_blank");
            }
          }>
            <MdEmail className="h-4 w-4 text-gray-600" />
          </button>
          
          <button className="w-8 h-8 flex items-center justify-center border border-gray-200 rounded
            hover:bg-gray-100 hover:text-gray-800 active:bg-gray-200 active:scale-95 transition"
            onClick={() => {
              const linkedInShareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent("https://voluntrix-preview.vercel.app/")}`;
              window.open(linkedInShareUrl, "_blank");
            }}
          >
            <TiSocialLinkedin className="h-4 w-4 text-gray-600" />
          </button>
          
          <button className="w-8 h-8 flex items-center justify-center border border-gray-200 rounded
            hover:bg-gray-100 hover:text-gray-800 active:bg-gray-200 active:scale-95 transition"
            onClick={() => {
              const whatsappShareUrl = `https://wa.me/?text=${encodeURIComponent(
                "Check out this research: " + window.location.href
              )}`;
              window.open(whatsappShareUrl, "_blank");
            }}
          >
            <IoLogoWhatsapp className="h-4 w-4 text-gray-600" />
          </button>
          
          <button className="w-8 h-8 flex items-center justify-center border border-gray-200 rounded
            hover:bg-gray-100 hover:text-gray-800 active:bg-gray-200 active:scale-95 transition"
            onClick={() => {
              const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                window.location.href
              )}`;
              window.open(facebookShareUrl, "_blank");
            }
          }>
            <FaFacebookF className="h-4 w-4 text-gray-600" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default FundingSection;