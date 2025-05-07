import React, { useState, useEffect } from 'react';
import { Select, MenuItem, IconButton, TextField, Box, Button } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckIcon from '@mui/icons-material/Check';
import AddIcon from '@mui/icons-material/Add';

const SourceListUpdater = ({ rowData, setRowData, gridApi, updateBackend }) => {
    const [sourceList, setSourceList] = useState(['Java', 'Python', 'JavaScript']);
    const [editingIndex, setEditingIndex] = useState(null);
    const [editedValue, setEditedValue] = useState('');
    const [newSource, setNewSource] = useState('');
    const [selectedSource, setSelectedSource] = useState('');

    const handleSelectChange = (e) => {
        setSelectedSource(e.target.value);
    };

    const handleEdit = (index, value) => {
        setEditingIndex(index);
        setEditedValue(value);
    };

    const handleSaveEdit = (index) => {
        const updated = [...sourceList];
        updated[index] = editedValue;
        setSourceList(updated);
        setEditingIndex(null);
        updateBackend('edit', updated[index]);
    };

    const handleDelete = (index) => {
        const updated = sourceList.filter((_, i) => i !== index);
        setSourceList(updated);
        updateBackend('delete', sourceList[index]);
    };

    const handleAdd = () => {
        if (newSource.trim()) {
            const updated = [...sourceList, newSource];
            setSourceList(updated);
            setNewSource('');
            updateBackend('add', newSource);
        }
    };

    const handleApplyToAllRows = () => {
        const visibleNodes = [];
        gridApi.forEachNodeAfterFilterAndSort((node) => {
            visibleNodes.push(node);
        });

        const updatedRows = rowData.map(row => {
            const isVisible = visibleNodes.some(node => node.data === row);
            if (isVisible) {
                return { ...row, SOURCE_LIST: selectedSource };
            }
            return row;
        });

        setRowData(updatedRows);
        updateBackend('bulkUpdate', selectedSource, visibleNodes.map(node => node.data));
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Select value={selectedSource} onChange={handleSelectChange} size="small">
                {sourceList.map((source, index) => (
                    <MenuItem key={index} value={source}>
                        {editingIndex === index ? (
                            <>
                                <TextField
                                    value={editedValue}
                                    onChange={(e) => setEditedValue(e.target.value)}
                                    size="small"
                                    autoFocus
                                    sx={{ width: '100px', marginRight: 1 }}
                                />
                                <IconButton size="small" onClick={() => handleSaveEdit(index)}>
                                    <CheckIcon fontSize="small" />
                                </IconButton>
                            </>
                        ) : (
                            <>
                                {source}
                                <IconButton size="small" onClick={() => handleEdit(index, source)}>
                                    <EditIcon fontSize="small" />
                                </IconButton>
                                <IconButton size="small" onClick={() => handleDelete(index)}>
                                    <DeleteIcon fontSize="small" />
                                </IconButton>
                            </>
                        )}
                    </MenuItem>
                ))}
            </Select>

            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <TextField
                    label="New Source"
                    value={newSource}
                    onChange={(e) => setNewSource(e.target.value)}
                    size="small"
                    sx={{ marginRight: 1 }}
                />
                <IconButton size="small" onClick={handleAdd}>
                    <AddIcon fontSize="small" />
                </IconButton>
            </Box>

            <Button
                variant="contained"
                onClick={handleApplyToAllRows}
                disabled={!selectedSource}
                sx={{ alignSelf: 'flex-start', marginTop: 1 }}
            >
                Set Source List to Visible Rows
            </Button>
        </Box>
    );
};

export default SourceListUpdater;
