// components/FundProjectButton.tsx
import { useState } from "react";
import { fundProject } from "../../services/ethereumService";

export default function FundProjectButton({ projectId }: { projectId: number }) {
  const [amountEth, setAmountEth] = useState("0.01");
  const [isFunding, setIsFunding] = useState(false);

  const handleFundProject = async () => {
    setIsFunding(true);
    try {
      const result = await fundProject(projectId, amountEth);
      
      if (result.success) {
        alert(`Funding successful! Transaction Hash: ${result.transactionHash}`);
      }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      alert("Error funding project");
    } finally {
      setIsFunding(false);
    }
  };

  return (
    <div>
      <input
        type="number"
        step="0.01"
        value={amountEth}
        onChange={(e) => setAmountEth(e.target.value)}
        placeholder="Amount in ETH"
      />
      <button
        onClick={handleFundProject}
        disabled={isFunding}
        className="bg-blue-600 text-white p-2 rounded"
      >
        {isFunding ? "Funding..." : "Fund Project"}
      </button>
    </div>
  );
}
