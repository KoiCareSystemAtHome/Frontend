import React, { useState } from "react";
import AddMembership from "./AddMembership";

const MembershipButton = () => {
  const [isAddOpen, setIsAddOpen] = useState(false);

  const handleOk = () => {
    setIsAddOpen(false);
  };

  return (
    <div>
      <AddMembership onClose={handleOk} />
    </div>
  );
};

export default MembershipButton;
