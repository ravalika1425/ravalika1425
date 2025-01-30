import React, { useEffect } from 'react';
import "./AvatarTypeSelection.css"
import {useNavigate} from 'react-router-dom';
const MALE:string = "MALE";
const FEMALE:string = "FEMALE";

export class SessionManager {

    static GENDER: string ;
    static OutfitPath: string ;
    static SkinPath: string;
    static accessToken: string;

}
const GENDER:string = "gender";

interface Props {
    setGenderSelected:Function
    setAvatarType: Function
  }

export const  AvatarTypeSelection = ( {setAvatarType, setGenderSelected }:Props)=>{

    let navigate = useNavigate();

    useEffect(()=>{
        localStorage.removeItem(GENDER);
        setGenderSelected(false);
        navigate('/')
    })

    return (
        <div className='wrapper'>
            <div className='type-container'>
                <div className="avatar-type">
                    <img className='type-img' src="asset/img/fighter.png" alt="" />
                    <div className="btn-container">
                        <button className="type-btn" onClick={()=> { setAvatarType('fullBodyAvatar'); navigate('/editor')}}>
                            Full-Body Avatar
                        </button>
                    </div>
                </div>
                <div className="avatar-type">
                    <img className='type-img' src="asset/img/fighter.png" alt="" />
                    <div className="btn-container">
                        <button className="type-btn" onClick={()=> {setAvatarType('halfBodyAvatar'); navigate('/half-body')}}>
                            Half-Body Avatar
                        </button>
                    </div>
                </div>
            </div>  
            
        </div>
    )
}