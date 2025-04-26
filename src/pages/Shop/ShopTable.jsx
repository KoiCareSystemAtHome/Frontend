import {
  Button,
  Image,
  Input,
  notification,
  Pagination,
  Popconfirm,
  Select,
  Space,
  Spin,
  Table,
  Tag,
} from "antd";
import React, { useEffect, useState } from "react";
import UpdateShop from "./UpdateShop";
import { useDispatch } from "react-redux";
import useShopList from "../../hooks/useShopList";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  DeleteOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import { deleteShop, getListShop } from "../../redux/slices/shopSlice";

const renderUpdateShop = (record) => <UpdateShop record={record} />;

// CSS styles for enhanced visuals
const tableStyles = `
  .product-management-table .ant-table {
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    background: #fff;
  }

  .product-management-table .ant-table-thead > tr > th {
    background: linear-gradient(135deg,rgb(65, 65, 65),rgb(65, 65, 65));
    color: #fff;
    font-weight: 600;
    padding: 12px 16px;
    border-bottom: none;
    transition: background 0.3s;
  }

  .product-management-table .ant-table-tbody > tr:hover > td {
    background: #e6f7ff;
    transition: background 0.2s;
  }

  .product-management-table .ant-table-tbody > tr > td {
    padding: 12px 16px;
    border-bottom: 1px solid #f0f0f0;
    transition: all 0.3s;
  }

  .product-management-table .ant-table-tbody > tr:nth-child(even) {
    background: #fafafa;
  }

  .filter-container {
    background: #f9f9f9;
    padding: 16px;
    border-radius: 8px;
    margin-bottom: 24px;
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
    align-items: center;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  }

  .filter-container .ant-input, 
  .filter-container .ant-select {
    border-radius: 6px;
    transition: all 0.3s;
  }

  .filter-container .ant-input:hover,
  .filter-container .ant-input:focus,
  .filter-container .ant-select:hover .ant-select-selector,
  .filter-container .ant-select-focused .ant-select-selector {
    border-color: #40a9ff !important;
    box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2) !important;
  }

  .filter-container .ant-btn {
    border-radius: 6px;
    transition: all 0.3s;
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .filter-container .ant-btn:hover {
    background: #40a9ff;
    color: #fff;
    border-color: #40a9ff;
    transform: translateY(-1px);
  }

  .custom-spin .ant-spin-dot-item {
    background-color: #1890ff;
  }

  .pagination-container {
    margin-top: 16px;
    display: flex;
    justify-content: flex-end;
  }

  .pagination-container .ant-pagination-item-active {
    background:rgb(65, 65, 65);
    border-color:rgb(65, 65, 65);
  }

  .pagination-container .ant-pagination-item-active a {
    color: #fff;
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .fade-in {
    animation: fadeIn 0.5s ease-out;
  }
`;

// Inject styles into the document
const styleSheet = document.createElement("style");
styleSheet.innerText = tableStyles;
document.head.appendChild(styleSheet);

function ShopTable({ dataSource }) {
  console.log("Datasource: ", dataSource);
  // const shopList = useSelector(getListShopSelector);
  // console.log("shop list", shopList);
  const dispatch = useDispatch();

  // pagination
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // State for search filters
  const [searchShopName, setSearchShopName] = useState("");
  const [searchShopAddress, setSearchShopAddress] = useState("");
  const [searchStatus, setSearchStatus] = useState("all"); // "all", "active", "inactive"

  // Filter the data based on search criteria
  const filteredData = dataSource.filter((shop) => {
    // Shop Name filter (case-insensitive)
    const matchesShopName = searchShopName
      ? shop.shopName.toLowerCase().includes(searchShopName.toLowerCase())
      : true;

    // Shop Address filter (case-insensitive)
    let shopAddressText = "N/A";
    if (shop.shopAddress) {
      try {
        const address = JSON.parse(shop.shopAddress);
        shopAddressText = `${address.WardName}, ${address.DistrictName}, ${address.ProvinceName}`;
      } catch (error) {
        shopAddressText = "Invalid Address";
      }
    }
    const matchesShopAddress = searchShopAddress
      ? shopAddressText.toLowerCase().includes(searchShopAddress.toLowerCase())
      : true;

    // Status filter
    const isActive = shop.isActivate === true || shop.isActivate === "true";
    const matchesStatus =
      searchStatus === "all" ||
      (searchStatus === "active" && isActive) ||
      (searchStatus === "inactive" && !isActive);

    return matchesShopName && matchesShopAddress && matchesStatus;
  });

  // Compute paginated data
  const paginatedData = filteredData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

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

  const handleResetFilters = () => {
    setSearchShopName("");
    setSearchShopAddress("");
    setSearchStatus("all");
    setCurrentPage(1); // Reset to the first page
    setPageSize(10); // Reset page size to default
  };

  const columns = [
    {
      title: "STT",
      // dataIndex: "shopId",
      key: "shopId",
      render: (_, __, index) => index + 1 + (currentPage - 1) * pageSize,
    },
    {
      title: "Hình Ảnh",
      dataIndex: "shopAvatar",
      key: "shopAvatar",
      render: (shopAvatar) => {
        if (!shopAvatar) {
          return "N/A"; // Display "N/A" if no image URL is provided
        }
        return (
          <Image
            src={shopAvatar}
            alt="Shop Avatar"
            style={{
              maxWidth: "100px",
              maxHeight: "100px",
              objectFit: "cover",
            }}
            placeholder={<Spin size="small" />}
            fallback="https://via.placeholder.com/100?text=No+Image" // Fallback image if URL fails
          />
        );
      },
    },
    {
      title: "Tên Cửa Hàng",
      dataIndex: "shopName",
      key: "shopName",
    },
    {
      title: "Đánh Giá",
      dataIndex: "shopRate",
      key: "shopRate",
    },
    {
      title: "Mô Tả",
      dataIndex: "shopDescription",
      key: "shopDescription",
    },
    {
      title: "Địa Chỉ",
      dataIndex: "shopAddress",
      key: "shopAddress",
      render: (shopAddress) => {
        if (!shopAddress) return "N/A"; // Handle missing address
        try {
          const address = JSON.parse(shopAddress);
          return `${address.WardName}, ${address.DistrictName}, ${address.ProvinceName}`;
        } catch (error) {
          return "Invalid Address"; // Handle parsing errors
        }
      },
    },
    {
      title: "Giấy Phép Kinh Doanh",
      dataIndex: "bizLicences",
      key: "bizLicences",
      render: (bizLicences) => {
        if (!bizLicences) {
          return "N/A";
        }
        return (
          <Image
            src={bizLicences}
            alt="N/A"
            style={{
              maxWidth: "100px",
              maxHeight: "100px",
              objectFit: "cover",
            }}
          />
        );
      },
    },
    {
      title: "GHN ID",
      dataIndex: "ghnId",
      key: "ghnId",
    },
    {
      title: "Trạng Thái",
      dataIndex: "isActivate",
      key: "isActivate",
      render: (isActivate) => {
        const isActive = isActivate === true || isActivate === "true"; // Ensure boolean
        return isActive ? (
          <Tag
            style={{ width: "95px", fontSize: "14px", padding: "5px" }}
            icon={<CheckCircleOutlined />}
            color="green"
          >
            Kích Hoạt
          </Tag>
        ) : (
          <Tag
            style={{ width: "95px", fontSize: "14px", padding: "5px" }}
            icon={<CloseCircleOutlined />}
            color="red"
          >
            Vô Hiệu
          </Tag>
        );
      },
    },
    {
      title: "Chỉnh Sửa / Xóa",
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
  }, [
    dataSource,
    currentPage,
    pageSize,
    searchShopName,
    searchShopAddress,
    searchStatus,
  ]);

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
    <div className="product-management-table" style={{ padding: "16px" }}>
      {/* Search Filters */}
      <Space className="filter-container">
        <Input
          prefix={<span style={{ color: "#bfbfbf" }}>🔍</span>}
          placeholder="Tên Cửa Hàng"
          value={searchShopName}
          onChange={(e) => setSearchShopName(e.target.value)}
          style={{ width: 200, height: 36 }}
        />
        <Input
          prefix={<span style={{ color: "#bfbfbf" }}>🔍</span>}
          placeholder="Địa Chỉ"
          value={searchShopAddress}
          onChange={(e) => setSearchShopAddress(e.target.value)}
          style={{ width: 200, height: 36 }}
        />
        <Select
          prefix={<span style={{ color: "#bfbfbf" }}>🔍</span>}
          value={searchStatus}
          onChange={(value) => setSearchStatus(value)}
          style={{ width: 150, height: 36 }}
        >
          <Select.Option value="all">Tất Cả</Select.Option>
          <Select.Option value="active">Kích Hoạt</Select.Option>
          <Select.Option value="inactive">Chưa Kích Hoạt</Select.Option>
        </Select>
        <Button
          icon={<ReloadOutlined />}
          type="default"
          onClick={handleResetFilters}
          style={{ height: 36 }}
          className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white rounded-md flex items-center justify-center"
        >
          Cài lại bộ lọc
        </Button>
      </Space>

      <div className="w-full">
        <Spin spinning={loading} tip="Đang Tải...">
          <Table
            scroll={{ x: 1000 }}
            dataSource={paginatedData}
            columns={columns}
            pagination={false}
            className="[&_.ant-table-thead_.ant-table-cell]:bg-[#fafafa] [&_.ant-table-thead_.ant-table-cell]:font-medium [&_.ant-table-cell]:py-4"
            style={{ marginBottom: "1rem" }}
            onChange={GetListTable}
          />
          <div className="pagination-container">
            <Pagination
              total={filteredData.length}
              pageSize={pageSize}
              current={currentPage}
              showSizeChanger
              align="end"
              showTotal={(total, range) =>
                `${range[0]}-${range[1]} / ${total} cửa hàng`
              }
              onChange={(page, size) => {
                setCurrentPage(page);
                setPageSize(size);
              }}
            />
          </div>
        </Spin>
      </div>
    </div>
  );
}

export default ShopTable;
