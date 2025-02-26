import { useDispatch } from "react-redux";
import { updateShopStatus } from "../../redux/slices/shopSlice";
import { Tag, notification } from "antd";
import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";

const StatusTag = ({ isActivate, record }) => {
  const dispatch = useDispatch();
  const isActive = isActivate === true || isActivate === "true";

  const toggleStatus = () => {
    const newStatus = !isActive;

    dispatch(updateShopStatus({ shopId: record.shopId, isActivate: newStatus }))
      .then(() => {
        notification.success({
          message: "Status Updated",
          description: `Shop status changed to ${
            newStatus ? "Active" : "Inactive"
          }.`,
          placement: "topRight",
        });
      })
      .catch((error) => {
        notification.error({
          message: "Update Failed",
          description: "Failed to update shop status.",
          placement: "topRight",
        });
        console.error("Error updating shop status:", error);
      });
  };

  return (
    <Tag
      style={{ width: "75px", cursor: "pointer" }}
      icon={isActive ? <CheckCircleOutlined /> : <CloseCircleOutlined />}
      color={isActive ? "green" : "red"}
      onClick={toggleStatus}
    >
      {isActive ? "Active" : "Inactive"}
    </Tag>
  );
};

export default StatusTag;
