// SearchPanel.js

import React from "react";
import { Collapse, Input, Button } from "antd";
import { AlignCenterOutlined, SearchOutlined } from "@ant-design/icons";

const { Panel } = Collapse;

const searchButton = {
  flexBasis: "33%",
  margin: "3px 0",
};

const SearchTable = () => {
  return (
    <Collapse defaultActiveKey={["0"]} size="small" style={{ width: "100%" }}>
      <Panel header="Search Information" key="1">
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
          }}
        >
          <Input placeholder="Input 1" size="small" style={searchButton} />
          <Input placeholder="Input 2" size="small" style={searchButton} />
          <Input placeholder="Input 3" size="small" style={searchButton} />
          <Input placeholder="Input 4" size="small" style={searchButton} />
          <Input placeholder="Input 5" size="small" style={searchButton} />
          <Input placeholder="Input 6" size="small" style={searchButton} />
          <Input placeholder="Input 7" size="small" style={searchButton} />
          <Input placeholder="Input 8" size="small" style={searchButton} />
          <Input placeholder="Input 9" size="small" style={searchButton} />

          <div className="searchButton" style={{ display: "flex" }}>
            <Button
              icon={<AlignCenterOutlined />}
              style={{ margin: "0 5px 0 0" }}
            >
              Clean Filter
            </Button>
            <Button
              type="primary"
              icon={<SearchOutlined />}
              style={{ padding: "4px 5px", margin: "0 0 0 5px" }}
            >
              Search
            </Button>
          </div>
        </div>
      </Panel>
    </Collapse>
  );
};

export default SearchTable;
