import { PlusOutlined } from "@ant-design/icons";
import { Button, Col, DatePicker, Form, Input, Modal, Row, Select } from "antd";
import React, { useState } from "react";

const AddMember = () => {
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
        Add Member
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
              <p className="modalContent">Member Name</p>
              <Form.Item
                name="memberName"
                rules={[
                  {
                    required: true,
                    message: "Please enter member name!",
                  },
                ]}
              >
                <Input placeholder="Member Name"></Input>
              </Form.Item>
            </Col>
            {/* 2nd column */}
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
            {/* 3rd column */}
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
          </Row>
          {/* 2nd Row */}
          <Row style={{ justifyContent: "space-between" }}>
            {/* 1st column */}
            <Col>
              <p className="modalContent">Membership Type</p>
              <Form.Item
                name="membershipType"
                rules={[
                  {
                    required: true,
                    message: "Please select membership type!",
                  },
                ]}
              >
                <Select placeholder="Membership Type"></Select>
              </Form.Item>
            </Col>
            {/* 2nd column */}
            <Col>
              <p className="modalContent">Start Date</p>
              <Form.Item
                name="startDate"
                rules={[
                  {
                    required: true,
                    message: "Please select start date!",
                  },
                ]}
              >
                <DatePicker
                  style={{ width: "270px" }}
                  placeholder="Start Date"
                ></DatePicker>
              </Form.Item>
            </Col>
            {/* 3rd column */}
            <Col>
              <p className="modalContent">End Date</p>
              <Form.Item
                name="endDate"
                rules={[
                  {
                    required: true,
                    message: "Please select end date!",
                  },
                ]}
              >
                <DatePicker
                  style={{ width: "270px" }}
                  placeholder="End Date"
                ></DatePicker>
              </Form.Item>
            </Col>
          </Row>
          {/* 3rd Row */}
          <Row>
            {/* 1st column */}
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
                  width: "150px",
                  height: "40px",
                  padding: "8px",
                  borderRadius: "10px",
                }}
              >
                <PlusOutlined />
                Create Member
              </Button>
            </Form.Item>
          </Row>
        </Form>
      </Modal>
    </div>
  );
};

export default AddMember;
