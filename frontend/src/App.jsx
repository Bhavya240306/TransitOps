import AuthProvider from "./context/AuthContext";

import {Routes,Route} from "react-router-dom";

import Login from "./pages/Login";

import Dashboard from "./pages/Dashboard";

import Vehicles from "./pages/Vehicles";

import Drivers from "./pages/Drivers";

import Trips from "./pages/Trips";

import Reports from "./pages/Reports";

import Maintenance from "./pages/Maintenance";

import DashboardLayout from "./layouts/DashboardLayout";

function App(){

return(

<AuthProvider>

<Routes>

<Route path="/" element={<Login/>}/>

<Route element={<DashboardLayout/>}>

<Route path="/dashboard" element={<Dashboard/>}/>

<Route path="/vehicles" element={<Vehicles/>}/>

<Route path="/drivers" element={<Drivers/>}/>

<Route path="/trips" element={<Trips/>}/>

<Route path="/maintenance" element={<Maintenance/>}/>

<Route path="/reports" element={<Reports/>}/>

</Route>

</Routes>

</AuthProvider>

)

}

export default App;