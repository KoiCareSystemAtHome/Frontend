import { Pagination, Spin, Table } from "antd";
import React, { use, useEffect, useState } from "react";
import useNormFoodList from "../../hooks/useNormFoodList";
import { useDispatch } from "react-redux";

function NormFoodTable({ dataSource }) {
  console.log("Datasource: ", dataSource);
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const paginatedData = dataSource.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const columns = [
    {
      title: "",
      dataIndex: "normFoodAmountId",
      key: "normFoodAmountId",
      render: (_, __, index) => index + 1 + (currentPage - 1) * pageSize,
    },
    {
      title: "Lượng Thức Ăn Tiêu Chuẩn",
      dataIndex: "standardAmount",
      key: "standardAmount",
    },
    {
      title: "Tần Suất Cho Ăn",
      dataIndex: "feedingFrequency",
      key: "feedingFrequency",
    },
    {
      title: "Độ Tuổi Từ",
      dataIndex: "ageFrom",
      key: "ageFrom",
    },
    {
      title: "Độ Tuổi Đến",
      dataIndex: "ageTo",
      key: "ageTo",
    },
    {
      title: "Tin Nhắn Cảnh Báo",
      dataIndex: "warningMessage",
      key: "warningMessage",
    },
    {
      title: "Tăng Trưởng Mong Muốn",
      dataIndex: "desiregrowth",
      key: "desiregrowth",
    },
    {
      title: "Nhiệt Độ",
      dataIndex: "temperature",
      key: "temperature",
    },
  ];

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, [dataSource, currentPage, pageSize]);

  const GetListTable = () => {
    setLoading(true);
    dispatch(useNormFoodList())
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
      <Spin spinning={loading} tip="Loading...">
        <Table
          scroll={{ x: 1700 }}
          dataSource={paginatedData}
          columns={columns}
          pagination={false}
          className="[&_.ant-table-thead_.ant-table-cell]:bg-[#fafafa] [&_.ant-table-thead_.ant-table-cell]:font-medium [&_.ant-table-cell]:py-4"
          style={{ marginBottom: "1rem" }}
          onChange={GetListTable}
        />
      </Spin>
      <Pagination
        total={dataSource.length || 0}
        pageSize={pageSize || 10}
        current={currentPage || 1}
        showSizeChanger
        align="end"
        showTotal={(total, range) =>
          `${range[0]}-${range[1]} of ${total} items`
        }
        onChange={(page, pageSize) => {
          setCurrentPage(page);
          setPageSize(pageSize);
        }}
      />
    </div>
  );
}

export default NormFoodTable;
