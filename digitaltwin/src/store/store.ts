import { configureStore } from '@reduxjs/toolkit'
import rootReducer from './reducers'

const store = configureStore({
  reducer: rootReducer,
  // Redux Toolkit's configureStore automatically integrates with the Redux DevTools extension
})

export default store
