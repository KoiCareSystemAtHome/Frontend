import React, { useEffect } from "react";
import { Typography, Button, Spin } from "antd";
import { LeftOutlined } from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getDiseaseDetail } from "../../redux/slices/diseasesSlice"; // Adjust the path accordingly

const { Title, Text, Paragraph } = Typography;

const CommonDiseasesDetail = () => {
  const navigate = useNavigate();
  const { diseaseId } = useParams();
  const dispatch = useDispatch();

  const {
    diseaseDetail: disease,
    loading,
    error,
  } = useSelector((state) => state.diseasesSlice || {});

  //console.log("Redux diseaseDetail in component:", disease);

  useEffect(() => {
    //console.log("Fetching disease details for ID:", diseaseId);
    if (diseaseId) {
      dispatch(getDiseaseDetail(diseaseId)).then((res) => {
        //console.log("Fetched Disease Detail:", res);
      });
    }
  }, [dispatch, diseaseId]);

  return (
    <div>
      {/* Header with back button */}
      <div>
        <div className="align-content-start">
          <Button
            type="text"
            icon={<LeftOutlined />}
            onClick={() => navigate("/admin/diseases")}
            className="flex items-center"
          >
            Back
          </Button>
        </div>
      </div>

      {/* Handle loading and error states */}
      {loading ? (
        <div className="flex justify-center mt-10">
          <Spin size="large" />
        </div>
      ) : error ? (
        <div className="text-red-500 text-center mt-10">
          {error || "Failed to load data"}
        </div>
      ) : (
        <div className="pt-16">
          <div className="max-w-8xl mx-auto p-4 md:p-6">
            <div className="flex flex-col md:flex-row gap-8">
              {/* Image Section */}
              <div className="md:w-1/3">
                <img
                  src={disease?.image || "https://via.placeholder.com/300"}
                  alt={disease?.name || "Disease Image"}
                  className="w-full rounded-lg shadow-md"
                />
              </div>

              {/* Content Section */}
              <div className="md:w-1/3">
                <Title level={3} className="text-gray-800">
                  {disease?.name || "Disease Name"}
                </Title>

                {/* <div className="mb-6">
                  <Text strong className="text-green-600 text-lg">
                    + Nguyên Nhân Gây Bệnh
                  </Text>
                  <Paragraph className="pl-4 mt-2">
                    {disease?.cause || "No cause information available."}
                  </Paragraph>
                </div> */}

                <div className="mb-6">
                  <Text strong className="text-green-600 text-lg">
                    + Disease Description
                  </Text>
                  <Paragraph className="pl-4 mt-2">
                    {disease?.description ||
                      "No symptom information available."}
                  </Paragraph>
                </div>
              </div>
            </div>
          </div>

          {/* Treatment Methods */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {disease?.treatments?.map((treatment, index) => (
              <div key={index} className="m-10">
                <Title level={4} className="text-blue-600">
                  {treatment.method}
                </Title>
                <Paragraph>{treatment.description}</Paragraph>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CommonDiseasesDetail;
