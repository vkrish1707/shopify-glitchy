import React, { useState, useRef } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

const AppendRowToFilteredGrid = () => {
  const gridRef = useRef(null);

  const [rowData] = useState([
    { id: 1, name: "John", age: 30, country: "USA" },
    { id: 2, name: "Jane", age: 25, country: "UK" },
    { id: 3, name: "Mark", age: 35, country: "Canada" },
    { id: 4, name: "Lucy", age: 28, country: "Germany" },
  ]);

  const [columnDefs] = useState([
    { field: "name", filter: true },
    { field: "age", filter: "agNumberColumnFilter" },
    { field: "country", filter: true },
  ]);

  const additionalRow = { id: "custom", name: "Always on Top", age: "-", country: "-" };

  // Function to handle filter changes
  const onFilterChanged = () => {
    const api = gridRef.current.api;
    const isFilterActive = !!Object.keys(api.getFilterModel()).length;

    if (isFilterActive) {
      // Collect all currently filtered rows
      const filteredRows = [];
      api.forEachNodeAfterFilter((node) => {
        filteredRows.push(node);
      });

      // Check if the additional row is already present
      const customRowExists = filteredRows.some((node) => node.data.id === "custom");

      if (!customRowExists) {
        // Dynamically inject the additional row at the top
        api.applyTransactionAsync({
          add: [additionalRow],
          addIndex: 0,
        });
      }
    } else {
      // Remove the additional row when filters are cleared
      api.forEachNode((node) => {
        if (node.data.id === "custom") {
          api.applyTransactionAsync({ remove: [node.data] });
        }
      });
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
        onFilterChanged={onFilterChanged} // Trigger logic on filter changes
      />
    </div>
  );
};

export default AppendRowToFilteredGrid;