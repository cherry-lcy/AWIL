import {createBrowserRouter} from "react-router-dom";
import Login from  "../pages/Login";
import AuthRoute from "../components/AuthRoute";
import Layout from "../pages/Layout";
import Dashboard from "../pages/Dashboard";
import Panel from "../pages/Panel";

const router = createBrowserRouter([
    {
        path: "/",
        element:<Login/>
    },
    {
        path:"/home",
        element:<AuthRoute><Layout/></AuthRoute>,
        children:[
            {
                path:'edit',
                element: <Panel/>
            },
            {
                path:'view',
                element: <Dashboard/>
            }
        ]
    }
])

export default router;