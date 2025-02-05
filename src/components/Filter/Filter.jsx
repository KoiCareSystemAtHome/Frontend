import React from "react";
import { Space, Select, Button } from "antd";
import { FilterFilled, ReloadOutlined } from "@ant-design/icons";

const Filter = () => {
  return (
    <Space size="middle" className="w-full bg-white p-4">
      <Button icon={<FilterFilled />}>Filter By</Button>

      <Select
        style={{ width: 200 }}
        placeholder="Date"
        allowClear
        options={[
          { value: "today", label: "Today" },
          { value: "yesterday", label: "Yesterday" },
          { value: "last_week", label: "Last Week" },
        ]}
      />

      <Select
        style={{ width: 200 }}
        placeholder="Rating"
        allowClear
        options={[
          { value: "high", label: "High Rating" },
          { value: "medium", label: "Medium Rating" },
          { value: "low", label: "Low Rating" },
        ]}
      />

      <Select
        style={{ width: 200 }}
        placeholder="Value"
        allowClear
        options={[
          { value: "high", label: "High Value" },
          { value: "medium", label: "Medium Value" },
          { value: "low", label: "Low Value" },
        ]}
      />

      <Button
        type="link"
        icon={<ReloadOutlined />}
        style={{ color: "#ff4d4f" }}
        className="text-red-500"
      >
        Reset Filter
      </Button>
    </Space>
  );
};

export default Filter;
