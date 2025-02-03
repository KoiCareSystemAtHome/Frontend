import React, { useEffect, useState } from "react";
import AddShop from "./AddShop";
import { notification } from "antd";

const ShopButton = () => {
  // Notification
  const [notificationType, setNotificationType] = useState(null);
  const [notificationMessage, setNotificationMessage] = useState(null);

  useEffect(() => {
    if (notificationType && notificationMessage) {
      notification[notificationType]({
        message: notificationMessage,
        placement: "top",
        duration: 5,
      });
      setTimeout(() => {
        notification.destroy();
      }, 5000);
      console.log("notification: ", notification);
    }
  }, [notificationType, notificationMessage]);
  const [isAddOpen, setIsAddOpen] = useState(false);

  const handleOk = () => {
    setIsAddOpen(false);
  };
  return (
    <div>
      <AddShop onClose={handleOk} />
    </div>
  );
};

export default ShopButton;
