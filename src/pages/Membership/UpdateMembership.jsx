import { EditOutlined } from "@ant-design/icons";
import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Modal,
  notification,
  Popover,
  Row,
} from "antd";
import React, { useCallback, useState } from "react";
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

  const showEditModal = useCallback(() => {
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
  }, [form, record, setIsEditOpen]);

  const handleEditCancel = useCallback(() => {
    form.resetFields();
    setIsEditOpen(false);
  }, [form, setIsEditOpen]);

  const handleCancel = useCallback(() => {
    setIsEditOpen(false);
  }, [setIsEditOpen]);

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

  const handleEditSubmit = (values) => {
    form
      .validateFields()
      .then(() => {
        const formattedValues = {
          ...values,
          startDate: values.startDate
            ? dayjs(values.startDate)
                .tz("Asia/Ho_Chi_Minh", true)
                .utc()
                .format()
            : null,
          endDate: values.endDate
            ? dayjs(values.endDate).tz("Asia/Ho_Chi_Minh", true).utc().format()
            : null,
        };

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
            handleEditCancel();
            openNotification(
              "success",
              `Cập Nhật "${record.packageTitle}" Thành Công!`
            );
            dispatch(getListMembershipPackage());
          })
          .catch((error) => {
            openNotification("warning", error.message || "Update failed!");
          });
      })
      .catch((validationError) => {
        openNotification(
          "error",
          "Validation failed: " + validationError.message
        );
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
        title="Chỉnh Sửa Thông Tin Gói Thành Viên"
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
              <p className="modalContent">Tên Gói</p>
              <Form.Item
                name="packageTitle"
                initialValue={record.packageTitle}
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập tên gói!",
                  },
                ]}
              >
                <Input placeholder="Tên Gói"></Input>
              </Form.Item>
            </Col>
            {/* 2nd column */}
            <Col>
              <p className="modalContent">Mô Tả</p>
              <Form.Item
                name="packageDescription"
                initialValue={record.packageDescription}
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập mô tả!",
                  },
                ]}
              >
                <Input placeholder="Mô Tả"></Input>
              </Form.Item>
            </Col>
            {/* 3rd column */}
            <Col>
              <p className="modalContent">Giá</p>
              <Form.Item
                name="packagePrice"
                initialValue={record.packagePrice}
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập giá!",
                  },
                ]}
              >
                <Input
                  allowClear
                  style={{ width: "270px" }}
                  placeholder="Giá"
                  type="number"
                ></Input>
              </Form.Item>
            </Col>
          </Row>
          {/* 2nd Row */}
          <Row style={{ justifyContent: "space-between" }}>
            {/* 1st column */}
            <Col>
              <p className="modalContent">Loại Gói</p>
              <Form.Item
                name="type"
                initialValue={record.type}
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập loại gói!",
                  },
                ]}
              >
                <Input placeholder="Loại Gói"></Input>
              </Form.Item>
            </Col>
            {/* 2nd column */}
            <Col>
              <p className="modalContent">Ngày Bắt Đầu</p>
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
                    message: "Vui lòng chọn ngày bắt đầu!",
                  },
                ]}
              >
                <DatePicker
                  style={{ width: "270px" }}
                  placeholder="Ngày Bắt Đầu"
                ></DatePicker>
              </Form.Item>
            </Col>
            {/* 3rd column */}
            <Col>
              <p className="modalContent">Ngày Kết Thúc</p>
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
                    message: "Vui lòng chọn ngày kết thúc!",
                  },
                ]}
              >
                <DatePicker
                  style={{ width: "270px" }}
                  placeholder="Ngày Kết Thúc"
                ></DatePicker>
              </Form.Item>
            </Col>
          </Row>
          {/* 3rd Row */}
          <Row>
            {/* 1st column */}
            <Col>
              <p className="modalContent">Giai Đoạn</p>
              <Form.Item
                name="peiod"
                initialValue={record.peiod}
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập giai đoạn!",
                  },
                ]}
              >
                <Input placeholder="Giai Đoạn"></Input>
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
                Chỉnh Sửa
              </Button>
            </Form.Item>
          </Row>
        </Form>
      </Modal>
    </div>
  );
};

export default UpdateMembership;
