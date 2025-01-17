import React, { useState } from "react";
import {
  Table,
  Checkbox,
  Button,
  Space,
  Pagination,
  Popover,
  Image,
} from "antd";
import {
  SmileOutlined,
  StarOutlined,
  DeleteOutlined,
  DesktopOutlined,
  FolderFilled,
} from "@ant-design/icons";

// const { Search } = Input;

const FeedbackTable = () => {
  // State to manage clicked status of satisfaction and favorite icons
  const [clickedIcons, setClickedIcons] = useState(
    Array(10).fill({ satisfaction: false, favorite: false })
  );

  const handleIconClick = (index, type) => {
    setClickedIcons((prevState) =>
      prevState.map((icon, i) =>
        i === index ? { ...icon, [type]: !icon[type] } : icon
      )
    );
  };

  // Mock data
  const dataSource = Array(10)
    .fill()
    .map((_, index) => ({
      key: index,
      comments: "How to know if your koi is healthy",
      date: "01/01/2024",
      device: "Desktop",
      selected: false,
    }));

  // Table columns configuration
  const columns = [
    {
      title: "Comments",
      dataIndex: "comments",
      key: "comments",
      render: (text) => (
        <Space>
          <Checkbox />
          <Image
            style={{ width: "50px" }}
            src="https://cdn.shortpixel.ai/spai/w_662+q_glossy+ret_img+to_webp/www.hive.hr/wp-content/uploads/2020/06/Hive-Homepage-Hive-Fives-2020-Cards.png"
          />
          <span>{text}</span>
        </Space>
      ),
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "Satisfaction",
      dataIndex: "satisfaction",
      key: "satisfaction",
      render: (_, record, index) => (
        <Popover content="User satisfaction rating" trigger="hover">
          <SmileOutlined
            style={{
              fontSize: "20px",
              color: clickedIcons[index]?.satisfaction ? "#52c41a" : "#8c8c8c",
              cursor: "pointer",
            }}
            onMouseEnter={(e) =>
              !clickedIcons[index]?.satisfaction &&
              (e.currentTarget.style.color = "#52c41a")
            }
            onMouseLeave={(e) =>
              !clickedIcons[index]?.satisfaction &&
              (e.currentTarget.style.color = "#8c8c8c")
            }
            onClick={() => handleIconClick(index, "satisfaction")}
          />
        </Popover>
      ),
    },
    {
      title: "Favorite",
      dataIndex: "favorite",
      key: "favorite",
      render: (_, record, index) => (
        <Popover content="Mark as favorite" trigger="hover">
          <StarOutlined
            style={{
              fontSize: "20px",
              color: clickedIcons[index]?.favorite ? "#fadb14" : "#8c8c8c",
              cursor: "pointer",
            }}
            onMouseEnter={(e) =>
              !clickedIcons[index]?.favorite &&
              (e.currentTarget.style.color = "#fadb14")
            }
            onMouseLeave={(e) =>
              !clickedIcons[index]?.favorite &&
              (e.currentTarget.style.color = "#8c8c8c")
            }
            onClick={() => handleIconClick(index, "favorite")}
          />
        </Popover>
      ),
    },
    {
      title: "Device",
      dataIndex: "device",
      key: "device",
      render: (_, record) => (
        <Space className="w-full justify-between">
          <Space>
            <DesktopOutlined />
            <span>{record.device}</span>
          </Space>
        </Space>
      ),
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      width: "5%",
      render: () => (
        <Space className="justify-between">
          <Popover content="Archive" trigger="hover">
            <Button
              type="text"
              icon={<FolderFilled />}
              className="bg-yellow-50 text-yellow-600 hover:bg-yellow-100"
            />
          </Popover>
          <Popover content="Delete Item" trigger="hover">
            <Button
              type="text"
              icon={<DeleteOutlined />}
              className="bg-red-50 text-red-600 hover:bg-red-100"
            />
          </Popover>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div className="w-full">
        <Table
          dataSource={dataSource}
          columns={columns}
          pagination={false}
          className="[&_.ant-table-thead_.ant-table-cell]:bg-[#fafafa] [&_.ant-table-thead_.ant-table-cell]:font-medium [&_.ant-table-cell]:py-4"
          style={{ marginBottom: "1rem" }}
        />

        <Pagination
          total={50}
          align="end"
          showTotal={(total, range) =>
            `${range[0]}-${range[1]} of ${total} items`
          }
          defaultPageSize={10}
          defaultCurrent={1}
        />
      </div>
    </div>
  );
};

export default FeedbackTable;
