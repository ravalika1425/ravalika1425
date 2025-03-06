// import React from 'react';
// import Navbar from '../src/Navbar';
// import style from '../src/styles/App.module.css';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faHome, faAddressCard, faBuilding, faLandmark } from '@fortawesome/free-solid-svg-icons';
// import { BrowserRouter, Routes} from 'react-router-dom';
// import { Route} from 'react-router-dom';
// import Homes from './Pages/Homes';
// import Apartments from './Pages/Apartments';
// import Individualhomes from '../src/Pages/IndividualHomes';
// import Openplots from '../src/Pages/Open-plots';
// import Villas from '../src/Pages/Villas';
// import Contact from '../src/Pages/Contacts';
// import ApartmentDetails from './Pages/ApartmentDetails';
// import FormLands from './Pages/FormLands';
// import IndividualHomesDetails from './Pages/IndividualHomesDetails';
// import FormLandsDetails from './Pages/FormLandsDetails';
// import VillasDetails from './Pages/VillasDetails';
// import OpenPlotsDetails from './Pages/OpenPlotsDetails';
// import Adminhome from './Pages/Adminhome';


// const App: React.FC = () => { 
//       const navLinks = [
//         { label: 'Home', url: '/', icon: <FontAwesomeIcon icon={faHome} /> }, 
//         { label: 'Apartments', url: '/Apartments', icon: <FontAwesomeIcon icon={faBuilding} /> }, 
//         { label: 'Individual Homes', url: '/IndividualHomes', icon: <FontAwesomeIcon icon={faHome} /> }, 
//         { label: 'Villas', url: '/Villas', icon: <FontAwesomeIcon icon={faHome} /> }, 
//         { label: 'Open Plots', url: '/Openplots', icon: <FontAwesomeIcon icon={faLandmark} /> },
//         { label: 'Form Lands', url: '/FormLands', icon: <FontAwesomeIcon icon={faLandmark} /> },
//         { label: 'Contact', url: '/Contact', icon: <FontAwesomeIcon icon={faAddressCard} /> },
        
//       ];
//       return (
//         <div className={style.App}>
//           <BrowserRouter>
//             <Navbar title="BhagyaNagar Properties" links={navLinks} />
//             <Routes>
//               <Route path="/" element={<Homes />} />
//               <Route path="/Apartments" element={<Apartments />} />
//               <Route path="/IndividualHomes" element={<Individualhomes />} />
//               <Route path="/Villas" element={<Villas />} />
//               <Route path="/Openplots" element={<Openplots />} />
//               <Route path="/FormLands" element={<FormLands />} />
//               <Route path="/Contact" element={<Contact />} />
//               <Route path="/ApartmentDetails/:id" element={<ApartmentDetails />} />
//               <Route path="/IndividualhomesDetails/:id" element={<IndividualHomesDetails />} />
//               <Route path="/FormLandDetails/:id" element={<FormLandsDetails />} />
//               <Route path="/VillasDetails/:id" element={<VillasDetails />} />
//               <Route path="/OpenPlotsDetails/:id" element={< OpenPlotsDetails/>} />
//               <Route path="/adminhome" element={<Adminhome />} />              
//             </Routes>
//           </BrowserRouter>
//         </div>
//       );
//     }

// export default App;
// App.tsx
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './AppRoutes';
import { AuthProvider } from '../src/Pages/AuthContext';

const App: React.FC = () => {
  return (
    <AuthProvider> 
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;


// # <AppRoutes> -
