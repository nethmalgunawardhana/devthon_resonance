// services/ethereumService.ts
import { ethers } from "ethers";

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

    return {
      success: true,
      transactionHash: receipt.transactionHash,
    };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    console.error("Funding error:", err);
    throw new Error(err.message || "Funding failed");
  }
};
