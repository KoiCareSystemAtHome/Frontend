import { EditOutlined } from "@ant-design/icons";
import {
  Button,
  Form,
  Input,
  Modal,
  Popover,
  InputNumber,
  Switch,
  message,
} from "antd";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import {
  editPondParameter,
  getListParameter,
} from "../../../redux/slices/parameterSlice"; // Adjust the import path as needed

const UpdatePondParameter = (props) => {
  const { record } = props;
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  // Default values for all fields
  const defaultValues = {
    parameterID: record?.parameterId || "",
    name: record?.parameterName || "",
    createdAt: record?.createdAt || new Date().toISOString(),
    type: record?.type || "",
    varietyId: record?.varietyId || "",
    unitName: record?.unitName || "",
    warningUpper: record?.warningUpper || 0,
    warningLowwer: record?.warningLowwer || 0,
    dangerLower: record?.dangerLower || 0,
    dangerUpper: record?.dangerUpper || 0,
    isActive: record?.isActive !== undefined ? record.isActive : true,
    measurementInstruction: record?.measurementInstruction || "",
    warningAcceptantDay: record?.warningAcceptantDay || 0,
    dangerAcceptantDay: record?.dangerAcceptantDay || 0,
  };

  const showEditModal = () => {
    console.log("record.parameterID:", record?.parameterID);
    // Set form values when opening the modal
    form.setFieldsValue(defaultValues);
    setIsEditOpen(true);
  };

  const handleCancel = () => {
    setIsEditOpen(false);
    form.resetFields();
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      // Dispatch the editPondParameter thunk with the updated values
      await dispatch(editPondParameter(values))
        .unwrap()
        .then(() => {
          message.success("Cập nhật thông số thành công!");
          // Optionally refresh the parameter list after editing a parameter
          dispatch(getListParameter({ type: "pond" }));
        });
      setIsEditOpen(false);
      form.resetFields();
    } catch (error) {
      console.error("Failed to update parameter:", error);
    }
  };

  return (
    <div>
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
        title="Cập Nhật Thông Số Hồ"
        open={isEditOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Save"
        cancelText="Cancel"
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={defaultValues} // Set initial values here
        >
          <Form.Item
            name="parameterID"
            label="Parameter ID"
            hidden // Usually ID is not editable
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="name"
            label="Tên Thông Số"
            rules={[{ required: true, message: "Vui lòng nhập tên thông số" }]}
          >
            <Input placeholder="Tên Thông Số" />
          </Form.Item>

          <Form.Item name="type" label="Type" hidden>
            <Input placeholder="Type" />
          </Form.Item>

          <Form.Item
            name="unitName"
            label="Tên Đơn Vị"
            rules={[{ required: true, message: "Vui lòng nhập tên đơn vị" }]}
          >
            <Input placeholder="Tên Đơn Vị" />
          </Form.Item>

          <Form.Item name="warningUpper" label="Cảnh Báo Giới Hạn Trên">
            <InputNumber
              style={{ width: "100%" }}
              placeholder="Cảnh Báo Giới Hạn Trên"
            />
          </Form.Item>

          <Form.Item name="warningLowwer" label="Cảnh Báo Giới Hạn Dưới">
            <InputNumber
              style={{ width: "100%" }}
              placeholder="Cảnh Báo Giới Hạn Dưới"
            />
          </Form.Item>

          <Form.Item name="dangerUpper" label="Nguy Hiểm Giới Hạn Trên">
            <InputNumber
              style={{ width: "100%" }}
              placeholder="Nguy Hiểm Giới Hạn Trên"
            />
          </Form.Item>

          <Form.Item name="dangerLower" label="Nguy Hiểm Giới Hạn Dưới">
            <InputNumber
              style={{ width: "100%" }}
              placeholder="Nguy Hiểm Giới Hạn Dưới"
            />
          </Form.Item>

          <Form.Item
            name="isActive"
            label="Is Active"
            valuePropName="checked"
            hidden
          >
            <Switch />
          </Form.Item>

          <Form.Item name="measurementInstruction" label="Hướng Dẫn Đo Lường">
            <Input.TextArea rows={3} placeholder="Hướng Dẫn Đo Lường" />
          </Form.Item>

          <Form.Item
            name="warningAcceptantDay"
            label="Warning Acceptant Days"
            hidden
          >
            <InputNumber
              style={{ width: "100%" }}
              min={0}
              placeholder="Enter warning acceptant days"
            />
          </Form.Item>

          <Form.Item
            name="dangerAcceptantDay"
            label="Danger Acceptant Days"
            hidden
          >
            <InputNumber
              style={{ width: "100%" }}
              min={0}
              placeholder="Enter danger acceptant days"
            />
          </Form.Item>

          <Form.Item
            name="createdAt"
            label="Created At"
            hidden // Usually creation date is not editable
          >
            <Input disabled />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default UpdatePondParameter;
