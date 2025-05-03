import { Button, Image, Input, Pagination, Select, Spin, Table } from "antd";
import React, { useEffect, useState } from "react";
//import { useDispatch } from "react-redux";
//import useProductManagementList from "../../hooks/useProductManagementList";
import { EyeOutlined, ReloadOutlined } from "@ant-design/icons";
import UpdateProductManagement from "./UpdateProductManagement";
import UpdateFood from "./UpdateFood";
import UpdateMedicine from "./UpdateMedicine";
import { useDispatch, useSelector } from "react-redux";
import { getProductsByShopId } from "../../redux/slices/productManagementSlice";

const renderUpdateProductManagement = (record) => {
  if (record.type === 1) {
    // Type 1: Dụng Cụ (Tool) => Use UpdateProductManagement
    return <UpdateProductManagement record={record} />;
  } else if (record.type === 0) {
    // Type 0: Thức Ăn (Food) => Use UpdateFood
    return <UpdateFood record={record} />;
  } else if (record.type === 2) {
    // Type 2: Thuốc (Medicine) => Use UpdateMedicine
    return <UpdateMedicine record={record} />;
  }
  return null;
};

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

function ProductManagementTable({ dataSource, shopId }) {
  console.log("Datasource: ", dataSource);
  //const productList = useSelector(getListProductManagementSelector);
  //console.log("Product list", productList);
  const dispatch = useDispatch();
  const [products, setProducts] = useState([]);

  const loggedInUser = useSelector((state) => state.authSlice.user);
  const currentShopId = shopId || loggedInUser?.shopId;

  // Ensure dataSource is an array, default to empty array if not
  const safeDataSource = Array.isArray(dataSource) ? dataSource : [];

  // search states
  const [searchProductName, setSearchProductName] = useState("");
  const [searchDescription, setSearchDescription] = useState("");
  const [searchBrand, setSearchBrand] = useState("");
  const [searchType, setSearchType] = useState(null);

  // Filtered data based on search input with defensive checks
  const filteredData = safeDataSource.filter((item) => {
    // Skip items that are undefined, null, or missing required properties
    if (!item || typeof item !== "object") return false;

    // Use optional chaining and provide fallback values
    const productName = (item.productName || "").toLowerCase();
    const description = (item.description || "").toLowerCase();
    const brand = (item.brand || "").toLowerCase();
    const type = item.type;

    return (
      productName.includes(searchProductName.toLowerCase()) &&
      description.includes(searchDescription.toLowerCase()) &&
      brand.includes(searchBrand.toLowerCase()) &&
      (searchType === null || type === searchType)
    );
  });

  // pagination
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    const fetchProductsByShopId = async () => {
      try {
        const response = await dispatch(getProductsByShopId(currentShopId));
        if (response.payload) {
          setProducts(response.payload);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchProductsByShopId();
  }, [currentShopId, dispatch]);

  // Compute paginated data
  const paginatedData = filteredData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Map type integers to labels
  const typeLabels = {
    0: "Thức Ăn",
    1: "Dụng Cụ",
    2: "Thuốc",
  };

  const columns = [
    {
      title: "STT",
      //dataIndex: "productId",
      key: "productId",
      render: (_, __, index) => index + 1 + (currentPage - 1) * pageSize,
    },
    {
      title: "Tên Sản Phẩm",
      dataIndex: "productName",
      key: "productName",
      render: (text) => <span style={{ fontWeight: 500 }}>{text}</span>,
    },
    {
      title: "Mô Tả",
      //dataIndex: "description",
      key: "description",
      render: (record) => (
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <Image
            width={50}
            height={50}
            src={record.image}
            alt="Product"
            style={{ objectFit: "cover", borderRadius: 5 }}
            preview={{ mask: <EyeOutlined /> }} // Enables preview on click
          />
          <span>{record.description}</span>
        </div>
      ),
    },
    {
      title: "Giá",
      dataIndex: "price",
      key: "price",
      render: (price) => {
        // Check if price is a valid number, otherwise return a fallback
        return price && !isNaN(price)
          ? price.toLocaleString("vi-VN", {
              style: "currency",
              currency: "VND",
            })
          : "N/A"; // Or any fallback value like 0 or an empty string
      },
      sorter: (a, b) => {
        // Handle cases where price might be undefined or not a number
        const priceA = a.price && !isNaN(a.price) ? a.price : 0;
        const priceB = b.price && !isNaN(b.price) ? b.price : 0;
        return priceA - priceB;
      },
      sortDirections: ["ascend", "descend"], // Enable ascending and descending sort
    },
    {
      title: "Số Lượng",
      dataIndex: "stockQuantity",
      key: "stockQuantity",
      width: 110,
      render: (stockQuantity) => (
        <span
          style={{
            color: stockQuantity === 0 ? "red" : "#52c41a",
            fontWeight: 500,
          }}
        >
          {stockQuantity === 0 ? "HẾT HÀNG" : stockQuantity}
        </span>
      ),
      sorter: (a, b) => {
        // Handle cases where price might be undefined or not a number
        const stockQuantityA =
          a.stockQuantity && !isNaN(a.stockQuantity) ? a.stockQuantity : 0;
        const stockQuantityB =
          b.stockQuantity && !isNaN(b.stockQuantity) ? b.stockQuantity : 0;
        return stockQuantityA - stockQuantityB;
      },
      sortDirections: ["ascend", "descend"], // Enable ascending and descending sort
    },
    {
      title: "Nhãn Hiệu",
      dataIndex: "brand",
      key: "brand",
    },
    {
      title: "Phân Loại",
      dataIndex: ["category", "name"],
      key: "'category'",
    },
    {
      title: "Khối Lượng",
      dataIndex: "weight",
      key: "weight",
      render: (weight, record) => {
        // Check if weight is valid (not undefined, null, or non-numeric)
        if (weight === undefined || weight === null || isNaN(weight)) {
          return <span>-</span>;
        }

        // Determine the unit based on product type
        const unit = record.type === 2 ? "ml" : "g";

        // Format the weight with the unit
        return <span>{`${weight} ${unit}`}</span>;
      },
    },
    {
      title: "Thông Số Ảnh Hưởng",
      dataIndex: "parameterImpacts",
      key: "parameterImpacts",
      render: (value) => {
        try {
          // Ensure value is an object; if not, display a fallback
          if (!value || typeof value !== "object") {
            return <span>-</span>;
          }

          // Translate "increased" and "decreased" to Vietnamese
          const translatedValue = Object.fromEntries(
            Object.entries(value).map(([key, val]) => [
              key,
              val === "Increased" ? "Tăng" : val === "Decreased" ? "Giảm" : val,
            ])
          );

          // Convert the object entries into a formatted string
          const formattedString = Object.entries(translatedValue)
            .map(([key, val]) => `"${key}" : "${val}"`)
            .join(",\n");

          // Render the formatted string in a <pre> tag
          return <pre style={{ margin: 0 }}>{formattedString}</pre>;
        } catch (error) {
          // Log the error and display a fallback
          console.error(
            "Error rendering parameterImpacts:",
            error,
            "Value:",
            value
          );
          return <span>-</span>;
        }
      },
    },
    {
      title: "Loại Sản Phẩm",
      dataIndex: "type",
      key: "type",
      width: 150,
      render: (type) => (
        <span
          style={{
            color: typeLabels[type] ? "#1890ff" : "#000",
            fontWeight: 500,
          }}
        >
          {typeLabels[type] || type}
        </span>
      ),
      sorter: (a, b) => Number(a.type) - Number(b.type), // Sorting function
      sortDirections: ["ascend", "descend"], // Allow ascending and descending
    },
    {
      title: "Chỉnh Sửa",
      key: "edit",
      width: 100,
      render: (record) => {
        return renderUpdateProductManagement(record);
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
    searchProductName,
    searchDescription,
    searchBrand,
    searchType,
  ]);

  // Get List
  // const GetListTable = () => {
  //   setLoading(true);
  //   dispatch(useProductManagementList())
  //     .then(() => {
  //       setLoading(false);
  //     })
  //     .catch((error) => {
  //       console.error("Error fetching data:", error);
  //       setLoading(false);
  //     });
  // };

  return (
    <div className="product-management-table" style={{ padding: "16px" }}>
      <div className="filter-container">
        <Input
          prefix={<span style={{ color: "#bfbfbf" }}>🔍</span>}
          placeholder="Tên Sản Phẩm"
          value={searchProductName}
          onChange={(e) => setSearchProductName(e.target.value)}
          style={{ width: 220, borderRadius: 6, padding: "6px 10px" }}
          allowClear
        />
        <Input
          prefix={<span style={{ color: "#bfbfbf" }}>🔍</span>}
          placeholder="Mô Tả"
          value={searchDescription}
          onChange={(e) => setSearchDescription(e.target.value)}
          style={{ width: 220, borderRadius: 6, padding: "6px 10px" }}
          allowClear
        />
        <Input
          prefix={<span style={{ color: "#bfbfbf" }}>🔍</span>}
          placeholder="Nhãn Hiệu"
          value={searchBrand}
          onChange={(e) => setSearchBrand(e.target.value)}
          style={{ width: 220, borderRadius: 6, padding: "6px 10px" }}
          allowClear
        />
        <Select
          prefix={<span style={{ color: "#bfbfbf" }}>🔍</span>}
          placeholder="Loại"
          value={searchType}
          onChange={(value) => setSearchType(value)}
          allowClear
          style={{ width: 150, height: 36 }}
        >
          <Select.Option value={0}>Thức Ăn</Select.Option>
          <Select.Option value={1}>Dụng Cụ</Select.Option>
          <Select.Option value={2}>Thuốc</Select.Option>
        </Select>
        <Button
          icon={<ReloadOutlined />}
          onClick={() => {
            setSearchProductName("");
            setSearchDescription("");
            setSearchBrand("");
            setSearchType(null);
            setCurrentPage(1); // Reset to the first page
            setPageSize(10); // Reset page size to default
          }}
          style={{ height: 36 }}
          className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white rounded-md flex items-center justify-center"
        >
          Đặt lại bộ lọc
        </Button>
      </div>

      <Spin spinning={loading} tip="Đang Tải...">
        <Table
          dataSource={paginatedData}
          columns={columns}
          pagination={false}
          scroll={{ x: 1700 }}
          //onChange={GetListTable}
        />
      </Spin>
      <div className="pagination-container">
        <Pagination
          total={filteredData.length}
          pageSize={pageSize}
          current={currentPage}
          showSizeChanger
          align="end"
          showTotal={(total, range) =>
            `${range[0]}-${range[1]} / ${total} sản phẩm`
          }
          onChange={(page, size) => {
            setCurrentPage(page);
            setPageSize(size);
          }}
        />
      </div>
    </div>
  );
}

export default ProductManagementTable;
