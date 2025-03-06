import React, { useState } from 'react';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from '@mui/material';
import { useNavigate } from "react-router-dom"

interface AlertDialogProps {
    open: boolean;
    onClose: () => void;
    message: string;
}

const AlertDialog: React.FC<AlertDialogProps> = ({ open, onClose, message }) => {
    const navigate = useNavigate();

    const handleRegister = () => {
        onClose();
        navigate('/Register');
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Alert</DialogTitle>
            <DialogContent>
                <DialogContentText>{message}</DialogContentText>
            </DialogContent>
            <DialogActions>

                <Button onClick={handleRegister} color="primary">
                    Register
                </Button>
                <Button onClick={onClose} color="primary">
                    Cancel
                </Button>

            </DialogActions>
        </Dialog>
    );
};

export default AlertDialog;