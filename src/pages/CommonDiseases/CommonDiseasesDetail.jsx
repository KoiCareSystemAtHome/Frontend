import React from "react";
import { Typography, Button } from "antd";
import { LeftOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const { Title, Text, Paragraph } = Typography;

const CommonDiseasesDetail = () => {
  const navigate = useNavigate();

  return (
    <div>
      {/* Header with back button */}
      <div>
        <div className="align-content-start">
          <Button
            type="text"
            icon={<LeftOutlined />}
            onClick={() => navigate("/admin/diseases")} // Use an absolute path
            className="flex items-center"
          >
            Back
          </Button>
        </div>
      </div>

      {/* Main content with top padding to account for fixed header */}
      <div className="pt-16">
        <div className="max-w-8xl mx-auto p-4 md:p-6">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Image Section */}
            <div className="md:w-1/3">
              <img
                src="https://koiservice.vn/wp-content/uploads/2021/04/cach-tri-trung-mo-neo-cho-ca-koi-tan-goc-va-hieu-qua-nhat-1.jpg"
                alt="Bệnh cá mó neo"
                className="w-full rounded-lg shadow-md"
              />
            </div>

            {/* Content Section */}
            <div className="md:w-1/3">
              <Title level={3} className="text-gray-800">
                Bệnh cá mó neo
              </Title>

              <div className="mb-6">
                <Text strong className="text-green-600 text-lg">
                  + Nguyên Nhân Gây Bệnh
                </Text>
                <Paragraph className="pl-4 mt-2">
                  Ký sinh trùng Lernaea gây bệnh cá Koi. Chúng sinh sôi này nở
                  nhanh rồi lây bệnh cho cả đàn cá. Trùng mỏ neo hút máu và chất
                  dinh dưỡng của cá Koi khiến cá gầy yếu, cơ thể bị tổn thương
                  lạo thành vết thương lâu ngày gây lên vết lở loét và dẫn tới
                  chết.
                </Paragraph>
              </div>

              <div className="mb-6">
                <Text strong className="text-green-600 text-lg">
                  + Triệu Chứng Bệnh Trùng Mỏ Neo
                </Text>
                <ul className="list-none pl-4 mt-2">
                  <li className="mb-2">
                    - Xuất hiện vết gờ, quầng đỏ đó chỗ bị ký sinh trùng cắn.
                  </li>
                  <li className="mb-2">
                    - Cá Koi hay nhảy lên khỏi mặt nước hoặc cạ mình vào thành
                    bể và các vật dụng trong bể vì ngứa ngáy gây trầy xước da.
                    Nếu để lâu không điều trị vết thương hở rất dễ bị nấm, vi
                    khuẩn xâm nhập gây ra bệnh cá koi khác như lở loét,...
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        {/* Treatment Methods */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Method 1 */}
          <div className="m-10">
            <Title level={4} className="text-blue-600">
              Cách 1: Gắp trùng mỏ neo bằng tay
            </Title>
            <ul className="list-none pl-0">
              <li className="mb-3">
                + Tiến hành cách ly các koi, khử khuẩn bằng thuộc tím sau đó gây
                mê cá koi. Dùng dụng cụ gắp hết ký sinh trùng bán trên cơ thể cá
                koi ra.
              </li>
              <li className="mb-3">
                + Sau đó hồi sức, dưỡng cá koi trong tank dưỡng riêng với nước
                muối liều lượng 300g/ 100ml nước trong vòng 1 tuần.
              </li>
              <li className="mb-3">
                + Tăng nhiệt độ nước lên 32 độ C để diệt trứng trùng mỏ neo
                trong nước chưa nở còn sót.
              </li>
              <li className="mb-3">
                + Khử trùng lại toàn bộ hồ cá koi bằng thuốc tím, nước muối với
                liều lượng 300g/ 1001 tiến hành trong vòng 7 ngày.
              </li>
            </ul>
          </div>

          {/* Method 2 */}
          <div className="m-10">
            <Title level={4} className="text-blue-600">
              Cách 2: Trị trùng mỏ neo bằng thuốc Dimilin
            </Title>
            <Paragraph>
              Cách xử lý trùng mỏ neo bằng đánh thuốc Dimilin đơn giản. Thực
              hiện trong công 15 ngày.
            </Paragraph>
            <ul className="list-none pl-0">
              <li className="mb-3">
                Ngày 1: Sử dụng 1g Dimilin/1m3 đánh liều đầu tiên. Sau đó để
                cách một ngày
              </li>
              <li className="mb-3">
                Ngày thứ 3: Tiến hành thay 20% nước, đánh liều thuốc Dimilin thứ
                2 liều giống liều 1. Sau đó để cách đến ngày 7.
              </li>
              <li className="mb-3">
                Ngày thứ 7: Tới ngày thứ 7 thì thay 20% nước, đánh liều thứ 3
                liều lượng như liều đầu 1g Dimilin/1m3. Lại cách tiếp 2 ngày.
              </li>
              <li className="mb-3">
                Ngày thứ 9: Thay 20% nước, đánh liều thuốc thứ 4 vẫn liều lượng
                cũ. Sau đó để cách tiếp 3 ngày.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommonDiseasesDetail;
