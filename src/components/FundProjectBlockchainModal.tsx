import { useState, useEffect, useCallback } from "react";
import { fundProject, getEthereumObject } from "../../services/ethereumService";
import Image from "next/image";
import { AiOutlineWallet } from "react-icons/ai"; // Wallet icon

export default function FundProjectBlockchainModal({ projectId }: { projectId: number }) {
  const [amountEth, setAmountEth] = useState("0.01");
  const [isFunding, setIsFunding] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [ethPrice, setEthPrice] = useState<number | null>(null); // For displaying ETH price in USD
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isFetchingEthPrice, setIsFetchingEthPrice] = useState(true); // Loading state for ETH price

  useEffect(() => {
    const fetchWalletAddress = async () => {
      const eth = getEthereumObject();
      if (eth) {
        const accounts = await eth.request({ method: "eth_accounts" });
        if (accounts.length > 0) {
          setWalletAddress(accounts[0]);
        }
      }
    };

    const fetchEthPrice = async () => {
      setIsFetchingEthPrice(true);
      try {
        const res = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd");
        const data = await res.json();
        setEthPrice(data.ethereum.usd); // Set ETH price in USD
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        setErrorMessage("Failed to fetch ETH price.");
      } finally {
        setIsFetchingEthPrice(false);
      }
    };

    fetchWalletAddress();
    fetchEthPrice();
  }, []);

  useEffect(() => {
    const eth = getEthereumObject();
    if (eth) {
      eth.on("accountsChanged", (accounts: string[]) => {
        if (accounts.length > 0) {
          setWalletAddress(accounts[0]);
        } else {
          setWalletAddress(null);
        }
      });
    }
  }, []);


  const handleFundProject = async () => {
    if (parseFloat(amountEth) <= 0) {
      setErrorMessage("Amount must be greater than 0 ETH.");
      return;
    }
  
    setErrorMessage(null);
    setSuccessMessage(null);
    setIsFunding(true);
    try {
      const result = await fundProject(projectId, amountEth);
      if (result.success) {
        setSuccessMessage(`Funding successful! Transaction Hash: ${result.transactionHash.slice(0, 10)}...`);
        setTimeout(() => handleCloseModal(), 3000); // Close modal after 3 seconds on success
      }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      setErrorMessage(`${error.message}`);
    } finally {
      setIsFunding(false);
    }
  };

  

  const handleOpenModal = useCallback(() => {
    setIsModalOpen(true);
    setErrorMessage(null);
    setSuccessMessage(null);
  }, []);

  const handleCloseModal = () => setIsModalOpen(false);

  const handleConnectWallet = async () => {
    setErrorMessage(null);
    const eth = getEthereumObject();
    if (eth) {
      try {
        // Prompt for wallet connection
        const accounts = await eth.request({ method: "eth_requestAccounts" });
        if (accounts.length > 0) {
          setWalletAddress(accounts[0]);
        }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
      } catch (error: any) {
        setErrorMessage("Error connecting wallet. Please make sure MetaMask is installed and unlocked.");
      }
    } else {
      setErrorMessage("MetaMask is not installed. Please install it to continue.");
    }
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (parseFloat(value) >= 0) {
      setAmountEth(value);
    }
  };

  return (
    <div>
      <button
        onClick={handleOpenModal}
        className="w-full bg-[#770C0C] text-white py-3 rounded-md font-medium mb-3 hover:bg-[#770C0C]/80 transition duration-200 ease-in-out"
      >
        Fund This Research
      </button>

      {/* Modal */}
      {isModalOpen && (
        <div onClick={handleCloseModal} className="fixed inset-0 flex justify-center items-center bg-black/40 z-50">
          <div onClick={(e) => e.stopPropagation()} className="w-full bg-white opacity-100 md:w-1/2 sm:w-3/4 lg:w-1/3 flex items-center justify-center p-8 space-y-6">
            <div className="w-full max-w-md space-y-6">
              <div className="text-center mb-4">
                <div className="flex justify-center items-center space-x-2">
                  <Image
                    src="/MetaMask-icon-fox-with-margins.svg"
                    alt="MetaMask"
                    width={50}
                    height={50}
                  />
                  <p className="text-sm text-gray-500">Powered by MetaMask</p>
                </div>
                <h2 className="text-3xl font-bold text-gray-800 mb-2">
                  Fund Project
                </h2>
                <p className="text-sm text-gray-500">
                  Enter the amount in ETH to fund the project.
                </p>
              </div>

              {walletAddress ? (
                <div className="text-center">
                  <div title={walletAddress} className="flex items-center justify-center bg-green-100 border border-green-400 text-green-700 rounded-lg py-2 px-4">
                    <span className="font-semibold">Connected Wallet:</span>
                    <span>
                      {`${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    To switch wallets, please open MetaMask extension and select a different account.
                  </p>
                </div>
              ) : (
                <div className="text-center">
                  <p className="text-sm text-red-500">
                    No wallet connected. Please connect MetaMask.
                  </p>
                  <button
                    onClick={handleConnectWallet}
                    className="mt-2 flex items-center justify-center space-x-2 mx-auto px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-all"
                  >
                    <AiOutlineWallet />
                    <span>Connect Wallet</span>
                  </button>
                  <div className="mt-4 text-xs text-gray-600 border border-gray-200 p-3 rounded-lg bg-gray-50">
                    <p className="font-semibold mb-1">Don&apos;t have MetaMask?</p>
                    <p>MetaMask is a cryptocurrency wallet & gateway to blockchain apps.</p>
                    <a 
                      href="https://metamask.io/download/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline block mt-2"
                    >
                      Install MetaMask →
                    </a>
                  </div>
                </div>
              )}

              {errorMessage && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                  {errorMessage}
                </div>
              )}

              {successMessage && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
                  {successMessage}
                </div>
              )}

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-800">
                  Amount in ETH
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.01"
                    value={amountEth}
                    onChange={handleAmountChange}
                    className="w-full px-4 py-3 text-sm text-black placeholder-gray-400 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#770C0C]/30 focus:border-[#770C0C] transition-all"
                    placeholder="Enter amount"
                    min="0"
                  />
                </div>
                {ethPrice && !isFetchingEthPrice && (
                  <p className="text-sm text-gray-600">
                    Approx. ${(parseFloat(amountEth) * ethPrice).toFixed(2)} USD
                  </p>
                )}
                {isFetchingEthPrice && (
                  <p className="text-sm text-gray-600">Fetching ETH price...</p>
                )}
              </div>

              <div className="flex justify-end">
                <button
                  onClick={handleCloseModal}
                  className="text-sm text-[#770C0C] hover:underline cursor-pointer"
                >
                  Cancel
                </button>
              </div>

              <button
                onClick={handleFundProject}
                disabled={isFunding || !walletAddress || parseFloat(amountEth) <= 0}
                className="w-full bg-[#770C0C] text-white py-3 rounded-lg font-semibold hover:bg-[#5d0a0a] transition-all transform hover:scale-[1.02] shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed hover:cursor-pointer"
              >
                {isFunding ? "Processing..." : "Fund Project"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
