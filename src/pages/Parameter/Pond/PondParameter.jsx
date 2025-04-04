import React from "react";
import PondParameterButton from "./PondParameterButton";
import PondParameterTable from "./PondParameterTable";
import SearchTable from "../../../components/SearchTable/searchTable";
import useParameterList from "../../../hooks/useParameterList";

const PondParameter = () => {
  const parameterList = useParameterList("pond");

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
        <div>Thông Số Hồ</div>

        <div
          style={{
            display: "flex",
          }}
        >
          <PondParameterButton />
        </div>
      </div>

      <div className="searchContainer">{/* <SearchTable /> */}</div>

      <div className="tableContainer" style={{ marginTop: "10px" }}>
        <PondParameterTable dataSource={parameterList} />
      </div>
    </div>
  );
};

export default PondParameter;
