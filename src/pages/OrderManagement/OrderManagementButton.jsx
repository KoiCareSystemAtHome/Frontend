import React, { useState } from "react";
import AddOrder from "./AddOrder";

const OrderManagementButton = () => {
  const [isAddOpen, setIsAddOpen] = useState(false);

  const handleOk = () => {
    setIsAddOpen(false);
  };

  return (
    <div>
      <AddOrder onClose={handleOk} />
    </div>
  );
};

export default OrderManagementButton;
