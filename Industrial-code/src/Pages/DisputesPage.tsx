import React, { useEffect, useState } from "react";
import style from '../styles/UserPage.module.css';
import PropertyCard from "./PropertyCard";
import { deleteDispute, getAllDispute } from "../services/Api/Dispute";
import { Delete, Visibility } from "@mui/icons-material";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';

export function DisputesPage() {
    const [data, setData] = useState<any>([]);
    const [selectedDispute, setSelectedDispute] = useState<any>(null);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getAllDispute();
                if (response.success) {
                    setData(response.data);
                } else {
                    setData([]);
                }
            } catch (err) {
                alert(err);
            }
        };
        fetchData();
    }, []);

    const handleDeleteDispute = async (item: any) => {
        try {
            const response = await deleteDispute(item.id);
            if (response.success) {
                alert("Deleted Successfully");
                // Re-fetch data to reflect changes
                const updatedData = data.filter((dispute: any) => dispute.id !== item.id);
                setData(updatedData);
            } else {
                alert("Something went wrong");
            }
        } catch (error) {
            alert(error);
        }
    };

    const handleOpenDialog = (item: any) => {
        setSelectedDispute(item);
        setOpen(true);
    };

    const handleCloseDialog = () => {
        setOpen(false);
        setSelectedDispute(null);
    };

    return (
        <div>
            <div className={style.outercontainer}>
                <div className={style.innercontainer}>
                    <h3><b>DISPUTES LIST</b></h3>

                    <div>
                        {data && data.length > 0 && (
                            <table>
                                <thead>
                                    <tr className={style.heading}>
                                        <th className={style.item}>Name</th>
                                        <th className={style.item}>Mobile Number</th>
                                        <th className={style.item}>Email</th>
                                        <th className={style.item}>Problem Title</th>
                                        <th className={style.item}>Problem Description</th>
                                        <th className={style.item}>Delete</th>
                                        <th className={style.item}>View</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.map((item: any) => (
                                        <tr className={style.useritem} key={item.id}>
                                            <td className={style.item}>{item.name}</td>
                                            <td className={style.item}>{item.mobile_number}</td>
                                            <td className={style.item}>{item.email}</td>
                                            <td className={style.item}>{item.problem_title}</td>
                                            <td className={style.item}>{item.problem_discription}</td>
                                            <td className={style.item} onClick={() => handleDeleteDispute(item)}>
                                                <Delete />
                                            </td>
                                            <td className={style.item} onClick={() => handleOpenDialog(item)}>
                                                <Visibility />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </div>

            <Dialog open={open} onClose={handleCloseDialog}>
                <DialogTitle>Dispute Details</DialogTitle>
                <DialogContent>
                    {selectedDispute && (
                        <div>
                            <p><strong>Name:</strong> {selectedDispute.name}</p>
                            <p><strong>Mobile Number:</strong> {selectedDispute.mobile_number}</p>
                            <p><strong>Email:</strong> {selectedDispute.email}</p>
                            <p><strong>Problem Title:</strong> {selectedDispute.problem_title}</p>
                            <p><strong>Problem Description:</strong> {selectedDispute.problem_discription}</p>
                        </div>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="primary">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default DisputesPage;
