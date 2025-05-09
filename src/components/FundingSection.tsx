"use client";

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { FaFacebookF } from "react-icons/fa";
import { TiSocialLinkedin } from "react-icons/ti";
import { IoLogoWhatsapp } from "react-icons/io";
import { MdEmail } from "react-icons/md";
import { FaCopy } from "react-icons/fa6";
import FundProjectBlockchainModal from './FundProjectBlockchainModal';
import BlockchainTransactionHistoryModal from './BlockchainTransactionHistoryModal';
import { ResearchProject } from '../../services/researchService2';
import AllTransactionHistoryModal from './AllTransactionHistoryModal';

interface FundingSectionProps {
  project: ResearchProject;
}

const FundingSection: React.FC<FundingSectionProps> = ({ project }) => {

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';


  const [copied, setCopied] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('stripe');
  const [researchProject, setResearchProject] = useState<ResearchProject | null>();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [transactionHistoryFromFirestore, setTransactionHistoryFromFirestore] = useState<any[]>([]);
  const [totalFunding, setTotalFunding] = useState(0);
  const [totalFundingTransactions, setTotalFundingTransactions] = useState(0);


  const fetchTransactionHistory = React.useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/research/projects/${project.id}/fundingtransactions`);
      if (!response.ok) {
        throw new Error('Failed to fetch transaction history');
      }
      const data = await response.json();

      setTotalFunding(data.totalFunding);
      setTotalFundingTransactions(data.numberOfTransactions);
      setTransactionHistoryFromFirestore(data.fundingTransactions);

    } catch (error) {
      console.error('Error fetching transaction history:', error);
    }
  }, [API_BASE_URL, project.id]);

  useEffect(() => {
    setResearchProject(project);
    fetchTransactionHistory();
  }, [project, fetchTransactionHistory]);

  console.log('project:', project);

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch((err) => {
      console.error("Failed to copy: ", err);
    });
  };

  const handlePayment = () => {
    if (paymentMethod === 'stripe') {
      window.location.href = "https://buy.stripe.com/test_cN2dTTf5Z5cX5BC6oo";
    } 
  };

  return (
    <div className="w-full max-w-x5">
      <div className="bg-white p-5 rounded-lg border border-gray-200 mb-4">
        <div className="mb-3">
          <h3 className="text-sm mb-1 text-[#1D2026]">Total Funding</h3>
          <div className="flex items-baseline">
            <div className="text-xl font-medium text-[#1D2026]">
              $ {totalFunding	}
              </div>
            <div className="text-sm text-gray-500 ml-2">Funding Goal of $ {researchProject?.fundingGoal}</div>
          </div>
        </div>
        
        <div className="mb-4">
          <div className="bg-gray-100 h-1 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full"
              style={{
                width: `${Math.min((totalFunding / (researchProject?.fundingGoal || 1)) * 100, 100)}%`,
                backgroundColor: '#16a34a'
              }}
            ></div>
          </div>
          <div className="flex justify-between mt-2">
            <div
              className="text-sm font-medium"
              style={{
              color: '#16a34a'
              }}
            >
              {((totalFunding / (researchProject?.fundingGoal || 1)) * 100).toFixed(2)}% CROWDFUNDED
              {totalFunding >= (researchProject?.fundingGoal || 0) ? ' - GOAL MET 🎉!' : ''}
            </div>
          </div>
        </div>
        
        <div className="flex items-center mb-4">
          <Image src="/Users.svg" alt="People" width={24} height={24} className="rounded-full mr-2" />
          <span className="text-sm text-gray-500">Funding donations</span>
          <span className="ml-auto text-sm font-medium text-gray-500">
            {totalFundingTransactions}
          </span>
        </div>
        
        <div className="mb-4">
          <p className="text-sm font-medium text-[#1D2026] mb-2">Select Payment Method:</p>
          <div className="flex flex-col space-y-2">
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="paymentMethod"
                value="stripe"
                checked={paymentMethod === 'stripe'}
                onChange={() => setPaymentMethod('stripe')}
                className="mr-2 accent-[#770C0C]"
              />
              <span className="text-sm text-gray-700">Pay with Card / Stripe</span>
            </label>
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="paymentMethod"
                value="blockchain"
                checked={paymentMethod === 'blockchain'}
                onChange={() => setPaymentMethod('blockchain')}
                className="mr-2 accent-[#770C0C]"
              />
              <span className="text-sm text-gray-700">
                Pay using Ethereum Cryptocurrency
              </span>
            </label>
          </div>
        </div>

        {paymentMethod === 'stripe' && (
          <button
            onClick={handlePayment}
            className="w-full bg-[#770C0C] text-white py-3 rounded-md font-medium mb-3
                      hover:bg-[#770C0C]/80 transition duration-200 ease-in-out"
          >
            Fund This Research
          </button>
        )} 
        {paymentMethod === 'blockchain' && (
            <FundProjectBlockchainModal 
              projectId={Number(researchProject?.onChainProjectId)}
              projectDocId={researchProject?.id || ''}
            />  
        )}

        <div className="mt-3">
            <AllTransactionHistoryModal 
              projectId={Number(researchProject?.onChainProjectId)}
              transactionHistoryFromFirestore={transactionHistoryFromFirestore}
              onRefreshData={() => {
                fetchTransactionHistory();
              }}
            />
        </div>

        <div className='mt-3'>
          <BlockchainTransactionHistoryModal projectId={Number(researchProject?.onChainProjectId)} />
        </div>

        
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