import React, { useState, useEffect } from 'react';
import { faHome, faMapMarked, faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { AppRegistrationOutlined, AccountCircle, SettingsOverscanSharp, Visibility, VisibilityOff } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { Login } from '@mui/icons-material';
import { Logout } from '@mui/icons-material';
import { Close } from '@mui/icons-material';
import HomeIcon from '@mui/icons-material/Home';
import { RoomServiceSharp } from '@mui/icons-material';
import { Button, IconButton, InputAdornment, Snackbar, TextField } from '@mui/material';
import { forgotPassword, getUser, resetPassword, sendOtp, userLogin, validateOtp, getUserData } from './services/Api/Users';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import OTPInput from './Pages/OTPInput';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LocalPostOfficeIcon from '@mui/icons-material/LocalPostOffice';
import ServicesDialog from './Pages/ServicesDialog';
import logo from '../src/media/Logo-yellow.jpg';
import logo2 from '../src/media/Logo-latest-web.png';
import latest from '../src/media/Suman-cdr.png';
import latest3 from '../src/media/Suman-GM Logo.png';
import AboutUsModal from './AboutUsModal';
import { LandslideSharp } from '@mui/icons-material';
import { AppBar, useMediaQuery, Typography} from "@mui/material";
import Box from '@mui/material/Box';
import AdminProperties from './Pages/AdminProperties';
import Toolbar from '@mui/material/Toolbar';
import Container from '@mui/material/Container';
import style from '../src/styles/HomePage.module.css'
import errorImage from './assetts/coming-soon-img.png';

interface NavbarProps {
  title: string;
  links: { label: string; url: string; icon: JSX.Element }[];
}

const Navbar: React.FC<NavbarProps> = ({ title, links }) => {
  const navigate = useNavigate();
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const [otpLogin, setOtpLogin] = useState(false);
  const [open, setOpen] = useState(false);
  const [otp, setOtp] = useState<string>('');
  const [showToken, setShowToken] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarContent, setSnackbarContent] = useState('');
  const [currentUser, setCurrentUser] = useState('');
  const [isForgot, setIsForgot] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorDialogOpen, setErrorDialogOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [aboutUsOpen, setAboutUsOpen] = useState(true);
  const [token, setToken] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [showErrorPage, setShowErrorPage] = useState(false); 

  const handleCloseAboutUs = () => {
    setAboutUsOpen(false);
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = async () => {
    const payload = {
      email: email,
      password: password
    };

    try {
      const response = await userLogin(payload);
      if (response.success) {
        setSnackbarContent("Login Successful");
        setSnackbarOpen(true);
        closePopup();
        let user_response = await getUser(response.user_id);
        if (user_response.role === 'ADMIN') {
          navigate('/adminhome');
        }
        if (user_response.success) {
          if (user_response.data) {
            localStorage.setItem("user", JSON.stringify(user_response.data));
            setCurrentUser(user_response.data);
          }
        }
      } else {
        setShowErrorPage(true); 
      }
    } catch (error) {
      setShowErrorPage(true); 
    }
  };

  const handleOtpChange = (value: string) => {
    setOtp(value);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    setCurrentUser('');
    navigate('/home');
  };

  const handleOTPSubmit = async () => {
    try {
      const response = await sendOtp({ email });
      setSnackbarOpen(true);
      handleClickOpen();
      closePopup();
    } catch (err) {
      console.log("Error occurred");
      setShowErrorPage(true); 
    }
  };

  const handleOTPValidate = async () => {
    try {
      const response = await validateOtp({ otp: otp, email: email });
      if (response.success) {
        handleClose();
        setSnackbarContent("OTP validated successfully");
        setSnackbarOpen(true);
        const param = { email: email };
        const user_response = await getUserData(param);
        if (user_response.role === 'ADMIN') {
          navigate('/adminhome');
        }
        if (user_response.success) {
          if (user_response.data) {
            localStorage.setItem("user", JSON.stringify(user_response.data));
            setCurrentUser(user_response.data);
          }
        }
      } else {
        setErrorMessage("Invalid OTP. Please try again.");
        setErrorDialogOpen(true);
      }
    } catch (err) {
      setErrorMessage("Invalid OTP. Please try again.");
      setErrorDialogOpen(true);
      handleClose();
      setShowErrorPage(true); 
    }
  };

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user != null) {
      setCurrentUser(user);
    }
   
    if (!localStorage.getItem('aboutUsShown')) {
      setAboutUsOpen(true);
      localStorage.setItem('aboutUsShown', 'true');
    }
  }, []);

  const handleForgotPassword = () => {
    setIsForgot(true);
  };

  const handlSubmitForgotPassword = async () => {
    try {
      const response = await forgotPassword({ email: email });
      setShowToken(true);
      setSnackbarContent("Token has been sent to your mail");
      setSnackbarOpen(true);
    } catch (err) {
      console.log("Error occurred");
      setShowErrorPage(true); 
    }
  };

  const handleResetPassword = async () => {
    try {
      const response = await resetPassword(token, { password: password });
      if (response.success) {
        setSnackbarContent("Password Reset Successful");
        setSnackbarOpen(true);
        closePopup();
      }
    } catch (err) {
      console.log("Error occurred");
      setShowErrorPage(true); 
    }
  };

  const handleClickOpenDispute = () => {
    setIsOpen(true);
  };

  const handleCloseDispute = () => {
    setIsOpen(false);
  };

  const openPopup = () => {
    setEmail('');
    setPassword('');
    setOtpLogin(false);
    setIsPopupOpen(true);
    setIsForgot(false);
    setToken('');
    setShowToken(false);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
  };

  const routeTo = (e: any) => {
    if (e === 'Home') {
      setAboutUsOpen(false);
    }
    navigate(e);
  };

  return (
    <>
      <AppBar
        position="fixed"
        sx={{
          bgcolor: "#373636",
          height: "50px",
          display: "flex",
          alignItems: "center",
          padding: "0 12px",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            width: "100%",
            justifyContent: "space-between",
            flexWrap: "wrap",
          }}
        >
          <img
            src={latest3}
            alt="GruhaSamachar Logo"
            style={{
              width: isMobile ? "150px" : "260px",
              height: isMobile ? "15px" : "30px",
              marginTop: isMobile ? "15px" : "10px",
            }}
          />
          <Box
            style={{
              display: "flex",
              gap: isMobile ? "10px" : "20px",
              alignItems: "center",
              width: isMobile ? "170px" : "320px",
              marginTop: isMobile ? "20px" : "10px",
            }}
          >
            <Box onClick={() => routeTo("Home")} sx={{ cursor: "pointer", display: "flex", alignItems: "center" }}>
              <HomeIcon sx={{ fontSize: isMobile ? "8px" : "14px" }} />
              <Typography sx={{ marginLeft: isMobile ? "2px" : "5px", fontSize: isMobile ? "8px" : "14px", color: "#fff" }}>Houses</Typography>
            </Box>
            <Box onClick={() => routeTo("/FormLands")} sx={{ cursor: "pointer", display: "flex", alignItems: "center" }}>
              <LandslideSharp sx={{ fontSize: isMobile ? "8px" : "14px" }} />
              <Typography sx={{ marginLeft: isMobile ? "2px" : "5px", fontSize: isMobile ? "8px" : "14px", color: "#fff" }}>Lands</Typography>
            </Box>
            <Box onClick={() => setIsOpen(true)} sx={{ cursor: "pointer", display: "flex", alignItems: "center" }}>
              <LocalPostOfficeIcon sx={{ fontSize: isMobile ? "8px" : "14px" }} />
              <Typography sx={{ marginLeft: isMobile ? "2px" : "5px", fontSize: isMobile ? "8px" : "14px", color: "#fff" }}>Services</Typography>
            </Box>
            {currentUser === "" ? (
              <Box onClick={openPopup} sx={{ cursor: "pointer", display: "flex", alignItems: "center" }}>
                <Login sx={{ fontSize: isMobile ? "8px" : "14px" }} />
                <Typography sx={{ marginLeft: isMobile ? "2px" : "5px", fontSize: isMobile ? "8px" : "14px", color: "#fff" }}>Login</Typography>
              </Box>
            ) : (
              <>
                <Box onClick={handleLogout} sx={{ cursor: "pointer", display: "flex", alignItems: "center" }}>
                  <Logout sx={{ fontSize: isMobile ? "8px" : "14px" }} />
                  <Typography sx={{ marginLeft: isMobile ? "2px" : "5px", fontSize: isMobile ? "12px" : "14px", color: "#fff" }}>Logout</Typography>
                </Box>
                <Box onClick={() => routeTo("/user-profile")} sx={{ cursor: "pointer", display: "flex", alignItems: "center" }}>
                  <AccountCircleIcon sx={{ fontSize: isMobile ? "8px" : "14px" }} />
                  <Typography sx={{ marginLeft: isMobile ? "2px" : "5px", fontSize: isMobile ? "12px" : "14px", color: "#fff" }}>Profile</Typography>
                </Box>
              </>
            )}
          </Box>
         



        </Box>
      </AppBar>
      <AboutUsModal open={aboutUsOpen} onClose={handleCloseAboutUs} />
      {isPopupOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(204, 192, 192, 0.9)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: '10px',
              width: "90%",
              maxWidth: "400px",
              color: "#fff",
              textAlign: "center",
              boxShadow: "0px 4px 10px rgba(255, 255, 255, 0.2)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                borderTopLeftRadius: '10px',
                borderTopRightRadius: '10px',
                background: '#373636'
              }}
            >
              <h2 style={{ flex: 1, textAlign: "center", fontSize: '20px', marginLeft: '20px', padding: '5px', marginTop: '3px' }}>Login</h2>
              <button
                onClick={closePopup}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "#fff",
                  paddingBottom: '4px'
                }}
              >
                <Close style={{ fontSize: "15px" }} />
              </button>
            </div>

            {!isForgot && (
              <div style={{ display: "flex", justifyContent: "center", gap: "60px", marginTop: '10px' }}>
                <h5
                  onClick={() => setOtpLogin(true)}
                  style={{ cursor: "pointer", fontWeight: otpLogin ? "bold" : "normal", color: "#373636", fontSize: '15px', paddingTop: '10px' }}
                >
                  OTP Login
                </h5>
                <h5
                  onClick={() => setOtpLogin(false)}
                  style={{ cursor: "pointer", fontWeight: !otpLogin ? "bold" : "normal", color: "#373636", fontSize: '15px', paddingTop: '10px' }}
                >
                  Email Login
                </h5>
              </div>
            )}

            <div style={{ marginTop: "10px", marginLeft: '15px', marginRight: '15px' }}>
              <TextField
                autoFocus
                margin="dense"
                id="outlined-basic"
                label="Email"
                variant="outlined"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                fullWidth
                required
                style={{ background: "#fff", borderRadius: "5px", marginBottom: '10px', color: 'white' }}
              />

              {showToken && (
                <TextField
                  id="outlined-token"
                  label="OTP Token"
                  variant="outlined"
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  fullWidth
                  style={{ marginTop: "1rem", background: "#fff", borderRadius: "5px" }}
                />
              )}
              {!otpLogin && !isForgot && (
                <TextField
                  autoFocus
                  margin="dense"
                  id="outlined-password"
                  label="Password"
                  variant="outlined"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type={showPassword ? "text" : "password"}
                  fullWidth
                  required
                  style={{ marginTop: "1rem", background: "#fff", borderRadius: "5px" }}
                />
              )}
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <button
                  style={{
                    backgroundColor: email === "" || password === "" ? "#555" : "#373636",
                    color: "#fff",
                    border: "none",
                    textAlign: 'center',
                    borderRadius: "5px",
                    cursor: email === "" || password === "" ? "not-allowed" : "pointer",
                    marginTop: "1rem",
                    width: "30%",
                    fontWeight: "bold",
                    transition: "background-color 0.3s, transform 0.3s",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "2rem",
                  }}
                  disabled={email === "" || password === ""}
                  onClick={handleSubmit}
                  onMouseOver={(e) => {
                    if (email !== "" && password !== "") {
                      e.currentTarget.style.backgroundColor = "#6200ea";
                      e.currentTarget.style.transform = "scale(1.05)";
                    }
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = "#373636";
                    e.currentTarget.style.transform = "scale(1)";
                  }}
                >
                  Submit
                </button>
              </div>
            </div>

            <div style={{ marginTop: "20px", textAlign: "center" }}>
              <p>
                <a
                  onClick={handleForgotPassword}
                  role="button"
                  style={{
                    color: "#373636",
                    cursor: "pointer",
                    textDecoration: "underline",
                  }}
                  onMouseEnter={(e) => ((e.target as HTMLElement).style.color = "blue")}
                  onMouseLeave={(e) => ((e.target as HTMLElement).style.color = "#373636")}
                >
                  Forgot Password?
                </a>
              </p>
              <p style={{ color: "#373636" }}>
                Don’t have an account?{' '}
                <a href="/register" style={{ color: "#373636", textDecoration: "underline" }} onMouseEnter={(e) => ((e.target as HTMLElement).style.color = "blue")}
                  onMouseLeave={(e) => ((e.target as HTMLElement).style.color = "#373636")}>
                  Register
                </a>
              </p>
            </div>
          </div>
        </div>
      )}

      {showErrorPage && (
        <div
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "100vw",
            height: "100vh",
            background: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1001,
          }}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: '10px',
              padding: "20px",
              textAlign: "center",
              width:'35%',
              boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
            }}
          >
            
            <img src={errorImage} alt="Coming Soon" style={{ marginBottom: "20px", width:isMobile?"0":'30%', height:isMobile?"0":'30%' }} />
           
            <p>{errorMessage || "An unexpected error occurred. Please try again later."}</p>
            <button
              onClick={() => setShowErrorPage(false)}
              style={{
                backgroundColor: "#373636",
                color: "#fff",
                border: "none",
                padding: "10px 20px",
                borderRadius: "5px",
                cursor: "pointer",
                marginTop: "20px",
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Enter OTP</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            An OTP has been sent to your email. Please verify it within 10 minutes.
            <OTPInput length={6} onChange={handleOtpChange} />
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleOTPValidate}
            autoFocus
            variant="contained"
            color="primary"
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>
      <ServicesDialog open={isOpen} onClose={handleCloseDispute} />

      <Dialog
        open={errorDialogOpen}
        onClose={() => setErrorDialogOpen(false)}
        aria-labelledby="error-dialog-title"
        aria-describedby="error-dialog-description"
      >
        <DialogTitle id="error-dialog-title">OTP Validation Error</DialogTitle>
        <DialogContent>
          <DialogContentText id="error-dialog-description">
            {errorMessage}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setErrorDialogOpen(false);
              setOpen(true);
            }}
            variant="contained"
            color="primary"
          >
            Retry
          </Button>
          <Button
            onClick={() => setErrorDialogOpen(false)}
            variant="contained"
            color="secondary"
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
      
    </>
  );
};

export default Navbar;


