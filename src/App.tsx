import React from "react";
import ReactDOM from "react-dom/client";
import { ThemeProvider } from "@mui/material";
// import theme from "./themes";
import {createBrowserRouter, RouterProvider} from "react-router-dom"
import Auth from "./Components/Auth/userAuth"
import Home from "./Pages/Home";

// Define the router configuration
const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />
  }
]);
function App(){
  return(
     <RouterProvider router={router} />
  )
}
export default App;