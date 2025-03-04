import { Pagination, Spin, Table, Tag } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import useParameterList from "../../../hooks/useParameterList";
import { getListParameter } from "../../../redux/slices/parameterSlice";
import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";

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

  //const [selectedType] = useState("fish");

  const columns = [
    {
      title: "Parameter ID",
      dataIndex: "parameterID",
      key: "parameterID",
    },
    {
      title: "Created Date",
      dataIndex: "createdAt",
      key: "createdAt",
    },
    {
      title: "Weight Warning Upper",
      dataIndex: "weightWarningUpper",
      key: "weightWarningUpper",
    },
    {
      title: "Weight Warning Lower",
      dataIndex: "weightWarningLowwer",
      key: "weightWarningLowwer",
    },
    {
      title: "Weight Danger Upper",
      dataIndex: "weightDangerUpper",
      key: "weightDangerUpper",
    },
    {
      title: "Weight Danger Lower",
      dataIndex: "weightDangerLower",
      key: "weightDangerLower",
    },
    {
      title: "Size Warning Upper",
      dataIndex: "sizeWarningUpper",
      key: "sizeWarningUpper",
    },
    {
      title: "Size Warning Lower",
      dataIndex: "sizeWarningLowwer",
      key: "sizeWarningLowwer",
    },
    {
      title: "Size Danger Upper",
      dataIndex: "sizeDangerUpper",
      key: "sizeDangerUpper",
    },
    {
      title: "Size Danger Lower",
      dataIndex: "sizeDangerLower",
      key: "sizeDangerLower",
    },
    {
      title: "Status",
      dataIndex: "isActive",
      key: "isActive",
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
      title: "Measurement Instruction",
      dataIndex: "measurementInstruction",
      key: "measurementInstruction",
    },
    {
      title: "Age",
      dataIndex: "age",
      key: "age",
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
          scroll={{ x: 3000 }}
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
