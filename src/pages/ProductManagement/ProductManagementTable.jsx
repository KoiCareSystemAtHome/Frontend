import { Image, Pagination, Spin, Table } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import useProductManagementList from "../../hooks/useProductManagementList";
import { getListProductManagementSelector } from "../../redux/selector";
import { EyeOutlined } from "@ant-design/icons";

function ProductManagementTable({ dataSource }) {
  console.log("Datasource: ", dataSource);
  const productList = useSelector(getListProductManagementSelector);
  console.log("Product list", productList);
  const dispatch = useDispatch();
  // const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);

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
    },
    {
      title: "Expiry Date",
      dataIndex: "expiryDate",
      key: "expiryDate",
    },
    {
      title: "Parameter Impactment",
      dataIndex: "parameterImpactment",
      key: "parameterImpactment",
    },
    {
      title: "Shop ID",
      dataIndex: "shopId",
      key: "shopId",
    },
    {
      title: "Shop",
      dataIndex: "shop",
      key: "shop",
    },
    {
      title: "Category ID",
      dataIndex: "categoryId",
      key: "categoryId",
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
    },
    {
      title: "Food",
      dataIndex: "foodIsFloat",
      key: "foodIsFloat",
    },
    {
      title: "Age From",
      dataIndex: "ageFrom",
      key: "ageFrom",
    },
    {
      title: "Age To",
      dataIndex: "ageTo",
      key: "ageTo",
    },
    {
      title: "Product Weight",
      dataIndex: "productWeight",
      key: "productWeight",
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
    },
    {
      title: "Blog Product",
      dataIndex: "blogProducts",
      key: "blogProducts",
    },
    {
      title: "FeedBack",
      dataIndex: "feedBacks",
      key: "feedBacks",
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
          dataSource={dataSource}
          columns={columns}
          pagination={false}
          className="[&_.ant-table-thead_.ant-table-cell]:bg-[#fafafa] [&_.ant-table-thead_.ant-table-cell]:font-medium [&_.ant-table-cell]:py-4"
          style={{ marginBottom: "1rem" }}
          scroll={{ x: 4000 }}
          onChange={GetListTable}
        />
      </Spin>
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
  );
}

export default ProductManagementTable;
