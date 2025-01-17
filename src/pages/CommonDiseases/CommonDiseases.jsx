import React, { useState } from "react";
import { Card, Input, Button } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router";

const CommonDiseases = () => {
  const [searchTerm, setSearchTerm] = useState("");

  // Inside your DiseaseGrid component:
  const navigate = useNavigate();

  const handleViewDetails = (e) => {
    e.preventDefault(); // Prevent any default behavior
    navigate("Detail");
  };

  // Mock data for the diseases
  const diseases = Array(8).fill({
    name: "Bệnh Cá Mỏ Neo",
    image:
      "https://koiservice.vn/wp-content/uploads/2021/04/cach-tri-trung-mo-neo-cho-ca-koi-tan-goc-va-hieu-qua-nhat-1.jpg",
  });

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

      {/* Disease Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {diseases.map((disease, index) => (
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
              <Button type="primary" block onClick={handleViewDetails}>
                View Details
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CommonDiseases;
