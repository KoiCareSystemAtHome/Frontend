import { EditOutlined } from "@ant-design/icons";
import { Button, Col, Form, Input, Modal, Popover, Row, Select } from "antd";
import React, { useState } from "react";

const UpdateShop = () => {
  //const { record } = props;
  const [form] = Form.useForm();
  //const dispatch = useDispatch();
  const [isEditOpen, setIsEditOpen] = useState(false);

  const showEditModal = () => {
    setIsEditOpen(true);
  };

  const handleEditCancel = () => {
    form.resetFields();
    setIsEditOpen(false);
  };

  const handleCancel = () => {
    setIsEditOpen(false);
  };

  const handleEditSubmit = () => {};

  return (
    <div>
      <Popover content="Edit" trigger="hover">
        <Button
          type="primary"
          icon={<EditOutlined />}
          onClick={showEditModal}
          className="bg-[#FFC043] hover:bg-[#FFB520] border-none shadow-none flex items-center justify-center"
          style={{
            width: "32px",
            height: "32px",
            padding: 0,
            backgroundColor: "orange",
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
              <p className="modalContent">Owner Name</p>
              <Form.Item
                name="ownerName"
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
              <p className="modalContent">Email Address</p>
              <Form.Item
                name="email"
                rules={[
                  {
                    required: true,
                    message: "Please enter email address!",
                  },
                ]}
              >
                <Input placeholder="Email Address"></Input>
              </Form.Item>
            </Col>
          </Row>
          {/* 2nd Row */}
          <Row style={{ justifyContent: "space-between" }}>
            {/* 1st column */}
            <Col>
              <p className="modalContent">Phone Number</p>
              <Form.Item
                name="phone"
                rules={[
                  {
                    required: true,
                    message: "Please enter phone number!",
                  },
                ]}
              >
                <Input placeholder="Phone Number"></Input>
              </Form.Item>
            </Col>
            {/* 2nd column */}
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
            {/* 3rd column */}
            <Col>
              <p className="modalContent">Status</p>
              <Form.Item
                name="status"
                rules={[
                  {
                    required: true,
                    message: "Please select status!",
                  },
                ]}
              >
                <Select placeholder="Status"></Select>
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
