import React from "react";
import SearchTable from "../../components/SearchTable/searchTable";
import FeedbackButton from "./FeedbackButton";
import FeedbackTable from "./FeedbackTable";

export const Feedback = () => {
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
        <div>Feedback</div>

        <div
          style={{
            display: "flex",
          }}
        >
          <FeedbackButton />
        </div>
      </div>

      <div className="searchContainer">
        <SearchTable />
      </div>

      <div className="tableContainer" style={{ marginTop: "10px" }}>
        <FeedbackTable />
      </div>
    </div>
  );
};
