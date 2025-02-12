import { PlusOutlined } from "@ant-design/icons";
import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  Modal,
  notification,
  Row,
} from "antd";
import React, { useState } from "react";
import "../../Styles/Modal.css";
import { useDispatch } from "react-redux";
import {
  createPackage,
  getListMembershipPackage,
} from "../../redux/slices/membershipPackageSlice";
//import { useDispatch } from "react-redux";

const AddMembership = ({ onClose }) => {
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
    width: "160px",
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
    console.log(values);
    // Dispatch the createBaoHiem action with the form values
    dispatch(createPackage(values))
      .unwrap()
      .then(() => {
        // Close the Modal
        onClose();
        openNotification("success", "Membership Created Successfully!");
        dispatch(getListMembershipPackage());
        handleCancel();
        // Reset the form fields after dispatching the action
        form.resetFields();
      })
      .catch((error) => {
        openNotification("warning", error);
      });
    // .finally(() => {
    //   // Reset the form fields after dispatching the action
    //   form.resetFields();
    //   // Close the Modal
    //   onClose();
    //   dispatch(getListMembershipPackage());
    //   openNotification("success", "Membership Created Successfully!");
    //   handleCancel();
    // });
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
                <Input placeholder="Package Title"></Input>
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
                <Input placeholder="Package Description"></Input>
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
                <Input placeholder="Package Price"></Input>
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
                <Input placeholder="Package Type"></Input>
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
