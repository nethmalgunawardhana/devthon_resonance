import { useState, useEffect } from "react";
import { AiOutlineCopy, AiOutlineCheck, AiOutlineLink } from "react-icons/ai";

type Transaction = {
  amountEth?: string;
  transactionHash?: string;
  createdAt: string;
  type: string;
  amountUSD?: string;
  user?: string;
};

export default function AllTransactionHistory({
  projectId,
  transactionHistoryFromFirestore,
  onRefreshData,
}: {
  projectId: number;
  transactionHistoryFromFirestore: Transaction[];
  onRefreshData: () => void; // The callback to refresh the parent data
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [copiedValue, setCopiedValue] = useState<string | null>(null);

  console.log(transactionHistoryFromFirestore)
  // Function to truncate Ethereum addresses
  const truncateAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const copyToClipboard = (value: string) => {
    navigator.clipboard.writeText(value);
    setCopiedValue(value);
    setTimeout(() => setCopiedValue(null), 2000); // Reset after 2 seconds
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
    // Call the refreshData callback when the modal is opened
    onRefreshData();
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    onModalClose();
  };

  const onModalClose = () => { 
    setIsModalOpen(false);
    onRefreshData();
  }

  return (
    <div>
      <button
        onClick={handleOpenModal}
        className="w-full bg-gray-50 text-center font-semibold rounded-md text-sm text-gray-600 py-3
        border border-gray-200 hover:bg-gray-100 hover:text-gray-800 active:bg-gray-200 active:scale-95 transition"
      >
        <span>View All Transaction History</span>
      </button>

      {/* Modal */}
      {isModalOpen && (
        <div onClick={handleCloseModal} className="fixed inset-0 flex justify-center items-center bg-black/40 z-50">
          <div onClick={(e) => e.stopPropagation()} className="w-full bg-white md:w-2/3 lg:w-1/2 flex items-center justify-center p-8 space-y-6">
            <div className="w-full max-w-2xl space-y-6">
              <div className="text-center mb-4">
                <h2 className="text-3xl font-bold text-gray-800 mb-2">
                  All Transaction History
                </h2>
                <p className="text-sm text-gray-500">
                  Complete transaction history for this project including on-chain and off-chain transactions.
                </p>
              </div>

              <div className="border border-gray-200 rounded-lg overflow-hidden">
                {transactionHistoryFromFirestore.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">No transactions found for this project.</div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">USD Value</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {transactionHistoryFromFirestore.map((tx, index) => (
                          <tr key={index} className={tx.type === 'withdraw' ? 'bg-red-50' : (tx.type === 'fund' || tx.type === 'eth') ? 'bg-green-50' : ''}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-gray-600 text-xs font-medium`}>
                              {tx.type === 'eth' ? (
                                <div className="flex items-center space-x-2">
                                <span>Ethereum</span>
                                {tx.transactionHash && (
                                  <>
                                  <button 
                                    onClick={() => copyToClipboard(tx.transactionHash ?? "")}
                                    className="text-gray-400 hover:text-gray-600 transition-colors"
                                    title="Copy transaction hash"
                                  >
                                    {copiedValue === tx.transactionHash ? (
                                    <AiOutlineCheck className="text-green-500" />
                                    ) : (
                                    <AiOutlineCopy />
                                    )}
                                  </button>
                                  <a
                                    href={`https://sepolia.etherscan.io/tx/${tx.transactionHash}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-gray-400 hover:text-blue-600 transition-colors"
                                    title="View transaction on Etherscan"
                                  >
                                    <AiOutlineLink />
                                  </a>
                                  </>
                                )}
                                </div>
                              ) : tx.type === 'stripe/card' ? 'Stripe/Card' : tx.type }
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {tx.user ? (
                                <div className="flex items-center space-x-2">
                                  <span>{truncateAddress(tx.user)}</span>
                                  {/* <button 
                                    onClick={() => copyToClipboard(tx.user? tx.user : "")}
                                    className="text-gray-400 hover:text-gray-600 transition-colors"
                                    title="Copy address"
                                  >
                                    {copiedValue === tx.user ? (
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
                                  </a> */}
                                </div>
                              ) : (
                                <span>-</span>
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {tx.amountEth ? `${tx.amountEth} ETH` : "-"}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {tx.amountUSD || "-"}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {

                                new Date(tx.createdAt).toLocaleTimeString("en-US", {
                                  hour: "2-digit",
                                  minute: "2-digit",    
                                  second: "2-digit",
                                  hour12: true,
                                  timeZone: "UTC",
                                }) + " " + new Date(tx.createdAt).toLocaleDateString("en-US", {
                                  year: "numeric",
                                  month: "2-digit",
                                  day: "2-digit",
                                })
                              
                              }
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