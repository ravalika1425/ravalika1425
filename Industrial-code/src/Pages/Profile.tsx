import React, { useState } from 'react'
import style from '../styles/Profile.module.css'
import UserImage from '../assetts/user-profile.jpg'
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import LanguageIcon from '@mui/icons-material/Language';
import EditIcon from '@mui/icons-material/Edit';
import { Button, InputLabel, TextField } from '@mui/material';
import { getUser, updateUser } from '../services/Api/Users';
import displayImage from '../assetts/property.png'
import { useNavigate } from 'react-router-dom';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';

const Profile = () => {

    const [user, setUser] = useState(localStorage.getItem('user'))
    const [isEdit, setEdit] = useState(false)
    const [name, setName] = useState(user ? JSON.parse(user).name : '')
    const [email, setEmail] = useState(user ? JSON.parse(user).email : '')
    const [mobile, setMobile] = useState(user ? JSON.parse(user).mobile_number : '')
    const [companyName, setCompanyName] = useState(user ? JSON.parse(user).company_name : '')
    const [companyPortal, setCompanyPortal] = useState(user ? JSON.parse(user).company_portal : '')
    const [profile, setProfile] = useState(user ? JSON.parse(user).profile_picture[0] : '')
    const [role, setRole] = useState(user ? JSON.parse(user).role : '')

    const [fileName, setFileName] = useState('')

    const navigate = useNavigate()
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files && e.target.files[0];

        if (file) {
            setFileName(file.name)
            const reader = new FileReader();
            reader.onloadend = () => {
                if (typeof reader.result === 'string') {
                    setProfile(reader.result);
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = async () => {

        const payload = {
            name: name,
            mobile_number: mobile,
            email: email,
            company_name: companyName,
            company_portal: companyPortal,
            profile_picture: profile,
            role: role
        }

        try {

            if (user) {
                const response = await updateUser(JSON.parse(user).id, payload)
                if (response.success) {
                    alert("Updated Successfully!!")
                    const userResponse = await getUser(JSON.parse(user).id)
                    console.log(userResponse)
                    if (userResponse.success) {
                        localStorage.removeItem("user")
                        localStorage.setItem("user", JSON.stringify(userResponse.data))
                    }

                }
                else {
                    console.log(response)
                }
            }
        }
        catch (err) {
            console.log(err)
        }
    }

    const handlecartpage = () => {

    }

    return (
        <>
            {
                user && (
                    <>
                        {/* <p>Profile : {user.name}</p> */}
                        <div className={style.maincontainer}>
                            <div className={style.profilecontainer}>
                                {/* <p>{user.name}</p> */}
                                <div className={style.imagecontainer}>
                                    <img src={JSON.parse(user).profile_picture.length != 0 ? JSON.parse(user).profile_picture : UserImage} className={style.image} />

                                </div>
                                <div className={style.editcontainer}>
                                    <p className={style.role}>{role}</p>
                                    <EditIcon onClick={() => setEdit(true)} />
                                </div>
                                <div className={style.detailscontainer}>
                                    {/* <h3>{user.name}</h3> */}
                                    <div className={style.detailitem}>
                                        <PersonIcon />
                                        <h5>{name}</h5>
                                    </div>
                                    <div className={style.detailitem}>
                                        <EmailIcon />
                                        <h5>{email}</h5>
                                    </div>
                                    <div className={style.detailitem}>
                                        <LocalPhoneIcon />
                                        <h5>{mobile}</h5>
                                    </div>
                                    <div className={style.detailitem}>
                                        <LanguageIcon />
                                        <h5>{companyPortal}</h5>
                                    </div>
                                </div>

                            </div>
                            {
                                isEdit && (
                                    <>
                                        <div className={style.editprofilecontainer}>
                                            <h2>EDIT PROFILE</h2>
                                            <div>
                                                <div className={style.edititem}>
                                                    <TextField
                                                        id="outlined-basic"
                                                        label="Name"
                                                        variant="outlined"
                                                        value={name}
                                                        onChange={(e) => setName(e.target.value)}
                                                        fullWidth />
                                                    <TextField
                                                        id="outlined-basic"
                                                        label="Email"
                                                        variant="outlined"
                                                        value={email}
                                                        onChange={(e) => setEmail(e.target.value)}
                                                        fullWidth />
                                                </div>
                                                <div className={style.edititem}>
                                                    <TextField
                                                        id="outlined-basic"
                                                        label="Company Name"
                                                        variant="outlined"
                                                        value={companyName}
                                                        onChange={(e) => setCompanyName(e.target.value)}
                                                        fullWidth />
                                                    <TextField
                                                        id="outlined-basic"
                                                        label="Company Portal"
                                                        variant="outlined"
                                                        value={companyPortal}
                                                        onChange={(e) => setCompanyPortal(e.target.value)}
                                                        fullWidth />
                                                </div>
                                                <div className={style.edititem}>
                                                    <TextField
                                                        id="outlined-basic"
                                                        label="Mobile Number"
                                                        variant="outlined"
                                                        value={mobile}
                                                        onChange={(e) => setMobile(e.target.value)}
                                                        fullWidth />

                                                    <Select

                                                        id="demo-simple-select"
                                                        value={role}
                                                        label="Role"
                                                        onChange={(e) => setRole(e.target.value)}
                                                    >
                                                        {/* <MenuItem value={"SELLER"}>SELLER</MenuItem>
                                                        <MenuItem value={"BUYER"}>BUYER</MenuItem> */}
                                                    </Select>


                                                </div>
                                                <div className={style.edititem}>
                                                    <div>
                                                        <input type="file" accept="image/*" onChange={handleImageChange} />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className={style.buttoncontainer} style={{ float: 'right' }}>
                                                <Button variant='contained' style={{ backgroundColor: 'white', color: 'black' }} onClick={() => setEdit(false)}>Cancel</Button>
                                                <Button variant='contained' style={{ backgroundColor: 'black' }} onClick={handleSave}>Save</Button>
                                            </div>
                                        </div>
                                    </>
                                )
                            }
                            {
                                !isEdit && (
                                    <>
                                        <div className={style.editprofilecontainer}>
                                            <img src={displayImage} />
                                            <p style={{ marginTop: '1rem' }}>We’re here to make your home-buying experience as smooth and enjoyable as possible. Let’s find your perfect home together!</p>
                                            <p>Stay informed about the latest real estate trends and market conditions in your preferred locations. Access reports and articles to make well-informed decisions.</p>
                                            <div className={style.cardscontainer}>
                                                {/* <div className={style.card}>Viewed Properties</div>
                                            <div className={style.card}>Buyed Properties</div>
                                            <div className={style.card}></div> */}
                                                <div className={style.buttoncontainer}>
                                                    <Button variant="contained" style={{ backgroundColor: 'black' }} >Faviourate Properties</Button>
                                                    <Button variant="contained" style={{ backgroundColor: 'black' }} onClick={() => navigate('/addproperty')}>Add Property</Button>
                                                    <Button variant="contained" style={{ backgroundColor: 'black' }} onClick={() => navigate('/owner-properties')}>View Properties</Button>
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                )
                            }
                        </div>
                    </>
                )
            }
        </>
    )
}

export default Profile