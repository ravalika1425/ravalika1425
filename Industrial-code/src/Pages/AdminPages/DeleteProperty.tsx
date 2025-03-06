import React, { useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { useParams } from 'react-router-dom';
import { deleteProperty } from '../../services/Api/Property';

const DeleteProperty = () => {
    const { id } = useParams();
    const [open, setOpen] = useState(false);

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleDelete = (id: any) => {
        console.log("Delete : ",id)
        // deleteProperty(id);
        setOpen(false);
    };

    return (
        <div>
            <h1>Delete Property</h1>
            <Button variant="contained" color="primary" onClick={handleOpen}>
                Delete Property
            </Button>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Delete Property</DialogTitle>
                <DialogContent>
                    Are you sure you want to delete this property?
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleDelete} color="primary">
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default DeleteProperty;
