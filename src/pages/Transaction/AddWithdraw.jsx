import { PlusOutlined } from "@ant-design/icons";
import { Button, Form, Input, Modal, message } from "antd";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  walletWithdraw,
  walletWithdrawByUser,
} from "../../redux/slices/transactionSlice";

const AddWithdraw = () => {
  const dispatch = useDispatch();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [form] = Form.useForm();

  const loggedInUser = useSelector((state) => state.authSlice.user);
  const currentUserId = loggedInUser?.id;
  const { walletWithdrawalData, loading } = useSelector(
    (state) => state.transactionSlice
  );

  // Fetch withdrawals when component mounts or userId changes
  useEffect(() => {
    if (currentUserId) {
      dispatch(walletWithdrawByUser(currentUserId));
    }
  }, [dispatch, currentUserId]);

  const showAddModal = () => {
    form.setFieldsValue({
      amount: "",
    });
    setIsAddOpen(true);
  };

  const handleCancel = () => {
    setIsAddOpen(false);
    form.resetFields();
  };

  const onFinish = async (values) => {
    const payload = {
      userId: currentUserId,
      amount: values.amount,
    };

    // Check restrictions
    const hasPending = walletWithdrawalData?.some(
      (withdraw) => withdraw.status === "Pending"
    );
    const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM format
    const hasWithdrawThisMonth = walletWithdrawalData?.some(
      (withdraw) =>
        new Date(withdraw.createDate).toISOString().slice(0, 7) === currentMonth
    );

    if (hasPending) {
      message.error("Không thể rút tiền khi có yêu cầu đang chờ xử lý!");
      return;
    }

    if (hasWithdrawThisMonth) {
      message.error("Bạn chỉ được rút tiền 1 lần mỗi tháng!");
      return;
    }

    try {
      await dispatch(walletWithdraw(payload)).unwrap();
      await dispatch(walletWithdrawByUser(currentUserId));
      setIsAddOpen(false);
      form.resetFields();
      message.success("Yêu cầu rút tiền đã được gửi thành công!");
    } catch (error) {
      console.error("Withdraw failed:", error);
      message.error("Gửi yêu cầu rút tiền thất bại!");
    }
  };

  const buttonStyle = {
    height: "40px",
    width: "160px",
    borderRadius: "10px",
    margin: "0px 5px",
    padding: "7px 0px 10px 0px",
  };

  return (
    <div>
      <Button
        size="small"
        className="addBtn"
        type="primary"
        icon={<PlusOutlined />}
        style={buttonStyle}
        onClick={showAddModal}
        disabled={loading}
      >
        Thêm Rút Tiền
      </Button>

      <Modal
        centered
        title="Thêm Rút Tiền"
        open={isAddOpen}
        onCancel={handleCancel}
        footer={null}
      >
        <Form
          form={form}
          name="add_withdraw"
          onFinish={onFinish}
          layout="vertical"
        >
          <Form.Item
            name="amount"
            label="Số Tiền *"
            rules={[
              { required: true, message: "Vui lòng nhập số tiền!" },
              {
                type: "number",
                min: 0,
                message: "Số tiền phải lớn hơn 0!",
                transform: (value) => Number(value),
              },
            ]}
          >
            <Input type="number" placeholder="Nhập số tiền" />
          </Form.Item>

          <Form.Item style={{ textAlign: "right", marginBottom: 0 }}>
            <Button type="primary" htmlType="submit" loading={loading}>
              Xác Nhận
            </Button>
            <Button onClick={handleCancel} style={{ marginLeft: 8 }}>
              Hủy
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AddWithdraw;

// import { PlusOutlined } from "@ant-design/icons";
// import { Button, Form, Input, Modal } from "antd";
// import React, { useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   walletWithdraw,
//   walletWithdrawByUser,
// } from "../../redux/slices/transactionSlice";

// const AddWithdraw = () => {
//   const dispatch = useDispatch();
//   const [isAddOpen, setIsAddOpen] = useState(false);
//   const [form] = Form.useForm();

//   const loggedInUser = useSelector((state) => state.authSlice.user);
//   const currentUserId = loggedInUser?.id;

//   const showAddModal = () => {
//     form.setFieldsValue({
//       amount: "",
//     });
//     setIsAddOpen(true);
//   };

//   const handleCancel = () => {
//     setIsAddOpen(false);
//     form.resetFields();
//   };

//   const onFinish = async (values) => {
//     const payload = {
//       userId: currentUserId,
//       amount: values.amount,
//     };
//     try {
//       await dispatch(walletWithdraw(payload)).unwrap(); // Ensure the action completes successfully
//       // Fetch the updated withdrawal list after a successful withdraw
//       await dispatch(walletWithdrawByUser(currentUserId));
//       setIsAddOpen(false);
//       form.resetFields();
//     } catch (error) {
//       console.error("Withdraw failed:", error);
//     }
//   };

//   const buttonStyle = {
//     height: "40px",
//     width: "160px",
//     borderRadius: "10px",
//     margin: "0px 5px",
//     padding: "7px 0px 10px 0px",
//   };

//   return (
//     <div>
//       <Button
//         size="small"
//         className="addBtn"
//         type="primary"
//         icon={<PlusOutlined />}
//         style={buttonStyle}
//         onClick={showAddModal}
//       >
//         Thêm Rút Tiền
//       </Button>

//       <Modal
//         centered
//         title="Thêm Rút Tiền"
//         open={isAddOpen}
//         onCancel={handleCancel}
//         footer={null}
//       >
//         <Form
//           form={form}
//           name="add_withdraw"
//           onFinish={onFinish}
//           layout="vertical"
//         >
//           <Form.Item
//             name="amount"
//             label="Số Tiền *"
//             rules={[
//               { required: true, message: "Vui lòng nhập số tiền!" },
//               {
//                 type: "number",
//                 min: 0,
//                 message: "Số tiền phải lớn hơn 0!",
//                 transform: (value) => Number(value),
//               },
//             ]}
//           >
//             <Input type="number" placeholder="Nhập số tiền" />
//           </Form.Item>

//           <Form.Item style={{ textAlign: "right", marginBottom: 0 }}>
//             <Button type="primary" htmlType="submit">
//               Xác Nhận
//             </Button>
//             <Button onClick={handleCancel} style={{ marginLeft: 8 }}>
//               Hủy
//             </Button>
//           </Form.Item>
//         </Form>
//       </Modal>
//     </div>
//   );
// };

// export default AddWithdraw;
