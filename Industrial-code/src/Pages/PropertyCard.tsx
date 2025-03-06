
import React, { useState } from "react"
import ImageSource from '../assetts/logo.png'
import { Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import style from '../styles/PropertyCard.module.css'
import { LocationOn, Landscape, Visibility } from "@mui/icons-material"
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import { useNavigate } from "react-router-dom"

import { Button } from "@mui/material"
import Edit from "@mui/icons-material/Edit"
import { Delete } from "@mui/icons-material"
import { approveProperty, deleteProperty } from "../services/Api/Property"
import { NavItem } from "react-bootstrap"
import AlertDialog from "../Components/MaterialDialogBox";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

interface Property {
    id: number;
    village: string;
    mandal: string;
    price: string;
    size?: string;
    views?: number;
    logo?: string[];
    Tag?: string;
}

interface CardProps {
    // property_obj: any,
    property_obj: Property;
    showButtons?: boolean;
    showApprove?: boolean;
}
const PropertyCard: React.FC<CardProps> = ({ property_obj, showButtons, showApprove }) => {
    const navigate = useNavigate()
    const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

    const handleDelete = async () => {
        const userItem = localStorage.getItem('user')
        let user;
        if (userItem) {
            user = JSON.parse(userItem)
        }
        try {
            const response = await deleteProperty(user.id, property_obj.id)
            alert("Deleted Successfully")

        } catch (err) {
            alert("Failed Deletion")
        }
    }
    const handleNavigate = () => {
        // const userItem = localStorage.getItem('user')
        // if (userItem) {
        navigate(`/viewproperty/${property_obj.id}`)
        // }
        // else {
        //     // alert(
        //     //     "Please Register to see further Details"
        //     // )
        //     setIsDialogOpen(true);
        // }

    }
    const handleCloseDialog = () => {
        setIsDialogOpen(false);
    };
    const handleApprove = async (type: number) => {
        try {
            let prop_status;
            if (type == 0) {
                prop_status = "REJECTED"
            }
            else {
                prop_status = "APPROVED"
            }
            const payload = {
                reviewed_by: prop_status
            }
            const response = await approveProperty(property_obj.id, payload)
            if (response.success) {
                alert("Property Successfully Approved")
            }
            else {
                alert(response.msg)
            }

        } catch (error) {
            alert("Error occured")
        }
    }

    return (
        <>
            <div className={style.maincontainer}>
                {/* <div className={style.imagesection} onClick={() => handleNavigate()}>
                    <img src={style.logo} />
                    {property_obj.Tag && <p className={style.tag}>{property_obj.Tag}</p>}
                </div> */}
                <div className={style.imagesection} onClick={() => handleNavigate()}>
                    <Swiper
                        navigation
                        pagination={{ clickable: true }}
                        modules={[Navigation, Pagination]}
                        className={style.slider}
                    >

                        {property_obj.logo && property_obj.logo.length > 0 ? (
                            property_obj.logo.map((image, index) => (
                                <SwiperSlide key={index}>
                                    <img src={image} alt={`Property ${index + 1}`} className={style.image} />

                                    {property_obj.Tag && <p className={style.tag} >{property_obj.Tag}</p>}
                                </SwiperSlide>

                            ))
                        ) : (
                            <SwiperSlide>
                                <img src="/placeholder-image.png" alt="Placeholder" className={style.image} />
                            </SwiperSlide>
                        )}
                    </Swiper>

                </div>
                <div className={style.detailscontainer}>
                    <div className={style.container}>
                        <div className={style.address}><LocationOn />{property_obj.village}, {property_obj.mandal}</div>
                        <div className={style.price}><CurrencyRupeeIcon /> {property_obj.price}</div>
                    </div>
                    <div className={style.container}>
                        <div className={style.areasize}><Landscape className={style.landscape} />{property_obj.size}</div>
                        <div className={style.address}><Visibility />{property_obj.views}</div>
                    </div>
                    {
                        showButtons && (
                            <div className={style.buttonscontainer}>
                                <div><Edit /></div>
                                <div onClick={handleDelete}><Delete /></div>
                            </div>
                        )
                    }
                    {
                        showApprove && (
                            <div className={style.buttonscontainer}>
                                <Button variant="contained" style={{ background: 'black' }} onClick={() => handleApprove(1)}>Approve</Button>
                                <Button variant="contained" style={{ background: 'black' }} onClick={() => handleApprove(0)}>Reject</Button>

                            </div>
                        )
                    }
                </div>
                <AlertDialog
                    open={isDialogOpen}
                    onClose={handleCloseDialog}
                    message="Please Register/Login to see further Details"
                />

            </div>
            <div>

            </div>
        </>


    )
}
export default PropertyCard;