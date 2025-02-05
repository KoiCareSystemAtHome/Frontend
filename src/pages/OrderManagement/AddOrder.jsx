import { PlusOutlined } from "@ant-design/icons";
import { Button, Col, DatePicker, Form, Input, Modal, Row, Select } from "antd";
import { Option } from "antd/es/mentions";
import React, { useState } from "react";

const AddOrder = () => {
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
    width: "140px",
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
        Add Order
      </Button>

      <Modal
        className="custom-modal"
        centered
        title="Create Member"
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
              <p className="modalContent">Order Date</p>
              <Form.Item
                name="orderDate"
                rules={[
                  {
                    required: true,
                    message: "Please select Order Date!",
                  },
                ]}
              >
                <DatePicker
                  style={{ width: "270px" }}
                  placeholder="Order Date"
                ></DatePicker>
              </Form.Item>
            </Col>
            {/* 2nd column */}
            <Col>
              <p className="modalContent">Member</p>
              <Form.Item
                name="member"
                rules={[
                  {
                    required: true,
                    message: "Please enter member name!",
                  },
                ]}
              >
                <Input placeholder="Member"></Input>
              </Form.Item>
            </Col>
            {/* 3rd column */}
            <Col>
              <p className="modalContent">Total</p>
              <Form.Item
                name="total"
                rules={[
                  {
                    required: true,
                    message: "Please enter total!",
                  },
                ]}
              >
                <Input placeholder="Total"></Input>
              </Form.Item>
            </Col>
          </Row>
          {/* 2nd Row */}
          <Row style={{}}>
            {/* 1st column */}
            <Col>
              <p className="modalContent">Payment Method</p>
              <Form.Item
                name="paymentMethod"
                rules={[
                  {
                    required: true,
                    message: "Please select Payment Method!",
                  },
                ]}
              >
                <Select allowClear placeholder="Payment Method">
                  <Option key="vnpay" value="VNPay">
                    VNPay
                  </Option>
                  <Option key="cod" value="COD">
                    COD
                  </Option>
                </Select>
              </Form.Item>
            </Col>
            {/* 2nd column */}
            <Col style={{ marginLeft: "6px" }}>
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
                <Select allowClear placeholder="Status">
                  <Option key="delivered" value="Delivered">
                    Delivered
                  </Option>
                  <Option key="pending" value="Pending">
                    Pending
                  </Option>
                  <Option key="canceled" value="Canceled">
                    Canceled
                  </Option>
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
                Create Order
              </Button>
            </Form.Item>
          </Row>
        </Form>
      </Modal>
    </div>
  );
};

export default AddOrder;
