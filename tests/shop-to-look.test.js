import React, { useState, useRef } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

const AppendToFilteredView = () => {
  const gridRef = useRef(null);

  const [rowData] = useState([
    { id: 1, name: "John", age: 30, country: "USA" },
    { id: 2, name: "Jane", age: 25, country: "UK" },
    { id: 3, name: "Mark", age: 35, country: "Canada" }, // Row to append to filtered view
    { id: 4, name: "Lucy", age: 28, country: "Germany" },
  ]);

  const [columnDefs] = useState([
    { field: "name", filter: true },
    { field: "age", filter: "agNumberColumnFilter" },
    { field: "country", filter: true },
  ]);

  const additionalRow = { id: "custom", name: "Always on Top", age: "-", country: "-" };

  const onFilterChanged = () => {
    const api = gridRef.current.api;

    // Check if the row is already displayed in the filtered rows
    let isRowAlreadyDisplayed = false;
    api.forEachNodeAfterFilter((node) => {
      if (node.data.id === "custom") {
        isRowAlreadyDisplayed = true;
      }
    });

    if (!isRowAlreadyDisplayed) {
      // Temporarily add the additional row to the grid without modifying rowData
      const allFilteredRows = [];
      api.forEachNodeAfterFilter((node) => allFilteredRows.push(node.data));

      // Append the custom row to the filtered rows
      allFilteredRows.unshift(additionalRow);

      // Set filtered rows to display, keeping original rowData intact
      api.setRowData(allFilteredRows);
    }
  };

  const onFilterCleared = () => {
    const api = gridRef.current.api;

    // When filters are cleared, reset to the original rowData
    api.setRowData(rowData);
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
        onFilterChanged={onFilterChanged} // Add row dynamically when filters are applied
        onFilterModified={onFilterCleared} // Reset rows when filters are cleared
        getRowId={(params) => params.data.id} // Ensure rows have unique IDs
      />
    </div>
  );
};

export default AppendToFilteredView;