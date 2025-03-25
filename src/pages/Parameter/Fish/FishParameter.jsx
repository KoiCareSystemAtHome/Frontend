import React from "react";
import SearchTable from "../../../components/SearchTable/searchTable";
import FishParameterButton from "./FishParameterButton";
import FishParameterTable from "./FishParameterTable";
import useParameterList from "../../../hooks/useParameterList";

const FishParameter = () => {
  const parameterList = useParameterList("fish");
  console.log("Parameter List in FishParameter:", parameterList); // Add logging

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
        <div>Fish Parameter</div>

        <div
          style={{
            display: "flex",
          }}
        >
          <FishParameterButton />
        </div>
      </div>

      <div className="searchContainer">
        <SearchTable />
      </div>

      <div className="tableContainer" style={{ marginTop: "10px" }}>
        <FishParameterTable dataSource={parameterList} />
      </div>
    </div>
  );
};

export default FishParameter;
