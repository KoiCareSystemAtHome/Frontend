import { EditOutlined } from "@ant-design/icons";
import {
  Button,
  Col,
  Form,
  Input,
  Modal,
  notification,
  Popover,
  Row,
  Select,
} from "antd";
import React, { useState } from "react";
import { getListShop, updateShop } from "../../redux/slices/shopSlice";
import { useDispatch } from "react-redux";

const UpdateShop = (props) => {
  const { record } = props;
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [api, contextHolder] = notification.useNotification();

  const showEditModal = () => {
    form.setFieldsValue({
      shopName: record.shopName,
      shopRate: record.shopRate,
      shopDescription: record.shopDescription,
      shopAddress: record.shopAddress,
      bizLicences: record.bizLicences,
      isActivate: record.isActivate,
    });
    setIsEditOpen(true);
  };

  const handleEditCancel = () => {
    form.resetFields();
    setIsEditOpen(false);
  };

  const handleCancel = () => {
    setIsEditOpen(false);
  };

  const openNotification = (type, message) => {
    api[type]({
      message: message,
      placement: "top",
      duration: 5,
    });
  };

  const handleEditSubmit = () => {
    form.validateFields().then((values) => {
      dispatch(updateShop({ shopId: record.shopId, updatedShop: values }))
        .unwrap()
        .then(() => {
          form.resetFields();
          setIsEditOpen(false);
          openNotification(
            "success",
            `Updated shop with ID: "${record.shopId}" successfully!`
          );
          dispatch(getListShop());
        })
        .catch((error) => {
          console.error("Update error:", error); // Debugging
          openNotification("warning", error.message || "Update failed!");
        });
    });
  };

  return (
    <div>
      {contextHolder}
      <Popover content="Edit" trigger="hover">
        <Button
          type="text"
          icon={<EditOutlined />}
          onClick={showEditModal}
          className="bg-yellow-50 text-yellow-600 hover:bg-yellow-100 border-none shadow-none flex items-center justify-center"
          style={{
            width: "32px",
            height: "32px",
            padding: 0,
          }}
        />
      </Popover>

      <Modal
        className="custom-modal"
        centered
        title="Edit Shop"
        open={isEditOpen}
        onCancel={handleEditCancel}
        width={870}
        footer={null}
      >
        <Form form={form} onFinish={handleEditSubmit}>
          {/* 1st Row */}
          <Row style={{ justifyContent: "space-between" }}>
            {/* 1st column */}
            <Col>
              <p className="modalContent">Shop Name</p>
              <Form.Item
                name="shopName"
                initialValue={record.shopName}
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
                initialValue={record.shopRate}
                rules={[
                  {
                    required: true,
                    message: "Please enter owner name!",
                  },
                ]}
              >
                <Input placeholder="Owner Name"></Input>
              </Form.Item>
            </Col>
            {/* 3rd column */}
            <Col>
              <p className="modalContent">Shop Description</p>
              <Form.Item
                name="shopDescription"
                initialValue={record.shopDescription}
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
                initialValue={record.shopAddress}
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
                initialValue={record.bizLicences}
                rules={[
                  {
                    required: true,
                    message: "Please enter license!",
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
                initialValue={record.isActivate} // Ensure initial value is a boolean
                rules={[
                  {
                    required: true,
                    message: "Please select status!",
                  },
                ]}
              >
                <Select placeholder="Select Status">
                  <Select.Option value={true}>Active</Select.Option>
                  <Select.Option value={false}>Inactive</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row className="membershipButton">
            <Form.Item>
              <Button
                onClick={handleCancel}
                htmlType="submit"
                type="primary"
                style={{
                  width: "120px",
                  height: "40px",
                  padding: "8px",
                  borderRadius: "10px",
                  backgroundColor: "orange",
                }}
              >
                <EditOutlined />
                Edit Shop
              </Button>
            </Form.Item>
          </Row>
        </Form>
      </Modal>
    </div>
  );
};

export default UpdateShop;
