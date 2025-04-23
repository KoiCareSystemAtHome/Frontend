import React from "react";
import NormFoodTable from "./NormFoodTable";
import useNormFoodList from "../../hooks/useNormFoodList";

const NormFood = () => {
  const NormFoodList = useNormFoodList();

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
        <div>Thức Ăn Chuẩn</div>

        <div
          style={{
            display: "flex",
          }}
        ></div>
      </div>

      <div className="searchContainer">{/* <SearchTable /> */}</div>

      <div className="tableContainer" style={{ marginTop: "10px" }}>
        <NormFoodTable dataSource={NormFoodList} />
      </div>
    </div>
  );
};

export default NormFood;
