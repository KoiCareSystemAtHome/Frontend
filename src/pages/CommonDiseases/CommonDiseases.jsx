import React, { useEffect, useState } from "react";
import { Card, Input, Button, Spin, Modal, Form } from "antd";
import {
  SearchOutlined,
  PlusOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import {
  getListDisease,
  createDisease,
} from "../../redux/slices/diseasesSlice";
import { getListDiseaseSelector } from "../../redux/selector";
import AddCommonDiseases from "./AddCommonDiseases";

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

const CommonDiseases = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const diseases = useSelector(getListDiseaseSelector);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dispatch(getListDisease()).then(() => {
      setTimeout(() => setLoading(false), 2000);
    });
  }, [dispatch]);

  const handleViewDetails = (diseaseId) => {
    console.log("Navigating to details page with ID:", diseaseId);
    navigate(`/admin/diseases-detail/${diseaseId}`);
  };

  // Log diseases for debugging
  console.log("Diseases from selector:", diseases);

  const filteredDiseases = (diseases || []).filter(
    (disease) =>
      disease &&
      disease.name &&
      disease.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCloseModal = () => {
    // This function will be passed to AddCommonDiseases to handle closing the modal
    dispatch(getListDisease()); // Refresh the list after creating a disease
  };

  const handleResetFilters = () => {
    setSearchTerm("");
  };

  return (
    <div className="mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">Bệnh Thường Gặp</h1>
        {/* Create Button */}
        <AddCommonDiseases onClose={handleCloseModal} />
      </div>

      {/* Search */}
      <div className="filter-container">
        <Input
          style={{ width: "400px", height: 36 }}
          placeholder="Tên Bệnh"
          prefix={<SearchOutlined />}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Button
          icon={<ReloadOutlined />}
          type="default"
          style={{ height: 36 }}
          onClick={handleResetFilters}
          className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white rounded-md flex items-center justify-center"
          //disabled={!searchTitle && !searchDate && !searchStatus} // Disable when no filters applied
        >
          Cài lại bộ lọc
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center">
          <Spin size="large" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredDiseases.length === 0 ? (
            <p>No diseases found.</p>
          ) : (
            filteredDiseases.map((disease, index) =>
              disease && disease.name ? (
                <div
                  key={index}
                  onClick={() => handleViewDetails(disease.diseaseId)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleViewDetails(disease.diseaseId);
                  }}
                  role="button"
                  tabIndex={0}
                  className="cursor-pointer hover:shadow-lg transition-shadow"
                >
                  <Card
                    key={index}
                    cover={
                      <img
                        alt={disease.name}
                        src={disease.image}
                        className="h-96 object-cover"
                      />
                    }
                  >
                    <div className="text-center">
                      <h3 className="text-gray-800 mb-4">{disease.name}</h3>
                      {/* <Button
                      type="primary"
                      block
                      onClick={() => handleViewDetails(disease.diseaseId)}
                    >
                      Xem chi tiết
                    </Button> */}
                    </div>
                  </Card>
                </div>
              ) : null
            )
          )}
        </div>
      )}
    </div>
  );
};

export default CommonDiseases;
