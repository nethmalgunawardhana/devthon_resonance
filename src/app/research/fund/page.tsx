"use client";

import { useState } from "react";
import FundProjectBlockchainModal from "../../../components/FundProjectBlockchainModal"; 
import BlockchainTransactionHistoryModal from "@/components/BlockchainTransactionHistoryModal";

export default function FundProjectPage() {
  const [projectId, setProjectId] = useState<number>(1); 

  // testing lol
  const handleProjectChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const id = Number(e.target.value);
    if (!isNaN(id)) {
      setProjectId(id);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Fund a Research Project</h1>

      <div className="mb-4">
        <label htmlFor="projectId" className="block mb-2">Enter Project ID to Fund:</label>
        <input
          type="number"
          id="projectId"
          value={projectId}
          onChange={handleProjectChange}
          className="border p-2 rounded"
          min="1"
        />
      </div>

      <FundProjectBlockchainModal projectId={projectId} />

      <BlockchainTransactionHistoryModal projectId={projectId} />
    </div>
  );
}
