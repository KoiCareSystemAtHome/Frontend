import { PlusOutlined } from "@ant-design/icons";
import { Button, Col, DatePicker, Form, Input, Modal, Row, Select } from "antd";
import React, { useState } from "react";

const AddParameter = () => {
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
        Add Parameter
      </Button>

      <Modal
        className="custom-modal"
        centered
        title="Create Parameter"
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
              <p className="modalContent">Parameter Name</p>
              <Form.Item
                name="parameterName"
                rules={[
                  {
                    required: true,
                    message: "Please enter parameter name!",
                  },
                ]}
              >
                <Input placeholder="Parameter Name"></Input>
              </Form.Item>
            </Col>
            {/* 2nd column */}
            <Col>
              <p className="modalContent">Parameter Code</p>
              <Form.Item
                name="parameterCode"
                rules={[
                  {
                    required: true,
                    message: "Please enter parameter code!",
                  },
                ]}
              >
                <Input placeholder="Parameter Code"></Input>
              </Form.Item>
            </Col>
            {/* 3rd column */}
            <Col>
              <p className="modalContent">Medium</p>
              <Form.Item
                name="medium"
                rules={[
                  {
                    required: true,
                    message: "Please enter medium!",
                  },
                ]}
              >
                <Input placeholder="Medium"></Input>
              </Form.Item>
            </Col>
          </Row>
          {/* 2nd Row */}
          <Row style={{ justifyContent: "space-between" }}>
            {/* 1st column */}
            <Col>
              <p className="modalContent">Warning - Danger Range (g/m2)</p>
              <Form.Item
                name="warningDangerRange"
                rules={[
                  {
                    required: true,
                    message: "Please select warning - danger range!",
                  },
                ]}
              >
                <Select placeholder="Warning - Danger Range"></Select>
              </Form.Item>
            </Col>
            {/* 2nd column */}
            <Col>
              <p className="modalContent">Type</p>
              <Form.Item
                name="type"
                rules={[
                  {
                    required: true,
                    message: "Please select type!",
                  },
                ]}
              >
                <Select placeholder="Type"></Select>
              </Form.Item>
            </Col>
            {/* 3rd column */}
            <Col>
              <p className="modalContent">Updated Date</p>
              <Form.Item
                name="updatedDate"
                rules={[
                  {
                    required: true,
                    message: "Please select updated date!",
                  },
                ]}
              >
                <DatePicker
                  style={{ width: "270px" }}
                  placeholder="Updated Date"
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
                Create Parameter
              </Button>
            </Form.Item>
          </Row>
        </Form>
      </Modal>
    </div>
  );
};

export default AddParameter;
