import React, { useState } from "react";
import AddReport from "./AddReport";

const ReportButton = () => {
  const [isAddOpen, setIsAddOpen] = useState(false);

  const handleOk = () => {
    setIsAddOpen(false);
  };

  return (
    <div>
      <AddReport onClose={handleOk} />
    </div>
  );
};

export default ReportButton;
