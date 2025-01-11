import { PlusCircleOutlined } from "@ant-design/icons";
import { Button } from "antd";
import React from "react";

const buttonStyle = {
  height: "40px",
  width: "150px",
  borderRadius: "10px",
  margin: "0px 5px",
  padding: "7px 0px 10px 0px",
};
const MembershipButton = () => {
  return (
    <div>
      <Button
        className="deleteBtn"
        type="primary"
        icon={<PlusCircleOutlined />}
        style={buttonStyle}
      >
        Add Membership
      </Button>
    </div>
  );
};

export default MembershipButton;
