import React, { useEffect } from "react";
import {
  Routes,
  Route,
  createRoutesFromElements,
  createBrowserRouter,
  RouterProvider
} from "react-router-dom";

//Layouts
// import NonAuthLayout from "../Layouts/NonAuthLayout";
import VerticalLayout from "../Layouts/index";

//routes
import { publicRoutes } from "./allRoutes";
import NonAuthLayout from "Layouts/NonAuthLayout";
import { AuthenticatedTemplate, useMsal } from "@azure/msal-react";
import { loginRequest } from "authConfig";
import { EditableProvider } from "pages/ImageToCode/Contaxt";
import * as msal from "@azure/msal-browser";

// import AuthProtected  from './AuthProtected';

const Index = () => {
  const { instance } = useMsal();

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route>
        {publicRoutes.map((route, idx) => (
          <Route
            path={route.path}
            element={
              <AuthenticatedTemplate>
                <NonAuthLayout>
                  <EditableProvider>
                    <VerticalLayout>{route.component}</VerticalLayout>
                  </EditableProvider>
                </NonAuthLayout>
              </AuthenticatedTemplate>
            }
            key={idx}
          />
        ))}
      </Route>
    )
  );
  useEffect(() => {
    const account = instance.getActiveAccount();
    if (account) {
      console.log("account available");
      instance
        .ssoSilent({
          scopes: loginRequest.scopes,
          account: account
        })
        // .catch((error) => {
        //   console.error("Silent authentication error:", error);
        //   instance
        //     .loginRedirect({
        //       scopes: loginRequest.scopes,
        //       prompt: "select_account",
        //     })
        //     .catch((error) => console.error("Redirection error:", error));
        // });
        .catch((error) => {
          console.error("Silent authentication error:", error);
          if (error instanceof msal.InteractionRequiredAuthError) {
            // If silent authentication fails, use redirect as a fallback
            instance
              .loginRedirect({
                scopes: loginRequest.scopes,
                prompt: "select_account"
              })
              .catch((error) => console.error("Redirection error:", error));
          } else {
            console.error("Unexpected error:", error);
          }
        });
    } else {
      instance
        .loginRedirect()
        .then(() => {
          console.log("logged in successfully");
        })
        .catch((error) => console.error("Redirection error:", error));
    }
  }, [instance]);
  return (
    <React.Fragment>
      <RouterProvider router={router} />
    </React.Fragment>
  );
};

export default Index;
