import React from "react";
import SearchTable from "../../components/SearchTable/searchTable";
import ReportTable from "./ReportTable";
import useReportList from "../../hooks/useReportList";
import ReportButton from "./ReportButton";

const Report = () => {
  const reportList = useReportList();
  return (
    <div>
      <div
        className="font-semibold mb-4 ml-4 text-2xl"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>Báo Cáo</div>

        <div
          style={{
            display: "flex",
          }}
        >
          {/* <ReportButton /> */}
        </div>
      </div>

      <div className="searchContainer">{/* <SearchTable /> */}</div>

      <div className="tableContainer" style={{ marginTop: "10px" }}>
        <ReportTable dataSource={reportList} />
      </div>
    </div>
  );
};

export default Report;
