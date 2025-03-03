import * as React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import asclogo from './Asc.png';
import './Header.css';

export default function Header() {
  return (
    <>
      <AppBar position="static" style={{ backgroundColor: "black", height: 60 } as React.CSSProperties}>
        <Toolbar>
          <Typography variant="h6" component="div" style={{ flexGrow: 1 } as React.CSSProperties}>
            <img src={asclogo} alt="" className='asclogo' />
          </Typography>
          <Button color="inherit">Login</Button>
        </Toolbar>
      </AppBar>
    </>
  ) 
}



