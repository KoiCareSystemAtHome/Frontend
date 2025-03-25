import { EditOutlined, PlusOutlined } from "@ant-design/icons";
import {
  Button,
  Col,
  Form,
  Input,
  Modal,
  notification,
  Popover,
  Row,
  Select,
} from "antd";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getListReport, updateReport } from "../../redux/slices/reportSlice";

const UpdateReport = (props) => {
  const { record } = props;
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [api, contextHolder] = notification.useNotification();
  //const reports = useSelector((state) => state.reportSlice.listReport); // Get reports from Redux store

  const showEditModal = () => {
    form.setFieldsValue({
      reportId: record.reportId,
      status: record.status,
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

  const handleEditSubmit = async (values) => {
    try {
      const { reportId, status } = values;

      // Rename `status` to `statuz` before sending to backend
      await dispatch(updateReport({ reportId, statuz: status })).unwrap();

      notification.success({
        message: "Report Updated",
        description: "The report status has been successfully updated.",
        placement: "top",
      });
      // Fetch the updated list to ensure everything is up-to-date
      await dispatch(getListReport()).unwrap();
      form.resetFields(); // Reset the form after a successful update
      setIsEditOpen(false);
    } catch (error) {
      console.error("Update error:", error);

      notification.error({
        message: "Update Failed",
        description:
          typeof error === "string"
            ? error
            : error?.message || "An unexpected error occurred.",
      });
    }
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
        title="Edit Report"
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
              <p className="modalContent">Report ID</p>
              <Form.Item
                name="reportId"
                initialValue={record.reportId}
                rules={[
                  {
                    required: true,
                    message: "Please enter report ID!",
                  },
                ]}
              >
                <Input disabled placeholder="Report ID"></Input>
              </Form.Item>
            </Col>
            {/* 2nd column */}
            <Col>
              <p className="modalContent">Status</p>
              <Form.Item
                name="status"
                initialValue={record.status}
                rules={[
                  {
                    required: true,
                    message: "Please input status!",
                  },
                ]}
              >
                <Select placeholder="Select status">
                  <Select.Option value="Approve">Approve</Select.Option>
                  <Select.Option value="Reject">Reject</Select.Option>
                </Select>
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
                <PlusOutlined />
                Edit Report
              </Button>
            </Form.Item>
          </Row>
        </Form>
      </Modal>
    </div>
  );
};

export default UpdateReport;
