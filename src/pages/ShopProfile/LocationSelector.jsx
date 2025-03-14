import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Select, Spin, Alert } from "antd";
import {
  fetchProvinces,
  fetchDistricts,
  fetchWards,
} from "../../redux/slices/ghnSlice";

const { Option } = Select;

const LocationSelector = ({
  selectedProvince,
  selectedDistrict,
  selectedWard,
  onLocationChange,
}) => {
  const dispatch = useDispatch();
  const { provinces, districts, wards, loading, error } = useSelector(
    (state) => state.ghnSlice
  );

  useEffect(() => {
    dispatch(fetchProvinces());
  }, [dispatch]);

  useEffect(() => {
    if (selectedProvince) {
      dispatch(fetchDistricts(selectedProvince));
    }
  }, [dispatch, selectedProvince]);

  useEffect(() => {
    if (selectedDistrict) {
      dispatch(fetchWards(selectedDistrict));
    }
  }, [dispatch, selectedDistrict]);

  if (loading) return <Spin size="large" />;
  if (error)
    return <Alert message="Error" description={error} type="error" showIcon />;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Province */}
      <Select
        allowClear
        className="w-full"
        placeholder="Select Province"
        value={selectedProvince || undefined}
        onChange={(value) => onLocationChange("province", value)}
        showSearch
        filterOption={(input, option) =>
          option.children.toLowerCase().includes(input.toLowerCase())
        }
      >
        {provinces.map((province) => (
          <Option key={province.ProvinceID} value={province.ProvinceID}>
            {province.ProvinceName}
          </Option>
        ))}
      </Select>

      {/* District */}
      <Select
        allowClear
        className="w-full"
        placeholder="Select District"
        value={selectedDistrict || undefined}
        onChange={(value) => onLocationChange("district", value)}
        disabled={!selectedProvince}
        showSearch
        filterOption={(input, option) =>
          option.children.toLowerCase().includes(input.toLowerCase())
        }
      >
        {districts.map((district) => (
          <Option key={district.DistrictID} value={district.DistrictID}>
            {district.DistrictName}
          </Option>
        ))}
      </Select>

      {/* Ward */}
      <Select
        allowClear
        className="w-full"
        placeholder="Select Ward"
        value={selectedWard || undefined}
        onChange={(value) => onLocationChange("ward", value)}
        disabled={!selectedDistrict}
        showSearch
        filterOption={(input, option) =>
          option.children.toLowerCase().includes(input.toLowerCase())
        }
      >
        {wards.map((ward) => (
          <Option key={ward.WardCode} value={ward.WardCode}>
            {ward.WardName}
          </Option>
        ))}
      </Select>
    </div>
  );
};

export default LocationSelector;
