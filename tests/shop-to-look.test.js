import React, { useState, useRef } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

const AppendRowOnTop = () => {
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

  const onFilterChanged = () => {
    const api = gridRef.current.api;
    const isFilterActive = !!Object.keys(api.getFilterModel()).length;

    if (isFilterActive) {
      // Check if the row is already present
      const displayedRows = [];
      api.forEachNodeAfterFilter((node) => {
        displayedRows.push(node.data.id);
      });

      if (!displayedRows.includes("custom")) {
        // Append the custom row on top
        api.applyTransaction({
          add: [additionalRow],
          addIndex: 0, // Add it at the top
        });
      }
    } else {
      // Remove the additional row if no filters are applied
      const nodesToRemove = [];
      api.forEachNode((node) => {
        if (node.data.id === "custom") {
          nodesToRemove.push(node.data);
        }
      });

      if (nodesToRemove.length > 0) {
        api.applyTransaction({ remove: nodesToRemove });
      }
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
        onFilterChanged={onFilterChanged} // Listen for filter changes
      />
    </div>
  );
};

export default AppendRowOnTop;