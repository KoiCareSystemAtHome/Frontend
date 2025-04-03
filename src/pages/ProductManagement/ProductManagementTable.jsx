import { Button, Image, Input, Pagination, Select, Spin, Table } from "antd";
import React, { useEffect, useState } from "react";
//import { useDispatch } from "react-redux";
//import useProductManagementList from "../../hooks/useProductManagementList";
import { EyeOutlined, ReloadOutlined } from "@ant-design/icons";
import UpdateProductManagement from "./UpdateProductManagement";
import dayjs from "dayjs";
import UpdateFood from "./UpdateFood";
import UpdateMedicine from "./UpdateMedicine";

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

function ProductManagementTable({ dataSource }) {
  console.log("Datasource: ", dataSource);
  //const productList = useSelector(getListProductManagementSelector);
  //console.log("Product list", productList);
  //const dispatch = useDispatch();

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
      title: "",
      //dataIndex: "productId",
      key: "productId",
      render: (_, __, index) => index + 1 + (currentPage - 1) * pageSize,
    },
    {
      title: "Tên Sản Phẩm",
      dataIndex: "productName",
      key: "productName",
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
    // {
    //   title: "Image",
    //   dataIndex: "image",
    //   key: "image",
    // },
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
    },
    {
      title: "Số Lượng",
      dataIndex: "stockQuantity",
      key: "stockQuantity",
    },
    {
      title: "Nhãn Hiệu",
      dataIndex: "brand",
      key: "brand",
    },
    {
      title: "Ngày Sản Xuất",
      dataIndex: "manufactureDate",
      key: "manufactureDate",
      width: 150,
      render: (date) =>
        date
          ? dayjs.utc(date).tz("Asia/Ho_Chi_Minh").format("DD-MM-YYYY")
          : "-",
    },
    {
      title: "Ngày Hết Hạn",
      dataIndex: "expiryDate",
      key: "expiryDate",
      width: 150,
      render: (date) =>
        date
          ? dayjs.utc(date).tz("Asia/Ho_Chi_Minh").format("DD-MM-YYYY")
          : "-",
    },
    {
      title: "Tham Số Ảnh Hưởng",
      dataIndex: "parameterImpacts",
      key: "parameterImpacts",
      render: (value) => {
        try {
          // Ensure value is an object; if not, display a fallback
          if (!value || typeof value !== "object") {
            return <span>-</span>;
          }

          // Convert the object entries into a formatted string
          const formattedString = Object.entries(value)
            .map(([key, val]) => `"${key}": "${val}"`)
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
    // {
    //   title: "Shop ID",
    //   dataIndex: "shopId",
    //   key: "shopId",
    // },
    // {
    //   title: "Category ID",
    //   dataIndex: "categoryId",
    //   key: "categoryId",
    // },
    {
      title: "Loại Sản Phẩm",
      dataIndex: "type",
      key: "type",
      width: 150,
      render: (type) => typeLabels[type] || type, // Display the label (e.g., "Food") instead of the integer (e.g., 0)
      sorter: (a, b) => Number(a.type) - Number(b.type), // Sorting function
      sortDirections: ["ascend", "descend"], // Allow ascending and descending
    },
    {
      title: "Chỉnh Sửa",
      key: "edit",
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
    <div className="w-full">
      <div
        style={{
          marginBottom: 16,
          display: "flex",
          gap: "12px",
          alignItems: "center",
        }}
      >
        <Input
          placeholder="Tên Sản Phẩm"
          value={searchProductName}
          onChange={(e) => setSearchProductName(e.target.value)}
          style={{ width: 220, borderRadius: 6, padding: "6px 10px" }}
        />
        <Input
          placeholder="Mô Tả"
          value={searchDescription}
          onChange={(e) => setSearchDescription(e.target.value)}
          style={{ width: 220, borderRadius: 6, padding: "6px 10px" }}
        />
        <Input
          placeholder="Nhãn Hiệu"
          value={searchBrand}
          onChange={(e) => setSearchBrand(e.target.value)}
          style={{ width: 220, borderRadius: 6, padding: "6px 10px" }}
        />
        <Select
          placeholder="Loại"
          value={searchType}
          onChange={(value) => setSearchType(value)}
          allowClear
          style={{ width: 150 }}
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
          style={{
            borderRadius: 6,
            display: "flex",
            alignItems: "center",
            gap: "6px",
          }}
        >
          Đặt lại bộ lọc
        </Button>
      </div>

      <Spin spinning={loading} tip="Loading...">
        <Table
          dataSource={paginatedData}
          columns={columns}
          pagination={false}
          className="[&_.ant-table-thead_.ant-table-cell]:bg-[#fafafa] [&_.ant-table-thead_.ant-table-cell]:font-medium [&_.ant-table-cell]:py-4"
          style={{ marginBottom: "1rem" }}
          scroll={{ x: 1700 }}
          //onChange={GetListTable}
        />
      </Spin>
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
    </div>
  );
}

export default ProductManagementTable;

// import { Button, Image, Input, Pagination, Spin, Table } from "antd";
// import React, { useEffect, useState } from "react";
// import { useDispatch } from "react-redux";
// import useProductManagementList from "../../hooks/useProductManagementList";
// import { EyeOutlined, ReloadOutlined, SearchOutlined } from "@ant-design/icons";
// import UpdateProductManagement from "./UpdateProductManagement";
// import dayjs from "dayjs";
// import { searchProductManagement } from "../../redux/slices/productManagementSlice";

// const renderUpdateProductManagement = (record) => (
//   <UpdateProductManagement record={record} />
// );

// function ProductManagementTable({ dataSource }) {
//   console.log("Datasource: ", dataSource);
//   //const productList = useSelector(getListProductManagementSelector);
//   //console.log("Product list", productList);
//   const dispatch = useDispatch();

//   const initialSearchParams = {
//     productName: "",
//     brand: "",
//     parameterImpact: "",
//     CategoryName: "",
//   };

//   // pagination
//   const [loading, setLoading] = useState(false);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [pageSize, setPageSize] = useState(10);
//   const [searchParams, setSearchParams] = useState(initialSearchParams);
//   const [filteredData, setFilteredData] = useState([]);

//   // Fetch data when the page loads
//   // useEffect(() => {
//   //   handleSearch();
//   // }, []);

//   const handleSearch = () => {
//     setLoading(true);
//     dispatch(searchProductManagement(searchParams))
//       .then((res) => {
//         const results = Array.isArray(res.payload) ? res.payload : [];
//         setFilteredData(results);
//         setLoading(false);
//       })
//       .catch(() => setLoading(false));
//   };

//   const handleResetFilters = () => {
//     setSearchParams(initialSearchParams);
//     setCurrentPage(1);
//   };

//   useEffect(() => {
//     handleSearch();
//   }, [searchParams]); // Runs handleSearch whenever searchParams changes

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setSearchParams((prev) => ({ ...prev, [name]: value }));
//   };

//   // Compute paginated data
//   const paginatedData = filteredData.slice(
//     (currentPage - 1) * pageSize,
//     currentPage * pageSize
//   );

//   const columns = [
//     {
//       title: "Product ID",
//       dataIndex: "productId",
//       key: "productId",
//     },
//     {
//       title: " Product Name",
//       dataIndex: "productName",
//       key: "productName",
//     },
//     {
//       title: "Description",
//       dataIndex: "description",
//       key: "description",
//     },
//     {
//       title: "Image",
//       dataIndex: "image",
//       key: "image",
//       render: (imageUrl) => (
//         <Image
//           width={50}
//           height={50}
//           src={imageUrl}
//           alt="Product"
//           style={{ objectFit: "cover", borderRadius: 5 }}
//           preview={{ mask: <EyeOutlined /> }} // Enables preview on click
//         />
//       ),
//     },
//     {
//       title: "Price",
//       dataIndex: "price",
//       key: "price",
//     },
//     {
//       title: "Stock Quantity",
//       dataIndex: "stockQuantity",
//       key: "stockQuantity",
//     },
//     {
//       title: "Brand",
//       dataIndex: "brand",
//       key: "brand",
//     },
//     {
//       title: "Manufacture Date",
//       dataIndex: "manufactureDate",
//       key: "manufactureDate",
//       render: (date) =>
//         date
//           ? dayjs.utc(date).tz("Asia/Ho_Chi_Minh").format("YYYY-MM-DD")
//           : "-",
//     },
//     {
//       title: "Expiry Date",
//       dataIndex: "expiryDate",
//       key: "expiryDate",
//       render: (date) =>
//         date
//           ? dayjs.utc(date).tz("Asia/Ho_Chi_Minh").format("YYYY-MM-DD")
//           : "-",
//     },
//     {
//       title: "Parameter Impactment",
//       dataIndex: "parameterImpactment",
//       key: "parameterImpactment",
//       render: (value) => {
//         try {
//           const parsedValue = JSON.parse(value);
//           return <pre>{JSON.stringify(parsedValue, null, 2)}</pre>;
//         } catch (error) {
//           return <pre>{JSON.stringify(value, null, 2)}</pre>; // Fallback if parsing fails
//         }
//       },
//     },
//     {
//       title: "Shop ID",
//       dataIndex: "shopId",
//       key: "shopId",
//     },
//     {
//       title: "Category ID",
//       dataIndex: ["category", "name"],
//       key: "categoryId",
//     },
//     {
//       title: "Edit",
//       key: "edit",
//       render: (record) => {
//         return renderUpdateProductManagement(record);
//       },
//     },
//   ];

//   useEffect(() => {
//     setLoading(true);
//     setTimeout(() => {
//       setLoading(false);
//     }, 2000);
//   }, [dataSource, currentPage, pageSize]);

//   // Get List
//   const GetListTable = () => {
//     setLoading(true);
//     dispatch(useProductManagementList())
//       .then(() => {
//         setLoading(false);
//       })
//       .catch((error) => {
//         console.error("Error fetching data:", error);
//         setLoading(false);
//       });
//   };

//   return (
//     <div className="w-full">
//       <div style={{ marginBottom: 16, display: "flex", gap: 8 }}>
//         <Input
//           allowClear
//           placeholder="Search Product Name"
//           name="productName"
//           value={searchParams.productName}
//           onChange={handleInputChange}
//         />
//         <Input
//           allowClear
//           placeholder="Search Brand"
//           name="brand"
//           value={searchParams.brand}
//           onChange={handleInputChange}
//         />
//         <Input
//           allowClear
//           placeholder="Search Category"
//           name="CategoryName"
//           value={searchParams.CategoryName}
//           onChange={handleInputChange}
//         />
//         <Button icon={<SearchOutlined />} type="primary" onClick={handleSearch}>
//           Search
//         </Button>
//         <Button icon={<ReloadOutlined />} onClick={handleResetFilters}>
//           Reset Filters
//         </Button>
//       </div>

//       <Spin spinning={loading} tip="Loading...">
//         <Table
//           dataSource={paginatedData}
//           columns={columns}
//           pagination={false}
//           className="[&_.ant-table-thead_.ant-table-cell]:bg-[#fafafa] [&_.ant-table-thead_.ant-table-cell]:font-medium [&_.ant-table-cell]:py-4"
//           style={{ marginBottom: "1rem" }}
//           scroll={{ x: 2500 }}
//           onChange={GetListTable}
//         />
//       </Spin>
//       <Pagination
//         total={filteredData.length}
//         pageSize={pageSize}
//         current={currentPage}
//         showSizeChanger
//         align="end"
//         showTotal={(total, range) =>
//           `${range[0]}-${range[1]} of ${total} items`
//         }
//         onChange={(page, size) => {
//           setCurrentPage(page);
//           setPageSize(size);
//         }}
//       />
//     </div>
//   );
// }

// export default ProductManagementTable;
