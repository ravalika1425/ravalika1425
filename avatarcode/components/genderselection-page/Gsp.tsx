import React, { useState } from 'react';
import { GenderSelection } from './GenderSelection';
import './Gsp.css';

const Gsp = () => {
  const [gender, setGender] = useState('');
  const [genderSelected, setGenderSelected] = useState(false);

  const genderSelectionProps = {
    gender: gender,
    setGender: setGender,
    setGenderSelected: setGenderSelected,
  };

  return (
    <div className='background'>
      <div className='genderselection'>
            </div>
      <GenderSelection {...genderSelectionProps} />
    </div>
  );
};

export default Gsp;
