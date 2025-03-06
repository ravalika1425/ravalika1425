import React, { useState } from 'react';
import registrationGif from '../assetts/registration.gif'; 
import styled from "../styles/registration.module.css";
import { Button, MenuItem, TextField, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { useNavigate } from "react-router-dom";
import Snackbar from '@mui/material/Snackbar';
import { AppBar, useMediaQuery, Typography} from "@mui/material";
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { createUser, deleteUser, sendOtp, validateOtp } from '../services/Api/Users';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import OTPInput from './OTPInput';

export function Registration() {
    const navigate = useNavigate();
    const [role, setRole] = useState(1);
    const [name, setName] = useState('');
    const [mobile, setMobile] = useState('');
    const [email, setEmail] = useState('');
    const [companyName, setCompanyName] = useState('');
    const [companyURL, setCompanyURL] = useState('');
    const [password, setPassword] = useState('');
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarContent, setSnackbarContent] = useState('');
    const roles = ['USER'];
    const [profile, setProfile] = useState<string | null>(null);
    const [fileName, setFileName] = useState('');
    const [isUserVerfied, setUserVerfied] = useState(false);
    const [open, setOpen] = React.useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const isMobile = useMediaQuery("(max-width: 768px)");
    const handleDialogClose = () => {
        setDialogOpen(false);
    };

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleBack = () => {
        navigate('/');
    };

    const [otp, setOtp] = useState<string>('');

    const handleOtpChange = (value: string) => {
        setOtp(value);
    };

    const disableCheck = () => {
        if (role === 1) {
            if (name === '' || mobile === '' || email === '' || companyName === '' || companyURL === '' || password === '') {
                return true;
            }
        } else {
            if (name === '' || mobile === '' || email === '' || password === '') {
                return true;
            }
        }
        return false;
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files && e.target.files[0];

        if (file) {
            setFileName(file.name);
            const reader = new FileReader();
            reader.onloadend = () => {
                if (typeof reader.result === 'string') {
                    setProfile(reader.result);
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async () => {
        try {
            const response = await sendOtp({ email: email, service: "register" });
            handleClickOpen();
        } catch (err) {
            console.log(err);
        }
    };

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    const handleOTPSubmit = async () => {
        alert(`Entered OTP: ${otp}`);
        handleClose();
        try {
            const response = await validateOtp({ otp: otp, service: "register", email: email });

            if (response.success) {
                setSnackbarContent("OTP has been verified successfully!!!");
                setSnackbarOpen(true);

                try {
                    const payload = {
                        name: name,
                        mobile_number: mobile,
                        email: email,
                        password: password,
                        company_name: companyName,
                        company_portal: companyURL,
                        role: "USER",
                        profile_picture: profile
                    };
                    console.log(payload);
                    const response = await createUser(payload);
                    if (response.success) {
                        setName('');
                        setMobile('');
                        setCompanyName('');
                        setCompanyURL('');
                        setEmail('');
                        setPassword('');
                        setDialogOpen(true);
                    } else {
                        setSnackbarContent("Failed to register user. Please try again.");
                        setSnackbarOpen(true);
                    }
                } catch (error) {
                    console.log(error);
                    setSnackbarContent("Error Occurred");
                    setSnackbarOpen(true);
                }
            }
        } catch (error: any) {
            setSnackbarContent(error.response.data.msg);
            setSnackbarOpen(true);
        }
    };

    return (
        <>
           
            <div style={{display:'flex' ,justifyContent:'center', alignItems:'center', marginTop:'100px', marginRight:isMobile ?'0px':"150px"}}>
            <div style={{ width: isMobile ? "50%" : "100%", backgroundColor: 'white', color: 'black', display: "flex", 
      justifyContent: "center",
      alignItems: "center",
     
      }}>
      
        <img src={registrationGif} alt="register" style={{ width: isMobile ? '0%' : "60%", height: 'auto', background:"blue"}} />
        {/* <div> */}
        <div style={{  width:'120%', position:'relative' }}>
            <h2 style={{ textAlign: 'center', color: 'white', fontWeight: 'bold', fontSize:'20px', backgroundColor:'#373636', borderRadius:'5px', height:'40px', paddingTop:'8px' }}>REGISTRATION FORM</h2>
            <ToggleButtonGroup
                value={role}
                exclusive
                aria-label="Platform"
                fullWidth
                style={{ marginBottom: '1rem', backgroundColor: 'white', color: 'black' }}
            >
            </ToggleButtonGroup>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                <TextField
                    id="outlined-basic"
                    label="Full Name"
                    variant="outlined"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    fullWidth
                    required
                    style={{ flex: 1 }}
                />
            </div>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                <TextField
                    id="outlined-basic"
                    label="Mobile Number"
                    variant="outlined"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    fullWidth
                    required
                    style={{ flex: 1 }}
                />
                <TextField
                    id="outlined-basic"
                    label="Email"
                    variant="outlined"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    fullWidth
                    style={{ flex: 1 }}
                />
            </div>
            {(role === 1 || role === 3 || role === 4) && (
                <div>
                    <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                        <TextField
                            id="outlined-basic"
                            label="Company Name"
                            variant="outlined"
                            value={companyName}
                            onChange={(e) => setCompanyName(e.target.value)}
                            fullWidth
                            required
                            style={{ flex: 1 }}
                        />
                        <TextField
                            id="outlined-basic"
                            label="Company URL"
                            variant="outlined"
                            value={companyURL}
                            onChange={(e) => setCompanyURL(e.target.value)}
                            fullWidth
                            style={{ flex: 1 }}
                        />
                    </div>
                </div>
            )}
            <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                <TextField
                    id="outlined-basic"
                    label="Password"
                    required
                    variant="outlined"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    type='password'
                    fullWidth
                    style={{ flex: 1 }}
                />
            </div>
            <div style={{ marginBottom: '10px' }}>
                <input type="file" accept="image/*" onChange={handleImageChange} />
            </div>
            <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', marginTop:'20px', }}>
                {/* <button onClick={handleBack}
                 style={{ border: '1px solid black', backgroundColor: 'white', color: 'black', width:'100px', height:'30px' }}
                 >Back</button> */}
                  <button 
  onClick={handleBack} 
  style={{ 
    border: '1px solid #6c757d', 
    backgroundColor: '#ffffff', 
    color: '#6c757d', 
    width: '100px', 
    height: '30px',
    borderRadius: '5px',
    cursor: 'pointer',
    transition: 'all 0.3s ease-in-out'
  }}
  onMouseOver={(e) => { 
    const btn = e.currentTarget as HTMLButtonElement;
    btn.style.backgroundColor = '#6c757d'; // Dark gray background
    btn.style.color = 'white'; // White text
  }}
  onMouseOut={(e) => { 
    const btn = e.currentTarget as HTMLButtonElement;
    btn.style.backgroundColor = '#ffffff'; // Back to white background
    btn.style.color = '#6c757d'; // Gray text
  }}
>
  Back
</button>

                <button className={disableCheck() ? 'disablebtn' : 'submitbtn'} 
                onClick={handleSubmit} 
                style={{ border: '1px solid black', backgroundColor: disableCheck() ? 'gray' : 'black', color: 'white', width:'100px', height:'30px', borderRadius: '5px', }}
        
                onMouseOver={(e) => { 
                    const btn = e.currentTarget as HTMLButtonElement;
                    btn.style.backgroundColor = 'blue'; // Dark gray background
                    btn.style.color = 'white'; // White text
                  }}
                  onMouseOut={(e) => { 
                    const btn = e.currentTarget as HTMLButtonElement;
                    btn.style.backgroundColor = '#373636'; // Back to white background
                    btn.style.color = '#fff'; // Gray text
                  }}>Submit</button>
           

        </div>
       
    </div>
    </div>


</div>

            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                message={snackbarContent}
                onClose={handleSnackbarClose}
            />
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {"Enter the OTP"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        <p>OTP has been sent to your email please verify it expires in 10 minutes</p>
                        <OTPInput length={6} onChange={handleOtpChange} />
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleOTPSubmit} autoFocus variant="contained" style={{ backgroundColor: 'black' }}>
                        SUBMIT
                    </Button>
                </DialogActions>
            </Dialog>
            <Dialog open={dialogOpen} onClose={handleDialogClose}>
                <DialogTitle
                    style={{
                        textAlign: "center",
                        fontWeight: "bold",
                        fontSize: "1.5rem",
                        color: "#4caf50",
                    }}
                >
                    Registration Successful
                </DialogTitle>
                <DialogContent
                    style={{
                        textAlign: "center",
                        padding: "20px",
                    }}
                >
                    <p style={{ fontSize: "1.2rem", color: "#555", marginBottom: "20px" }}>
                        You have successfully registered! Please log in to access your account.
                    </p>
                </DialogContent>
                <DialogActions
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        gap: "15px",
                        paddingBottom: "20px",
                    }}
                >
                    <Button
                        color="primary"
                        variant="contained"
                        style={{
                            fontWeight: "bold",
                            padding: "10px 20px",
                            textTransform: "uppercase",
                            backgroundColor: "#007bff",
                        }}
                    >
                        Login
                    </Button>
                    <Button
                        onClick={handleDialogClose}
                        color="primary"
                        variant="contained"
                        style={{
                            fontWeight: "bold",
                            padding: "10px 20px",
                            textTransform: "uppercase",
                            borderColor: "#007bff",
                            color: "#007bff",
                        }}
                    >
                        OK
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
