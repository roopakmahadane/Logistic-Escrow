

import Layout from "./components/Layout";
import { BrowserRouter, Routes, Route } from "react-router";
import Dashboard from "./components/Dashboard";
import CreateEscrow from "./components/CreateEscrowForm";

function App() {
 

  return (
    <Routes>
    <Route path="/" element={<Layout />} />
    <Route path="/dashboard" element={<Dashboard />}></Route>
    <Route path="/createEscrow" element={<CreateEscrow />}></Route>
  </Routes>
    
  )
}

export default App
