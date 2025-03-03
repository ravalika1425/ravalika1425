import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle
} from 'reactstrap'
import { createSelector } from 'reselect'

//import images
import { useMsal } from '@azure/msal-react'
import { getFirstNameFromEmail } from 'Mike/utils/utils'

const ProfileDropdown = () => {
  const profiledropdownData = createSelector(
    (state: any) => state.Profile.user,
    user => user
  )
  // Inside your component
  const user = useSelector(profiledropdownData)
  const { accounts } = useMsal()

  const [userName, setUserName] = useState('Admin')

  useEffect(() => {
    const authUSer: any = sessionStorage.getItem('authUser')
    if (authUSer) {
      const obj: any = JSON.parse(authUSer)
      setUserName(
        process.env.REACT_APP_DEFAULTAUTH === "fake"
          ? obj.username === undefined
            ? user.first_name
              ? user.first_name
              : obj.data.first_name
                 : "Admin"
          : process.env.REACT_APP_DEFAULTAUTH === "firebase"
          ? obj.email
          : "Admin"
      );
    }
  }, [userName, user])

  //Dropdown Toggle
  const [isProfileDropdown, setIsProfileDropdown] = useState<boolean>(false)
  const toggleProfileDropdown = () => {
    setIsProfileDropdown(!isProfileDropdown)
  }
  return (
    <React.Fragment>
      <Dropdown
        isOpen={isProfileDropdown}
        toggle={toggleProfileDropdown}
        className='ms-sm-3 header-item topbar-user'
      >
        <DropdownToggle tag='button' type='button' className='btn'>
          <span className='d-flex align-items-center'>
            <i className='ri-user-3-fill' style={{ fontSize: 26 }}></i>
            <span className='text-start ms-xl-2'>
              <span className='d-none d-xl-inline-block ms-1 fw-medium user-name-text'>
                {getFirstNameFromEmail(accounts[0].username)}
              </span>
              <span className='d-none d-xl-block ms-1 fs-12 text-muted user-name-sub-text'>
                Creator
              </span>
            </span>
          </span>
        </DropdownToggle>
        <DropdownMenu className='dropdown-menu-end'>
          <h6 className='dropdown-header'>
            Welcome {getFirstNameFromEmail(accounts[0].username)}!
          </h6>
          <DropdownItem className='p-0' disabled>
            <Link to='/profile' className='dropdown-item'>
              <i className='mdi mdi-account-circle text-muted fs-16 align-middle me-1'></i>
              <span className='align-middle'>Profile</span>
            </Link>
          </DropdownItem>
          <DropdownItem className='p-0' disabled>
            <Link to='' className='dropdown-item'>
              <i className='mdi mdi-dots-circle text-muted fs-16 align-middle me-1'></i>{' '}
              <span className='align-middle'>
                Circle : <b>Experience Engineering</b>
              </span>
            </Link>
          </DropdownItem>
          <DropdownItem className='p-0' disabled>
            <Link to='' className='dropdown-item'>
              <i className='mdi mdi-lightning-bolt text-muted fs-16 align-middle me-1'></i>{' '}
              <span className='align-middle'>
                Status : <b>Creator</b>
              </span>
            </Link>
          </DropdownItem>

          <div className='dropdown-divider'></div>
          <DropdownItem className='p-0' disabled>
            <Link to='' className='dropdown-item'>
              <i className='mdi mdi-wallet text-muted fs-16 align-middle me-1'></i>{' '}
              <span className='align-middle'>
                Balance : <b>Unlimited</b>
              </span>
            </Link>
          </DropdownItem>
          <DropdownItem className='p-0' disabled>
            <Link to='/pages-profile-settings' className='dropdown-item'>
              <span className='badge bg-success-subtle text-success mt-1 float-end'>
                New
              </span>
              <i className='mdi mdi-cog-outline text-muted fs-16 align-middle me-1'></i>{' '}
              <span className='align-middle'>Settings</span>
            </Link>
          </DropdownItem>
          <DropdownItem className='p-0' disabled>
            <Link to='/pages-faqs' className='dropdown-item'>
              <i className='mdi mdi-lifebuoy text-muted fs-16 align-middle me-1'></i>{' '}
              <span className='align-middle'>Help</span>
            </Link>
          </DropdownItem>
          <DropdownItem className='p-0' disabled>
            <Link to='/logout' className='dropdown-item'>
              <i className='mdi mdi-logout text-muted fs-16 align-middle me-1'></i>{' '}
              <span className='align-middle' data-key='t-logout'>
                Logout
              </span>
            </Link>
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </React.Fragment>
  )
}

export default ProfileDropdown
