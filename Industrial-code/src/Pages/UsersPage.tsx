import React, { useEffect, useState } from 'react';
import style from '../styles/UserPage.module.css';
import { deleteUser, getUsers } from '../services/Api/Users';
import { Delete } from '@mui/icons-material';
import { Button } from '@mui/material';
import { useNavigate, Outlet } from 'react-router-dom';
import { getAdminAllProperties } from '../services/Api/Property';
import PropertyCard from './PropertyCard';

const UsersPage = () => {
  const [userData, setUserData] = useState<any>([]);
  const [propData, setPropdata] = useState<any>([]);
  const navigate = useNavigate();

  const fetchData = async () => {
    const response = await getUsers();
    console.log(response);
    setUserData(response.data);
  };

  const handleAddProperty = () => {
    navigate('/adminhome/addproperty', { replace: true });
  }

  const fetchProperties = async (type: string) => {
    try {
      const response = await getAdminAllProperties(type)
      if (response.success) {
        setPropdata(response.data)
      }
      else {
        if (response.status === 'property_data_not_found') {
          setPropdata([])
        }
      }
    }
    catch (error) {
      alert(error)
    }
  }
  useEffect(() => {
    fetchData();
    fetchProperties("ALL");
  }, []);



  const handleDeleteUser = async (e: any) => {
    if (window.confirm(`Do you want to delete user ${e.name}?`)) {
      console.log('User confirmed!');
      try {
        const response = await deleteUser(e.id.toString());
        if (response.success) {
          alert('User Deleted Successfully');
          fetchData();
        } else {
          alert('Error occurred');
        }
      } catch (err) {
        alert('Error occurred');
      }
    } else {
      console.log('User cancelled!');
    }
  };

  const handleAdminLogout = () => {
    localStorage.removeItem("user")
    navigate('/home')
  }

  return (
    <div className={style.maincontainer}>
      <div>
        <h1 className={style.title}>Welcome to Admin Dashboard!!</h1>
        <div className={style.buttonscontainer}>
          <Button
            variant="contained"
            style={{ backgroundColor: 'black' }}
            onClick={() => navigate('/adminhome/approve-properties')}
          >
            Approve Properties
          </Button>
          <Button
            variant="contained"
            style={{ backgroundColor: 'black' }}
            onClick={() => navigate('/adminhome/events')}
          >
            Events
          </Button>
          <Button
            variant="contained"
            style={{ backgroundColor: 'black' }}
            onClick={() => navigate('/adminhome/disputes')}
          >
            Disputes
          </Button>
          <Button
            variant="contained"
            style={{ backgroundColor: 'black' }}
            onClick={() => handleAdminLogout()}
          >
            Logout
          </Button>

        </div>
      </div>
      <div className={style.outercontainer}>
        <div className={style.innercontainer}>
          <h3><b>USERS LIST</b></h3>

          <div>
            {userData && userData.length > 0 && (
              <table>
                <thead>
                  <tr className={style.heading}>
                    <th className={style.item}>Name</th>
                    <th className={style.item}>Mobile Number</th>
                    <th className={style.item}>Email</th>
                    <th className={style.item}>Role</th>
                    <th className={style.item}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {userData.map((item: any) => (
                    <tr className={style.useritem} key={item.id}>
                      <td className={style.item}>{item.name}</td>
                      <td className={style.item}>{item.mobile_number}</td>
                      <td className={style.item}>{item.email}</td>
                      <td className={style.item}>{item.role}</td>
                      <td className={style.item} onClick={() => handleDeleteUser(item)}>
                        <Delete />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
      <div>
        <h1>PROPERTIES</h1>
        <div className={style.buttonscontainer}>
          <Button variant="contained" style={{ background: 'black' }} onClick={() => fetchProperties('ALL')} >ALL</Button>
          <Button variant="contained" style={{ background: 'black' }} onClick={() => fetchProperties('PENDING')}>PENDING</Button>
          <Button variant="contained" style={{ background: 'black' }} onClick={() => fetchProperties('APROVED')}>APPROVED</Button>
          <Button variant="contained" style={{ background: 'black' }} onClick={() => fetchProperties('REJECTED')}>REJECTED</Button>
          <Button variant="contained" style={{ background: 'black' }} onClick={() => fetchProperties('UNDER REVIEW')}>UNDER REVIEW</Button>
          <Button variant="contained" style={{ background: 'black' }} onClick={handleAddProperty}>Add Property</Button>
        </div>
        <div className={style.propertycontainer}>


          {
            propData && propData.map((item: any, index: number) => {
              return (
                <div key={index}>
                  <PropertyCard property_obj={item} showButtons={false} />
                </div>
              )
            })
          }
          {
            propData && propData.length === 0 && (
              <>
                <h3>No Data Found</h3>
              </>
            )
          }
        </div>

      </div>

      {/* Add Outlet for nested routes to render */}
      <Outlet />
    </div>
  );
};

export default UsersPage;
