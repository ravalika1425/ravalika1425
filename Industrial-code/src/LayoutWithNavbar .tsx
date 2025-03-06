// LayoutWithNavbar.tsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../src/Navbar';
import style from '../src/styles/App.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faAddressCard, faBuilding, faLandmark } from '@fortawesome/free-solid-svg-icons';

const LayoutWithNavbar: React.FC = () => {
  // Define your navLinks here or pass them as props
  const navLinks = [
    { label: 'Home', url: '/', icon: <FontAwesomeIcon icon={faHome} /> },
    { label: 'Apartments', url: '/Apartments', icon: <FontAwesomeIcon icon={faBuilding} /> },
    { label: 'Individual Homes', url: '/IndividualHomes', icon: <FontAwesomeIcon icon={faHome} /> },
    { label: 'Villas', url: '/Villas', icon: <FontAwesomeIcon icon={faHome} /> },
    { label: 'Open Plots', url: '/Openplots', icon: <FontAwesomeIcon icon={faLandmark} /> },
    { label: 'Form Lands', url: '/FormLands', icon: <FontAwesomeIcon icon={faLandmark} /> },
    { label: 'Contact', url: '/Contact', icon: <FontAwesomeIcon icon={faAddressCard} /> },

  ];

  return (
    <div className={style.App}>
      <Navbar title="SH Properties" links={navLinks} />
      <Outlet /> {/* Render child routes here */}
    </div>
  );
};

export default LayoutWithNavbar;
