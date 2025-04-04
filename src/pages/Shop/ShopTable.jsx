import {
  Button,
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
  SearchOutlined,
} from "@ant-design/icons";
import { deleteShop, getListShop } from "../../redux/slices/shopSlice";

const renderUpdateShop = (record) => <UpdateShop record={record} />;

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
      title: "",
      // dataIndex: "shopId",
      key: "shopId",
      render: (_, __, index) => index + 1 + (currentPage - 1) * pageSize,
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
    <div>
      {/* Search Filters */}
      <Space style={{ marginBottom: 16, width: "100%" }} wrap>
        <Input
          placeholder="Tên Cửa Hàng"
          value={searchShopName}
          onChange={(e) => setSearchShopName(e.target.value)}
          prefix={<SearchOutlined />}
          style={{ width: 200 }}
        />
        <Input
          placeholder="Địa Chỉ"
          value={searchShopAddress}
          onChange={(e) => setSearchShopAddress(e.target.value)}
          prefix={<SearchOutlined />}
          style={{ width: 200 }}
        />
        <Select
          prefix={<SearchOutlined />}
          value={searchStatus}
          onChange={(value) => setSearchStatus(value)}
          style={{ width: 150 }}
        >
          <Select.Option value="all">Tất Cả</Select.Option>
          <Select.Option value="active">Kích Hoạt</Select.Option>
          <Select.Option value="inactive">Chưa Kích Hoạt</Select.Option>
        </Select>
        <Button
          icon={<ReloadOutlined />}
          type="default"
          onClick={handleResetFilters}
          //disabled={!searchTitle && !searchDate && !searchStatus} // Disable when no filters applied
        >
          Cài lại bộ lọc
        </Button>
      </Space>

      <div className="w-full">
        <Spin spinning={loading} tip="Loading...">
          <Table
            scroll={{ x: 1000 }}
            dataSource={paginatedData}
            columns={columns}
            pagination={false}
            className="[&_.ant-table-thead_.ant-table-cell]:bg-[#fafafa] [&_.ant-table-thead_.ant-table-cell]:font-medium [&_.ant-table-cell]:py-4"
            style={{ marginBottom: "1rem" }}
            onChange={GetListTable}
          />
          <Pagination
            total={filteredData.length}
            pageSize={pageSize}
            current={currentPage}
            showSizeChanger
            align="end"
            showTotal={(total, range) =>
              `${range[0]}-${range[1]} of ${total} items`
            }
            onChange={(page, size) => {
              setCurrentPage(page);
              setPageSize(size);
            }}
          />
        </Spin>
      </div>
    </div>
  );
}

export default ShopTable;
