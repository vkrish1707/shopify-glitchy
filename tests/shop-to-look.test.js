import React, { useState, useEffect } from "react";
import { Modal, Box, Typography, FormControlLabel, Switch, Button } from "@mui/material";

const SocModal = ({ isOpen, onClose, cellData, cellValue }) => {
  const [stateOneEnabled, setStateOneEnabled] = useState(false); // State 1
  const [stateTwoEnabled, setStateTwoEnabled] = useState(false); // State 2
  const [socStatus, setSocStatus] = useState(false); // Switch status
  const [socDisplayText, setSocDisplayText] = useState(""); // SoC text
  const [sidDisplayText, setSidDisplayText] = useState(""); // SIDID text

  // Update display text whenever states or data change
  useEffect(() => {
    if (stateOneEnabled) {
      setSocDisplayText("Please select an SIDID");
      setSidDisplayText("Please make a selection");
    } else if (stateTwoEnabled) {
      setSocDisplayText("State Two Value"); // Replace with actual logic
      setSidDisplayText("State Two SIDID Value"); // Replace with actual logic
    } else {
      setSocDisplayText(cellData?.soc || "SoC Name");
      setSidDisplayText(cellValue?.siDieId || "SIDID");
    }
  }, [stateOneEnabled, stateTwoEnabled, cellData, cellValue]);

  // Handle Switch Change
  const handleSwitchChange = () => {
    if (!stateOneEnabled && !stateTwoEnabled) {
      setSocStatus(!socStatus); // Toggle only if states are not enabled
    }
  };

  return (
    <Modal open={isOpen} onClose={onClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
      <Box className="owner-modal-box">
        <div className="modal-heading">
          {/* Display SoC Name */}
          <Typography id="modal-modal-title" variant="h6" component="h2">
            <strong>{socDisplayText}</strong>
          </Typography>
        </div>
        
        {/* Form Control for Switch */}
        <FormControlLabel
          label={socStatus ? "Hide SoC" : "Show SoC"}
          labelPlacement="start"
          control={
            <Switch
              checked={socStatus}
              onChange={handleSwitchChange}
              disabled={stateOneEnabled || stateTwoEnabled} // Disable if any state is enabled
            />
          }
        />

        {/* Display SIDID */}
        <Box sx={{ mt: 2 }}>
          {cellValue.isDataFromAgile ? (
            <div>
              <h4>ID: {sidDisplayText}</h4>
              <div className="add-soc">
                <Button variant="contained" onClick={() => console.log("Action Here")}>
                  Perform Action
                </Button>
              </div>
            </div>
          ) : null}
        </Box>
      </Box>
    </Modal>
  );
};

export default SocModal;