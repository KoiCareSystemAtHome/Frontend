import React from "react";
import SearchTable from "../../components/SearchTable/searchTable";
import ParameterButton from "./ParameterButton";
import ParameterTable from "./ParameterTable";

const Parameter = () => {
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
        <div>Parameter</div>

        <div
          style={{
            display: "flex",
          }}
        >
          <ParameterButton />
        </div>
      </div>

      <div className="searchContainer">
        <SearchTable />
      </div>

      <div className="tableContainer" style={{ marginTop: "10px" }}>
        <ParameterTable />
      </div>
    </div>
  );
};

export default Parameter;
