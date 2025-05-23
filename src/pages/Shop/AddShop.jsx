import { PlusOutlined } from "@ant-design/icons";
import {
  Button,
  Col,
  Form,
  Input,
  Modal,
  notification,
  Row,
  Select,
} from "antd";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { createShop, getListShop } from "../../redux/slices/shopSlice";

const AddShop = ({ onClose }) => {
  const [isAddOpen, setIsAddOpen] = useState(false);

  const showAddModal = () => {
    setIsAddOpen(true);
  };

  const handleCancel = () => {
    setIsAddOpen(false);
  };

  const dispatch = useDispatch();

  const [form] = Form.useForm();

  const buttonStyle = {
    height: "40px",
    width: "120px",
    borderRadius: "10px",
    margin: "0px 5px",
    padding: "7px 0px 10px 0px",
  };

  // Notification
  const [api, contextHolder] = notification.useNotification();

  const openNotification = (type, message) => {
    api[type]({
      message: message,
      placement: "top",
      duration: 5,
    });
  };

  const onFinish = (values) => {
    const payload = {
      ...values,
      isActivate:
        values.isActivate === "true" || values.isActivate === true
          ? true
          : false, // Ensure boolean type
    };
    console.log(payload);
    // Dispatch the createShop action with the form values
    dispatch(createShop(payload))
      .unwrap()
      .then(() => {
        // Close the Modal
        onClose();
        openNotification("success", "Shop Created Successfully!");
        dispatch(getListShop());
        handleCancel();
        // Reset the form fields after dispatching the action
        form.resetFields();
      })
      .catch((error) => {
        openNotification("warning", error);
      });
  };

  return (
    <div>
      {contextHolder}
      <Button
        size="small"
        className="addBtn"
        type="primary"
        icon={<PlusOutlined />}
        style={buttonStyle}
        onClick={showAddModal}
      >
        Add Shop
      </Button>

      <Modal
        className="custom-modal"
        centered
        title="Create Shop"
        open={isAddOpen}
        onCancel={handleCancel}
        width={870}
        footer={null}
      >
        <Form form={form} onFinish={onFinish}>
          {/* 1st Row */}
          <Row style={{ justifyContent: "space-between" }}>
            {/* 1st column */}
            <Col>
              <p className="modalContent">Shop Name</p>
              <Form.Item
                name="shopName"
                rules={[
                  {
                    required: true,
                    message: "Please enter shop name!",
                  },
                ]}
              >
                <Input placeholder="Shop Name"></Input>
              </Form.Item>
            </Col>
            {/* 2nd column */}
            <Col>
              <p className="modalContent">Shop Rate</p>
              <Form.Item
                name="shopRate"
                rules={[
                  {
                    required: true,
                    message: "Please enter shop rate!",
                  },
                ]}
              >
                <Input placeholder="Shop Rate"></Input>
              </Form.Item>
            </Col>
            {/* 3rd column */}
            <Col>
              <p className="modalContent">Shop Description</p>
              <Form.Item
                name="shopDescription"
                rules={[
                  {
                    required: true,
                    message: "Please enter shop description!",
                  },
                ]}
              >
                <Input placeholder="Shop Description"></Input>
              </Form.Item>
            </Col>
          </Row>
          {/* 2nd Row */}
          <Row style={{ justifyContent: "space-between" }}>
            {/* 1st column */}
            <Col>
              <p className="modalContent">Shop Address</p>
              <Form.Item
                name="shopAddress"
                rules={[
                  {
                    required: true,
                    message: "Please enter shop address!",
                  },
                ]}
              >
                <Input placeholder="Shop Address"></Input>
              </Form.Item>
            </Col>
            {/* 2nd column */}
            <Col>
              <p className="modalContent">License</p>
              <Form.Item
                name="bizLicences"
                rules={[
                  {
                    required: true,
                    message: "Please enter liscense!",
                  },
                ]}
              >
                <Input placeholder="License"></Input>
              </Form.Item>
            </Col>
            {/* 3rd column */}
            <Col>
              <p className="modalContent">Status</p>
              <Form.Item
                name="isActivate"
                rules={[
                  {
                    required: true,
                    message: "Please select status!",
                  },
                ]}
              >
                <Select placeholder="Select status">
                  <Select.Option value="true">Active</Select.Option>
                  <Select.Option value="false">Inactive</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row className="membershipButton">
            <Form.Item>
              <Button
                htmlType="submit"
                type="primary"
                style={{
                  width: "150px",
                  height: "40px",
                  padding: "8px",
                  borderRadius: "10px",
                }}
              >
                <PlusOutlined />
                Create Shop
              </Button>
            </Form.Item>
          </Row>
        </Form>
      </Modal>
    </div>
  );
};

export default AddShop;
