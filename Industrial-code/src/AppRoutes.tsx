import React, { useState } from 'react';
// import Navbar from '../src/Navbar';
import style from '../src/styles/App.module.css';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faHome, faAddressCard, faBuilding, faLandmark } from '@fortawesome/free-solid-svg-icons';
import { Navigate, Routes } from 'react-router-dom';
import { Route } from 'react-router-dom';
import Homes from './Pages/Homes';
import Apartments from './Pages/Apartments';
import Individualhomes from '../src/Pages/IndividualHomes';
import Openplots from '../src/Pages/Open-plots';
import Villas from '../src/Pages/Villas';
import Contact from '../src/Pages/Contacts';
import ApartmentDetails from './Pages/ApartmentDetails';
import FormLands from './Pages/FormLands';
import IndividualHomesDetails from './Pages/IndividualHomesDetails';
import FormLandsDetails from './Pages/FormLandsDetails';
import VillasDetails from './Pages/VillasDetails';
import OpenPlotsDetails from './Pages/OpenPlotsDetails';
import Adminhome from './Pages/AdminPages/Adminhome';
import LayoutWithNavbar from './LayoutWithNavbar ';
import { useAuth } from '../src/Pages/AuthContext';
import SellerPropertiesHome from './Pages/AdminPages/Properties';
import Users from './Pages/AdminPages/Users';

import AddProperyForm from './Pages/AdminPages/AddProperyForm';
import DeleteProperty from './Pages/AdminPages/DeleteProperty';
import EditPropertyForm from './Pages/AdminPages/EditProperty';
import PropertyDetails from './Pages/AdminPages/PropertyDetails';
import AdminPage from './Pages/AdminPages/admin'
import { BrowserRouter as Router } from 'react-router-dom';
import Login from './Components/Login';
import { Registration } from './Pages/Registration';
import Profile from './Pages/Profile';
import OwnerProperties from './Pages/AdminPages/OwnerProperties';
import UsersPage from './Pages/UsersPage';
import ApproveProperties from './Pages/ApproveProperties';
import AdminProperties from './Pages/AdminProperties';
import EventsPage from './Pages/EventsPage';
import DisputesPage from './Pages/DisputesPage';
import Properties from './Pages/AdminPages/Properties';

const App: React.FC = () => {

    const auth = useAuth();

    return (
        <div className={style.app}>

            {/* <Navbar title="BhagyaNagar Properties" links={navLinks} />
            <Routes>
                <Route path="/admin" element={ auth && auth.isLoggedIn ?<Adminhome/>:<AdminPage /> } />
                {auth && auth.isLoggedIn ? (
                    // Render only Adminhome if logged in
                    <Route path="/adminhome" element={<Adminhome />}>
                        <Route path="properties" element={<Properties />} />
                        <Route path="users" element={<Users />} />
                        <Route path="events" element={<Events />} />
                        <Route path="addproperty" element={<AddProperyForm />} />
                        <Route path="editproperty/:id" element={<EditPropertyForm />} />
                        <Route path="viewproperty/:id" element={<PropertyDetails />} />

                    </Route>
                ) : (
                    <Route element={<LayoutWithNavbar />}>
                        <Route path="/" element={ auth && auth.isLoggedIn ?<Adminhome/>:<Homes />} />
                        <Route path="/Apartments" element={<Apartments />} />
                        <Route path="/IndividualHomes" element={<Individualhomes />} />
                        <Route path="/Villas" element={<Villas />} />
                        <Route path="/Openplots" element={<Openplots />} />
                        <Route path="/FormLands" element={<FormLands />} />
                        <Route path="/Contact" element={<Contact />} />
                        <Route path="/ApartmentDetails/:id" element={<ApartmentDetails />} />
                        <Route path="/IndividualhomesDetails/:id" element={<IndividualHomesDetails />} />
                        <Route path="/FormLandDetails/:id" element={<FormLandsDetails />} />
                        <Route path="/VillasDetails/:id" element={<VillasDetails />} />
                        <Route path="/OpenPlotsDetails/:id" element={< OpenPlotsDetails />} />

                    </Route>
                    
                )}
            </Routes> */}
            {/* <Router>
                <Routes>
                    <Route path="/admin" element={<AdminPage />} />
                    <Route path="/login" element={<Login />} />
                </Routes>
            </Router> */}
            <Routes>
                {/* Route for admin login */}
                <Route path="/admin" element={auth && auth.isLoggedIn ? <Navigate to="/adminhome" /> : <UsersPage />} />
                
                {/* Protected admin routes */}
                <Route path="/adminhome/*" element={auth && auth.isLoggedIn ? <UsersPage /> : <Navigate to="/admin" />} >

                    <Route path="Properties" element={<Properties />} />
                    <Route path="users" element={<Users />} />

                    <Route path="addproperty" element={<AddProperyForm />} />
                    <Route path="editproperty/:id" element={<EditPropertyForm />} />
                    <Route path="viewproperty/:id" element={<PropertyDetails />} />
                    {/* Ensure this path is correct */}
                </Route>
                <Route path="adminhome/approve-properties" element={<AdminProperties />} />
                <Route path="adminhome/events" element={<EventsPage />} />
                <Route path="adminhome/disputes" element={<DisputesPage />} />

                {/* Default routes for non-admin or logged out users */}
                <Route path="/" element={<LayoutWithNavbar />}>
                    <Route index element={auth && auth.isLoggedIn ? <Navigate to="/adminhome" /> : <Homes />} />
                    <Route path="/Apartments" element={<Apartments />} />
                    <Route path="/IndividualHomes" element={<Individualhomes />} />
                    <Route path="/Villas" element={<Villas />} />
                    <Route path="/Openplots" element={<Openplots />} />
                    <Route path="/FormLands" element={<FormLands />} />
                    <Route path="/Contact" element={<Contact />} />
                    <Route path="/ApartmentDetails/:id" element={<ApartmentDetails />} />
                    <Route path="/IndividualhomesDetails/:id" element={<IndividualHomesDetails />} />
                    <Route path="/FormLandDetails/:id" element={<FormLandsDetails />} />
                    <Route path="/VillasDetails/:id" element={<VillasDetails />} />
                    <Route path="/OpenPlotsDetails/:id" element={<OpenPlotsDetails />} />
                    <Route path="/Register" element={<Registration />} />
                    <Route path="/user-profile" element={<Profile />} />
                    <Route path="/addproperty" element={<AddProperyForm />} />
                    <Route path="/owner-properties" element={<OwnerProperties />} />
                    <Route path="viewproperty/:id" element={<PropertyDetails />} />
                </Route>

                {/* Redirect all other routes to home */}
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </div>
    );
}

export default App;
