import React, { useState, useEffect } from 'react';
import { Select, MenuItem } from '@mui/material';

const SkillEditor = (props) => {
    const [val, setVal] = useState(props.value || '');
    const employeeId = props.data.EMPLOYEE_ID;

    const options = ['Java', 'Python', 'Go']; // Or dynamic

    const handleChange = (e) => {
        const newValue = e.target.value;
        setVal(newValue);

        // Call your main updateRowData function
        if (props.context && typeof props.context.updateRowData === 'function') {
            props.context.updateRowData('SKILL_SET', newValue, employeeId);
        }

        props.stopEditing(); // Exit edit mode
    };

    return (
        <Select
            value={val}
            onChange={handleChange}
            autoFocus
            fullWidth
            size="small"
        >
            {options.map((opt) => (
                <MenuItem key={opt} value={opt}>
                    {opt}
                </MenuItem>
            ))}
        </Select>
    );
};

export default SkillEditor;