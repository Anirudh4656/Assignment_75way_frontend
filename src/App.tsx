import React from "react";
import ReactDOM from "react-dom/client";
// import theme from "./themes";
import {createBrowserRouter, RouterProvider} from "react-router-dom"
import Auth from "./Components/Auth/userAuth";
import Home from "./Pages/Home";
import Admin from "./Components/Admin/AllUsers";
import Protected from "./Layout/protected";

// Define the router configuration
const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />
  },
  {
    path:"/auth",
    element:<Auth />
  },
  {
    path:'/admin',
    element: (
        <Admin />
    )
  }
]);
function App(){
  return(
     <RouterProvider router={router} />
  )
}
export default App;