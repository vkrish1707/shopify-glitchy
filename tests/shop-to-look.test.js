import React, { useState, useEffect } from 'react';
import { Select, MenuItem } from '@mui/material';

const DropdownEditor = (props) => {
    const [value, setValue] = useState(props.value || '');
    const options = props.options || [];
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        // AG Grid sets editing when the component mounts if it's in edit mode
        setIsEditing(true);
        setValue(props.value || '');
    }, []);

    const handleChange = (e) => {
        const newVal = e.target.value;
        setValue(newVal);
        props.api.stopEditing(); // required
    };

    // Required by AG Grid to return value after editing
    const getValue = () => value;

    return isEditing ? (
        <Select
            value={value}
            onChange={handleChange}
            autoFocus
            size="small"
            fullWidth
        >
            {options.map((opt) => (
                <MenuItem key={opt} value={opt}>
                    {opt}
                </MenuItem>
            ))}
        </Select>
    ) : (
        <span>{value || 'Select'}</span>
    );
};

export default DropdownEditor;