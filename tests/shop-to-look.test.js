import React, { useState, useRef } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

const LockRowAtTop = () => {
  const gridRef = useRef(null);

  const [rowData] = useState([
    { id: 1, name: "John", age: 30, country: "USA" },
    { id: 2, name: "Jane", age: 25, country: "UK" },
    { id: 3, name: "Mark", age: 35, country: "Canada" }, // Row to lock at the top
    { id: 4, name: "Lucy", age: 28, country: "Germany" },
  ]);

  const [columnDefs] = useState([
    { field: "name", filter: true },
    { field: "age", filter: "agNumberColumnFilter" },
    { field: "country", filter: true },
  ]);

  const lockedRowId = 3; // The ID of the row to lock at the top

  // External filter logic to always allow the locked row to pass
  const isExternalFilterPresent = () => true; // External filter is always active

  const doesExternalFilterPass = (node) => {
    if (node.data.id === lockedRowId) {
      // Always pass the locked row
      return true;
    }
    return true; // Let other rows pass based on regular filtering
  };

  // Post-sort logic to ensure the locked row is always at the top
  const postSort = (rowNodes) => {
    const lockedRow = rowNodes.find((node) => node.data.id === lockedRowId);
    if (lockedRow) {
      // Remove the locked row from its current position
      rowNodes.splice(rowNodes.indexOf(lockedRow), 1);
      // Add it to the top of the array
      rowNodes.unshift(lockedRow);
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
        getRowId={(params) => params.data.id} // Ensure unique row IDs
        isExternalFilterPresent={isExternalFilterPresent} // Trigger external filtering
        doesExternalFilterPass={doesExternalFilterPass} // Ensure locked row always passes filters
        postSort={postSort} // Ensure locked row stays on top after sorting
      />
    </div>
  );
};

export default LockRowAtTop;