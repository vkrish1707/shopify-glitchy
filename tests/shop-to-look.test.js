import React, { useState, useRef } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

const AlwaysOnTopRowWithFilter = () => {
  const gridRef = useRef();
  const [rowData] = useState([
    { uniqueId: "123", name: "John", age: 30, country: "USA" },
    { uniqueId: "456", name: "Jane", age: 25, country: "UK" },
    { uniqueId: "789", name: "Mark", age: 35, country: "Canada" }, // Row to always appear on top
    { uniqueId: "101", name: "Lucy", age: 28, country: "Germany" },
  ]);

  const [columnDefs] = useState([
    { field: "name", filter: true },
    { field: "age", filter: "agNumberColumnFilter" },
    { field: "country", filter: true },
  ]);

  const uniqueIdToAlwaysShow = "789"; // Row with this ID will always be on top

  // Custom filtering logic
  const isExternalFilterPresent = () => {
    return true; // External filter logic is always active
  };

  const doesExternalFilterPass = (node) => {
    // Allow the row with the uniqueId to always pass the filter
    if (node.data.uniqueId === uniqueIdToAlwaysShow) {
      return true;
    }
    return false; // Other rows depend on internal filter rules
  };

  // Post Sort Logic
  const postSort = (rowNodes) => {
    // Find the row with the specific uniqueId
    const alwaysOnTopNode = rowNodes.find((node) => node.data.uniqueId === uniqueIdToAlwaysShow);

    if (alwaysOnTopNode) {
      // Remove the node from its current position
      rowNodes.splice(rowNodes.indexOf(alwaysOnTopNode), 1);

      // Move the row to the top of the grid
      rowNodes.unshift(alwaysOnTopNode);
    }
  };

  return (
    <div className="ag-theme-alpine" style={{ height: "500px", width: "600px" }}>
      <AgGridReact
        ref={gridRef}
        rowData={rowData}
        columnDefs={columnDefs}
        defaultColDef={{
          sortable: true,
          filter: true,
        }}
        getRowId={(params) => params.data.uniqueId} // Ensure rows are uniquely identified
        postSort={postSort} // Always move the row with uniqueId to the top
        isExternalFilterPresent={isExternalFilterPresent} // External filter logic always active
        doesExternalFilterPass={doesExternalFilterPass} // Exclude the specific row from filters
      />
    </div>
  );
};

export default AlwaysOnTopRowWithFilter;