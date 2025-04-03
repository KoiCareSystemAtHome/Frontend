import { Alert, Pagination, Spin, Table, Tag } from "antd";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

function FishParameterTable({ dataSource = [] }) {
  console.log("Datasource: ", dataSource);
  const { loading, error } = useSelector((state) => state.parameterSlice);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Ensure dataSource is an array before slicing
  const dataArray = Array.isArray(dataSource) ? dataSource : [];
  const paginatedData = dataArray.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const columns = [
    {
      title: "",
      key: "parameterID",
      render: (_, __, index) => index + 1 + (currentPage - 1) * pageSize,
    },
    {
      title: "Ngày Tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (value) =>
        value ? dayjs(value).format("DD-MM-YYYY / HH:mm:ss") : "-",
    },
    {
      title: "Cảnh Báo Trọng Lượng Trên",
      dataIndex: "weightWarningUpper",
      key: "weightWarningUpper",
      render: (value) => value || "-",
    },
    {
      title: "Cảnh Báo Trọng Lượng Dưới",
      dataIndex: "weightWarningLowwer",
      key: "weightWarningLowwer",
      render: (value) => value || "-",
    },
    {
      title: "Cân Nặng Nguy Hiểm Trên",
      dataIndex: "weightDangerUpper",
      key: "weightDangerUpper",
      render: (value) => value || "-",
    },
    {
      title: "Cân Nặng Nguy Hiểm Dưới",
      dataIndex: "weightDangerLower",
      key: "weightDangerLower",
      render: (value) => value || "-",
    },
    {
      title: "Cảnh Báo Kích Thước Trên",
      dataIndex: "sizeWarningUpper",
      key: "sizeWarningUpper",
      render: (value) => value || "-",
    },
    {
      title: "Cảnh Báo Kích Thước Dưới",
      dataIndex: "sizeWarningLowwer",
      key: "sizeWarningLowwer",
      render: (value) => value || "-",
    },
    {
      title: "Kích Thước Nguy Hiểm Trên",
      dataIndex: "sizeDangerUpper",
      key: "sizeDangerUpper",
      render: (value) => value || "-",
    },
    {
      title: "Kích Thước Nguy Hiểm Dưới",
      dataIndex: "sizeDangerLower",
      key: "sizeDangerLower",
      render: (value) => value || "-",
    },
    {
      title: "Trạng Thái",
      dataIndex: "isActive",
      key: "isActive",
      render: (isActivate) => {
        const isActive = isActivate === true || isActivate === "true";
        return isActive ? (
          <Tag
            style={{ width: "90px" }}
            icon={<CheckCircleOutlined />}
            color="green"
          >
            Kích Hoạt
          </Tag>
        ) : (
          <Tag icon={<CloseCircleOutlined />} color="red">
            Vô Hiệu
          </Tag>
        );
      },
    },
    {
      title: "Hướng Dẫn Đo Lường",
      dataIndex: "measurementInstruction",
      key: "measurementInstruction",
      render: (value) => value || "-",
    },
    {
      title: "Độ Tuổi",
      dataIndex: "age",
      key: "age",
      render: (value) => value || "-",
    },
  ];

  return (
    <div className="w-full">
      <Spin spinning={loading} tip="Loading...">
        {/* {error && <p className="text-red-500 mb-4">Error: {error}</p>} */}
        {error && (
          <Alert
            message="Error"
            description={error}
            type="error"
            showIcon
            style={{ marginBottom: "16px" }}
          />
        )}
        <Table
          scroll={{ x: 3000 }}
          dataSource={paginatedData}
          columns={columns}
          pagination={false}
          className="[&_.ant-table-thead_.ant-table-cell]:bg-[#fafafa] [&_.ant-table-thead_.ant-table-cell]:font-medium [&_.ant-table-cell]:py-4"
          style={{ marginBottom: "1rem" }}
        />
      </Spin>
      <Pagination
        total={dataArray.length}
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

// import { Pagination, Spin, Table, Tag } from "antd";
// import React, { useEffect, useState } from "react";
// import { useDispatch } from "react-redux";
// import useParameterList from "../../../hooks/useParameterList";
// import { getListParameter } from "../../../redux/slices/parameterSlice";
// import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";

// function FishParameterTable({ dataSource }) {
//   console.log("Datasource: ", dataSource);
//   // const packageList = useSelector(getListMembershipPackageSelector);
//   // console.log("package list", packageList);
//   const dispatch = useDispatch();

//   // pagination
//   const [loading, setLoading] = useState(false);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [pageSize, setPageSize] = useState(10);

//   // Compute paginated data
//   const paginatedData = dataSource.slice(
//     (currentPage - 1) * pageSize,
//     currentPage * pageSize
//   );

//   //const [selectedType] = useState("fish");

//   const columns = [
//     {
//       title: "",
//       // dataIndex: "parameterID",
//       key: "parameterID",
//       render: (_, __, index) => index + 1 + (currentPage - 1) * pageSize,
//     },
//     {
//       title: "Created Date",
//       dataIndex: "createdAt",
//       key: "createdAt",
//     },
//     {
//       title: "Weight Warning Upper",
//       dataIndex: "weightWarningUpper",
//       key: "weightWarningUpper",
//     },
//     {
//       title: "Weight Warning Lower",
//       dataIndex: "weightWarningLowwer",
//       key: "weightWarningLowwer",
//     },
//     {
//       title: "Weight Danger Upper",
//       dataIndex: "weightDangerUpper",
//       key: "weightDangerUpper",
//     },
//     {
//       title: "Weight Danger Lower",
//       dataIndex: "weightDangerLower",
//       key: "weightDangerLower",
//     },
//     {
//       title: "Size Warning Upper",
//       dataIndex: "sizeWarningUpper",
//       key: "sizeWarningUpper",
//     },
//     {
//       title: "Size Warning Lower",
//       dataIndex: "sizeWarningLowwer",
//       key: "sizeWarningLowwer",
//     },
//     {
//       title: "Size Danger Upper",
//       dataIndex: "sizeDangerUpper",
//       key: "sizeDangerUpper",
//     },
//     {
//       title: "Size Danger Lower",
//       dataIndex: "sizeDangerLower",
//       key: "sizeDangerLower",
//     },
//     {
//       title: "Status",
//       dataIndex: "isActive",
//       key: "isActive",
//       render: (isActivate) => {
//         const isActive = isActivate === true || isActivate === "true"; // Ensure boolean
//         return isActive ? (
//           <Tag
//             style={{ width: "75px" }}
//             icon={<CheckCircleOutlined />}
//             color="green"
//           >
//             Active
//           </Tag>
//         ) : (
//           <Tag icon={<CloseCircleOutlined />} color="red">
//             Inactive
//           </Tag>
//         );
//       },
//     },
//     {
//       title: "Measurement Instruction",
//       dataIndex: "measurementInstruction",
//       key: "measurementInstruction",
//     },
//     {
//       title: "Age",
//       dataIndex: "age",
//       key: "age",
//     },
//   ];

//   // useEffect(() => {
//   //   setLoading(true);
//   //   dispatch(getListParameter(selectedType))
//   //     .then(() => setLoading(false))
//   //     .catch(() => setLoading(false));
//   // }, [selectedType, dispatch]);

//   useEffect(() => {
//     setLoading(true);
//     setTimeout(() => {
//       setLoading(false);
//     }, 2000);
//   }, [dataSource, currentPage, pageSize]);

//   // // Get List
//   // const GetListTable = () => {
//   //   setLoading(true);
//   //   dispatch(useParameterList())
//   //     .then(() => {
//   //       setLoading(false);
//   //     })
//   //     .catch((error) => {
//   //       console.error("Error fetching data:", error);
//   //       setLoading(false);
//   //     });
//   // };

//   return (
//     <div className="w-full">
//       <Spin spinning={loading} tip="Loading...">
//         <Table
//           scroll={{ x: 3000 }}
//           dataSource={paginatedData}
//           columns={columns}
//           pagination={false}
//           className="[&_.ant-table-thead_.ant-table-cell]:bg-[#fafafa] [&_.ant-table-thead_.ant-table-cell]:font-medium [&_.ant-table-cell]:py-4"
//           style={{ marginBottom: "1rem" }}
//           //onChange={GetListTable}
//         />
//       </Spin>
//       <Pagination
//         total={dataSource.length}
//         pageSize={pageSize}
//         current={currentPage}
//         showSizeChanger
//         align="end"
//         showTotal={(total, range) =>
//           `${range[0]}-${range[1]} of ${total} items`
//         }
//         onChange={(page, pageSize) => {
//           setCurrentPage(page);
//           setPageSize(pageSize);
//         }}
//       />
//     </div>
//   );
// }

// export default FishParameterTable;
