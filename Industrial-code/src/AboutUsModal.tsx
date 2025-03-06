import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';

interface AboutUsModalProps {
  open: boolean;
  onClose: () => void;
}

const AboutUsModal: React.FC<AboutUsModalProps> = ({ open, onClose }) => {
  return (
    <Dialog open={open} onClose={onClose} style={{borderRadius:'18px'}}>
      <DialogTitle
        sx={{
          backgroundColor: '#373636',
          color: 'white',
          textAlign: 'center',
          fontSize: '24px',
          height: '40px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        About Us
      </DialogTitle>
      <DialogContent
        sx={{
          padding: '17px',
          backgroundColor: '#ffffff',
          color: '#373636',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <p style={{ textAlign: 'justify', paddingTop: '15px' }}>
         <i> 
          Welcome to GruhaSamachar! We are your trusted source for real estate information.
          Our mission is to provide you with the most accurate and up-to-date information
          about houses and lands available for sale. Whether you are looking to buy, sell,
          or rent, we are here to help you make informed decisions.
          </i>
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
        <Button
          onClick={onClose}
          variant="contained"
          sx={{
            backgroundColor: '#373636',
            color: 'white',
            '&:hover': {
              backgroundColor: '#575656', // Optional: Change background color on hover
            }
          }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AboutUsModal;
