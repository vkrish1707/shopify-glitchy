const handleColumnMoved = () => {
  const gridApi = gridRef.current?.api;

  if (!gridApi) {
    console.error("Grid API is not available.");
    return;
  }

  // Fetch the displayed columns and their order
  const displayedColumns = gridApi
    .getAllDisplayedColumns()
    .filter((col) => col.isVisible()) // Ensure only visible columns are considered
    .map((col) => col.getColId());

  console.log("Displayed Columns:", displayedColumns);

  // Get the column definitions once
  const columnDefinitions = gridApi.getColumnDefs();

  if (!columnDefinitions || columnDefinitions.length === 0) {
    console.error("No column definitions found.");
    return;
  }

  // Map the reordered column definitions
  const reorderedColumns = displayedColumns.reduce((acc, colId) => {
    const colDef = columnDefinitions.find((col) => col.field === colId);
    if (colDef) acc.push(colDef);
    else console.warn(`Column definition not found for field: ${colId}`);
    return acc;
  }, []);

  console.log("Reordered Columns:", reorderedColumns);

  // Set the updated column definitions to the second grid
  setSsColumnDefs(reorderedColumns);
};