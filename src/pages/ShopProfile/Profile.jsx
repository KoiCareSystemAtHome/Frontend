import React, { useEffect, useState } from "react";
import { Form, Avatar } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { getShopByUserId } from "../../redux/slices/shopSlice";
import LocationSelector from "./LocationSelector";
import AddGhn from "./AddGhn";

const Profile = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.authSlice?.user || {}); // Get user from auth
  console.log("User from Redux:", user);
  const userId = user.id; // Get the correct userId
  const shopProfile = useSelector(
    (state) => state.shopSlice?.shopProfile || null
  );
  console.log("Shop Profile:", shopProfile);

  useEffect(() => {
    console.log("User ID:", userId); // Check if userId is correctly retrieved
    if (userId) {
      console.log("Fetching shop profile for userId:", userId);
      dispatch(getShopByUserId(userId));
    }
  }, [dispatch, userId]);

  // State to hold selected location
  const [selectedLocation, setSelectedLocation] = useState({
    province: shopProfile?.province_id || "",
    district: shopProfile?.district_id || "",
    ward: shopProfile?.ward_id || "",
  });

  // Handle location change
  const handleLocationChange = (field, value) => {
    setSelectedLocation((prev) => {
      if (field === "province") {
        return { province: value, district: "", ward: "" }; // ✅ Reset district & ward
      }
      if (field === "district") {
        return { ...prev, district: value, ward: "" }; // ✅ Reset ward
      }
      return { ...prev, [field]: value };
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      {/* Gradient Header */}
      <div className="w-full h-14 bg-gradient-to-r from-blue-200 to-yellow-100 rounded-t-lg mb-6"></div>

      {/* Profile Section */}
      <div className="flex items-center mb-8 px-4">
        <Avatar
          size={64}
          icon={<UserOutlined />}
          className="border-2 border-gray-200"
        />
        <div className="ml-4">
          <h2 className="text-xl font-medium text-gray-800">
            {shopProfile ? shopProfile.shopName : "Loading..."}
          </h2>
          <p className="text-gray-500 text-sm">
            {user ? user.email : "Loading..."}
          </p>
        </div>
      </div>

      {/* Form */}
      <Form layout="vertical" className="px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column */}
          <div>
            <Form.Item
              label={
                <span className="text-gray-700 font-medium">Shop Name</span>
              }
              name="shopName"
            >
              <div className="p-2 bg-gray-100 rounded border-0">
                {shopProfile?.shopName}
              </div>
            </Form.Item>

            <Form.Item
              label={<span className="text-gray-700 font-medium">Address</span>}
              name="address"
            >
              <div className="p-2 bg-gray-100 rounded border-0">
                {`${shopProfile?.shopAddress.wardName}, ${shopProfile?.shopAddress.districtName},${shopProfile?.shopAddress.provinceName}`}
              </div>
            </Form.Item>
          </div>

          {/* Right Column */}
          <div>
            <Form.Item
              label={<span className="text-gray-700 font-medium">Status</span>}
              name="phone"
            >
              <div className="p-2 bg-gray-100 rounded border-0">
                {shopProfile?.isActivate ? "Activated" : "Unactivated"}
              </div>
            </Form.Item>

            <Form.Item
              label={<span className="text-gray-700 font-medium">Email</span>}
              name="email"
            >
              <div className="p-2 bg-gray-100 rounded border-0">
                {user?.email}
              </div>
            </Form.Item>
          </div>
        </div>

        {/* Location Selector */}
        {/* <div className="mt-6">
          <h3 className="text-lg font-medium text-gray-800">Shop Location</h3>
          <LocationSelector
            selectedProvince={selectedLocation.province}
            selectedDistrict={selectedLocation.district}
            selectedWard={selectedLocation.ward}
            onLocationChange={handleLocationChange}
          />
        </div> */}

        {/* Create Ghn */}
        <h2>Create Shop GHN</h2>
        <AddGhn />
      </Form>
    </div>
  );
};

export default Profile;
