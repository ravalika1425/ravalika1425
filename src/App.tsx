import React, { useState } from "react";
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Landingpage from "./components/landing-page/background";
import Registrationpage from "./components/registration-page/registrationpage_background";
import Loginpage from "./components/login-page/loginpage_background";
import CreateAvatar from "./components/createavatar-page/create-avatar/CreateAvatar";
import FemaleAvatar from "./components/createavatar-page/female-avatar/FemaleAvatar";
import { AvatarTypeSelection } from "./components/genderselection-page/AvatarTypeSelection";
import Gsp from "./components/genderselection-page/Gsp";

 
import { Model } from "./components/AvatarLoader";
const App = () => {
const [isGenderSelected, setGenderSelected] = useState<boolean>(false);
const [gender, setGender] = useState('');
const [avatarType, setAvatarType] = useState('');
  return (
    <Router>
      <Routes>
        <Route path="/landingpage" element={<Landingpage/>}></Route>
        <Route path="/registrationpage" element={<Registrationpage/>}></Route>
        <Route path="/loginpage" element={<Loginpage/>}></Route>
        <Route path="/createavatar" element={<CreateAvatar/>}></Route>
        <Route path="/" element={<Gsp/>}></Route>
        <Route path="/femaleavatar" element={<FemaleAvatar/>}></Route>
        {/* <Route path="/avatar-type" element={ gender !== '' ? 
        <AvatarTypeSelection setAvatarType={setAvatarType} setGenderSelected={setGenderSelected}/> : <Reload/>} 
      /> */}
        <Route path="/export" element={<Model/>}></Route>
      </Routes>
    </Router>
  );
}

export default App;
