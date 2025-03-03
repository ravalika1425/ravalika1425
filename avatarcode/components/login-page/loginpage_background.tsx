import './loginpage_background.css';
import Loginform from './loginpage_form';
const Loginpage = () => {
    return(
        <div className='background'>
            <div className='loginchar'>
            </div>
            
            <Loginform/>    
        </div>
    );
}

export default Loginpage;