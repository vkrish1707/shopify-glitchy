import React, { useState } from "react";
import { Modal, Box, Typography, FormControlLabel, Switch, Button } from "@mui/material";

const SocModal = ({ isOpen, onClose, cellData, cellValue }) => {
  const [stateOneEnabled, setStateOneEnabled] = useState(false); // State 1
  const [stateTwoEnabled, setStateTwoEnabled] = useState(false); // State 2
  const [socStatus, setSocStatus] = useState(false); // Switch status

  // Handle Switch Change
  const handleSwitchChange = () => {
    if (!stateOneEnabled && !stateTwoEnabled) {
      setSocStatus(!socStatus); // Toggle only if states are not enabled
    }
  };

  // Determine Displayed Text for SoC Name
  const socDisplayText =
    stateOneEnabled
      ? "Please select an SIDID"
      : stateTwoEnabled
      ? "State Two Value" // Replace this with actual state two value if needed
      : cellData?.soc || "SoC Name";

  // Determine Displayed Text for SIDID
  const sidDisplayText =
    stateOneEnabled
      ? "Please make a selection"
      : stateTwoEnabled
      ? "State Two SIDID Value" // Replace with actual state two SIDID value
      : cellValue?.siDieId || "SIDID";

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