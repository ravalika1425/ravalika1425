import { useNavigate } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import './registration_form.css';

const Register = () => {
    const navigate = useNavigate();

    const goToLoginComp = () => {
        navigate('/loginpage');
    }


    const goToRegistrationComp = () => {
        navigate('/registrationpage');
    }

    const goToLandingPage = () => {
        navigate('/landingpage');
    }

    return(
        <div>

            <span className='ascendion_icon'></span>
            <AppBar position="static" style={{ background: "none", boxShadow: "none" } as React.CSSProperties}>
              <Toolbar>
                <Typography sx={{ flexGrow: 1, marginLeft:'130px'}}>
                <h3 className='title'>Avatar Engine</h3>
                </Typography>
                <button className='home' color="inherit" onClick={goToLandingPage}>
                  <br/><br/>Home
                </button>
                <button onClick={goToLoginComp} className='signin'></button>
                <button onClick={goToRegistrationComp} className='signout'></button>
              </Toolbar>
            </AppBar>
            <center>
              <br /> <br/>
            <h1 className='reg'>REGISTER YOURSELF<h2 className='bigin'>Begin your journy with us</h2></h1>
            <div className='form'>
            <div className='firstnm'>First Name<br></br>
            <input type='text' className='fnl'/></div>
            <div className='lastnm'>Last Name<br></br>
            <input type='text' className='lnl'/></div><br/>
            </div>
            <div className='form'>
            <div className='email'>Email/Username<br></br>
            <input type='text' className='eml'/>  </div>
            <div className='pasword'>Password<br></br>
            <input type='password' className='psl'/> </div> 
            
            </div>
            <div className='checkbox'> <p className='condition'>I accept the Terms & Conditions</p></div>
            <button className='log'>Login</button>
            <div className='register'> Don't have an account?<button className='anchor'>Register here</button></div>
            </center>
            
        </div>
    );
}

export default Register;
