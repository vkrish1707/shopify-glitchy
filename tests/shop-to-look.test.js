import React, { useState } from "react";
import { FormControl, MenuItem, Select, Autocomplete, TextField } from "@mui/material";

const MilestoneSelection = ({ filteredSuggestions }) => {
  const [milestone, setMilestone] = useState(""); // To track selected milestone
  const [autocompleteOptions, setAutocompleteOptions] = useState([]); // Options for Autocomplete

  // Handle milestone selection
  const handleMilestoneChange = (event) => {
    const selectedMilestone = event.target.value;
    setMilestone(selectedMilestone);

    // Update autocomplete options based on selected milestone
    if (selectedMilestone === "A0") {
      setAutocompleteOptions(filteredSuggestions.allSocSuggestions);
    } else if (selectedMilestone === "B0") {
      setAutocompleteOptions(filteredSuggestions.allB0SocSuggestions);
    } else {
      setAutocompleteOptions([]); // Clear options if no valid milestone is selected
    }
  };

  return (
    <div>
      {/* Milestone Selection */}
      <FormControl sx={{ minWidth: 150 }}>
        <Select
          value={milestone}
          onChange={handleMilestoneChange}
          displayEmpty
        >
          <MenuItem value="" disabled>
            Select Milestone
          </MenuItem>
          <MenuItem value="A0">A0</MenuItem>
          <MenuItem value="B0">B0</MenuItem>
        </Select>
      </FormControl>

      {/* Autocomplete Field */}
      <div className="soc-tag-option">
        <Autocomplete
          disabled={!milestone} // Disable until a milestone is selected
          options={autocompleteOptions}
          getOptionLabel={(option) => option?.name || ""}
          onChange={(event, value) => {
            if (!value) {
              handleDerivedFromChange({ target: { value: "" } });
            } else {
              searchSiDieId(value);
            }
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Search SOC"
              onChange={handleDerivedFromChange}
            />
          )}
        />
      </div>
    </div>
  );
};

export default MilestoneSelection;