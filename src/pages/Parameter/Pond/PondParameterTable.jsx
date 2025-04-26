import { Button, Input, Pagination, Spin, Table } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { ReloadOutlined } from "@ant-design/icons";
import UpdatePondParameter from "./UpdatePondParameter";

const renderUpdatePondParameter = (record) => {
  return <UpdatePondParameter record={record} />;
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

function PondParameterTable({ dataSource }) {
  console.log("Datasource: ", dataSource);
  // const packageList = useSelector(getListMembershipPackageSelector);
  // console.log("package list", packageList);
  //const dispatch = useDispatch();

  // pagination
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // State for search
  const [searchParameterName, setSearchParameterName] = useState("");
  const [searchUnitName, setSearchUnitName] = useState("");

  // Filter data based on search terms with safeguards
  const filteredData = dataSource.filter((item) => {
    const paramName = item.parameterName || ""; // Fallback to empty string if undefined
    const unitName = item.unitName || ""; // Fallback to empty string if undefined
    return (
      paramName.toLowerCase().includes(searchParameterName.toLowerCase()) &&
      unitName.toLowerCase().includes(searchUnitName.toLowerCase())
    );
  });

  // Compute paginated data
  const paginatedData = filteredData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const columns = [
    {
      title: "STT",
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
      sorter: (a, b) => (a.warningUpper || 0) - (b.warningUpper || 0),
    },
    {
      title: "Cảnh Báo Dưới",
      dataIndex: "warningLowwer",
      key: "warningLowwer",
      sorter: (a, b) => (a.warningLowwer || 0) - (b.warningLowwer || 0),
    },
    {
      title: "Nguy Hiểm Trên",
      dataIndex: "dangerUpper",
      key: "dangerUpper",
      sorter: (a, b) => (a.dangerUpper || 0) - (b.dangerUpper || 0),
    },
    {
      title: "Nguy Hiểm Dưới",
      dataIndex: "dangerLower",
      key: "dangerLower",
      sorter: (a, b) => (a.dangerLower || 0) - (b.dangerLower || 0),
    },
    {
      title: "Hướng Dẫn Đo Lường",
      dataIndex: "measurementInstruction",
      key: "measurementInstruction",
    },
    {
      title: "Chỉnh Sửa",
      key: "edit",
      width: 100,
      render: (record) => {
        return renderUpdatePondParameter(record);
      },
    },
  ];

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, [dataSource, currentPage, pageSize, searchParameterName, searchUnitName]);

  return (
    <div className="product-management-table" style={{ padding: "16px" }}>
      {/* Search Inputs */}
      <div className="filter-container">
        <Input
          prefix={<span style={{ color: "#bfbfbf" }}>🔍</span>}
          placeholder="Tên Thông Số"
          value={searchParameterName}
          onChange={(e) => setSearchParameterName(e.target.value)}
          style={{ width: 150, height: 36 }}
        />
        <Input
          prefix={<span style={{ color: "#bfbfbf" }}>🔍</span>}
          placeholder="Tên Đơn Vị"
          value={searchUnitName}
          onChange={(e) => setSearchUnitName(e.target.value)}
          style={{ width: 150, height: 36 }}
        />

        <Button
          icon={<ReloadOutlined />}
          onClick={() => {
            setSearchParameterName("");
            setSearchUnitName("");
            setCurrentPage(1);
            setPageSize(10);
          }}
          style={{ height: 36 }}
          className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white rounded-md flex items-center justify-center"
        >
          Cài lại bộ lọc
        </Button>
      </div>

      <Spin spinning={loading} tip="Đang Tải...">
        <Table
          scroll={{ x: 1500 }}
          dataSource={paginatedData}
          columns={columns}
          pagination={false}
          className="[&_.ant-table-thead_.ant-table-cell]:bg-[#fafafa] [&_.ant-table-thead_.ant-table-cell]:font-medium [&_.ant-table-cell]:py-4"
          style={{ marginBottom: "1rem" }}
        />
      </Spin>
      <div className="pagination-container">
        <Pagination
          total={dataSource.length}
          pageSize={pageSize}
          current={currentPage}
          showSizeChanger
          align="end"
          showTotal={(total, range) =>
            `${range[0]}-${range[1]} / ${total} thông số hồ`
          }
          onChange={(page, pageSize) => {
            setCurrentPage(page);
            setPageSize(pageSize);
          }}
        />
      </div>
    </div>
  );
}

export default PondParameterTable;
