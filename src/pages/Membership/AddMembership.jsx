import { PlusOutlined } from "@ant-design/icons";
import { Button, Col, Form, Input, Modal, Row, Select } from "antd";
import React, { useState } from "react";
import "../../Styles/Modal.css";
//import { useDispatch } from "react-redux";

const AddMembership = () => {
  const [isAddOpen, setIsAddOpen] = useState(false);

  const showAddModal = () => {
    setIsAddOpen(true);
  };

  const handleCancel = () => {
    setIsAddOpen(false);
  };

  //   const dispatch = useDispatch();

  const [form] = Form.useForm();

  const buttonStyle = {
    height: "40px",
    width: "150px",
    borderRadius: "10px",
    margin: "0px 5px",
    padding: "7px 0px 10px 0px",
  };

  const onFinish = (values) => {};

  return (
    <div>
      <Button
        size="small"
        className="addBtn"
        type="primary"
        icon={<PlusOutlined />}
        style={buttonStyle}
        onClick={showAddModal}
      >
        Add Membership
      </Button>

      <Modal
        className="custom-modal"
        centered
        title="Create Membership"
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
                htmlType="submit"
                type="primary"
                style={{
                  width: "180px",
                  height: "40px",
                  padding: "8px",
                  borderRadius: "10px",
                }}
              >
                <PlusOutlined />
                Create Membership
              </Button>
            </Form.Item>
          </Row>
        </Form>
      </Modal>
    </div>
  );
};

export default AddMembership;
