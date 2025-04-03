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
        openNotification("success", "Thêm Gói Thành Viên Thành Công!");
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
        Thêm Gói
      </Button>

      <Modal
        className="custom-modal"
        centered
        title="Thêm Gói Thành Viên"
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
              <p className="modalContent">Tên Gói</p>
              <Form.Item
                name="packageTitle"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập tên gói!",
                  },
                ]}
              >
                <Input allowClear placeholder="Tên Gói"></Input>
              </Form.Item>
            </Col>
            {/* 2nd column */}
            <Col>
              <p className="modalContent">Mô Tả Gói</p>
              <Form.Item
                name="packageDescription"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập mô tả!",
                  },
                ]}
              >
                <Input allowClear placeholder="Mô Tả Gói"></Input>
              </Form.Item>
            </Col>
            {/* 3rd column */}
            <Col>
              <p className="modalContent">Giá Gói</p>
              <Form.Item
                name="packagePrice"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập giá gói!",
                  },
                ]}
              >
                <Input
                  allowClear
                  style={{ width: "270px" }}
                  placeholder="Giá Gói"
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
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập loại gói!",
                  },
                ]}
              >
                <Input allowClear placeholder="Loại Gói"></Input>
              </Form.Item>
            </Col>
            {/* 2nd column */}
            <Col>
              <p className="modalContent">Ngày Bắt Đầu</p>
              <Form.Item
                name="startDate"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập ngày bắt đầu!",
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
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập ngày kết thúc!",
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
            {/* 1st Column */}
            <Col>
              <p className="modalContent">Giai đoạn</p>
              <Form.Item
                name="peiod"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập giai đoạn!",
                  },
                ]}
              >
                <Input allowClear placeholder="Giai đoạn"></Input>
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
                Hủy bỏ
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
                Thêm Gói
              </Button>
            </Form.Item>
          </Row>
        </Form>
      </Modal>
    </div>
  );
};

export default AddMembership;
