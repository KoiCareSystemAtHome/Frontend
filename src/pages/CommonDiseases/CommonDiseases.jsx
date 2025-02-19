import React, { useEffect, useState } from "react";
import { Card, Input, Button, Spin } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { getListDisease } from "../../redux/slices/diseasesSlice";
import { getListDiseaseSelector } from "../../redux/selector";

const CommonDiseases = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Fetch disease list from Redux store
  const diseases = useSelector(getListDiseaseSelector);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dispatch(getListDisease()).then(() => {
      setTimeout(() => setLoading(false), 2000); // Ensure loading lasts at least 5 seconds
    });
  }, [dispatch]);

  const handleViewDetails = (diseaseId) => {
    console.log("Navigating to details page with ID:", diseaseId);
    navigate(`/admin/diseases-detail/${diseaseId}`);
  };

  // Filter diseases by search term
  const filteredDiseases = diseases.filter((disease) =>
    disease.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-6">Common Diseases</h1>

      {/* Search Bar */}
      <Input
        size="large"
        placeholder="Search by Disease Name"
        prefix={<SearchOutlined />}
        className="mb-8"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {loading ? (
        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-transparent">
          <Spin size="large" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredDiseases.map((disease, index) => (
            <Card
              key={index}
              cover={
                <img
                  alt={disease.name}
                  src={disease.image}
                  className="h-96 object-cover"
                />
              }
              className="hover:shadow-md transition-shadow"
            >
              <div className="text-center">
                <h3 className="text-gray-800 mb-4">{disease.name}</h3>
                <Button
                  type="primary"
                  block
                  onClick={() => handleViewDetails(disease.diseaseId)}
                >
                  View Details
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default CommonDiseases;
