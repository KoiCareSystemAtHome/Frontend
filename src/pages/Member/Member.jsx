import React from "react";
import MemberButton from "./MemberButton";
import SearchTable from "../../components/SearchTable/searchTable";
import MemberTable from "./MemberTable";

const Member = () => {
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
        <div>Member</div>

        <div
          style={{
            display: "flex",
          }}
        >
          <MemberButton />
        </div>
      </div>

      <div className="searchContainer">
        <SearchTable />
      </div>

      <div className="tableContainer" style={{ marginTop: "10px" }}>
        <MemberTable />
      </div>
    </div>
  );
};

export default Member;
