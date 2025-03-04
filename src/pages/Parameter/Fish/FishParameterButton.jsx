import React, { useState } from "react";
import AddFishParameter from "./AddFishParameter";

const FishParameterButton = () => {
  const [isAddOpen, setIsAddOpen] = useState(false);

  const handleOk = () => {
    setIsAddOpen(false);
  };
  return (
    <div>
      <AddFishParameter onClose={handleOk} />
    </div>
  );
};

export default FishParameterButton;
