import React, { useState } from 'react';
import { Tabs, Tab, Typography, Box } from '@mui/material';
import '../styles/Tabs.module.css';

interface TabData {
    label: string;
    value: string;
}

interface TabsComponentProps {
    tabs: TabData[];
    onTabChange: (value: string) => void;
    activeTab: string;
    content: JSX.Element;
}

const StyledTabs: React.FC<TabsComponentProps> = ({ tabs, onTabChange, activeTab, content }) => {
    const handleChange = (event: React.SyntheticEvent, newValue: string) => {
        onTabChange(newValue);
    };

    return (
        <Box sx={{ width: "100%", mt: 2 }}>
            <Tabs
                value={activeTab}
                onChange={handleChange}
                selectionFollowsFocus
                TabIndicatorProps={{ style: { backgroundColor: "#333", display: "flex" } }}
                className="right-aligned-tabs"
                style={{ backgroundColor: "#ffffff" }}
            >
                {tabs.map((tab) => (
                    <Tab key={tab.value} label={tab.label} value={tab.value} className="tab-label" />
                ))}
            </Tabs>
            <Box className="tab-content">
                {content}
            </Box>
        </Box>
    );
};

export default StyledTabs;
