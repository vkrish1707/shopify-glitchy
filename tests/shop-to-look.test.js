import React, { useState } from 'react';
import { MenuItem, Select, Box, TextField, IconButton, Typography, Button, ListSubheader, InputBase } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import EditIcon from '@mui/icons-material/Edit';
import DoneIcon from '@mui/icons-material/Done';

const SourceListUpdater = ({ rowData, setRowData, gridApi, updateBackend }) => {
    const [sourceList, setSourceList] = useState(['Java', 'Python', 'JavaScript']);
    const [selectedSource, setSelectedSource] = useState('');
    const [editingItem, setEditingItem] = useState('');
    const [editedText, setEditedText] = useState('');
    const [newItem, setNewItem] = useState('');
    const [enableApply, setEnableApply] = useState(false);

    const handleAddNewItem = () => {
        const trimmed = newItem.trim();
        if (trimmed && !sourceList.includes(trimmed)) {
            const updatedList = [...sourceList, trimmed];
            setSourceList(updatedList);
            setSelectedSource(trimmed);
            updateBackend('add', trimmed);
            setNewItem('');
            setEnableApply(true);
        }
    };

    const handleDelete = (itemToDelete) => {
        const updated = sourceList.filter(item => item !== itemToDelete);
        setSourceList(updated);
        if (selectedSource === itemToDelete) {
            setSelectedSource('');
            setEnableApply(false);
        }
        updateBackend('delete', itemToDelete);
    };

    const handleEdit = (item) => {
        setEditingItem(item);
        setEditedText(item);
    };

    const handleEditConfirm = () => {
        const trimmed = editedText.trim();
        if (trimmed && !sourceList.includes(trimmed)) {
            const updated = sourceList.map(item => item === editingItem ? trimmed : item);
            setSourceList(updated);
            if (selectedSource === editingItem) {
                setSelectedSource(trimmed);
            }
            updateBackend('edit', { old: editingItem, new: trimmed });
        }
        setEditingItem('');
        setEditedText('');
    };

    const handleChange = (e) => {
        setSelectedSource(e.target.value);
        setEnableApply(true);
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
        setEnableApply(false);
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, width: 300 }}>
            <Select
                value={selectedSource}
                onChange={handleChange}
                displayEmpty
                size="small"
                renderValue={(value) => value || 'Select or Add Source'}
                MenuProps={{
                    PaperProps: {
                        style: { maxHeight: 300 },
                        onMouseDown: (e) => e.stopPropagation(),
                    }
                }}
            >
                {sourceList.map((item) => (
                    <MenuItem key={item} value={item}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                            {editingItem === item ? (
                                <InputBase
                                    value={editedText}
                                    onChange={(e) => setEditedText(e.target.value)}
                                    onClick={(e) => e.stopPropagation()}
                                    sx={{ borderBottom: '1px solid gray', fontSize: '14px', flexGrow: 1, mr: 1 }}
                                />
                            ) : (
                                <Typography>{item}</Typography>
                            )}
                            {editingItem === item ? (
                                <IconButton edge="end" size="small" onClick={(e) => { e.stopPropagation(); handleEditConfirm(); }}>
                                    <DoneIcon color="success" fontSize="small" />
                                </IconButton>
                            ) : (
                                <>
                                    <IconButton edge="end" size="small" onClick={(e) => { e.stopPropagation(); handleEdit(item); }}>
                                        <EditIcon fontSize="small" sx={{ color: 'gray' }} />
                                    </IconButton>
                                    <IconButton edge="end" size="small" onClick={(e) => { e.stopPropagation(); handleDelete(item); }}>
                                        <RemoveCircleOutlineIcon fontSize="small" sx={{ color: 'red' }} />
                                    </IconButton>
                                </>
                            )}
                        </Box>
                    </MenuItem>
                ))}

                <ListSubheader disableSticky>
                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', px: 1 }}>
                        <InputBase
                            value={newItem}
                            onChange={(e) => setNewItem(e.target.value)}
                            placeholder="Add new source"
                            sx={{ fontSize: '14px', borderBottom: '1px solid #ccc', flexGrow: 1 }}
                            onClick={(e) => e.stopPropagation()}
                        />
                        <IconButton size="small" onClick={(e) => { e.stopPropagation(); handleAddNewItem(); }}>
                            <AddCircleOutlineIcon color="primary" fontSize="small" />
                        </IconButton>
                    </Box>
                </ListSubheader>
            </Select>

            {enableApply && (
                <Button
                    variant="contained"
                    onClick={handleApplyToAllRows}
                    sx={{ alignSelf: 'flex-start' }}
                    size="small"
                >
                    Apply to Visible Rows
                </Button>
            )}
        </Box>
    );
};

export default SourceListUpdater;