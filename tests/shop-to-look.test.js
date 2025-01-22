import React, { useState } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

const CustomHeader = (props) => {
  const [showDetails, setShowDetails] = useState(false);

  const handleDoubleClick = () => {
    setShowDetails(!showDetails);
  };

  return (
    <div onDoubleClick={handleDoubleClick} style={{ cursor: "pointer" }}>
      {/* Main Header Title */}
      <div>{props.displayName}</div>

      {/* Additional Information */}
      {showDetails && (
        <div style={{ marginTop: "5px", fontSize: "12px", color: "#666" }}>
          {/* Custom information or component */}
          <div>Additional Info 1</div>
          <div>Additional Info 2</div>
        </div>
      )}
    </div>
  );
};

const CustomHeaderExample = () => {
  const [rowData] = useState([
    { name: "John", age: 30, country: "USA" },
    { name: "Jane", age: 25, country: "UK" },
    { name: "Mark", age: 35, country: "Canada" },
    { name: "Lucy", age: 28, country: "Germany" },
  ]);

  const [columnDefs] = useState([
    {
      field: "name",
      headerName: "Name",
      headerComponent: CustomHeader, // Use the custom header component
    },
    {
      field: "age",
      headerName: "Age",
      headerComponent: CustomHeader, // Use the custom header component
    },
    { field: "country", headerName: "Country" },
  ]);

  return (
    <div className="ag-theme-alpine" style={{ height: "500px", width: "600px" }}>
      <AgGridReact
        rowData={rowData}
        columnDefs={columnDefs}
        defaultColDef={{
          sortable: true,
          filter: true,
        }}
      />
    </div>
  );
};

export default CustomHeaderExample;