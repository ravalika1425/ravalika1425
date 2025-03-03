import React, { useEffect } from 'react'

//import Scss
import './assets/scss/themes.scss'

//imoprt Route
import Route from './Routes'

// Fake Backend
import { IPublicClientApplication } from '@azure/msal-browser'
import { MsalProvider } from '@azure/msal-react'
// import fakeBackend from './helpers/AuthType/fakeBackend'

// Activating fake backend
// fakeBackend()

type AppProps = {
  pca: IPublicClientApplication
}

function App ({ pca }: AppProps) {
  useEffect(() => {
    document.documentElement.setAttribute('data-sidebar-size', 'sm')
    localStorage.clear()
  }, [])

  return (
    <React.Fragment>
      <MsalProvider instance={pca}>
        <Route />
      </MsalProvider>
    </React.Fragment>
  )
}

export default App
