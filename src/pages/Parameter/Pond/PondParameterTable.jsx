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
      title: "Parameter ID",
      dataIndex: "parameterId",
      key: "parameterId",
    },
    {
      title: "Parameter Name",
      dataIndex: "parameterName",
      key: "parameterName",
    },
    {
      title: "Unit Name",
      dataIndex: "unitName",
      key: "unitName",
    },
    {
      title: "Warning Upper",
      dataIndex: "warningUpper",
      key: "warningUpper",
    },
    {
      title: "Warning Lower",
      dataIndex: "warningLowwer",
      key: "warningLowwer",
    },
    {
      title: "Danger Upper",
      dataIndex: "dangerUpper",
      key: "dangerUpper",
    },
    {
      title: "Danger Lower",
      dataIndex: "dangerLower",
      key: "dangerLower",
    },
    {
      title: "Measurement Instruction",
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
          dataSource={!loading ? paginatedData : []} // Show empty data while loading
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
