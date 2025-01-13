import { EditOutlined } from "@ant-design/icons";
import { Button, Col, Form, Input, Modal, Popover, Row, Select } from "antd";
import React, { useState } from "react";
import "../../Styles/Modal.css";
//import { useDispatch } from "react-redux";

const UpdateMembership = () => {
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
        title="Edit Membership"
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
              <p className="modalContent">Package Name</p>
              <Form.Item
                name="packageName"
                rules={[
                  {
                    required: true,
                    message: "Please enter package name!",
                  },
                ]}
              >
                <Input placeholder="Package Name"></Input>
              </Form.Item>
            </Col>
            {/* 2nd column */}
            <Col>
              <p className="modalContent">Description</p>
              <Form.Item
                name="description"
                rules={[
                  {
                    required: true,
                    message: "Please enter description!",
                  },
                ]}
              >
                <Input placeholder="Description"></Input>
              </Form.Item>
            </Col>
            {/* 3rd column */}
            <Col>
              <p className="modalContent">Period</p>
              <Form.Item
                name="period"
                rules={[
                  {
                    required: true,
                    message: "Please select period!",
                  },
                ]}
              >
                <Select placeholder="Period"></Select>
              </Form.Item>
            </Col>
          </Row>

          {/* 2nd Row */}
          <Row style={{ justifyContent: "space-between" }}>
            {/* 1st column */}
            <Col>
              <p className="modalContent">Package Type</p>
              <Form.Item
                name="packageType"
                rules={[
                  {
                    required: true,
                    message: "Please select package type!",
                  },
                ]}
              >
                <Select placeholder="Package Type"></Select>
              </Form.Item>
            </Col>
            {/* 2nd column */}
            <Col>
              <p className="modalContent">Price</p>
              <Form.Item
                name="price"
                rules={[
                  {
                    required: true,
                    message: "Please enter price!",
                  },
                ]}
              >
                <Input placeholder="Price"></Input>
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
                  width: "160px",
                  height: "40px",
                  padding: "8px",
                  borderRadius: "10px",
                  backgroundColor: "orange",
                }}
              >
                <EditOutlined />
                Edit Membership
              </Button>
            </Form.Item>
          </Row>
        </Form>
      </Modal>
    </div>
  );
};

export default UpdateMembership;
