import { ethers } from "ethers";


const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

// Get the Ethereum object from the window (MetaMask)
export const getEthereumObject = () => {
  if (typeof window !== "undefined") {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (window as any).ethereum;
  }
  return null;
};

// Get the provider from MetaMask
export const getProvider = async () => {
  const eth = getEthereumObject();
  if (!eth) throw new Error("MetaMask is not installed");
  await eth.request({ method: "eth_requestAccounts" });
  return new ethers.BrowserProvider(eth);
};

const CONTRACT_ABI = [
    "function fundProject(uint256 _id) public payable"
];  

// Function to interact with the smart contract and fund the project
export const fundProject = async (projectId: number, amountEth: string) => {
  try {
    const provider = await getProvider();
    const signer = await provider.getSigner();

    const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
    if (!CONTRACT_ADDRESS) {
      throw new Error("Contract address is not defined");
    }

    const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

    // Call the fundProject function with the provided amount
    const tx = await contract.fundProject(projectId, {
      value: ethers.parseEther(amountEth),
    });

    const receipt = await tx.wait(); // Wait for the transaction confirmation

    console.log(receipt);

    await saveFundingTransaction(
      receipt.hash,
      projectId,
      "idv1cptGCY8IiBT55Joh",
      amountEth
    );

    return {
      success: true,
      transactionHash: receipt.hash,
    };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    console.error("Funding error:", err);
    throw new Error(err.message || "Funding failed");
  }
};


const saveFundingTransaction = async (
    transactionHash: string,
    fundingProjectId: number,
    projectDocId: string = "idv1cptGCY8IiBT55Joh",
    amountEth: string
    ) => {
    try {
        const response = await fetch(`${API_URL}/api/blockchain/fund-project`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
         body: JSON.stringify({ projectDocId, fundingProjectId, transactionHash, amountEth }),
        }); 
    
        if (!response.ok) {
        throw new Error("Failed to save funding transaction");
        }
    
        return await response.json();
    } catch (error) {
        console.error("Error saving funding transaction:", error);
        throw error;
    }
    }