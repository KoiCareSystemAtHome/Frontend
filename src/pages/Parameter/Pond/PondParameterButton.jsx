import React, { useState } from "react";
import AddPondParameter from "./AddPondParameter";

const PondParameterButton = () => {
  const [isAddOpen, setIsAddOpen] = useState(false);

  const handleOk = () => {
    setIsAddOpen(false);
  };
  return (
    <div>
      <AddPondParameter onClose={handleOk} />
    </div>
  );
};

export default PondParameterButton;
