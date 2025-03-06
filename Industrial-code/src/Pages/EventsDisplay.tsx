import React, { useEffect, useState } from "react";
import style from '../styles/EventsDisplay.module.css'
import PropertyCard from "./PropertyCard";
import { deleteEvent, getEvents } from "../services/Api/Event";
import { Delete } from '@mui/icons-material';
import { Button } from '@mui/material';

export function EventsDisplay() {

    const [data, setData] = useState([])
    const getData = async () => {
        try {
            const response = await getEvents();
            if (response.success) {
                if (response.data.event) {
                    setData(response.data.event)
                }
            }
        }
        catch (err) {
            console.log("Error occurred")
        }

    }

    useEffect(() => {
        getData();
    }, [])



    const handleDeleteEvent = async (item: any) => {
        if (window.confirm(`Do you want to delete event ${item.title}?`)) {

            try {
                const response = await deleteEvent(item.id);
                if (response.success) {
                    alert('Event Deleted Successfully');
                    getData()

                } else {
                    alert('Error occurred');
                }
            } catch (err) {
                alert('Error occurred');
            }
        } else {
            console.log('User cancelled!');
        }
    }

    return (
        <>
            <div className={style.outercontainer}>
                <div className={style.innercontainer}>


                    <div>
                        {data && data.length > 0 && (
                            <table>
                                <thead>
                                    <tr className={style.heading}>
                                        <th className={style.item}>S.No</th>
                                        <th className={style.item}>Title</th>
                                        <th className={style.item}>Description</th>
                                        <th className={style.item}>Action</th>

                                    </tr>
                                </thead>
                                <tbody>
                                    {data.map((item: any, index) => (
                                        <tr className={style.useritem} key={item.id}>
                                            <td className={style.item}>{index + 1}</td>
                                            <td className={style.item}>{item.title}</td>
                                            <td className={style.item}>{item.description}</td>

                                            <td className={style.item} onClick={() => handleDeleteEvent(item)}>
                                                <Delete />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </div>

        </>
    )
}

export default EventsDisplay;