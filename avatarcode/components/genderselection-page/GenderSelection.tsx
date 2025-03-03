import React, { useEffect } from 'react';
import "./GenderSelection.css";
import { useNavigate } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';


const MALE:string = "MALE";
const FEMALE:string = "FEMALE";

const GENDER:string = "gender";
interface Props {
    setGender: Function
    setGenderSelected:Function
  }

export const  GenderSelection = ( { setGender, setGenderSelected }:Props)=>{

    // var navigate = useNavigate();
    function clickHandler(gender:string){
        localStorage.setItem(GENDER,gender);
        setGenderSelected(true);
        navigate('/createavatar');
        setGender(gender);
        console.log(gender);
    }
    // var navigate = useNavigate();
    function clickHandler1(gender:string){
        localStorage.setItem(GENDER,gender);
        setGenderSelected(true);
        navigate('/femaleavatar');
        setGender(gender);
        console.log(gender);
    }

    useEffect(()=>{
        // localStorage.removeItem(GENDER);
        setGenderSelected(false);
    })

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
    return (
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

            

            <button className='genderBtn1' onClick={() => { clickHandler1(FEMALE) } }>Feminine</button>
            <button className='genderBtn' onClick={() => { clickHandler(MALE) } }>Natural</button>
            <button className='genderBtn2' onClick={() => { clickHandler(MALE) } }>Masculine</button>
           
                      <div>
                      
                     <h1 className='heading'>CHOOSE YOUR</h1>
                     <h1 className='heading1'>BODY</h1>
                     
                     <h1 className='heading2'>TYPE
                      
                 
                 </h1>
                 
                 
        </div>
        </div>

        
    )
}
