import { Pagination, Spin, Table } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import useParameterList from "../../../hooks/useParameterList";
import { getListParameter } from "../../../redux/slices/parameterSlice";

function FishParameterTable({ dataSource }) {
  console.log("Datasource: ", dataSource);
  // const packageList = useSelector(getListMembershipPackageSelector);
  // console.log("package list", packageList);
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

  //const [selectedType] = useState("pond");

  const columns = [
    {
      title: "",
      //dataIndex: "parameterId",
      key: "parameterId",
      render: (_, __, index) => index + 1 + (currentPage - 1) * pageSize,
    },
    {
      title: "Tên Thông Số",
      dataIndex: "parameterName",
      key: "parameterName",
    },
    {
      title: "Tên Đơn Vị",
      dataIndex: "unitName",
      key: "unitName",
    },
    {
      title: "Cảnh Báo Trên",
      dataIndex: "warningUpper",
      key: "warningUpper",
    },
    {
      title: "Cảnh Báo Dưới",
      dataIndex: "warningLowwer",
      key: "warningLowwer",
    },
    {
      title: "Nguy Hiểm Trên",
      dataIndex: "dangerUpper",
      key: "dangerUpper",
    },
    {
      title: "Nguy Hiểm Dưới",
      dataIndex: "dangerLower",
      key: "dangerLower",
    },
    {
      title: "Hướng Dẫn Đo Lường",
      dataIndex: "measurementInstruction",
      key: "measurementInstruction",
    },
  ];

  // useEffect(() => {
  //   setLoading(true);
  //   dispatch(getListParameter(selectedType))
  //     .then(() => setLoading(false))
  //     .catch(() => setLoading(false));
  // }, [selectedType, dispatch]);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, [dataSource, currentPage, pageSize]);

  // // Get List
  // const GetListTable = () => {
  //   setLoading(true);
  //   dispatch(useParameterList())
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
      <Spin spinning={loading} tip="Loading...">
        <Table
          scroll={{ x: 1500 }}
          dataSource={paginatedData}
          columns={columns}
          pagination={false}
          className="[&_.ant-table-thead_.ant-table-cell]:bg-[#fafafa] [&_.ant-table-thead_.ant-table-cell]:font-medium [&_.ant-table-cell]:py-4"
          style={{ marginBottom: "1rem" }}
          //onChange={GetListTable}
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
        onChange={(page, pageSize) => {
          setCurrentPage(page);
          setPageSize(pageSize);
        }}
      />
    </div>
  );
}

export default FishParameterTable;
