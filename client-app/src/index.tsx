import React from "react";
import ReactDOM from "react-dom/client";
import "semantic-ui-css/semantic.min.css";
import "./app/layout/styles.css";
import "react-toastify/dist/ReactToastify.min.css";
import "react-datepicker/dist/react-datepicker.css";
import reportWebVitals from "./reportWebVitals";
import { StoreContext, store } from "./app/stores/store";
import { router } from "./app/router/Routes";
import { RouterProvider } from "react-router-dom";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  //removed strict mode for semantic ui to not show error warnings in console
  // <React.StrictMode>
  <StoreContext.Provider value={store}>
    <RouterProvider router={router} />
  </StoreContext.Provider>

  // </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
