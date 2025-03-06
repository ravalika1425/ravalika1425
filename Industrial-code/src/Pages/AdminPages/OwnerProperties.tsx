import styles from '../../styles/OwnerProperty.module.css';
import { getusertypeproperties } from '../../services/Api/Property';
import PropertyCard from '../PropertyCard';
import StyledTabs from '../../Components/Tabs';
import { useState, useEffect, useMemo } from "react";
import { Box, Button, Typography } from "@mui/material";
import { useNavigate } from 'react-router-dom';
import { Close } from '@mui/icons-material';

interface TabData {
    label: string;
    value: string;
}

const OwnerProperties = () => {
    const [data, setData] = useState<{ [key: string]: any[] }>({
        ALL: [],
        APPROVED: [],
        PENDING: [],
        REJECTED: []
    });
    const [activeTab, setActiveTab] = useState<string>("ALL");
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate()

    const fetchProperties = async (status: string) => {
        setLoading(true);
        setError(null);
        try {
            const userItem = localStorage.getItem("user");
            if (!userItem) {
                throw new Error("User not found in localStorage");
            }

            const user = JSON.parse(userItem);
            if (!user?.id) {
                throw new Error("Invalid user data in localStorage");
            }

            const response = await getusertypeproperties(status, user.id);
            if (response?.success && response?.data) {
                const filteredData = response.data;
                console.log("filter data", filteredData)
                setData((prevData) => ({
                    ...prevData,
                    [status]: filteredData,
                }));

            }
            else {
                setData((prevData) => ({
                    ...prevData,
                    [status]: [],
                }));
            }
            // else {
            //     throw new Error("Failed to fetch properties. Invalid API response.");
            // }
        } catch (err) {
            setError((err as Error).message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProperties(activeTab);
    }, [activeTab]);

    const getTabContent = (status: string, inputdata: any[] = []) => {

        if (!inputdata || inputdata.length === 0) {
            return <Typography style={{ textAlign: "center", marginTop: "50px", color: "red" }}>No {status.toLowerCase()} properties yet.</Typography>;
        }


        return (
            <div className={styles.propertyContainer}>
                {loading ? (
                    <Typography>Loading...</Typography>
                ) : (
                    inputdata.map((item: any, index: number) => (
                        <PropertyCard key={item.id || index} property_obj={item} showButtons={true} />
                    ))
                )}
            </div>
        );
    };

    const tabsData: TabData[] = [
        { label: "ALL Properties", value: "ALL" },
        { label: "Approved Properties", value: "APPROVED" },
        { label: "Pending Properties", value: "PENDING" },
        { label: "Rejected Properties", value: "REJECTED" }
    ];

    const handeleCancel = () => {
        const userItem = localStorage.getItem('user')

        if (userItem) {
            const user = JSON.parse(userItem);
            if (user.role === "ADMIN") {
                navigate('/adminhome')
            }
            else {
                navigate('/user-profile')
            }

        }

    }

    return (
        <div className={styles.mainContainer}>
            <Box display="flex" alignItems="center" justifyContent="space-between">
                <Typography variant="h4" component="h1" gutterBottom>
                    Property Dash board
                </Typography>
                <button type="button" color="error" style={{ border: "none", background: "transparent", cursor: "pointer" }} onClick={handeleCancel}>
                    <Close />
                </button>

            </Box>
            <StyledTabs
                tabs={tabsData}
                onTabChange={setActiveTab}
                activeTab={activeTab}
                content={getTabContent(activeTab, data[activeTab] || [])}
            />
            {error && <Typography color="error">{error}</Typography>}


        </div>
    );
};

export default OwnerProperties;
