import { EditOutlined } from "@ant-design/icons";
import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  Modal,
  Popover,
  Row,
  Select,
} from "antd";
import React, { useState } from "react";

const UpdateParameter = () => {
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
        title="Edit Parameter"
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
                <Input placeholder="medium"></Input>
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
                onClick={handleCancel}
                htmlType="submit"
                type="primary"
                style={{
                  width: "150px",
                  height: "40px",
                  padding: "8px",
                  borderRadius: "10px",
                  backgroundColor: "orange",
                }}
              >
                <EditOutlined />
                Edit Parameter
              </Button>
            </Form.Item>
          </Row>
        </Form>
      </Modal>
    </div>
  );
};

export default UpdateParameter;
