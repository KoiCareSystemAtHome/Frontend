import React, { useState } from "react";
import AddShop from "./AddShop";

const ShopButton = () => {
  const [isAddOpen, setIsAddOpen] = useState(false);

  const handleOk = () => {
    setIsAddOpen(false);
  };

  return (
    <div>
      <AddShop onClose={handleOk} />
    </div>
  );
};

export default ShopButton;
