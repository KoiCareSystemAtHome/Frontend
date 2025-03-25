import { PlusOutlined } from "@ant-design/icons";
import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Modal,
  notification,
  Row,
} from "antd";
import React, { useCallback, useState } from "react";
import "../../Styles/Modal.css";
import { useDispatch } from "react-redux";
import {
  createPackage,
  getListMembershipPackage,
} from "../../redux/slices/membershipPackageSlice";
//import { useDispatch } from "react-redux";

const AddMembership = ({ onClose }) => {
  const [isAddOpen, setIsAddOpen] = useState(false);

  const showAddModal = useCallback(() => {
    setIsAddOpen(true);
  }, []);

  const handleCancel = useCallback(() => {
    setIsAddOpen(false);
  }, []);

  const dispatch = useDispatch();

  const [form] = Form.useForm();

  const buttonStyle = {
    height: "40px",
    width: "160px",
    borderRadius: "10px",
    margin: "0px 5px",
    padding: "7px 0px 10px 0px",
  };

  // Notification
  const [api, contextHolder] = notification.useNotification();

  const openNotification = useCallback(
    (type, message) => {
      api[type]({
        message: message,
        placement: "top",
        duration: 5,
      });
    },
    [api]
  );

  const onFinish = (values) => {
    console.log(values);
    // Dispatch the createBaoHiem action with the form values
    dispatch(createPackage(values))
      .unwrap()
      .then(() => {
        openNotification("success", "Membership Created Successfully!");
        dispatch(getListMembershipPackage());
        handleCancel();
        form.resetFields();
        onClose();
      })
      .catch((error) => {
        if (error.response) {
          openNotification("warning", `Error: ${error.response.data.message}`);
        } else if (error.request) {
          openNotification("warning", "Network error, please try again later.");
        } else {
          openNotification("warning", `Unexpected error: ${error.message}`);
        }
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
        Create Membership
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
              <p className="modalContent">Package Title</p>
              <Form.Item
                name="packageTitle"
                rules={[
                  {
                    required: true,
                    message: "Please enter package title!",
                  },
                ]}
              >
                <Input allowClear placeholder="Package Title"></Input>
              </Form.Item>
            </Col>
            {/* 2nd column */}
            <Col>
              <p className="modalContent">Package Description</p>
              <Form.Item
                name="packageDescription"
                rules={[
                  {
                    required: true,
                    message: "Please enter package description!",
                  },
                ]}
              >
                <Input allowClear placeholder="Package Description"></Input>
              </Form.Item>
            </Col>
            {/* 3rd column */}
            <Col>
              <p className="modalContent">Package Price</p>
              <Form.Item
                name="packagePrice"
                rules={[
                  {
                    required: true,
                    message: "Please select package price!",
                  },
                ]}
              >
                <InputNumber
                  style={{ width: "270px" }}
                  placeholder="Package Price"
                ></InputNumber>
              </Form.Item>
            </Col>
          </Row>
          {/* 2nd Row */}
          <Row style={{ justifyContent: "space-between" }}>
            {/* 1st column */}
            <Col>
              <p className="modalContent">Package Type</p>
              <Form.Item
                name="type"
                rules={[
                  {
                    required: true,
                    message: "Please select package type!",
                  },
                ]}
              >
                <Input allowClear placeholder="Package Type"></Input>
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
            {/* 1st Column */}
            <Col>
              <p className="modalContent">Period</p>
              <Form.Item
                name="peiod"
                rules={[
                  {
                    required: true,
                    message: "Please enter period!",
                  },
                ]}
              >
                <Input placeholder="Period"></Input>
              </Form.Item>
            </Col>
          </Row>
          <Row className="membershipButton">
            <Form.Item>
              <Button
                style={{
                  width: "100px",
                  height: "40px",
                  padding: "8px",
                  borderRadius: "10px",
                  marginRight: "10px",
                }}
                onClick={handleCancel}
              >
                Cancel
              </Button>
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
