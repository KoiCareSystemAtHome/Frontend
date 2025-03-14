import { Image, Pagination, Spin, Table } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import useProductManagementList from "../../hooks/useProductManagementList";
import { EyeOutlined } from "@ant-design/icons";
import UpdateProductManagement from "./UpdateProductManagement";
import dayjs from "dayjs";

const renderUpdateProductManagement = (record) => (
  <UpdateProductManagement record={record} />
);

function ProductManagementTable({ dataSource }) {
  console.log("Datasource: ", dataSource);
  //const productList = useSelector(getListProductManagementSelector);
  //console.log("Product list", productList);
  const dispatch = useDispatch();

  // pagination
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Compute paginated data
  const paginatedData = dataSource.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const columns = [
    {
      title: "Product ID",
      dataIndex: "productId",
      key: "productId",
    },
    {
      title: " Product Name",
      dataIndex: "productName",
      key: "productName",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Image",
      dataIndex: "image",
      key: "image",
      render: (imageUrl) => (
        <Image
          width={50}
          height={50}
          src={imageUrl}
          alt="Product"
          style={{ objectFit: "cover", borderRadius: 5 }}
          preview={{ mask: <EyeOutlined /> }} // Enables preview on click
        />
      ),
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
    },
    {
      title: "Stock Quantity",
      dataIndex: "stockQuantity",
      key: "stockQuantity",
    },
    {
      title: "Brand",
      dataIndex: "brand",
      key: "brand",
    },
    {
      title: "Manufacture Date",
      dataIndex: "manufactureDate",
      key: "manufactureDate",
      render: (date) =>
        date
          ? dayjs.utc(date).tz("Asia/Ho_Chi_Minh").format("YYYY-MM-DD")
          : "-",
    },
    {
      title: "Expiry Date",
      dataIndex: "expiryDate",
      key: "expiryDate",
      render: (date) =>
        date
          ? dayjs.utc(date).tz("Asia/Ho_Chi_Minh").format("YYYY-MM-DD")
          : "-",
    },
    {
      title: "Parameter Impactment",
      dataIndex: "parameterImpactment",
      key: "parameterImpactment",
      render: (value) => {
        try {
          const parsedValue = JSON.parse(value);
          return <pre>{JSON.stringify(parsedValue, null, 2)}</pre>;
        } catch (error) {
          return <pre>{JSON.stringify(value, null, 2)}</pre>; // Fallback if parsing fails
        }
      },
    },
    {
      title: "Shop ID",
      dataIndex: "shopId",
      key: "shopId",
    },
    {
      title: "Category ID",
      dataIndex: "categoryId",
      key: "categoryId",
    },
    {
      title: "Edit",
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
  }, [dataSource, currentPage, pageSize]);

  // Get List
  const GetListTable = () => {
    setLoading(true);
    dispatch(useProductManagementList())
      .then(() => {
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  };

  return (
    <div className="w-full">
      <Spin spinning={loading} tip="Loading...">
        <Table
          dataSource={paginatedData}
          columns={columns}
          pagination={false}
          className="[&_.ant-table-thead_.ant-table-cell]:bg-[#fafafa] [&_.ant-table-thead_.ant-table-cell]:font-medium [&_.ant-table-cell]:py-4"
          style={{ marginBottom: "1rem" }}
          scroll={{ x: 2500 }}
          onChange={GetListTable}
        />
      </Spin>
      <Pagination
        total={dataSource.length}
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
