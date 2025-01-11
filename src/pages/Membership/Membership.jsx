import React from "react";
import SearchTable from "../../components/SearchTable/searchTable";
import MembershipTable from "./MembershipTable";
import MembershipButton from "./MembershipButton";

const Membership = () => {
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
        <div>Membership Package</div>

        <div
          style={{
            display: "flex",
          }}
        >
          <MembershipButton />
        </div>
      </div>

      <div className="searchContainer">
        <SearchTable />
      </div>

      <div className="tableContainer" style={{ marginTop: "10px" }}>
        <MembershipTable />
      </div>
    </div>
  );
};

export default Membership;
