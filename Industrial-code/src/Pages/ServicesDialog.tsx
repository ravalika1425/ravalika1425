import React, { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import IconButton from "@mui/material/IconButton";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import CloseIcon from "@mui/icons-material/Close";
import MonitorIcon from "@mui/icons-material/Monitor";
import HandymanIcon from "@mui/icons-material/Handyman";
import GavelIcon from "@mui/icons-material/Gavel";
import { List, ListItem, ListItemIcon, ListItemText, Divider } from "@mui/material";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import FormDialog from "./FormDialog";
import { AppBar, useMediaQuery, Typography} from "@mui/material";
interface ServicesDialogProps {
    open: boolean;
    onClose: () => void;
}

const ServicesDialog: React.FC<ServicesDialogProps> = ({ open, onClose }) => {
    const [secondDialogOpen, setSecondDialogOpen] = useState(false);
    const [thirdDialogOpen, setThirdDialogOpen] = useState(false);
    const [selectedService, setSelectedService] = useState("");
    const isMobile = useMediaQuery("(max-width: 768px)");
    const handleSecondDialogOpen = (service: string) => {
        setSelectedService(service); // Set the service dynamically
        setSecondDialogOpen(true);
    };

    const handleSecondDialogClose = () => {
        setSecondDialogOpen(false);
    };

    const handleThirdDialogOpen = () => {
        setSecondDialogOpen(false);
        setThirdDialogOpen(true);
    };

    const handleThirdDialogClose = () => {
        setThirdDialogOpen(false);
    };

    return (
        <React.Fragment>
            {/* First Dialog */}
            <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
                <DialogTitle
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        height:'50px',
                        alignItems: "center",
                        backgroundColor: "#373636",
                        borderBottom: "2px solid #fdd835",
                        fontWeight: "bold",
                        color: "#ffffff",
                        width: isMobile? "100%":"100%",
                        fontSize: isMobile? "15px":''
                    }}
                >
                    Services By Gruha Samachar
                    <IconButton onClick={onClose}>
                        <CloseIcon  style={{color:'#ffffff', fontSize:'20px'}}/>
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    <List>
                        <Divider />
                        <ListItem button onClick={() => handleSecondDialogOpen("Monitoring Lands or Properties")}>
                            <ListItemIcon>
                                <MonitorIcon />
                            </ListItemIcon>
                            <ListItemText primary="Lands or Properties Monitoring" />
                            <ArrowForwardIosIcon />
                        </ListItem>
                        <Divider />
                        <ListItem button onClick={() => handleSecondDialogOpen("Disputes Properties Services")}>
                            <ListItemIcon>
                                <GavelIcon />
                            </ListItemIcon>
                            <ListItemText primary="Disputes Properties Services" />
                            <ArrowForwardIosIcon />
                        </ListItem>
                    </List>
                </DialogContent>
            </Dialog>

            {/* Second Dialog */}
            <Dialog open={secondDialogOpen} onClose={handleSecondDialogClose} fullWidth maxWidth="sm">
                <DialogTitle
                    style={{
                        display: "flex",
                        border: "0.5px solid white",
                        borderRadius:'5px',
                        justifyContent: "space-between",
                        height:'50px',
                        alignItems: "center",
                        backgroundColor: "#373636",
                        borderBottom: "2px solid #fdd835",
                        fontWeight: "bold",
                        color: "#ffffff",
                        fontSize: isMobile? "15px":''                        
                    }}
                >
                    {selectedService}
                    <IconButton onClick={handleSecondDialogClose}>
                        <CloseIcon style={{color:'#ffffff', fontSize:'20px'}}/>
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    <p style={{paddingTop:"15px"}}>
                        {selectedService === "Monitoring Lands or Properties"
                            ? "Lands monitoring involves tracking and supervising properties to ensure their legal and functional compliance. Based on your property, we will charge a monthly fee, or alternatively, we can charge based on your specific request. Would you like to proceed?"
                            : "Dispute property services involve resolving conflicts related to ownership or property disputes. Based on your property, we offer a monthly fee structure, or alternatively, we can charge based on your specific request. Would you like to proceed?"}
                    </p>
                </DialogContent>
                <div
          style={{
            position: 'absolute',
            top: '80%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            fontSize: '20px',
            color: '#85807f',
            opacity: 0.2,
            pointerEvents: 'none',
            zIndex: 0,
            whiteSpace: 'nowrap'
          }}
        >
          gruhasamchar.com
        </div>
                <DialogActions>
                    <Button onClick={handleSecondDialogClose} color="warning" style={{width:'30px', fontSize:'12px'}}>
                        Cancel
                    </Button>
                    <Button onClick={handleThirdDialogOpen}  variant="contained" style={{width:'30px', fontSize:'12px', background:'#373636'}}>
                        Proceed
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Third Dialog */}
            <FormDialog open={thirdDialogOpen} onClose={handleThirdDialogClose} />
        </React.Fragment>
    );
};

export default ServicesDialog;
