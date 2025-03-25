import React, { useEffect, useState } from "react";
import { Card, Input, Button, Spin, Modal, Form } from "antd";
import { SearchOutlined, PlusOutlined } from "@ant-design/icons";
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
        <h1 className="text-2xl font-semibold">Common Diseases</h1>
        {/* Create Button */}
        <AddCommonDiseases onClose={handleCloseModal} />
      </div>

      {/* Search */}
      <div>
        <Input
          style={{ width: "200px", marginRight: "10px" }}
          placeholder="Search by Disease Name"
          prefix={<SearchOutlined />}
          className="mb-6"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Button
          type="default"
          onClick={handleResetFilters}
          //disabled={!searchTitle && !searchDate && !searchStatus} // Disable when no filters applied
        >
          Reset Filters
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
                    <Button
                      type="primary"
                      block
                      onClick={() => handleViewDetails(disease.diseaseId)}
                    >
                      View Details
                    </Button>
                  </div>
                </Card>
              ) : null
            )
          )}
        </div>
      )}
    </div>
  );
};

export default CommonDiseases;

//const handleAddDisease = () => setIsModalVisible(true);

// const handleCreateDisease = (values) => {
//   dispatch(createDisease(values)).then(() => {
//     setIsModalVisible(false);
//     form.resetFields();
//     dispatch(getListDisease()); // Refresh list
//   });
// };

{
  /* Add Disease Modal */
}
{
  /* <Modal
        title="Add New Disease"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleCreateDisease}>
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: "Please enter a name" }]}
          >
            <Input placeholder="Name" />
          </Form.Item>
          <Form.Item label="Description" name="description">
            <Input.TextArea rows={4} placeholder="Description" />
          </Form.Item>
          <Form.Item label="Image URL" name="image">
            <Input placeholder="Image" />
          </Form.Item>
          <Form.Item label="Food Percentage" name="foodModifyPercent">
            <Input placeholder="Food Percentage" />
          </Form.Item>
          <Form.Item label="Salt Percentage" name="saltModifyPercent">
            <Input placeholder="Salt Percentage" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Create Disease
            </Button>
          </Form.Item>
        </Form>
      </Modal> */
}

// import React, { useEffect, useState } from "react";
// import { Card, Input, Button, Spin } from "antd";
// import { SearchOutlined } from "@ant-design/icons";
// import { useNavigate } from "react-router";
// import { useDispatch, useSelector } from "react-redux";
// import { getListDisease } from "../../redux/slices/diseasesSlice";
// import { getListDiseaseSelector } from "../../redux/selector";
// import AddCommonDiseases from "./AddCommonDiseases";

// const CommonDiseases = () => {
//   const [searchTerm, setSearchTerm] = useState("");
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   // Fetch disease list from Redux store
//   const diseases = useSelector(getListDiseaseSelector);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     dispatch(getListDisease()).then(() => {
//       setTimeout(() => setLoading(false), 2000); // Ensure loading lasts at least 5 seconds
//     });
//   }, [dispatch]);

//   const handleViewDetails = (diseaseId) => {
//     console.log("Navigating to details page with ID:", diseaseId);
//     navigate(`/admin/diseases-detail/${diseaseId}`);
//   };

//   // Filter diseases by search term
//   // const filteredDiseases = diseases.filter((disease) =>
//   //   disease.name.toLowerCase().includes(searchTerm.toLowerCase())
//   // );
//   const filteredDiseases = (diseases || []).filter((disease) =>
//     disease.name?.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   return (
//     <div className="mx-auto p-4">
//       <div className="flex justify-between items-center mb-4">
//         <h1 className="text-2xl font-semibold">Common Diseases</h1>
//         <AddCommonDiseases />
//       </div>

//       {/* Search Bar */}
//       <Input
//         size="large"
//         placeholder="Search by Disease Name"
//         prefix={<SearchOutlined />}
//         className="mb-8"
//         value={searchTerm}
//         onChange={(e) => setSearchTerm(e.target.value)}
//       />

//       {loading ? (
//         <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-transparent">
//           <Spin style={{ marginLeft: "200px" }} size="large" />
//         </div>
//       ) : (
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
//           {filteredDiseases.length === 0 ? (
//             <p>No diseases found.</p>
//           ) : (
//             filteredDiseases.map((disease, index) =>
//               disease && disease.name ? ( // Ensure valid object
//                 <Card
//                   key={index}
//                   cover={
//                     <img
//                       alt={disease.name}
//                       src={disease.image}
//                       className="h-96 object-cover"
//                     />
//                   }
//                 >
//                   <div className="text-center">
//                     <h3 className="text-gray-800 mb-4">{disease.name}</h3>
//                     <Button
//                       type="primary"
//                       block
//                       onClick={() => handleViewDetails(disease.diseaseId)}
//                     >
//                       View Details
//                     </Button>
//                   </div>
//                 </Card>
//               ) : null
//             )
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// export default CommonDiseases;
