import { EditOutlined } from "@ant-design/icons";
import { Button, Form, Popover } from "antd";
import React, { useState } from "react";

const UpdateFishParameter = () => {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [form] = Form.useForm();

  const showEditModal = () => {
    setIsEditOpen(true);
  };

  return (
    <div>
      <Popover content="Edit" trigger="hover">
        <Button
          type="text"
          icon={<EditOutlined />}
          onClick={showEditModal}
          className="bg-yellow-50 text-yellow-600 hover:bg-yellow-100 border-none shadow-none flex items-center justify-center"
          style={{
            width: "32px",
            height: "32px",
            padding: 0,
          }}
        />
      </Popover>
    </div>
  );
};

export default UpdateFishParameter;
