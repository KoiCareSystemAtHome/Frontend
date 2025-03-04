import { EditOutlined } from "@ant-design/icons";
import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  Modal,
  notification,
  Popover,
  Row,
  Select,
} from "antd";
import React, { useState } from "react";
import "../../Styles/Modal.css";
import { useDispatch } from "react-redux";
import {
  getListMembershipPackage,
  updatePackage,
} from "../../redux/slices/membershipPackageSlice";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

const UpdateMembership = (props) => {
  const { record } = props;
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [api, contextHolder] = notification.useNotification();

  const showEditModal = () => {
    form.setFieldsValue({
      packageTitle: record.packageTitle,
      packageDescription: record.packageDescription,
      packagePrice: record.packagePrice,
      type: record.type,
      startDate: record.startDate
        ? dayjs.utc(record.startDate).tz("Asia/Ho_Chi_Minh").startOf("day")
        : null,
      endDate: record.endDate
        ? dayjs.utc(record.endDate).tz("Asia/Ho_Chi_Minh").startOf("day")
        : null,
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
  console.log("Updating package with ID:", record.packageId);

  const handleEditSubmit = () => {
    form.validateFields().then((values) => {
      console.log("Original startDate:", record.startDate);
      console.log("Parsed as UTC:", dayjs.utc(record.startDate).format());
      console.log(
        "Converted to Vietnam Time:",
        dayjs.utc(record.startDate).tz("Asia/Ho_Chi_Minh").format()
      );
      console.log(
        "Final UTC before saving:",
        dayjs(record.startDate).tz("Asia/Ho_Chi_Minh").utc().format()
      );

      const formattedValues = {
        ...values,
        startDate: values.startDate
          ? dayjs(values.startDate).tz("Asia/Ho_Chi_Minh", true).utc().format()
          : null,
        endDate: values.endDate
          ? dayjs(values.endDate).tz("Asia/Ho_Chi_Minh", true).utc().format()
          : null,
      };

      console.log("Formatted Values:", formattedValues); // Debugging

      dispatch(
        updatePackage({
          updatedMembership: {
            ...formattedValues,
            packageId: record.packageId,
          },
        })
      )
        .unwrap()
        .then(() => {
          form.resetFields();
          setIsEditOpen(false);
          openNotification(
            "success",
            `Updated package with ID: "${record.packageId}" successfully!`
          );
          dispatch(getListMembershipPackage());
        })
        .catch((error) => {
          console.error("Update error:", error);
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
              <p className="modalContent">Package Title</p>
              <Form.Item
                name="packageTitle"
                initialValue={record.packageTitle}
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
              <p className="modalContent">Description</p>
              <Form.Item
                name="packageDescription"
                initialValue={record.packageDescription}
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
              <p className="modalContent">Price</p>
              <Form.Item
                name="packagePrice"
                initialValue={record.packagePrice}
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
          </Row>

          {/* 2nd Row */}
          <Row style={{ justifyContent: "space-between" }}>
            {/* 1st column */}
            <Col>
              <p className="modalContent">Package Type</p>
              <Form.Item
                name="type"
                initialValue={record.type}
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
                initialValue={
                  record.startDate
                    ? dayjs
                        .utc(record.startDate)
                        .tz("Asia/Ho_Chi_Minh")
                        .startOf("day")
                    : null
                }
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
                initialValue={
                  record.endDate
                    ? dayjs
                        .utc(record.endDate)
                        .tz("Asia/Ho_Chi_Minh")
                        .startOf("day")
                    : null
                }
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
