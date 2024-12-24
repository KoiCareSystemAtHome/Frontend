import { toast } from "react-toastify";

const handleError = (error) => {
  if (error.response) {
    if (error.response.status === 400) {

      toast.error(
        `${error.response.data.message || error.response.data.Message}`
      );
    }

    if (error.response.status === 401) {
      console.log("401 - Lỗi", error);
      toast.error(
        `${error.response.data.message || error.response.data.Message}`
      );
    }

    if (error.response.status === 403) {
      console.log("403 - Lỗi", error);
      toast.error(
        `Không có data`
      );
    }

    if (error.response.status === 404) {
      console.log("404 - Not Found");
    }

    // Xử lý lỗi 409 (Tạo sổ đọc chỉ số).
    if (error.response.status === 409) {
      console.log("409 - Tạo sổ.", error);
      toast.error(
        `${error.response.data.message || error.response.data.Message}`
      );
    }

    if (error.response.status === 500) {
      console.log("500 - Internal Server Error", error);

    }
  } else {
    console.log("Error:", error.message);
  }
};

export default handleError;
