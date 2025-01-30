import { useNavigate } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
// import { Box } from '@react-three/drei';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import './loginpage_form.css';


const Loginform = () => {
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
              <div>
              <h1 className='welcome'>WELCOME BACK</h1>
              <h2 className='progress'>Sign in to continue your progress</h2>
              <div className='mail'>Email / Username</div>
                <input type='text' className='regmail'/>
              </div>
              <div className='password'>Password</div>
                 <input type='password' className='length'/>
                     <div className='button'><h2 className='remember'>Remember me <h2 className='forget'>Forget Password?</h2></h2>
                     </div>
                     

                 <div><button className='login'>Login</button></div>
                 <div className='reghere'><br></br><br></br><br></br><br></br><br></br> Don't have an account?<button className='bold'>Register here</button></div>
            </center>
            
        </div>
        
    );
}

export default Loginform;