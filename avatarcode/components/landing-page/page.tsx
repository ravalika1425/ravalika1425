import { useNavigate } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import { Box } from '@react-three/drei';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import './page.css';
const Form = () => {
  const navigate = useNavigate();

  const goToLoginComp = () => {
    navigate('/loginpage');
  }


  const goToRegistrationComp = () => {
    navigate('/registrationpage');
  }

  const goToCustomizationPanel = () => {
    navigate('/');
  }

  return (
    <div>
        <span className='ascendion_icon'></span>
        
            <AppBar position="static" style={{ background: "none", boxShadow: "none" } as React.CSSProperties}>
              <Toolbar>
                <Typography sx={{ flexGrow: 1, marginLeft:'130px'}}>
                <h3 className='title'>Avatar Engine</h3>
                </Typography>
                <button className='home' color="inherit">
                  <br/><br/>Home
                </button>
                <button onClick={goToLoginComp} className='signin'></button>
                <button onClick={goToRegistrationComp} className='signout'></button>
              </Toolbar>
            </AppBar>
            <h1 className='exper'>EXPERIENCE THE</h1>
            <h1 className='metaverse'>METAVERSE</h1>
            <h3 className='create'>The Future of Design</h3>
            <h6 className='cust'>Customize your look and create your own avatar using our <button className='bton' onClick={goToCustomizationPanel}>Avatar creator</button> </h6>
            
    </div>
  );
}

export default Form;
