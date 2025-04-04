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
      <div>
        <Input
          style={{ width: "200px", marginRight: "10px" }}
          placeholder="Tên Bệnh"
          prefix={<SearchOutlined />}
          className="mb-6"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Button
          icon={<ReloadOutlined />}
          type="default"
          onClick={handleResetFilters}
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
