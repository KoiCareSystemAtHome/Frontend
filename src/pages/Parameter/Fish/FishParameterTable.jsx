import {
  Alert,
  Button,
  DatePicker,
  Pagination,
  Select,
  Spin,
  Table,
  Tag,
} from "antd";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  ReloadOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import { Option } from "antd/es/mentions";
import UpdateFishParameter from "./UpdateFishParameter";

const renderUpdateFishParameter = (record) => {
  return <UpdateFishParameter record={record} />;
};

function FishParameterTable({ dataSource = [] }) {
  console.log("Datasource: ", dataSource);
  const { error } = useSelector((state) => state.parameterSlice);

  // Pagination
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Search and Filter states
  const [searchDate, setSearchDate] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");

  // Ensure dataSource is an array before slicing
  const dataArray = Array.isArray(dataSource) ? dataSource : [];

  // Filter data based on search and status
  const filteredData = dataArray.filter((item) => {
    const matchesDate = searchDate
      ? dayjs(item.createdAt).format("DD-MM-YYYY").includes(searchDate)
      : true;
    const matchesStatus =
      statusFilter === "all"
        ? true
        : statusFilter === "active"
        ? item.isActive
        : !item.isActive;
    return matchesDate && matchesStatus;
  });

  const paginatedData = filteredData.slice(
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
      sorter: (a, b) => dayjs(a.createdAt).unix() - dayjs(b.createdAt).unix(),
      render: (value) =>
        value ? dayjs(value).format("DD-MM-YYYY / HH:mm:ss") : "-",
    },
    {
      title: "Cảnh Báo Trọng Lượng Trên",
      dataIndex: "weightWarningUpper",
      key: "weightWarningUpper",
      sorter: (a, b) =>
        (a.weightWarningUpper || 0) - (b.weightWarningUpper || 0),
      render: (value) => value || "-",
    },
    {
      title: "Cảnh Báo Trọng Lượng Dưới",
      dataIndex: "weightWarningLowwer",
      key: "weightWarningLowwer",
      sorter: (a, b) =>
        (a.weightWarningLowwer || 0) - (b.weightWarningLowwer || 0),
      render: (value) => value || "-",
    },
    {
      title: "Cân Nặng Nguy Hiểm Trên",
      dataIndex: "weightDangerUpper",
      key: "weightDangerUpper",
      sorter: (a, b) => (a.weightDangerUpper || 0) - (b.weightDangerUpper || 0),
      render: (value) => value || "-",
    },
    {
      title: "Cân Nặng Nguy Hiểm Dưới",
      dataIndex: "weightDangerLower",
      key: "weightDangerLower",
      sorter: (a, b) => (a.weightDangerLower || 0) - (b.weightDangerLower || 0),
      render: (value) => value || "-",
    },
    {
      title: "Cảnh Báo Kích Thước Trên",
      dataIndex: "sizeWarningUpper",
      key: "sizeWarningUpper",
      sorter: (a, b) => (a.sizeWarningUpper || 0) - (b.sizeWarningUpper || 0),
      render: (value) => value || "-",
    },
    {
      title: "Cảnh Báo Kích Thước Dưới",
      dataIndex: "sizeWarningLowwer",
      key: "sizeWarningLowwer",
      sorter: (a, b) => (a.sizeWarningLowwer || 0) - (b.sizeWarningLowwer || 0),
      render: (value) => value || "-",
    },
    {
      title: "Kích Thước Nguy Hiểm Trên",
      dataIndex: "sizeDangerUpper",
      key: "sizeDangerUpper",
      sorter: (a, b) => (a.sizeDangerUpper || 0) - (b.sizeDangerUpper || 0),
      render: (value) => value || "-",
    },
    {
      title: "Kích Thước Nguy Hiểm Dưới",
      dataIndex: "sizeDangerLower",
      key: "sizeDangerLower",
      sorter: (a, b) => (a.sizeDangerLower || 0) - (b.sizeDangerLower || 0),
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
      sorter: (a, b) => (a.age || 0) - (b.age || 0),
      render: (value) => value || "-",
    },
    {
      title: "Chỉnh Sửa",
      key: "edit",
      width: 100,
      render: (record) => {
        return renderUpdateFishParameter(record);
      },
    },
  ];

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, [dataSource, currentPage, pageSize, searchDate, statusFilter]);

  return (
    <div className="w-full">
      <div className="mb-4 flex gap-4">
        <DatePicker
          prefix={<SearchOutlined />}
          placeholder="Ngày Tạo"
          value={searchDate ? dayjs(searchDate, "DD-MM-YYYY") : null}
          onChange={(date) =>
            setSearchDate(date ? date.format("DD-MM-YYYY") : "")
          } // Use dayjs object directly
          format={"DD-MM-YYYY"}
          style={{ width: 150 }}
        />
        <Select
          prefix={<SearchOutlined />}
          defaultValue="all"
          value={statusFilter}
          style={{ width: 180 }}
          onChange={(value) => setStatusFilter(value)}
        >
          <Option value="all">Tất cả trạng thái</Option>
          <Option value="active">Kích hoạt</Option>
          <Option value="inactive">Vô hiệu</Option>
        </Select>

        <Button
          icon={<ReloadOutlined />}
          onClick={() => {
            setSearchDate(null);
            setStatusFilter("all");
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

      <Spin spinning={loading} tip="Đang Tải...">
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
