import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Dropdown, DropdownMenu, DropdownToggle, Form } from 'reactstrap'

//import images
import mikeLogo from '../assets/images/mikeLogo.png'

//import Components
import FullScreenDropdown from '../Components/Common/FullScreenDropdown'
import LightDark from '../Components/Common/LightDark'
import ProfileDropdown from '../Components/Common/ProfileDropdown'

import { useDispatch, useSelector } from 'react-redux'
import { createSelector } from 'reselect'

const Header = ({ onChangeLayoutMode, layoutModeType, headerClass }: any) => {

  const selectDashboardData = createSelector(
    (state: any) => state.Layout,
    sidebarVisibilitytype => sidebarVisibilitytype
  )
  // Inside your component
  const sidebarVisibilitytype = useSelector(selectDashboardData)

  const [search, setSearch] = useState<boolean>(false)
  const toogleSearch = () => {
    setSearch(!search)
  }

  const toogleMenuBtn = () => {
    console.log('toogleMenuBtn')
    var windowSize = document.documentElement.clientWidth
    // const humberIcon = document.querySelector("hamburger-icon") as HTMLElement;

    if (windowSize > 767)
      if (
        document.documentElement.getAttribute('data-layout') === 'horizontal'
      ) {
        //   / humberIcon.classList.toggle('close');

        //For collapse horizontal menu
        document.body.classList.contains('menu')
          ? document.body.classList.remove('menu')
          : document.body.classList.add('menu')
      }

    //For collapse vertical and semibox menu
    if (
      sidebarVisibilitytype === 'show' &&
      (document.documentElement.getAttribute('data-layout') === 'vertical' ||
        document.documentElement.getAttribute('data-layout') === 'semibox')
    ) {
      if (windowSize < 1025 && windowSize > 767) {
        document.body.classList.remove('vertical-sidebar-enable')
        document.documentElement.getAttribute('data-sidebar-size') === 'sm'
          ? document.documentElement.setAttribute('data-sidebar-size', 'lg')
          : document.documentElement.setAttribute('data-sidebar-size', 'sm')
      } else if (windowSize > 1025) {
        document.body.classList.remove('vertical-sidebar-enable')
        document.documentElement.getAttribute('data-sidebar-size') === 'lg'
          ? document.documentElement.setAttribute('data-sidebar-size', 'sm')
          : document.documentElement.setAttribute('data-sidebar-size', 'lg')
      } else if (windowSize <= 767) {
        document.body.classList.add('vertical-sidebar-enable')
        document.documentElement.setAttribute('data-sidebar-size', 'lg')
      }
    }

    // Quick fix for vertical layout show/hide toggle issue. If facing issues with other layout please comment the below lines
    if (document.documentElement.getAttribute('data-layout') === 'vertical') {
      document.documentElement.setAttribute(
        'data-sidebar-size',
        document.documentElement.getAttribute('data-sidebar-size') === 'sm'
          ? 'lg'
          : 'sm'
      )
    }
    //End of hack

    //Two column menu
    if (document.documentElement.getAttribute('data-layout') === 'twocolumn') {
      document.body.classList.contains('twocolumn-panel')
        ? document.body.classList.remove('twocolumn-panel')
        : document.body.classList.add('twocolumn-panel')
    }
  }

  return (
    <React.Fragment>
      <header id='page-topbar' className={headerClass}>
        <div className='layout-width'>
          <div className='navbar-header'>
            <div className='d-flex'>
              <div className='navbar-brand-box horizontal-logo'>
                <Link to='/' className='logo logo-dark'>
                  <span className='logo-sm'>
                    <img src={mikeLogo} alt='' height='22' />
                  </span>
                  <span className='logo-lg'>Michelangelo</span>
                </Link>

                <Link to='/' className='logo logo-light'>
                  <span className='logo-sm'>
                    <img src={mikeLogo} alt='' height='22' />
                  </span>
                  <span className='logo-lg'>Michelangelo</span>
                </Link>
              </div>

              <button
                style={{ display: 'none' }}
                onClick={toogleMenuBtn}
                type='button'
                className='btn btn-sm px-3 fs-16 header-item vertical-menu-btn topnav-hamburger'
                id='topnav-hamburger-icon'
              >
                <span className='hamburger-icon'>
                  <span></span>
                  <span></span>
                  <span></span>
                </span>
              </button>

              {/* <SearchOption /> */}
            </div>

            <div className='d-flex align-items-center'>
              <Dropdown
                isOpen={search}
                toggle={toogleSearch}
                className='d-md-none topbar-head-dropdown header-item'
              >
                <DropdownToggle
                  type='button'
                  tag='button'
                  className='btn btn-icon btn-topbar btn-ghost-secondary rounded-circle'
                >
                  <i className='bx bx-search fs-22'></i>
                </DropdownToggle>
                <DropdownMenu className='dropdown-menu-lg dropdown-menu-end p-0'>
                  <Form className='p-3'>
                    <div className='form-group m-0'>
                      <div className='input-group'>
                        <input
                          type='text'
                          className='form-control'
                          placeholder='Search ...'
                          aria-label="Recipient's username"
                        />
                        <button className='btn btn-primary' type='submit'>
                          <i className='mdi mdi-magnify'></i>
                        </button>
                      </div>
                    </div>
                  </Form>
                </DropdownMenu>
              </Dropdown>

              {/* LanguageDropdown */}
              {/* <LanguageDropdown /> */}

              {/* WebAppsDropdown */}
              {/* <WebAppsDropdown /> */}

              {/* MyCartDropdwon */}
              {/* <MyCartDropdown /> */}

              {/* FullScreenDropdown */}
              <FullScreenDropdown />

              {/* Dark/Light Mode set */}
              <LightDark
                layoutMode={layoutModeType}
                onChangeLayoutMode={onChangeLayoutMode}
              />

              {/* NotificationDropdown */}
              {/* <NotificationDropdown /> */}

              {/* ProfileDropdown */}
              <ProfileDropdown />
            </div>
          </div>
        </div>
      </header>
    </React.Fragment>
  )
}

export default Header
