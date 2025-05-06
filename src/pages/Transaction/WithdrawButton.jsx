import React, { useState } from "react";
import AddWithdraw from "./AddWithdraw";

const WithdrawButton = () => {
  const [isAddOpen, setIsAddOpen] = useState(false);

  const handleOk = () => {
    setIsAddOpen(false);
  };

  return (
    <div>
      <AddWithdraw onClose={handleOk} />
    </div>
  );
};

export default WithdrawButton;
