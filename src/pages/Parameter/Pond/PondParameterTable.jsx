import { Button, Input, Pagination, Spin, Table } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { ReloadOutlined, SearchOutlined } from "@ant-design/icons";
import UpdatePondParameter from "./UpdatePondParameter";

const renderUpdatePondParameter = (record) => {
  return <UpdatePondParameter record={record} />;
};

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
    <div className="w-full">
      {/* Search Inputs */}
      <div className="mb-4 flex gap-4">
        <Input
          prefix={<SearchOutlined />}
          placeholder="Tên Thông Số"
          value={searchParameterName}
          onChange={(e) => setSearchParameterName(e.target.value)}
          style={{ width: 150 }}
        />
        <Input
          prefix={<SearchOutlined />}
          placeholder="Tên Đơn Vị"
          value={searchUnitName}
          onChange={(e) => setSearchUnitName(e.target.value)}
          style={{ width: 150 }}
        />

        <Button
          icon={<ReloadOutlined />}
          onClick={() => {
            setSearchParameterName("");
            setSearchUnitName("");
            setCurrentPage(1);
            setPageSize(10);
          }}
          style={{
            borderRadius: 6,
            display: "flex",
            alignItems: "center",
            gap: "6px",
          }}
        >
          Cài lại bộ lọc
        </Button>
      </div>

      <Spin spinning={loading} tip="Loading...">
        <Table
          scroll={{ x: 1500 }}
          dataSource={paginatedData}
          columns={columns}
          pagination={false}
          className="[&_.ant-table-thead_.ant-table-cell]:bg-[#fafafa] [&_.ant-table-thead_.ant-table-cell]:font-medium [&_.ant-table-cell]:py-4"
          style={{ marginBottom: "1rem" }}
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

export default PondParameterTable;
