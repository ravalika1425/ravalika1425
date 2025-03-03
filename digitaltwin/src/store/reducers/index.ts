import { combineReducers } from "@reduxjs/toolkit"
import sampleReducer from "./sampleReducer"

const rootReducer = combineReducers({
  sample: sampleReducer,
})

export type RootState = ReturnType<typeof rootReducer>

export default rootReducer
