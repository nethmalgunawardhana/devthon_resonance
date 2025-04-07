import { useState, useEffect } from "react";
import Image from "next/image";
import { AiOutlineHistory, AiOutlineCopy, AiOutlineCheck, AiOutlineLink } from "react-icons/ai";

type Transaction = {
  projectId: string;
  amount: string;
  amountInUSD: string;
  user: string;
  txType: "fund" | "withdraw";
  timestamp: string;
};

export default function TransactionHistoryModal({ projectId }: { projectId: number }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null);

  const handleOpenModal = async () => {
    setIsModalOpen(true);
    await fetchTransactions();
  };

  const handleCloseModal = () => setIsModalOpen(false);

  const fetchTransactions = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/blockchain/project/${projectId}/transactions`);
      if (!response.ok) {
        throw new Error("Failed to fetch transaction history");
      }
      const data = await response.json();
      if (data.success) {
        setTransactions(data.data);
      } else {
        throw new Error(data.message || "Failed to fetch transaction history");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to truncate Ethereum addresses
  const truncateAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  // Function to copy address to clipboard
  const copyToClipboard = (address: string) => {
    navigator.clipboard.writeText(address);
    setCopiedAddress(address);
    setTimeout(() => setCopiedAddress(null), 2000); // Reset after 2 seconds
  };

  return (
    <div>
      <button
        onClick={handleOpenModal}
        className="bg-gray-600 text-white p-2 rounded flex items-center space-x-1"
      >
        <AiOutlineHistory />
        <span>Transaction History</span>
      </button>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
          <div className="w-full bg-white md:w-2/3 lg:w-1/2 flex items-center justify-center p-8 space-y-6">
            <div className="w-full max-w-2xl space-y-6">
              <div className="text-center mb-4">
                <div className="flex justify-center items-center space-x-2">
                  <Image
                    src="/ethereum-eth-logo.svg"
                    alt="Ethereum"
                    width={40}
                    height={40}
                  />
                  <p className="text-sm text-gray-500">Blockchain Transactions</p>
                </div>
                <h2 className="text-3xl font-bold text-gray-800 mb-2">
                  Project Transaction History
                </h2>
                <p className="text-sm text-gray-500">
                  All funding and withdrawal transactions for this project.
                </p>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}

              <div className="border border-gray-200 rounded-lg overflow-hidden">
                {isLoading ? (
                  <div className="p-8 text-center text-gray-500">Loading transactions...</div>
                ) : transactions.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">No transactions found for this project.</div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount (ETH)</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">USD Value</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {transactions.map((tx, index) => (
                          <tr key={index} className={tx.txType === 'withdraw' ? 'bg-red-50' : 'bg-green-50'}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                tx.txType === 'fund' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                              }`}>
                                {tx.txType === 'fund' ? 'Funding' : 'Withdrawal'}
                              </span>
                            </td>
                            <td title={tx.user} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              <div className="flex items-center space-x-2">
                                <span>{truncateAddress(tx.user)}</span>
                                <button 
                                  onClick={() => copyToClipboard(tx.user)}
                                  className="text-gray-400 hover:text-gray-600 transition-colors"
                                  title="Copy address"
                                >
                                  {copiedAddress === tx.user ? (
                                    <AiOutlineCheck className="text-green-500" />
                                  ) : (
                                    <AiOutlineCopy />
                                  )}
                                </button>
                                <a
                                  href={`https://sepolia.etherscan.io/address/${tx.user}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-gray-400 hover:text-blue-600 transition-colors"
                                  title="View on Etherscan"
                                >
                                  <AiOutlineLink />
                                </a>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {tx.amount} ETH
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {tx.amountInUSD}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {tx.timestamp}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  onClick={handleCloseModal}
                  className="px-4 py-2 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}