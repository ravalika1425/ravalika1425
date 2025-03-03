import {
  AuthenticationResult,
  EventMessage,
  EventType,
  PublicClientApplication
} from "@azure/msal-browser";
import { configureStore } from "@reduxjs/toolkit";
import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import App from "./App";
import { msalConfig } from "./authConfig";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import rootReducer from "./slices";

export const msalInstance = new PublicClientApplication(msalConfig);
const store = configureStore({ reducer: rootReducer, devTools: true });
msalInstance.initialize().then(() => {
  console.log("getting all available accounts");
  const accounts = msalInstance.getAllAccounts();
  if (accounts.length > 0) {
    msalInstance.setActiveAccount(accounts[0]);
  }

  msalInstance.addEventCallback((event: EventMessage) => {
    if (event.eventType === EventType.LOGIN_SUCCESS && event.payload) {
      const payload = event.payload as AuthenticationResult;
      const account = payload.account;
      msalInstance.setActiveAccount(account);
      console.log("login event callback", account);
    }
  });

  const root = ReactDOM.createRoot(
    document.getElementById("root") as HTMLElement
  );
  root.render(
    <Provider store={store}>
      <React.Fragment>
        <App pca={msalInstance} />
      </React.Fragment>
    </Provider>
  );
});

reportWebVitals();
export type RootState = ReturnType<typeof store.getState>;
export default store;
