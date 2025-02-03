import {
  Button,
  Modal,
  notification,
  Pagination,
  Popconfirm,
  Spin,
  Table,
  Tag,
} from "antd";
import React, { useEffect, useState } from "react";
import UpdateShop from "./UpdateShop";
import { useDispatch, useSelector } from "react-redux";
import { getListShopSelector } from "../../redux/selector";
import useShopList from "../../hooks/useShopList";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { deleteShop, getListShop } from "../../redux/slices/shopSlice";

const renderUpdateShop = (record) => <UpdateShop record={record} />;

function ShopTable({ dataSource }) {
  console.log("Datasource: ", dataSource);
  const shopList = useSelector(getListShopSelector);
  console.log("shop list", shopList);
  const dispatch = useDispatch();
  // const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);

  // Function to reload shop list
  const reloadShopList = () => {
    setLoading(true);
    dispatch(getListShop())
      .then(() => {
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  };

  // Function to handle delete
  const handleDelete = (record) => {
    console.log("Delete clicked for shop ID:", record.shopId); // Check if function is triggered
    setLoading(true);
    dispatch(deleteShop(record.shopId))
      .then(() => {
        // Show success notification
        notification.success({
          message: "Delete Successful",
          description: `Shop with ID ${record.shopId} has been deleted successfully.`,
          placement: "topRight",
        });

        // Reload shop list
        reloadShopList();
      })
      .catch((error) => {
        // Show error notification if delete fails
        notification.error({
          message: "Delete Failed",
          description: `Failed to delete shop with ID ${record.shopId}.`,
          placement: "topRight",
        });
        console.error("Error deleting shop:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const columns = [
    {
      title: "Shop ID",
      dataIndex: "shopId",
      key: "shopId",
    },
    {
      title: "Shop Name",
      dataIndex: "shopName",
      key: "shopName",
    },
    {
      title: "Shop Rate",
      dataIndex: "shopRate",
      key: "shopRate",
    },
    {
      title: "Shop Description",
      dataIndex: "shopDescription",
      key: "shopDescription",
    },
    {
      title: "Shop Address",
      dataIndex: "shopAddress",
      key: "shopAddress",
    },
    {
      title: "License",
      dataIndex: "bizLicences",
      key: "bizLicences",
    },
    {
      title: "Status",
      dataIndex: "isActivate",
      key: "isActivate",
      render: (isActivate) => {
        const isActive = isActivate === true || isActivate === "true"; // Ensure boolean
        return isActive ? (
          <Tag
            style={{ width: "75px" }}
            icon={<CheckCircleOutlined />}
            color="green"
          >
            Active
          </Tag>
        ) : (
          <Tag icon={<CloseCircleOutlined />} color="red">
            Inactive
          </Tag>
        );
      },
    },
    {
      title: "Edit / Delete",
      key: "actions",
      render: (record) => {
        return (
          <div style={{ display: "flex", gap: "8px" }}>
            {/* Edit Button */}
            {renderUpdateShop(record)}
            {/* Delete Button */}
            <Popconfirm
              cancelText="No"
              onText="Yes"
              title="Are you sure you want to delete this shop ?"
              onConfirm={() => {
                handleDelete(record);
              }}
            >
              <Button
                style={{ width: "32px", height: "32px" }}
                type="primary"
                danger
                // onClick={() => handleDelete(record)}
              >
                <DeleteOutlined />
              </Button>
            </Popconfirm>
          </div>
        );
      },
    },
  ];

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, [dataSource]);

  // Get List
  const GetListTable = () => {
    setLoading(true);
    dispatch(useShopList())
      .then(() => {
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  };

  return (
    <div>
      <div className="w-full">
        <Spin spinning={loading} tip="Loading...">
          <Table
            dataSource={dataSource}
            columns={columns}
            pagination={false}
            className="[&_.ant-table-thead_.ant-table-cell]:bg-[#fafafa] [&_.ant-table-thead_.ant-table-cell]:font-medium [&_.ant-table-cell]:py-4"
            style={{ marginBottom: "1rem" }}
            onChange={GetListTable}
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
        </Spin>
      </div>
    </div>
  );
}

export default ShopTable;
